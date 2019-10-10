<template>
<!-- 开取发票 -->
    <div class="invoice">
        <ul>
            <li>
                <span>抬头类型</span>
                <van-radio-group v-model="obj.isPersonal">
                    <van-radio name="0" checked-color="#f5ab0b">企业</van-radio>
                    <van-radio name="1" checked-color="#f5ab0b">个人</van-radio>
                </van-radio-group>
            </li>
            <li v-if="obj.isPersonal==='0'">
                <span>发票抬头</span>
                <input type="text" placeholder="请填写发票抬头" v-model="obj.title">
            </li>
            <li v-if="obj.isPersonal==='0'">
                <span>税号</span>
                <input type="text" placeholder="请填写纳税人识别号" v-model="obj.taxNumber">
            </li>
            <li v-if="obj.isPersonal==='1'">
                <span>发票抬头</span>
                <span style="font-weight:bold">个人</span>
            </li>
        </ul>
        <van-button round type="danger" :disabled="disabled" :class="disabled?'save bg_black color_white':'save bg_gold color_white'" @click="submit">确定</van-button>
        <div class="tips">
            <p class="text_size_30 color_black">发票内容说明</p>
            <p class="color_gray"><span></span>电子发票在订单支付成功后开具，点击“我的订单查看和下载”</p>
            <p class="color_gray"><span></span>发票内容将显示详细商品详细信息与价格信息</p>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio,Toast } from 'vant';
    export default {
        components:{
            'van-radio-group':RadioGroup,
            'van-radio':Radio
        },
        data(){
            return{
                obj:{
                    isPersonal:'0',//抬头类型 0:企业 1：个人
                    taxNumber:'',//税号
                    title:'',//发票抬头    
                },
                 
                disabled:true           
            }
        },
        watch:{
            obj:{
                deep:true,
                handler(){
                    if(this.obj.taxNumber!='' && this.obj.taxNumber!=''){
                        this.disabled = false
                    }else{
                        this.disabled = true
                    }
                    if(this.obj.isPersonal==1){
                        this.disabled = false
                    }
                }
            }
        },
        methods:{
            submit(){
                if(this.obj.isPersonal==0){
                    if(!(/^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(this.obj.taxNumber))){
                        Toast({message:'税号格式不正确',duration:2000})
                        return
                    }
                }               
                let a = {
                    isPersonal:this.obj.isPersonal==0?false:true,
                    taxNumber:this.obj.isPersonal==0?this.obj.taxNumber:'',//税号
                    title:this.obj.isPersonal==0?this.obj.title:''
                }
                sessionStorage.setItem('invioce',JSON.stringify(a))
                this.$router.go(-1)
            }
        },
        created(){
            if(sessionStorage.invioce){
                let sessionVlue = JSON.parse(sessionStorage.invioce)
                this.obj.isPersonal = sessionVlue.isPersonal?'1':'0'
                this.obj.taxNumber = sessionVlue.taxNumber
                this.obj.title = sessionVlue.title
                console.log(sessionVlue)
            }
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.invoice{
    ul{
        li{
            position: relative;
            background: #fff;
            font-size: 28px;
            padding: 0 30px;
            height: 100px;
            display: flex;
            align-items: center;
            border: 1px solid #F1F2F5;
            &>span{
                display: block;
                width: 180px;
            }
            input{
                flex: 1;
                font-weight: bold;
            }
            input::placeholder{
                font-weight: normal;
            }
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
                        margin-right: 19px;
                        height: 34px;
                        line-height: 34px;
                        .van-icon{
                            width: 34px;
                            height: 34px;
                        }
                    }
                    .van-radio__label{
                        font-size: 28px;
                        line-height: normal;
                    }
                }
            }
        }
    }
    .save{
        display: flex;
        justify-content: center;
        margin: 82px auto 0;
        width: 642px;
        height: 92px;
        border-radius: 92px;
        border: none;
        span{
            font-size: 30px;
        }
    }
    .tips{
        padding: 80px 30px 0;
        p{
            text-align: justify;
            line-height: 1.5;
            display: flex;
            align-items: baseline;
            span{
                width: 12px;
                height: 12px;
                border-radius: 100%;
                display: inline-block;
                background: #959595;
                margin-right: 16px;
            }
        }
        p:first-child{
            padding-bottom: 32px;
        }
    }
}
</style>