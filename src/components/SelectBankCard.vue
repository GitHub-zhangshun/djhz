<template>
<!-- 选择银行卡 -->
    <div class="select_bank">
        <van-popup v-model="$store.state.isShowBankCard" position="bottom" :close-on-click-overlay="false">
            <div class="title">
                <p>选择银行卡</p> 
                <img src="@/assets/images/bank_close.png" class="close" @click="cancel">
            </div>
            <div class="bank_box">
                <div v-for="(item,index) in bankList" :key="index" class="banklist row" @click="choose(item.id)">
                    <div class="row">
                        <img :src="item.link">
                        <p>{{ item.bankName }}({{ item.cardNumber }})</p>
                    </div>
                    <img src="@/assets/images/bank_check.png" v-if="label == item.id">
                </div>  
            </div>

            <van-button @click="confirm">确&nbsp;定</van-button>
        </van-popup>
    </div>
</template>

<script>
import { Popup, Toast  } from 'vant'

    export default {
        components: {
            'van-popup': Popup,
        },
        data(){
            return{
                label:'',
                bankList:[],  //银行卡列表
            }
        },
        methods: {
            cancel(){
                if(this.$route.path == '/submitticket' || this.$route.path == '/submit_order' || this.$route.path == '/personal/invest/takeconfirm'){
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
                    sessionStorage.removeItem('money') //清除金额
                    sessionStorage.removeItem('addressIdToSubmit')   //清除地址
                    sessionStorage.removeItem('storeIdToSubmit')   //清除门店信息
                }else{
                    this.$store.commit("m_toHideBankCard");
                }
            
            },
            choose(id){
                this.label = id
            },
            confirm(){
                sessionStorage.setItem('bankId',this.label)
                if(sessionStorage.bankId){
                    if(this.$route.path == '/submitticket' || this.$route.path == '/submit_order' || this.$route.path == '/personal/invest/takeconfirm' || this.$route.path == '/personal/ticketdetail' || this.$route.path == '/personal/invest/goldticketdetail'){
                        this.$store.commit("m_toShowPwdInput");
                    }else if(this.$route.path == '/personal/takemoney'){
                        this.$store.commit("m_toHideBankCard");
                    }
                }else{
                    Toast({message:'请选择银行卡',duration:2000})
                }
            }
        },
        created(){
            //获取银行列表
            this.$axios('center_user_bankaccount')
            .then(data => {
                this.bankList = data.result
                data.result.forEach(item => {
                    item.cardNumber = item.cardNumber.slice(-4)
                });

                this.label = data.result[0].id
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.select_bank{
    .van-popup{
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
        .bank_box{
            height: 540px;
            margin-bottom: 30px;
            overflow-y: scroll;
            .banklist{
                height: 120px;
                line-height: 120px;
                border-bottom: 1px solid #f0f1f3;
                padding: 0 34px;
                align-items: center;
                justify-content: space-between;
                &>div{
                    align-items: center;
                    img{
                        width: 36px;
                        margin-right: 24px;
                    }
                }
                img{
                    width: 24px;
                }
            }
        }
        
        .van-button{
            height: 90px;
            width: 690px;
            line-height: 90px;
            background: #f5ab0b;
            color: #fff;
            border-radius: 180px;                                   
            .van-button__text,.van-button__loading-text{
                font-size: 30px;
            }   
        }
    }
}

</style>