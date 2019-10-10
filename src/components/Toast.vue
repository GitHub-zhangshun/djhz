<template>
<!-- 提示框 -->
    <div class="toast">
        <van-popup v-model="$store.state.isShowToast" :close-on-click-overlay="false">
            <div class="pop text_center">
                <p class="text_size_32">提示</p>
                <p class="text_size_28 color_gray" v-html="title"></p>
                <p class="text_size_30 row">
                    <span @click="cancel">取消</span>
                    <span class="color_gold" @click="select">{{ btnTxt }}</span>
                </p>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup  } from 'vant'

    export default {
        components: {
            'van-popup': Popup
        },
        data(){
            return{
            }
        },
        methods: {
            cancel(){         
                if(this.$store.state.toastType == 4 && (this.$route.path == '/submitticket' || this.$route.path == '/submit_order' || this.$route.path == '/personal/invest/takeconfirm')){
                    let orderId = sessionStorage.getItem('orderId')     //提交订单页面保存的

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
                }else{
                    this.$store.commit({
                        type: "m_toHideToast",
                        showToast: false,
                    });
                }
            },
            select(){
                switch(this.$store.state.toastType){
                    case 1: this.$router.push('/personal/setting/isRealName_false'); break;
                    case 2: this.$router.push('/personal/setting/myBankCard/bindCard'); break;
                    case 3: this.$router.push('/personal/setting/trade_password'); break;
                    case 4: this.$store.commit("m_toShowPwdInput"); break;
                }
            }
        },
        computed:{
            title(){
                switch(this.$store.state.toastType){
                    case 1: return '为了您的资金安全，请先实名认证'; break;
                    case 2: return '为了您的资金安全，请先绑定银行卡'; break;
                    case 3: return '为了您的资金安全，请先设置交易密码'; break;
                    case 4: return `余额支付：<span class="color_red">${this.$store.state.paymoney}元</span><br>确认进行支付吗？`; break;
                }
            },
            btnTxt(){
                switch(this.$store.state.toastType){
                    case 1: return '去认证'; break;
                    case 2: return '去绑卡'; break;
                    case 3: return '去设置'; break;
                    case 4: return '确认'; break;
                }
            }
        },
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.toast{
    .van-popup{
        padding: 0 20px;
        border-radius: 12px;
        .pop{
            width: 560px;
            p{
                &:first-of-type{
                    margin: 60px 0 46px 0;
                }
                &:nth-of-type(2){
                    padding-bottom: 60px;
                    border-bottom: 2px solid #e3e3e3;
                    line-height: 46px;
                }
                &:nth-of-type(3){
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