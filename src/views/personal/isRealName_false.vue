<template>
    <div class="isRealName_false">
        <div class="top">
            <div class="img">
                <img src="@/assets/images/personal/realname.png" alt="">
            </div>
            <div class="tips">
                <span class="text_size_30 color_black">认证提示</span>
                <span class="text_size_26 color_gray">实名认证将您的资产与个人绑定，保障资金安全。</span>
                <span class="text_size_26 color_gray">确保您和德金惠众签订的购买协议合法有效。</span>
            </div>
        </div>
        <ul class="form">
            <li class="bg_white">
                <van-field v-model="formData.name" placeholder="请输入姓名" />
            </li>
            <li class="bg_white">
                <van-field v-model="formData.idCard" placeholder="请输入身份证号码" />
            </li>
            <li class="bg_white">
                <van-field
                readonly
                clickable
                :value="value"
                placeholder="请选择银行"
                @click="choose_bank"
                />
                <div class="img">
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="bg_white">
                <van-field v-model="formData.cardNumber" placeholder="请输入银行卡号" />
            </li>
            <li class="bg_white">
                <van-field v-model="formData.phone" placeholder="请输入预留手机号码" />
            </li>
            <li class="bg_white">
                <van-field v-model="formData.validateCode" placeholder="请输入短信验证码" />                
                <button class="color_gold" @click="send_code">{{content}}</button>
            </li>
        </ul>
        <van-button type="primary" :disabled="disabled" :loading="btn_loading" round :class="disabled?'bg_gray':'bg_gold'" @click="submit">确定</van-button>
        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                :loading="loading"
                title="选择银行"
                show-toolbar
                :columns="columns"
                @cancel="showPicker = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { Field , Button , Popup , Picker, Toast } from 'vant';
import { idCard , checkPhone } from '@/libs/publicFun' 
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-field':Field,
            'van-button':Button,
            'van-popup':Popup,
            'van-picker':Picker
        },
        data(){
            return{
                loading:false,//银行数据加载
                value: '',//选中银行的值
                showPicker: false,//银行弹窗
                columns: [],//列表展示数据
                bank_result:[],//银行data数据
                formData:{
                    name:'',//姓名
                    idCard:'',//身份证
                    bankId:'',//银行标识
                    cardNumber:'',//银行卡号
                    phone:'',//预留手机号
                    validateCode:'',//验证码
                },
                disabled:true,
                canClick:true,//验证码点击标识
                totalTime:60,//倒计时总值
                content:'获取验证码',
                clock:null,//定时器
                btn_loading:false
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(){
                    this.disabled = false
                    if(this.formData.name=='' || this.formData.idCard=='' || this.formData.bankId=='' || this.formData.cardNumber=='' || this.formData.phone=='' || this.formData.validateCode==''){
                        this.disabled = true
                    }
                }
            }
        },
        methods:{
            choose_bank(){
                window.scrollTo(0,0)
                this.columns = []
                this.showPicker = true
                this.loading = true;
                this.$axios('run_run_contentlistpage',{type:'bank', isShow:true, index:1,size:200})
                .then( data => {
                    this.loading = false
                    this.bank_result = data.result
                    data.result.forEach(item => {
                        this.columns.push(`<div><img src="${item.link || require('@/assets/images/personal/default_bank.png')}"/> &nbsp; ${item.title}</div>`)
                    })
                })
                .catch( () => {
                    this.loading = false
                })
            },
            onConfirm(value,index) {
                this.value = this.bank_result[index].title
                this.formData.bankId = this.bank_result[index].id
                this.showPicker = false;
            },
            submit(){              
                if(!idCard(this.formData.idCard)){
                    Toast({message:'身份证号码格式不正确',duration:2000})
                }else if(!checkPhone(this.formData.phone)){
                    Toast({message:'预留手机号码格式不正确',duration:2000})
                }else{
                    this.btn_loading = true
                    this.$axios('center_user_bankaccountadd',this.formData)
                    .then( data => {
                        this.btn_loading = false
                        Toast({message:'认证成功',duration:1500})
                        setTimeout( () => {
                            this.$router.replace('/personal/setting/trade_password')
                        },1500)                       
                    })
                    .catch( () => {
                        this.btn_loading = false
                    })
                }
            },
            send_code(){                    
                if(this.formData.name == ''){
                    Toast({message:'请输入姓名',duration:2000})
                }else if(!idCard(this.formData.idCard)){
                    Toast({message:'身份证号码格式不正确',duration:2000})
                }else if(this.formData.cardNumber == ''){
                    Toast({message:'请输入银行卡号',duration:2000})
                }else if(!checkPhone(this.formData.phone)){
                    Toast({message:'预留手机号码格式不正确',duration:2000})
                }else{
                    if (!this.canClick) return  //改动的是这两行代码
                    this.canClick = false
                    let formdata = {
                        name:this.formData.name,
                        idCard:this.formData.idCard,
                        cardNumber:this.formData.cardNumber,
                        phone:this.formData.phone,
                    }
                    this.$axios('center_user_signverifycodesend',formdata)
                    .then(data => {
                        this.content = this.totalTime + '秒'
                        this.clock = window.setInterval(() => {
                            this.totalTime--
                            this.content = this.totalTime + '秒'
                            if (this.totalTime < 0) {                           
                                window.clearInterval(this.clock)
                                this.content = '重新获取'
                                this.totalTime = 60
                                this.canClick = true  //这里重新开启
                            }
                        },1000)
                    })
                    .catch( () => {
                        this.canClick = true
                    })
                }
                 
            }
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.isRealName_false{
    .top{
        display: flex;
        padding: 38px 32px 48px;
        .img{
            margin-right: 22px;
            width: 68px;
            height: 68px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .tips{
            padding-top: 22px;
            display: flex;
            flex-flow: column;
            span:nth-of-type(1){
                padding-bottom: 24px;                
            }
            span:nth-of-type(2){
                padding-bottom: 17px;
            }
        }
    }
    .form{
        li{            
            padding: 0 32px;
            border-bottom: 2px solid #eef3f4;
            display: flex;
            align-items: center;
            /deep/.van-cell{
                flex: 1;
                padding: 0;
                &::after{
                    border: none;
                }
                .van-cell__value{
                    .van-field__body{     
                                          
                        .van-field__control{
                            height: 102px;
                            font-size: 28px;
                        }
                        .van-field__control::placeholder{
                            padding-top: 10px;
                            font-size: 28px;
                        }
                    }
                }
            }
            button{
                background: transparent;                
            }
            .img{
                width: 26px;
                height: 26px;
                display: inline-block;
                img{
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .van-button{
        display: flex;
        justify-content: center;
        width: 642px;
        height: 92px;
        margin: 82px auto 0;
        border: none;
        span{
            font-size: 28px;
        }
    }
    /deep/.van-popup{
        .van-picker{
            .van-hairline--top-bottom{
                height: 88px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                div{
                    font-size: 28px;
                }
            }
            .van-picker__columns{
                .van-picker-column{
                    ul{
                        li{
                            font-size: 28px;
                            div{
                                img{
                                    width: 36px;
                                    height: 36px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>