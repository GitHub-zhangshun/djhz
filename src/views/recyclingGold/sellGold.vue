<template>
<!-- 我要卖金 -->
        <div class="sellGold" >
            <div class="content">
                <ul class="contactNP bg_white">
                    <li>
                        <span>联系人</span>
                        <input type="text" placeholder="请输入您的名字" v-model="formDate.contactName">
                    </li>
                    <li>
                        <span>联系电话</span>
                        <input type="text" placeholder="请输入您的手机号码" v-model="formDate.contactPhone">
                    </li>
                </ul>
                <ul class="bg_white goldInfo">
                    <li>
                        <span>黄金类型</span>
                        <van-radio-group v-model="radio">
                            <van-radio checked-color="#f5ab0b" v-for="(item, index) in gold_type" :key="index" :name="index"><span :style="{color:radio==index?'#f5ab0b':''}">{{item.title}}</span></van-radio>
                        </van-radio-group>
                    </li>
                    <li>
                        <span>黄金克重</span>
                        <input type="number" placeholder="0.00" v-model="weight">
                    </li>
                    <li>
                        <span>黄金品牌</span>
                        <div class="choose" @click="brandShow">
                            <span>{{brand==""?'请选择':brand}}</span>
                            <div>
                                <img src="@/assets/images/index/Path.png" alt="">
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="upload bg_white">
                    <p class="text_size_28">上传图片<span class="color_gray"> （请上传实物，证书等相关图片，最多9张）</span></p>
                    <div class="chooseImg">
                        <div class="img" v-for="(item, index) in imgList" :key="index">
                            <van-icon name="clear" @click="click(index)"/>
                                <img :src="item.src" alt="">
                            <van-loading v-if="item.show"/>
                        </div>
                        <div class="img_input" @click="android">
                            <van-uploader :after-read="onRead" v-if="show">
                            <van-icon name="plus" />
                        </van-uploader>
                        </div>
                        
                    </div>           
                </div>
                <div class="estimatePrice bg_white">
                    <P class="text_size_28"><span>实时回收金价</span>：{{Real_time_gold}}元/克</P>
                    <P class="text_size_28"><span>回收估价</span>：{{Recycling_valuation}}元<i class="icon iconfont iconwenhao" @click="tips"></i> </P>
                </div>
                <div class="tips bg_base color_gray text_size_28">我已阅读并同意<span class="color_black" @click="$router.push({path:'/message/annoucementdetail', query:{id:'Recycling_protocol', title:'黄金回收协议'}})">《黄金回收协议》</span></div>
            </div>
            <van-button type="default" :class="disabled?'submit text_size_30 color_white bg_gray':'submit text_size_30 color_white bg_gold'" :disabled="disabled" :loading="loading" loading-text="提交订单" @click="submit">提交订单</van-button>
            <van-popup v-model="chooseBrandshow" position="bottom">
                <van-picker :columns="columns" show-toolbar @confirm="onConfirm" @cancel="onCancel" :item-height="40"/>
            </van-popup>
            <van-popup v-model="chooseImg" position="bottom" class="phoneImg">
                <ul>
                    <li @click="photo">照片</li>
                    <li @click="camera">拍摄</li>
                </ul>
            </van-popup>
        </div>
    
</template>

