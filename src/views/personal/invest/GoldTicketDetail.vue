<template>
<!-- 黄金单详情 -->
    <div class="ticket_detail bg_base">
        <div class="content">
            <div class="top">
                <img src="@/assets/images/personal/state_bg.png">
                <div class="text_size_32 state">
                    <p>{{ title }}</p>
                    <p class="text_size_28" v-if="state == '待支付'">{{ ticketInfo.countDown }}</p>
                    <p class="text_size_28" v-if="state == '已完成' && operStatus == 'gold_order_oper_confirm'">请确认提货或进行出租，出租获取收益更高哦~</p>
                    <p class="text_size_28" v-if="state == '已完成' && operStatus == 'gold_order_oper_lease'">您已将产品进行出租，详情请查看出租订单</p>
                    <p class="text_size_28" v-if="state == '已完成' && operStatus == 'gold_order_oper_extract'">您已选择提货，详情请查看提货订单</p>
                </div>     

                <div class="product bg_white">
                    <div class="row">
                        <p>黄金Au9999</p>
                        <p class="color_gold">{{ ticketInfo.platGoldPrice || '0.00' }}元/克</p>
                    </div>
                    <div class="row">
                        <p>实际购买金额</p>
                        <p>{{ ticketInfo.totalMoney || '0.00' }}元</p>
                    </div>
                    <div class="row">
                        <p>购买克重</p>
                        <p>{{ ticketInfo.weight || 0 }}克</p>
                    </div>
                </div>
            </div>

            <div class="balance row bg_white text_size_28" v-if="ticketInfo.balanceDeduction && state == '待支付'">
                <p>余额支付</p>
                <p>-{{ ticketInfo.balanceDeduction || '0.00' }}元</p>
            </div>

            <!-- 发票信息 -->
            <div class="invoice bg_white text_size_28">
                <p v-if="state != '待支付' && state != '已关闭'">
                    <span>电子合同</span>
                    <span class="decoration" @click="seeContract">点击查看</span>
                </p>
                <p v-if="ticketInfo.remark">
                    <span>订单备注</span>
                    <span>{{ ticketInfo.remark }}</span>
                </p>
                <p>
                    <span>订单编号</span>
                    <span>{{ ticketInfo.number }}</span>
                </p>
                <!-- 订单进度 -->
                <p>
                    <span>创建时间</span>
                    <span>{{ ticketInfo.createTimeStamp }}</span>
                </p>
                <p v-if="ticketInfo.payTime">
                    <span>支付时间</span>
                    <span>{{ ticketInfo.payTime }}</span>
                </p>
                <p v-if="ticketInfo.closeTime">
                    <span>关闭时间</span>
                    <span>{{ ticketInfo.closeTime }}</span>
                </p>
            </div>

            <p class="tip color_gray" v-if="ticketInfo.balanceDeduction && state == '待支付'">若取消订单，您余额抵扣的资金将自动退回至您的账户</p>
        </div>

        <!-- 页脚 -->
        <div class="footer bg_white text_size_28">
            <div v-if="state == '待支付'" class="row">
                <p class="row"><span>还需支付：</span><span class="color_gold">&yen;{{ ticketInfo.needPayMoney || 0 }}元</span></p>
                <p class="row">
                    <van-button round class="normal" @click="cancelTicket">取消订单</van-button>
                    <van-button round class="another" @click="toPay">去支付</van-button>
                </p>
            </div>

            <div v-else class="row">
                <p></p>
                <p>
                    <van-button round class="normal" v-if="state == '已完成' && operStatus == 'gold_order_oper_confirm'" @click="$router.push({path: '/personal/invest/takeconfirm',query:{type:1, id:ticketInfo.id}})">提货</van-button>
                    <van-button round class="another" v-if="state == '已完成' && operStatus == 'gold_order_oper_confirm'" @click="toRent">出租</van-button>
                    <van-button round class="normal" v-if="state == '已完成' && operStatus == 'gold_order_oper_extract'" @click="$router.push({path:'/personal/invest/taketicketdetail', query:{id:ticketInfo.extendId}})">查看提货订单</van-button>
                    <van-button round class="normal" v-if="state == '已完成' && operStatus == 'gold_order_oper_lease'" @click="$router.push({path:'/personal/invest/rentticketdetail', query:{id:ticketInfo.extendId}})">查看出租订单</van-button>
                    <van-button round class="normal" v-if="state == '已关闭'" @click="deleteTicket">删除订单</van-button>
                </p>
            </div>
        </div>

        <!-- 银行卡 -->
        <SelectBankCard />
        <!-- 交易密码输入框 -->
         <PwdInput />   
        <!-- 提示余额支付 -->
        <ToastPop/>
    </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import { findState, formatDate } from '@/libs/publicFun'
