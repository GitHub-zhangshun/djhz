<template>
<!-- 账单详情 -->
    <div class="billInfo bg_white">
        <div class="img">
            <img :src="icon" alt="">
        </div>
        <p class="text_size_28 text_center">{{title}}</p>
        <p class="text_size_34 text_center">{{isIncome}}&nbsp;{{money}}</p>
        <div class="bottom_content">
            <p v-if="flag==3 || flag==4 || flag==5">商品名称：<span>{{remark}}</span></p>
            <p v-if="flag==8">商品说明：<span>{{remark}}</span></p>
            <p v-if="flag==6 || flag==7 || flag==9">黄金克重：<span>{{remark}}</span></p>
            <p v-if="flag==3 || flag==4 || flag==5 || flag==6 || flag==7 || flag==8 || flag==9">订单信息：<span class="color_gold" @click="lookOrder">查看订单</span></p>            
            <p v-if="flag==2">手续费：<span>{{serviceCharge}}</span></p>
            <p v-if="flag==1 || flag==2">银行卡：<span>{{bankCard}}</span></p>           
            <p>交易流水号：<span>{{number}}</span></p>      
            <p>交易时间：<span>{{createTimeStamp}}</span></p>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import { findState,formatDate,number_format } from '@/libs/publicFun'
    export default {
        data(){
            return{
                flag:0, //充值成功：1，提现成功：2，优惠金&&购买金：3，购买：4,余额退回（商城）：5，余额退回（商城）：6，购买黄金：7，运费：8，购买黄金回款：9
                isIncome:'',// + || - 
                money:'',//金额
                title:'',//状态
                remark:'',//商品名称
                bankCard:"",//银行卡
                number:'',//交易流水号
                createTimeStamp:'',//交易时间
                serviceCharge:'',//手续费
                orderId:'',//商品ID
                icon:'',//图标
                orderNumber:'',//商品订单编号
                orderType:''//账单类型
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...'
            });
            this.$axios('user_user_frontuserbillbyid',this.$route.query.id)
            .then( data => {
                Toast.clear()
                let findArray = sessionStorage.dictionary && JSON.parse(sessionStorage.dictionary) && JSON.parse(sessionStorage.dictionary).find(i => { return i.id == data.result.billType })
                this.icon = findArray && findArray.content && JSON.parse(findArray.content).Icon || ''
                switch (findState(data.result.billType)) {
                    case 'bill_type_recharge':
                    this.flag = 1
                    this.title = '充值成功'
                    break;
                    case 'bill_type_withdraw':
                    this.flag = 2
                    this.title = '提现成功'
                    break;
                    case 'bill_type_discount':
                    this.flag = 3
                    this.title="交易成功"
                    break;
                    case 'bill_type_corpus':
                    this.flag = 3
                    this.title="交易成功"
                    break;
                    case 'bill_type_gold_profit':
                    this.flag = 3
                    this.title="交易成功"
                    break;
                    case 'bill_type_expense':
                    this.flag = 4
                    this.title="支付成功"
                    break;
                    case 'bill_type_restore':
                        if(data.result.orderType==1){
                            this.flag = 5
                        }
                        if(data.result.orderType==2){
                            this.flag = 6
                        }
                    this.title="退回成功"
                    break;
                    case 'bill_type_gold_expense':
                    this.flag = 7
                    this.title="支付成功"
                    break;
                    case 'bill_type_gold_freight':
                    this.flag = 8
                    this.title="支付成功"
                    break;
                    case 'bill_type_gold_corpus':
                    this.flag = 9
                    this.title="交易成功"
                    break;  
                    default:
                    break;
                }
                this.orderNumber = data.result.orderNumber
                this.orderId = data.result.orderId
                this.isIncome = data.result.isIncome?"+":"-"
                this.remark = data.result.remark
                this.money = number_format(data.result.operationMoney,2,'.',',')
                this.bankCard = data.result.bankCard && `${data.result.bankName}  尾号${(data.result.bankCard).substr(-4)}` 
                this.number = data.result.number
                this.createTimeStamp = formatDate(data.result.createTimeStamp,'yyyy-MM-dd hh:mm:ss')
                this.serviceCharge =  number_format(data.result.serviceCharge,2,'.',',')
                this.orderType = data.result.orderType
            })
        },
        methods:{
            lookOrder(){
                if(this.orderType==1){
                    this.$router.push({path:'/personal/ticketdetail',query:{id:this.orderId}})
                }
                if(this.orderType==2){
                    this.$router.push({path:'/personal/invest/goldticketdetail',query:{id:this.orderId}})
                }
                if(this.orderType==3){
                    this.$router.push({path:'/personal/invest/rentticketdetail',query:{id:this.orderId}})
                }
                if(this.orderType==4){
                    this.$router.push({path:'/personal/invest/taketicketdetail',query:{id:this.orderId}})
                }
            }
            
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.billInfo{
    min-height: calc(100vh - 66px);
    padding-top: 66px;
    .img{
        width: 92px;
        margin: 0 auto;
        padding-bottom: 32px;
        img{
            width: 100%;
        }
    }
    &>p:nth-of-type(2){
        padding-top: 30px;
        font-weight: bold;
        padding-bottom: 82px;
        border-bottom: 2px solid #e2e2e2;
    }
    .bottom_content{
        padding-top: 62px;
        padding-left: 33px;
        p{
            padding-bottom: 46px;
            font-size: 28px;
            color: #ababab;
            span{
                color: #000;
            }
            .color_gold{
                color: #f5ab0b;
                text-decoration:underline;
            }
        }
    }
}
</style>