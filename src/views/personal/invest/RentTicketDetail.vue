<template>
<!-- 出租单详情 -->
    <div class="ticket_detail bg_base">
        <div class="content" :class="{content2: !(!isTake && takeable || state == '已完成' && isTake)}">
            <div class="top">
                <div class="state">
                    <p v-if="state == '出租中'">
                        <span v-if="!isTake && !takeable">您在到期前{{ ticketInfo.applyExtractDay || 0 }}日可以提货，到期后您的收益将自动转入您的账户余额；若您未提货，到期后您实际购买的款项和收益将自动转入您的账户余额</span>                      
                        <span v-if="!isTake && takeable">您在到期前{{ ticketInfo.applyExtractDay || 0 }}日若未提货，到期后的下一个工作日您实际购买金额的款项和收益讲自动转入您的账户余额</span>
                        <span v-if="isTake">您已提货，到期日下一个工作日收益将自动转入您的账户余额；平台将在到期后尽快为您安排发货</span>
                    </p>
                    <p v-else-if="state == '已完成'">
                        <span v-if="isTake">您的收益已经转入您的账户余额，请注意查收</span> 
                        <span v-if="!isTake">您购买的款项和收益已经转入您的账户余额，请注意查收</span> 
                    </p>
                </div>
                
                <div class="product">
                    <div class="bg_white row" v-for="(item,index) in ticketInfo.goldOrderList" :key="index" @click="$router.push({path: '/personal/invest/goldticketdetail', query:{id:item.id} })">
                        <div>
                            <p class="name text_size_28  text_bold">黄金Au9999</p>
                            <div class="row detail text_size_26 color_gray">
                                <p>购买金额：{{ item.totalMoney || '0.00'}}元</p>
                                <p>克重：{{ item.weight || 0 }}克</p>    
                            </div>
                        </div>
                        <img src="@/assets/images/ticket/path.png" >
                    </div>   
                </div>
            </div>

            <!-- 合计 -->
            <div class="totalPrice text_size_28 bg_white">
                <p class="row">
                    <span>出租合计克重</span>
                    <span class="color_gold">{{ ticketInfo.totalWeight || 0 }}克</span>
                </p>
                <p class="row">
                    <span>实际购买金额合计</span>
                    <span>{{ ticketInfo.totalMoney || '0.00' }}元</span>
                </p>
            </div>

            <!-- 商品总额 -->
            <div class="period bg_white text_size_28">
                <p class="row">
                    <span>期限</span>
                    <span>{{ ticketInfo.termDay || 0}}天</span>
                </p>
                <p class="row">
                    <span>收益率</span>
                    <span>{{ ticketInfo.profitRate || 0 }}%</span>
                </p>
                <p class="row">
                    <span>预计收益</span>
                    <span>{{ ticketInfo.profitMoney || '0.00' }}元</span>
                </p>
                <p class="row">
                    <span>到期日</span>
                    <span>{{ ticketInfo.endTimeStamp }}</span>
                </p>
            </div>

            <!-- 发票信息 -->
            <div class="invoice bg_white text_size_28">
                <p>
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
                <p v-if="ticketInfo.finshTime">
                    <span>完成时间</span>
                    <span>{{ ticketInfo.finshTime }}</span>
                </p>
            </div>
        </div>

        <!-- 页脚 -->
        <div class="footer bg_white text_size_28" v-if="!isTake && takeable || state == '已完成' && isTake">
            <div class="row">
                <p></p>
                <p>
                    <van-button v-if="!isTake && takeable && state == '出租中'" round class="normal" @click="$router.push({path: '/personal/invest/takeconfirm',query:{type:2, id:ticketInfo.id}})">提货</van-button>
                    <van-button v-if="state == '已完成' && isTake" round class="normal" @click="$router.push({path: '/personal/invest/taketicketdetail', query:{id:ticketInfo.deliveryOrderId} })">查看提货订单</van-button>
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
                state: '',   //订单状态  出租中  已完成
                isTake: false,   //是否选择提货
                takeable: true,   //是否可以提货
                ticketInfo:{},   //订单详情
            }
        },
        methods: {
        
            //获取订单信息
            getTicketInfo(){
                this.$axios('center_order_goldleaseorderbyid', this.$route.query.id)
                .then(data => {
                    Toast.clear()
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    // }else{
                        
                        this.ticketInfo = data.result
                        console.log(this.ticketInfo)

                        this.ticketInfo.createTimeStamp = formatDate(Number(this.ticketInfo.createTimeStamp), 'yyyy-MM-dd hh:mm')   //创建时间
                        this.ticketInfo.finshTime = formatDate(Number(this.ticketInfo.finshTime), 'yyyy-MM-dd hh:mm')  //完成时间
                        this.ticketInfo.endTimeStamp = formatDate(Number(this.ticketInfo.endTimeStamp), 'yyyy年MM月dd日')  //到期时间

                        //金额
                        this.ticketInfo.totalMoney = this.ticketInfo.totalMoney && this.ticketInfo.totalMoney.toFixed(2)
                        this.ticketInfo.profitMoney = this.ticketInfo.profitMoney && this.ticketInfo.profitMoney.toFixed(2)
                        this.ticketInfo.goldOrderList.forEach(item => {
                            item.totalMoney = item.totalMoney && item.totalMoney.toFixed(2)
                        })


                        //订单状态
                        let stateSimplify = findState(this.ticketInfo.status)
                        switch(stateSimplify){
                            case 'gold_lease_order_leasing' : this.state = '出租中'; break;
                            case 'gold_lease_order_finsh' : this.state = '已完成'; break;
                        }

                        //是否提货
                        if(this.ticketInfo.extractStatus == 1){
                            this.isTake = true
                        }else{
                            this.isTake = false
                        }

                        this.takeable = this.ticketInfo.isApplyExtract
                    // }
                }).catch(() => {})
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
            background: url('../../../assets/images/personal/state_bg.png') no-repeat;
            background-size: 100% 210px;
            .state{
                padding: 40px 40px 0px 40px;
                box-sizing: border-box;
                min-height: 110px;
                span{
                    line-height: 36px;
                }
            }
            //商品
            .product{
                &>div{
                    margin: 0 20px;
                    padding: 30px;
                    border-radius: 10px;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px dashed #e3e3e3;
                    img{
                        width: 18px;
                    }
                    .name{
                        margin-bottom: 28px;
                    }
                    .detail{
                        p:first-of-type{
                            margin-right: 110px;
                        }
                    }
                    &:first-of-type{
                        margin-top: 18px;
                    }
                    &:last-of-type{
                        border: none;
                    }
                }
            }
        }
    

        //费用
        .totalPrice, .period{
            padding: 34px 20px;
            margin: 18px 0;
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