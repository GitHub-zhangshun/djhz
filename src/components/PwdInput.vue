<template>
<!-- 交易密码键盘 -->
    <div class="select_bank">
        <van-popup v-model="$store.state.isShowPwdInput" position="bottom" :close-on-click-overlay="false" @open="hasOpen" class="main">
            <div class="title">
                <p>请输入交易密码</p> 
                <img src="@/assets/images/bank_close.png" class="close" @click="cancel">
            </div>

            <van-password-input
            :value="value"
            @focus="showKeyboard = true"
            />

            <p class="text_size_26 forget"><span @click="forget">忘记密码？</span></p>

            <!-- 数字键盘 -->
            <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            :transition="false"
            delete-button-text=""
            />
        </van-popup>

        <van-popup v-model="isShowError" :close-on-click-overlay="false" class="error_pop">
            <div class="pop text_center">
                <p class="text_size_32">支付密码不正确</p>
                <p class="text_size_30 row">
                    <span @click="cancelErrorPop">重新输入</span>
                    <span class="color_gold" @click="forget">找回密码</span>
                </p>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup, PasswordInput, NumberKeyboard, Toast } from 'vant'
import md5 from 'blueimp-md5'
import { setTimeout } from 'timers';
import { debug } from 'util';

    export default {
        components: {
            'van-popup': Popup,
            'van-password-input': PasswordInput,
            'van-number-keyboard': NumberKeyboard
        },
        data(){
            return{
                value: '',
                showKeyboard: true,
                isShowError:false
            }
        },
        methods: {
            //关闭密码框
            cancel(){

                if(sessionStorage.getItem('bankId')){
                    this.$store.commit("m_toHidePwdInput");
                    this.showKeyboard = false
                }else{
                    if(this.$route.path == '/submitticket' || this.$route.path == '/submit_order' || this.$route.path == '/personal/invest/takeconfirm' ){
                        let orderId = sessionStorage.getItem('orderId')

                        if(this.$route.path == '/submitticket'){
                            this.$router.push({path:'/personal/ticketdetail', query:{id:orderId}})
                        }else if(this.$route.path == '/submit_order'){
                            this.$router.replace({path:'/personal/invest/goldticketdetail', query:{id:orderId}})
                        }else if(this.$route.path == '/personal/invest/takeconfirm'){
                            this.$router.go(-1)
                        }

                        sessionStorage.removeItem('invioce')  //清除发票信息 
                        sessionStorage.removeItem('productList')  //清除购物车id信息 
                        sessionStorage.removeItem('ticketInfo')  //清除来自详情的订单信息 
                        sessionStorage.removeItem('bankId')   //清除银行卡标识
                        sessionStorage.removeItem('orderId')   //清除订单号
                        sessionStorage.removeItem('money') //清除金额
                        sessionStorage.removeItem('addressIdToSubmit')   //清除地址
                        sessionStorage.removeItem('storeIdToSubmit')   //清除门店信息
                    }else{
                        this.$store.commit("m_toHidePwdInput");
                        this.showKeyboard = false
                    }
                }
            },
            //输入
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
            },
            //删除
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            //监听开启pop弹窗
            hasOpen(){
                this.showKeyboard = true
                this.value = ''
            },
            //忘记密码
            forget(){
                sessionStorage.setItem('unpaid','unpaid')
                this.$router.push('/personal/setting/reset_trade_password')
            },
            //关闭错误提示框
            cancelErrorPop(){
                this.isShowError = false
            }
        },
        watch:{
            value(val){
                if(val.length === 6 ){
                    Toast.loading({
                        message: '加载中...',
                        duration: 0,
                        loadingType: 'spinner',
                    });

                    let bankId = ''
                    if(sessionStorage.getItem('bankId')){
                        bankId = sessionStorage.getItem('bankId')
                    }
                    
                    if(this.$route.path == '/submitticket' || this.$route.path == '/submit_order' || this.$route.path == '/personal/invest/takeconfirm' || this.$route.path == '/personal/invest/goldticketdetail' || this.$route.path == '/personal/ticketdetail'){
                        //支付接口
                        this.$axios('center_transaction_orderpay', { orderId: sessionStorage.getItem('orderId'), bankCardId: bankId, client: 1, tranPass: md5(md5(md5(this.value)))})
                        .then(data => {
                            Toast.clear()
                            if(this.$route.path == '/submitticket'){
                                this.$router.push({path:'/personal/ticketdetail', query:{id:sessionStorage.getItem('orderId')}})
                            }else if(this.$route.path == '/submit_order'){
                                this.$router.replace({path:'/result', query:{id:sessionStorage.getItem('orderId')}})
                            }else if( this.$route.path == '/personal/invest/takeconfirm'){
                                this.$router.replace({path:'/personal/success', query:{type:'take', id:sessionStorage.getItem('orderId')}})
                            }else if(this.$route.path == '/personal/invest/goldticketdetail' || this.$route.path == '/personal/ticketdetail'){
                                this.$router.go(0)
                            }

                            sessionStorage.removeItem('invioce')  //清除发票信息 
                            sessionStorage.removeItem('productList')  //清除购物车id信息 
                            sessionStorage.removeItem('ticketInfo')  //清除来自详情的订单信息 
                            sessionStorage.removeItem('bankId')   //清除银行卡标识
                            sessionStorage.removeItem('orderId')   //清除订单号
                            sessionStorage.removeItem('money') //清除金额
                            sessionStorage.removeItem('addressIdToSubmit')   //清除地址
                            sessionStorage.removeItem('storeIdToSubmit')   //清除门店信息
                        }).catch((error) => {
                            if(error.code === '24009'){
                                this.value = ''
                                Toast.clear()
                                this.isShowError = true
                            }
                        })
                    }else if(this.$route.path == '/personal/takemoney'){
                        //提现接口
                        this.$axios('center_transaction_withdrawinit',{ bankCardId: bankId, tranPass: md5(md5(md5(this.value))), money: sessionStorage.getItem('takeMoney'), client: 1 })
                        .then(data => {
                            Toast.clear()
                            this.$router.push('/personal/takeresult')

                            sessionStorage.removeItem('bankId')   //清除银行卡标识
                            sessionStorage.removeItem('orderId')   //清除订单号
                            sessionStorage.removeItem('takeMoney') //清除金额
                        }).catch((error) => {
                            if(error.code === '24009'){
                                this.value = ''
                                Toast.clear()
                                this.isShowError = true
                            }
                        })  
                    }
                }
            }
        },
        created(){
            Toast.clear()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.select_bank{

    .main{
        text-align: center;
        font-size: 28px;
        height: 800px;
        padding: 0;
        .title{
            padding: 0 34px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border-bottom: 1px solid #f0f1f3;
            position: relative;
            .close{
                width: 24px;
                position: absolute;
                top: 50%;
                right: 34px;
                transform: translateY(-50%)
            }
        }

        /deep/.van-password-input{
            ul{
                padding: 40px 26px 36px 26px;
                box-sizing: border-box;
                height: 140px;
                li{
                    width: 90px;
                    height: 88px;
                    line-height: 88px;
                    border: 1px solid #e0e0e0;
                    margin: 0 8px;
                    border-radius: 12px;
                }
            }
            .van-password-input__security i{
                width: 18px;
                height: 18px;
                margin: 0;
                transform: translate(-50%, -50%)
            }
            .van-hairline--surround:after{
                border: none;
            }
        }

        .forget{
            margin: 40px 0 60px 0;
            text-decoration: underline;
        }
        
        /deep/.van-number-keyboard{
            .van-number-keyboard__body{
                background: #cccdd1;
                padding-top: 8px;
                padding-bottom: 12px;
                .van-key{
                    width: 234px;
                    height: 94px;
                    line-height: 94px;
                    border-radius: 12px;
                    background: #fff;
                    margin: 6px;
                    font-size: 34px;
                    box-shadow: 0 4px 4px #a2a3a7;    
                }
                .van-key--active{
                    background: #bac2cf;    
                }
                .van-key--gray{
                    background: #cccdd1;
                    box-shadow: none;
                }
                .van-hairline:after{
                    border: none;
                }
            }
        }

    }

    .error_pop{
        padding: 0 20px;
        border-radius: 12px;
        .pop{
            width: 560px;
            p{
                &:first-of-type{
                    margin: 60px 0;
                }
                &:nth-of-type(2){
                    span{
                        width: 50%;
                        display: inline-block;
                        padding: 30px 0;
                        &:active{
                            background: #e2e2e2;
                        }
                    } 
                }
            }
        }
    }
    
}

</style>