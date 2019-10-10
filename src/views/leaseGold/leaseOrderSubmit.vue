<template>
<!-- 我要租赁订单填写 -->
    <div class="leaseOrderSubmit">
        <div class="content">
            <ul class="contactNP bg_white">
                <li>
                    <span>联系人</span>
                    <input type="text" placeholder="请输入您的姓名" v-model="formData.contactName">
                </li>
                <li>
                    <span>联系电话</span>
                    <input type="text" placeholder="请输入您的手机号码" v-model="formData.contactPhone">
                </li>
            </ul>
            <ul class="bg_white goldInfo">
                <li>
                    <span>黄金类型</span>
                    <van-radio-group v-model="radio">
                        <van-radio checked-color="#f5ab0b" v-for="(item, index) in gold_type" :key="index" :name="index"><span :style="{color:radio==index?'#f5ab0b':''}">{{item.title}}</span></van-radio>
                    </van-radio-group>
                </li>
            </ul>
            <div class="gold_weight bg_white">
                <p class="text_size_28">黄金重量</p>
                <ul>
                    <li v-for="(item, index) in goldWeight" :key="index" @click="chooseWeight(item,index)" :style="{background:index==chooseweightIndex?'#f5ab0b':'',color:index==chooseweightIndex?'#fff':''}">{{item.title}}</li>
                </ul>
                <div class="custom_weight">
                    <span class="text_size_28">自定义</span>
                    <input type="number" class="text_size_28" v-model="weightInputVal" @focus="onFocusWeight(1)" @change="weightInput" placeholder="请输入您想要租赁黄金的重量">
                </div>
            </div>
            <div class="lease_time bg_white">
                <p class="text_size_28">租赁期限</p>
                <ul>
                    <li v-for="(item, index) in leaseTime" :key="index" @click="chooseTime(item,index)" :style="{background:index==chooseTimeIndex?'#f5ab0b':'',color:index==chooseTimeIndex?'#fff':''}">{{item.title}}</li>
                </ul>
                <div class="custom_weight">
                    <span class="text_size_28">自定义</span>
                    <input type="number" class="text_size_28" v-model="timeInputVal" @focus="onFocusWeight(2)" @change="timeInput" placeholder="请输入您想要租赁黄金的期限">
                </div>
            </div>
            <div class="tips bg_base color_gray text_size_28">我已阅读并同意<span class="color_black" @click="$router.push({path:'/message/annoucementdetail', query:{id:'Lease_agreement', title:'黄金租赁协议'}})">《黄金租赁协议》</span></div>
        </div>
        <van-button type="default" :class="disabled?'submit color_white bg_gray':'submit color_white bg_gold'" @click="submit" :loading="loading" loading-text="提交订单" :disabled="disabled">提交订单</van-button>
    </div>
</template>

