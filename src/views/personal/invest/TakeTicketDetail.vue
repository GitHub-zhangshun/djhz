<template>
<!-- 提货单详情 -->
    <div class="ticket_detail bg_base">
        <div class="content" :class="{content2: state !== '待收货'}">
            <div class="top">
                <img src="@/assets/images/personal/state_bg.png">
                <div class="text_size_32 state">
                    <p>{{ title }}</p>
                    <p class="text_size_28" v-if="state == '待发货'">平台将尽快为您发货，请耐心等待</p>
                </div>
                
               <div class="bg_white address" @click="checkDelivery">
                    <div class="row cover">
                        <div class="left">
                            <div v-if="state == '待收货'"><img src="@/assets/images/ticket/delivery.png"></div>
                            <div v-else-if="state == '已完成' && label == 'delivery'"><img src="@/assets/images/ticket/completed.png"></div>
                            <div v-else>
                                <img src="@/assets/images/ticket/address.png" v-if="label == 'delivery'">
                                <img src="@/assets/images/ticket/store.png" v-if="label == 'gostore'">
                            </div>
                        </div>
                        <div class="center">
                            <!-- 待收货的情况添加物流 -->
                            <div v-if="state == '待收货' || state == '已完成' && label == 'delivery'">
                                <div class="has_default">
                                    <p class="text_size_34"><span v-if="state=='待收货'">正在进行派送</span><span v-if="state=='已完成'">已签收</span></p>
                                    <p class="color_gray">{{ exprTraceInfo && exprTraceInfo.operTime }}</p>
                                </div>
                            </div>
                            <div v-else>
                                <div v-if="label == 'delivery'">
                                    <div class="has_default">
                                        <p class="text_size_36">{{ addressInfo.userName }}&emsp;<span class="text_size_32">{{ addressInfo.phone }}</span></p>
                                        <p class="color_gray">{{ addressInfo.roughlyAddress }}&emsp;{{ addressInfo.address }}</p>
                                    </div>
                                </div>

                                <div v-if="label == 'gostore'">
                                    <div class="has_default">
                                        <p class="text_size_36">{{ storeInfo.storeName }}</p>
                                        <p class="color_gray">门店地址：{{ storeInfo.address }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img v-if="state == '待收货' || state == '已完成' || label == 'gostore'" src="@/assets/images/ticket/path.png" class="right">
                    </div>
                    <img v-if="label == 'delivery' && (state == '待支付' || state =='待发货' || state == '预约中')" src="@/assets/images/ticket/bottemLine.png" class="bot_line">

                </div>
            </div>

            <!-- 物流配送 收货地址 -->
            <div v-if="state == '待收货' || (state == '已完成' && label == 'delivery')" class="delivery_address bg_white row">
                 <img src="@/assets/images/ticket/address.png">
                <div>
                    <p class="text_size_36">{{ addressInfo.userName }}&emsp;<span class="text_size_32">{{ addressInfo.phone }}</span></p>
                    <p class="color_gray">{{ addressInfo.roughlyAddress }}&emsp;{{ addressInfo.address }}</p>
                </div>
            </div>

            <!-- 自提码 -->
            <div v-if="label=='gostore'" class="code text_size_28">
                <div class="row code_time bg_white" v-if="storeInfo.extractTime&&(state =='待自提'||state=='待支付')">
                    <p>预约自提时间</p>
                    <p>{{ storeInfo.extractTimeTxt }}</p>
                </div>
                <div class="code_detail bg_white">
                    <p class="row" v-if="state=='待自提'||state=='已完成'"><span>自提码</span><span class="text_size_32">{{ storeInfo.code || 0 }}</span></p>
                </div>
            </div>

            <div class="product bg_white">
                <div v-for="(item,index) in ticketInfo.goldOrderList" :key="index">
                    <p class="name text_size_30">黄金Au9999</p>
                    <div class="row detail">
                        <div>
                            <p class="text_bold text_size_34">{{  item.totalMoney || '0.00' }}元</p>
                            <p class="text_size_26 color_gray">购买金额</p>
                        </div>
                        <div>
                            <p class="text_bold text_size_34">{{  item.weight || 0 }}克</p>
                            <p class="text_size_26 color_gray">克重</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 合计 -->
            <div class="totalPrice text_size_28 bg_white">
                <p class="row">
                    <span>提金克重合计</span>
                    <span class="color_gold">{{ ticketInfo.orderWeight || 0 }}克</span>
                </p>
                <p class="row">
                    <span>实际购买金额合计</span>
                    <span>{{ ticketInfo.orderMoney || '0.00'}}元</span>
                </p>
                <p class="row" v-if="label == 'delivery'">
                    <span>运费</span>
                    <span>{{ ticketInfo.freight || '0.00' }}元</span>
                </p>
            </div>

            <!-- 发票信息 -->
            <div class="invoice bg_white text_size_28">
                <p>
                    <span>电子发票</span>
                    <span v-if="ticketInfo.invoiceFinish && ticketInfo.invoiceFinish.pdfUrl" class="decoration" @click="seeInvoice">{{ ticketInfo.orderInvoice && ticketInfo.orderInvoice.title }}</span>
                    <span v-else>{{ ticketInfo.orderInvoice && ticketInfo.orderInvoice.title }}</span>
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
                <p v-if="ticketInfo.sendTime">
                    <span>发货时间</span>
                    <span>{{ ticketInfo.sendTime }}</span>
                </p>
                <p v-if="ticketInfo.finishTime">
                    <span>完成时间</span>
                    <span>{{ ticketInfo.finishTime }}</span>
                </p>
            </div>

        </div>


        <!-- 页脚 -->
        <div class="footer bg_white text_size_28" v-if="state == '待收货'">
            <div class="row">
                <p></p>
                <p>
                    <van-button round class="another" @click="confirmReceived">确认收货</van-button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import { findState, formatDate } from '@/libs/publicFun'

    export default {
        data(){
            return {
                label: '',    //门店自提还是送货上门 gostore delivery
                state: '',   //订单状态  待发货 待收货 待自提 已完成 
                title: '',        //订单状态对应标题
                ticketInfo:{},   //订单详情
                addressInfo:{},    //送货地址信息
                storeInfo:{},    //门店自提信息
                exprTraceInfo:{},   //当前物流信息
            }
        },
        methods: {
            checkDelivery(){
                if(this.state == '待收货' || this.state == '已完成' && this.label == 'delivery'){
                    //查看物流
                    this.$router.push({path:'/personal/delivery', query:{id:this.$route.query.id, type:'take'}})
                }else if(this.label == 'gostore'){
                    //查看自提门店详情
                    this.$router.push({path:'/submitticket/storedetail', query:{id:this.storeInfo.storeId}})
                }
            },

            //确认收货
            confirmReceived(){
                Dialog.confirm({
                    title: '确认收货',
                    message: '您确认收到货了吗？'
                    }).then(() => {
                        Toast.loading({
                            message: '加载中...',
                            duration: 0,
                            loadingType: 'spinner'
                        });
                        this.$axios('center_order_goldorderreceivedgoods', this.$route.query.id)
                        .then(data => {
                            // if(data.code != 0){
                            //     Toast({message:data.msg, duration:2000});
                            // }else{
                                Toast.success({message:"确认收货成功", duration:2000});
                                this.getTicketInfo()
                            // }
                       }).catch(() => {})
                    }).catch(() => {});
            },
            
            //获取订单信息
            getTicketInfo(){
                this.$axios('center_order_golddeliveryorderinfobyid', this.$route.query.id)
                .then(data => {
                    Toast.clear()
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    // }else{
                        
                        this.ticketInfo = data.result
                        console.log(this.ticketInfo)
                        
                        this.addressInfo = data.result.orderAddress
                        this.storeInfo = data.result.orderExtract
                        this.exprTraceInfo = data.result.exprTrace

                        this.ticketInfo.createTimeStamp = formatDate(Number(this.ticketInfo.createTimeStamp), 'yyyy-MM-dd hh:mm')   //创建时间
                        this.ticketInfo.sendTime = formatDate(Number(this.ticketInfo.sendTime), 'yyyy-MM-dd hh:mm')   //发货时间
                        this.ticketInfo.finishTime = formatDate(Number(this.ticketInfo.finishTime), 'yyyy-MM-dd hh:mm')  //完成时间

                        //金额
                        this.ticketInfo.orderMoney = this.ticketInfo.orderMoney && this.ticketInfo.orderMoney.toFixed(2)
                        this.ticketInfo.freight = this.ticketInfo.freight && this.ticketInfo.freight.toFixed(2)
                        this.ticketInfo.goldOrderList.forEach(item => {
                            item.totalMoney = item.totalMoney && item.totalMoney.toFixed(2)
                        })

                        
                        //送货上门还是门店自提
                        if(this.ticketInfo.isDelivery){
                            this.label = 'delivery'
                        }else{
                            this.label = 'gostore'
                        }

                        //订单状态
                        let stateSimplify = findState(this.ticketInfo.frontStatus)
                        switch(stateSimplify){
                            case 'front_gold_delivery_unsend' : this.title = '等待发货'; this.state = '待发货'; break;
                            case 'front_gold_delivery_waitgoods' : this.title = '待确认收货'; this.state = '待收货'; break;
                            case 'front_gold_delivery_extract' : this.title = '待自提'; this.state = '待自提'; break;
                            case 'front_gold_delivery_finish' : this.title = '交易完成'; this.state = '已完成'; break;
                        }
                    // }    
                }).catch(() => {})
            },

            //查看发票
            seeInvoice(){
                window.location.href = this.ticketInfo.invoiceFinish && this.ticketInfo.invoiceFinish.pdfUrl
            }

        },
        created(){
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
            margin-bottom: 120px;
            &>img{
                height: 220px;
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
            //地址
            .address{
                top: 140px;
                left: 20px;
                width: 710px;
                border-radius: 10px;
                .cover{
                    height: 180px;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    position: relative;
                    z-index: 10;
                    .left{
                        img{
                            width: 80px;
                            height: 80px;
                        }
                    }
                    .right{
                        width: 20px;
                        height: 36px;
                    }
                    .center{
                        padding: 0 40px 0 20px;
                        width: 560px;
                        .has_default{
                            line-height: 40px;
                                overflow:hidden; 
                                text-overflow:ellipsis;
                                display:-webkit-box;
                                /*! autoprefixer: off */
                                -webkit-box-orient:vertical;
                                /*! autoprefixer: on */
                                -webkit-line-clamp:2; 
                            p:first-of-type{
                                margin: 16px 0;
                            }                            
                        }
                    }
                }
                .bot_line{
                    width: 100%;
                    position: absolute;
                    top: 0;
                }
            }
        }

        //配送地址
        .delivery_address{
            margin-bottom: 18px;
            padding: 20px;
            align-items: center;
            img{
                width: 80px;
                height: 80px;
                margin-right: 20px;
            }
            div{
                p:first-of-type{
                    margin: 16px 0;
                }
                p:last-of-type{
                    line-height: 44px;
                    overflow:hidden; 
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    /*! autoprefixer: off */
                    -webkit-box-orient:vertical;
                    /*! autoprefixer: on */
                    -webkit-line-clamp:2; 
                }
            }
        }

        // 自提码
        .code{
            &>div{
                &:last-of-type{
                    margin-bottom: 18px;
                }
            }
            .code_time{
                justify-content: space-between;
                padding: 30px 20px;
            }
            .code_detail{
                p{
                    justify-content: space-between;
                    padding: 30px 20px;
                }
            }
        }

        .product{
            margin: 18px 0;
            &>div{
                padding: 36px 20px;
                border-bottom: 1px solid #e3e3e3;
                &:last-of-type{
                    border: none;
                }
                .name{
                    margin-bottom: 28px;
                }
                .detail{
                    padding: 0 10px; 
                    &>div{
                        width: 50%;
                        p{
                            &:first-of-type{
                                margin-bottom: 16px;
                            }
                        }
                    }
                }
            }
        }

        //费用
        .totalPrice{
            padding: 34px 20px;
            margin-bottom: 18px;
            p{
                align-items: center;
                justify-content: space-between;
                padding: 18px 0;
            }
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
    }

    .content2{
        min-height: 100vh;
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
                    width: 160px;
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