import SelectBankCard from '@/components/SelectBankCard'
import PwdInput from '@/components/PwdInput'
import ToastPop from '@/components/Toast'

    export default {
        components:{
            SelectBankCard,
            PwdInput,
            ToastPop
        },
        data(){
            return {
                state: '',   //订单状态  待支付 已完成 已关闭 
                title: '',        //订单状态对应标题
                ticketInfo:{},   //订单详情
                operStatus:'',    //操作状态 待确认 已出租 已提货
                flag:true,   //是否弹出付款
            }
        },
        methods: {  
            //取消订单
            cancelTicket(){
                Dialog.confirm({
                    title: '取消订单',
                    message: '您确认要取消该订单吗？'
                    }).then(() => {
                        Toast.loading({
                            message: '加载中...',
                            duration: 0,
                            loadingType: 'spinner'
                        });
                        this.$axios('center_order_goldordercancel', this.$route.query.id)
                        .then(data => {
                            console.log(data)
                            // if(data.code != 0){
                            //     Toast({message:data.msg, duration:2000});
                            // }else{
                                Toast.success({message:"取消成功", duration:2000});
                                this.getTicketInfo()
                            // }
                        }).catch(() => {})
                    }).catch(() => {});
            },

            //去付款
            toPay(){
                //跳转银行  

                //保存订单id
                sessionStorage.setItem('orderId', this.$route.query.id)
               
                //余额支付
                if(this.ticketInfo.needPayMoney == 0){
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:4,
                        needpaymoney:this.ticketInfo.balanceDeduction
                    });
                }else{
                    //选择银行卡
                    this.$store.commit("m_toShowBankCard")  
                }
            },
            
            //删除订单
            deleteTicket(){    
                 Dialog.confirm({
                    title: '删除订单',
                    message: '您确认要删除该订单吗？'
                    }).then(() => {
                        Toast.loading({
                            message: '加载中...',
                            duration: 0,
                            loadingType: 'spinner'
                        });
                        this.$axios('center_order_goldorderdel', this.$route.query.id)
                        .then(data => {
                            // if(data.code != 0){
                            //     Toast({message:data.msg, duration:2000});
                            // }else{
                                Toast.success({message:"删除成功", duration:2000});
                                setTimeout(() => {
                                    this.$router.go(-1)
                                },1500)
                            // }
                        }).catch(() => {})
                    }).catch(() => {});
            },

            //获取订单信息
            getTicketInfo(){
                this.$axios('center_order_goldorderinfofrontbyid', this.$route.query.id)
                .then(data => {
                    Toast.clear()
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    // }else{
                        
                        this.ticketInfo = data.result
                        console.log(this.ticketInfo)

                        this.ticketInfo.createTimeStamp = formatDate(Number(this.ticketInfo.createTimeStamp), 'yyyy-MM-dd hh:mm')   //创建时间
                        this.ticketInfo.payTime = formatDate(Number(this.ticketInfo.payTime), 'yyyy-MM-dd hh:mm')   //支付时间
                        this.ticketInfo.closeTime = formatDate(Number(this.ticketInfo.closeTime), 'yyyy-MM-dd hh:mm')   //关闭时间

                        //金额
                        this.ticketInfo.platGoldPrice = this.ticketInfo.platGoldPrice && this.ticketInfo.platGoldPrice.toFixed(2)
                        this.ticketInfo.totalMoney = this.ticketInfo.totalMoney && this.ticketInfo.totalMoney.toFixed(2)
                        this.ticketInfo.money = this.ticketInfo.money && this.ticketInfo.money.toFixed(2)
                        this.ticketInfo.balanceDeduction = this.ticketInfo.balanceDeduction && this.ticketInfo.balanceDeduction.toFixed(2)

                        //订单状态
                        let stateSimplify = findState(this.ticketInfo.status)
                        switch(stateSimplify){
                            case 'gold_order_unpaid' : this.title = '等待付款'; this.state = '待支付'; break;
                            case 'gold_order_finish' : this.title = '支付完成'; this.state = '已完成'; break;
                            case 'gold_order_close' : this.title = '交易关闭'; this.state = '已关闭'; break;
                        }

                        // 操作状态
                        this.operStatus = this.ticketInfo.operStatus && findState(this.ticketInfo.operStatus)  

                        
                        if(this.$route.query.type == 'pay' && this.flag && this.state == '待支付'){
                            this.toPay()
                        }
                        this.flag = false
                    // }
                }).catch(() => {})
            },

            //出租
            toRent(){
                sessionStorage.setItem('goldInfoToRent',JSON.stringify(this.ticketInfo))
                this.$router.push({path: '/personal/invest/rentconfirm',query:{type:1, id:this.ticketInfo.id}})
            },

            //查看合同
            seeContract(){
                if(this.ticketInfo.contractFinish && this.ticketInfo.contractFinish.imgLink){
                    window.location.href = this.ticketInfo.contractFinish && this.ticketInfo.contractFinish.imgLink
                }else{
                    Toast({message:"合同正在签署中", duration:2000});
                }
            }

        },
        async mounted(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //根据id获取订单信息
            this.getTicketInfo()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.decoration{
    color: #f5ab0b;
    text-decoration: underline;
}

.ticket_detail{
    .content{
        height: calc( 100vh - 100px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .top{
            position: relative;
            margin-bottom: 190px;
            &>img{
                height: 270px;
                width: 100%;
            }
            &>div{
                position: absolute;
                top: 40px;
                left: 40px;
            }
            .state{
                p:nth-of-type(2){
                    width: 670px;
                    color: #787277;
                    margin-top: 12px;
                    line-height: 34px;
                }
            }
            .product{
                top: 142px;
                left: 20px;
                width: 710px;
                border-radius: 10px;
                &>div{
                    height: 100px;
                    line-height: 100px;
                    padding: 0 30px;
                    box-sizing: border-box;
                    justify-content: space-between;
                    &:not(:last-of-type){
                        border-bottom: 1px dashed #e3e3e3;
                    }
                }
            }  
        }

        //余额抵扣
        .balance{
            padding: 34px 20px;
            margin-bottom: 18px;
            justify-content: space-between;
        }

        //发票及支付时间
        .invoice{
            padding: 34px 20px;
            margin-bottom: 18px;
                p{
                    padding: 18px 0;
                    span{
                        &:first-of-type{
                            display: inline-block;
                            width: 140px;
                        }
                    }
            }
        }

        .tip{
            padding: 20px;
        }
    }

    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #e3e3e3;
        &>div{
            height: 100px;
            line-height: 100px;
            padding: 0 20px;
            justify-content: space-between;
            p{
                align-items: center;
                .van-button{
                    min-width: 160px;
                    padding: 0 20px;
                    height: 68px;
                    line-height: 68px;
                    .van-button__text{
                        font-size: 28px;
                    }
                    &:last-of-type{
                        margin-left: 14px;
                    }
                    &.normal{
                        border: 1px solid #ccc;
                    }
                    &.another{
                        color: #fff;
                        background: #f5ab0b;
                    }
                }
            }
        }
    }
}

</style>