<script>
import { RadioGroup, Radio,Button,Toast } from 'vant';
import { checkPhone } from '@/libs/publicFun'
import { getToken } from '@/libs/auth'
import { throws } from 'assert';
    export default {
        components:{
            'van-radio-group':RadioGroup,
            'van-radio':Radio,
            'van-button':Button
        },
        data() {
            return {
                loading:false,//订单提交等待动画
                radio:0,//黄金类型选中标识
                goldWeight:[],//重量后台返回结构
                leaseTime:[],//期限后台返回结构
                chooseweightIndex:-1, //重量选中标识            
                chooseTimeIndex:-1,   //期限选中标识             
                weightInputVal:"",//重量自定义中间key
                timeInputVal:'',//期限自定义中间key
                gold_type:[],//黄金类型后台返回结果
                disabled:true,//按钮禁用
                formData:{
                    contactName:'',
                    contactPhone:'',
                    goldType:'',
                    weight:'',
                    leaseTerm:'',
                },
                weight_flag:false,
                leaseTerm_flag:false,
            }
        },
        watch:{
            radio(){
                this.formData.goldType = this.gold_type[this.radio].title
            },
            formData:{
                deep:true,
                handler(){
                    if(this.formData.contactName == "" || this.formData.contactPhone == "" || this.formData.goldType == "" || this.formData.weight == "" || this.formData.leaseTerm == "" || this.formData.isHighPrecision == ""){
                        this.disabled = true
                    }else{
                        this.disabled = false
                    }
                }
            },
            chooseweightIndex(){
                if(this.chooseweightIndex == -1){
                    this.formData.weight = ''
                }
            },
            chooseTimeIndex(){
                if(this.chooseTimeIndex == -1){
                    this.formData.leaseTerm = ''
                }
            },
            weightInputVal(){
                if(this.weight_flag){
                    this.formData.weight = this.weightInputVal
                }                
            },
            timeInputVal(){
                if(this.leaseTerm_flag){
                    this.formData.leaseTerm = this.timeInputVal
                }                
            }
        },
        methods:{
            submit(){
                this.loading = true
                if(!checkPhone(this.formData.contactPhone)){
                    Toast({message:'手机号格式不正确',duration:2000})
                    this.loading = false
                }else{
                    this.$axios('center_order_leaseorderadd',this.formData)
                    .then( data => {
                        this.loading = false
                        if(data.code==0){
                            this.$router.push({path:'/orderSubmitResult',query:{from:'lease'}})
                        }else{
                            Toast({message:data.msg,duration:2000})
                        }
                    })
                }
            },
            onFocusWeight(val){
                if(val==1){
                    this.weight_flag = true
                    this.chooseweightIndex = -1
                }
                if(val==2){
                    this.leaseTerm_flag = true
                    this.chooseTimeIndex = -1
                }
            },

            weightInput(){          
                this.weight_flag = true    
                this.formData.weight = this.weightInputVal
            },            
            chooseWeight(val,index){
                this.weight_flag = false
                this.chooseweightIndex = index
                this.weightInputVal = ''
                this.formData.weight = val.title              
            },


            timeInput(){
                this.leaseTerm_flag = true
                this.formData.leaseTerm = this.timeInputVal
            },
            chooseTime(val,index){
                this.leaseTerm_flag = false
                this.chooseTimeIndex = index
                this.timeInputVal = ''
                this.formData.leaseTerm = val.title 
            }
        },
        created(){
            if(this.$store.state.leaseOrderSubmit){
                let data = JSON.parse(this.$store.state.leaseOrderSubmit)
                this.loading = data.loading
                this.radio = data.radio
                this.goldWeight = data.goldWeight
                this.leaseTime = data.leaseTime
                this.chooseweightIndex = data.chooseweightIndex
                this.chooseTimeIndex = data.chooseTimeIndex
                this.weightInputVal = data.weightInputVal
                this.timeInputVal = data.timeInputVal
                this.gold_type = data.gold_type
                this.disabled = data.disabled
                this.formData = data.formData
                this.weight_flag = data.weight_flag
                this.leaseTerm_flag = data.leaseTerm_flag
            }else{
                this.$axios('dic_face_getlistdetailrtbyindexsimplify','gold_type')
                .then(data => {
                    data.result.forEach(item => {
                        this.gold_type.push(item)
                    });                
                    this.formData.goldType = this.gold_type[this.radio].title
                })
                this.$axios('dic_face_getlistdetailrtbyindexsimplify','gold_weight')
                .then( data => {
                    data.result.forEach(item => {
                        this.goldWeight.unshift(item)
                    })
                })
                this.$axios('dic_face_getlistdetailrtbyindexsimplify','lease_term')
                .then( data => {
                    data.result.forEach(item => {
                        this.leaseTime.unshift(item)
                    })
                })
            }
            
        },
        beforeRouteEnter (to, from, next) {
            if(!getToken()){
                next({path:'/login',query:{redirect:to.fullPath}})
            }
            next()
        },
        beforeRouteLeave (to, from, next) {
            let newData = JSON.stringify(this.$data)
            this.$store.commit({type:'m_leaseOrderSubmit',leaseOrderSubmit:newData})
            next()
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.leaseOrderSubmit{
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
            }
        }
        .gold_weight{
            margin-bottom: 20px;
        }
        .gold_weight,.lease_time{
            padding: 38px 30px 48px;
            p{
                padding-bottom: 48px;
            }
            ul{
                display: flex;
                justify-content:space-between;
                flex-wrap: wrap;
                li{
                    width: 216px;
                    height: 72px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    margin-bottom: 22px;
                    background: #e2e2e2;
                }
            }
            .custom_weight{
                display: flex;
                align-items: center;
                span{
                    margin-right: 20px;
                }
                input{
                    padding-left: 10px;
                    height: 68px;
                    border: 1px solid #e2e2e2;
                    outline: none;
                    -webkit-appearance: none; 
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    border-radius: 10px;
                    flex: 1;
                }
                input::placeholder{
                    padding-top: 10px;
                }
            }
        }
        .tips{
            padding: 0 32px;
            line-height: 1.5; 
            padding: 20px;
        }
    }
    
    .submit{
        border: none;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 102px;
        opacity: 1;
        // background: #ababab;
        span{
            font-size: 30px;
        }
    }
}
</style>