<script>
import { Uploader,RadioGroup, Radio,Picker,Popup,Icon,Button,Loading,Toast,Dialog } from 'vant'
import { checkPhone } from '@/libs/publicFun'
import { getToken } from '@/libs/auth'
    export default {
        components:{
            'van-uploader':Uploader,
            'van-radio-group':RadioGroup,
            'van-radio':Radio,
            'van-picker':Picker,
            'van-popup':Popup,
            'van-icon':Icon,
            'van-button':Button,
            'van-loading':Loading
        },
        data(){
            return{
                chooseImg:false,//
                imgList:[],//图片回显
                show:true,//图片上传
                radio:0,
                brand:'' ,
                chooseBrandshow:false,//黄金品牌的弹窗
                columns: [],//黄金品牌
                columnsResult: [],//黄金品牌后台结果
                loading:false,//提交等待动画
                gold_type:[],//黄金类型  
                formDate:{
                    contactName:'',//联系人 
                    contactPhone:'',//手机号  
                    goldType:'',//黄金类型选中ID
                    weight:'',//克重
                    goldBrand:'',//黄金品牌ID
                    resourceLinks:[],//上传图片ID
                    isHighPrecision:Boolean,//是否高精度
                },
                disabled:true,//按钮禁用
                Real_time_gold:'--',//实时金价
                Recycling_valuation:'--',//回收估价
                goldMoney:{
                    goldPrice:'--',//AU999金价
                    highPrecisionGoldPrice:'--',//AU9999金价
                },//后台返回的黄金金价
                weight:''
            }
        },
        watch:{
            weight(){
                this.formDate.weight = this.weight
                this.calculate()
            },
            imgList(){
                if(this.imgList.length == 9){
                    this.show = false
                }else{
                    this.show = true
                }
            },
            radio(){
                this.assignment()
                this.calculate()
                this.formDate.goldType = this.gold_type[this.radio].title
                this.formDate.isHighPrecision = JSON.parse(this.gold_type[this.radio].content).IsHighPrecision
            },
            formDate:{
                deep:true,
                handler(){
                    if(this.formDate.contactName=='' || this.formDate.contactPhone=='' || this.formDate.weight=='' || this.formDate.goldBrand=='' || this.formDate.resourceLinks.length==0){
                        this.disabled = true
                    }else{
                        this.disabled = false
                    }
                }
            },
            gold_type(){
                this.assignment()
                this.calculate()
            }
        },
        methods:{
            callback(data){
                let file = {content:`data:image/jpeg;base64,${data}`}
                this.onRead(file)
            },
            photo(){
                window.AndroidApp.selectImage(true)
                this.chooseImg = false
            },
            camera(){
                window.AndroidApp.selectImage(false)
                this.chooseImg = false
            },
            android(){
                if(window.AndroidApp !== undefined){
                    this.chooseImg = true
                }
            },
            //估价计算
            calculate(){
                if(this.Real_time_gold == '--' || this.weight == ''){
                    this.Recycling_valuation='--'
                }else{
                    this.Recycling_valuation = (Number(this.formDate.weight)*Number(this.Real_time_gold)).toFixed(2)
                } 
            },
            //初始化赋值
            assignment(){
                let gold_name = JSON.parse(this.gold_type[this.radio].content).IsHighPrecision               
                if(gold_name=='false'){
                    this.Real_time_gold = this.goldMoney.goldPrice
                }else{
                    this.Real_time_gold = this.goldMoney.highPrecisionGoldPrice
                }
            },
            tips(){
                Dialog.alert({
                    message: '由于黄金价格实时波动，此估价仅做参考，实际回收价格以专业检测结果为准'
                }).then(() => {
                // on close
                });
            },
            submit(){
                this.loading = true
                if(!checkPhone(this.formDate.contactPhone)){
                    this.loading = false
                    Toast({message:'手机号格式不正确',duration:2000})
                }else{
                    this.$axios('center_order_recoveryorderadd',this.formDate)
                    .then( data => {
                        this.loading = false
                        if(data.code == 0){
                            this.$router.push({path:'/orderSubmitResult',query:{from:'sell'}})
                        }else{
                            Toast({message:data.msg,duration:2000})
                        }
                    })
                    .catch( () => {
                        this.loading = false
                    })
                }
            },
            click(index){
                this.imgList.splice(index,1)
                this.formDate.resourceLinks.splice(index,1)
            },
            onConfirm(value,index) {
                this.brand = value
                this.chooseBrandshow = false
                this.formDate.goldBrand = this.columnsResult[index].id
            },
            onCancel() {
                this.chooseBrandshow = false
            },
            brandShow(){
                this.chooseBrandshow = true
            },
            onRead(file) {
                this.imgList.push({src:file.content,show:true})
                this.$axios('obs_res_upload',{base64:file.content.replace(/^data:image\/\w+;base64,/, "")})
                .then( data => {
                    if(data.code==0){
                        this.imgList.filter( item => { 
                            if(item.src==file.content){
                                item.show = false
                            }
                        })
                        this.formDate.resourceLinks.push(data.result.link)
                    }else{
                        this.imgList.splice(this.imgList.length-1,1)
                        Toast({message:'图片上传失败',duration:2000})
                    }
                })            
            }
        },
        created(){   
            if(this.$store.state.sellGold){
                let data = this.$store.state.sellGold
                this.chooseImg = data.chooseImg
                this.imgList = data.imgList
                this.show = data.show
                this.radio = data.radio
                this.brand = data.brand
                this.chooseBrandshow = data.chooseBrandshow
                this.columns = data.columns
                this.columnsResult = data.columnsResult
                this.loading = data.loading
                this.gold_type = data.gold_type
                this.formDate = data.formDate
                this.disabled = data.disabled
                this.Real_time_gold = data.Real_time_gold
                this.Recycling_valuation = data.Recycling_valuation
                this.goldMoney = data.goldMoney
                this.weight = data.weight
            }else{
                this.$axios('dic_face_getlistdetailrtbyindexsimplify','gold_type')
                .then(data => {
                    data.result.forEach(item => {
                        this.gold_type.push(item)
                    });                
                    this.formDate.goldType = this.gold_type[this.radio].title
                    this.formDate.isHighPrecision = JSON.parse(this.gold_type[this.radio].content).IsHighPrecision
                })
                this.$axios('dic_face_getlistdetailrtbyindexsimplify','gold_brand')
                .then(data => {
                    data.result.forEach(item => {
                        this.columns.unshift(item.remark)
                        this.columnsResult.unshift(item)
                    }); 
                })
                this.$axios('center_goldprice_getcurrenrecyclinggoldpriceset')
                .then(data => {
                    this.goldMoney.goldPrice = (data.result.goldPrice==0 || data.result.goldPrice==null)?'--':data.result.goldPrice
                    this.goldMoney.highPrecisionGoldPrice = (data.result.highPrecisionGoldPrice==0 || data.result.highPrecisionGoldPrice==null)?'--':data.result.highPrecisionGoldPrice
                })
            }
            window.callback = this.callback                   
        },
        beforeRouteEnter (to, from, next) {
            if(!getToken()){
                next({path:'/login',query:{redirect:to.fullPath}})
            }
            next()
        },
        beforeRouteLeave (to, from, next) {
            let newData = JSON.parse(JSON.stringify(this.$data))
            this.$store.commit({type:'m_sellGold',sellGold:newData})
            next()
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.sellGold{
    .content{
        padding-bottom: 102px;
        .contactNP{   
            margin-bottom: 20px;     
            li{
                padding: 0 32px;
                font-size: 28px;
                display: flex;
                // align-items: center;           
                border-bottom: 2px solid #e2e2e2;
                span{
                    display: inline-block;
                    width: 150px;
                    line-height: 89px;
                }
                input{
                    padding-left: 0;
                }
                input::placeholder{
                    font-size: 28px;
                    padding-top: 6px;
                }
            }
        }
        .goldInfo{
            margin-bottom: 20px;     
            li{
                padding: 0 32px;
                font-size: 28px;
                display: flex;
                align-items: center;
                border-bottom: 2px solid #e2e2e2;
                /deep/.van-radio-group{
                    height: 100%;
                    display: flex;
                    align-items: center;
                    .van-radio{
                        margin-right: 80px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        .van-radio__icon{
                            margin-right: 10px;
                            height: 34px;
                            line-height: 34px;
                            .van-icon{
                                width: 34px;
                                height: 34px;
                                font-size: 28px;
                            }
                        }
                        .van-radio__label{
                            font-size: 28px;
                            line-height: normal;
                        }
                    }
                }
                &>span{
                    display: inline-block;
                    width: 150px;
                    line-height: 89px;
                }
                .choose{
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    // align-items: center;
                    div{
                        padding-left: 10px;
                        width: 26px;
                        img{
                            vertical-align: baseline;
                            width: 100%;
                        }
                    }
                }
                input{
                    padding-left: 0;
                }
                input::placeholder{
                    font-size: 28px;
                    padding-top: 6px;
                }
            }
        }
        .upload{
            padding: 42px 32px 36px;
            border-bottom: 2px solid #e2e2e2;
            p{
                padding-bottom: 38px;
            }
            .chooseImg{
                display: flex;
                flex-wrap: wrap;
                .img{
                    position: relative;
                    i{
                        position: absolute;;
                        top: -15px;
                        right: 5px;
                        color: #f5ab0b;
                        font-size: 36px;
                        z-index: 22
                    }
                    img{
                        border-radius: 10px;
                        width: 178px;
                        height: 178px;
                        margin-right: 22px;
                        margin-bottom: 22px;
                    }
                    .van-loading{
                        border-radius: 10px;
                        background: rgba(0,0,0,.5);
                        width: calc(100% - 22px);
                        height: calc(100% - 22px);
                        position: absolute;
                        top: 0;
                        left: 0;
                        span{
                            display: inline-block;
                            width: 60px;
                            height: 60px;
                            position: relative;
                            top: 30%;
                            left: 30%;
                        }
                    }
                }       
                .img_input{
                    .van-uploader{
                        width: 178px;
                        height: 178px;
                        border: 1px dashed #e2e2e2;
                        border-radius: 10px;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i{
                            font-size: 48px;
                            color: #adadad;
                        }
                    }
                }    
                
            }
        }
        .estimatePrice{
            padding: 38px 32px 47px;
            p{
                span{
                    display: inline-block;
                    width: 170px;
                    text-align: right;
                }
                i{
                    margin-left: 10px;
                }
            }
            p:nth-of-type(1){
                padding-bottom: 22px;
            }
        }
        .tips{
            padding: 0 32px;
            line-height: 84px; 
        }
    }
    
    .submit{
        opacity: 1;
        border: none;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 102px;
    }
    /deep/.van-popup{
        .van-picker{
            .van-hairline--top-bottom{
                padding: 10px 0;
                .van-picker__cancel,
                .van-picker__confirm{
                    font-size: 28px;
                }
            }
            .van-picker__columns{
                .van-picker-column{                    
                    ul{
                        li{
                            font-size: 28px;
                        }
                    }
                }                
            }
        }
    }
    /deep/.phoneImg{
        height: 200px;
        ul{
            li{
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28px;
            }
        }
    }
}
</style>