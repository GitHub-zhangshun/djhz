<template>
<!-- 订单详情 -->
    <div class="ticket_detail bg_base">
        <div class="content">
            <div class="top">
                <img src="@/assets/images/personal/state_bg.png" :class="{later:state == '预约中', later2: ticketType == 'order' && state == '已完成'}">
                <div class="text_size_32 state">
                    <p>{{ title }}</p>
                    <p class="text_size_28" v-if="state == '待发货'">平台将尽快为您发货，请耐心等待</p>
                    <p class="text_size_28" v-if="state == '待支付'">{{ ticketInfo.countDown }}</p>
                    <p class="text_size_28" v-if="state == '预约中'">预约到期日：{{ InterestInfo.endTimeTxt }}<br>
                        <span class="text_size_24" v-if="!isTake">您在到期前{{ ticketInfo.applyExtractDay || 0 }}日可以提货，到期后您的优惠金将自动转入您的账户余额；若您未提货，到期后您实际购买的款项和优惠金将自动转入您的账户余额</span>                      
                        <span class="text_size_24" v-else>
                            <span v-if="label== 'delivery'">您已选择提货，到期后平台将尽快为您发货，优惠金将自动转入您的账户余额</span> 
                            <span v-else>您已选择提货，请凭自提码到门店进行提货，到期后优惠金将自动转入您的账户余额</span> 
                        </span>
                    </p>
                    <p class="text_size_28" v-if="ticketType == 'order' && state == '已完成'">预约到期日：{{ InterestInfo.endTimeTxt }}<br>
                        <span class="text_size_24" v-if="isTake">您的优惠金已自动转入您的账户余额，请注意查收</span>                      
                        <span class="text_size_24" v-else>您的实际购买的款项和优惠金已自动转入您的账户余额，请注意查收</span>
                    </p>
                </div>
                
               <div class="bg_white address" @click="checkDelivery" :class="{later:state == '预约中', later2: ticketType == 'order' && state == '已完成'}">
                    <div class="row cover">
                        <div class="left">
                            <div v-if="state == '待收货'"><img src="@/assets/images/ticket/delivery.png"></div>
                            <div v-else-if="(state =='已完成'&&label =='delivery'&&ticketType =='immediately') || (state =='已完成'&&label=='delivery'&&ticketType=='order'&&isTake)"><img src="@/assets/images/ticket/completed.png"></div>
                            <div v-else>
                                <img src="@/assets/images/ticket/address.png" v-if="label == 'delivery'">
                                <img src="@/assets/images/ticket/store.png" v-if="label == 'gostore'">
                            </div>
                        </div>
                        <div class="center">
                            <!-- 待收货的情况添加物流 -->
                            <div v-if="state == '待收货' || (state =='已完成'&&label =='delivery'&&ticketType =='immediately') || (state =='已完成'&&label=='delivery'&&ticketType=='order'&&isTake)">
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
                        <img v-if="state == '待收货' || (state =='已完成'&&label =='delivery'&&ticketType =='immediately') || (state =='已完成'&&label=='delivery'&&ticketType=='order'&&isTake) || label == 'gostore'" src="@/assets/images/ticket/path.png" class="right">
                    </div>
                    <img v-if="label == 'delivery' && (state == '待支付' || state =='待发货' || state == '预约中' || (state =='已完成'&&ticketType =='order'&&!isTake))" src="@/assets/images/ticket/bottemLine.png" class="bot_line">
                </div>
            </div>

            <!-- 物流配送 收货地址 -->
            <div v-if="state == '待收货' || (state =='已完成'&&label =='delivery'&&ticketType =='immediately') || (state =='已完成'&&label=='delivery'&&ticketType=='order'&&isTake)" class="delivery_address bg_white row">
                 <img src="@/assets/images/ticket/address.png">
                <div>
                    <p class="text_size_36">{{ addressInfo.userName }}&emsp;<span class="text_size_32">{{ addressInfo.phone }}</span></p>
                    <p class="color_gray">{{ addressInfo.roughlyAddress }}&emsp;{{ addressInfo.address }}</p>
                </div>
            </div>

            <!-- 自提码 -->
            <div v-if="label=='gostore'" class="code text_size_28">
                <div class="row code_time bg_white" v-if="ticketType =='immediately'&&storeInfo.extractTime&&(state =='待自提'||state=='待支付')">
                    <p>预约自提时间</p>
                    <p>{{ storeInfo.extractTimeTxt }}</p>
                </div>
                <div class="code_detail bg_white">
                    <p class="color_gray row" v-if="ticketType =='immediately'&&state =='待支付'"><span>自提码</span><span>支付完成后查看</span></p>
                    <p class="row" v-if="state=='待自提'||state=='已完成'||(state=='预约中'&&isTake)"><span>自提码</span><span class="text_size_32">{{ storeInfo.code || 0 }}</span></p>
                </div>
            </div>

            <div class="product bg_white">
                <div class="main"> 
                    <div class="row" v-for="(good,index) in ticketInfo.orderGoodsList" :key="index">
                        <img :src="good.goodsImgLink||require('@/assets/images/product_placeholder.jpg')">
                        <div class="detail">
                            <p class="name text_size_28">{{ good.goodsName }}</p>
                            <div class="color_gray text_size_26 row"><p><span v-for="(item,index) in good.orderGoodsSpecList" :key="index">{{ item.attrTxt }}&nbsp;&nbsp;</span></p><span>x{{ good.count || 0 }}</span></div>
                            <p class="color_gray text_size_26">商品克重：{{ good.weight || 0 }}g</p>
                        </div>
                    </div>
                </div>

                <!-- 预约期限 -->
                <div class="later_time bg_white text_size_28" v-if="ticketType == 'order'">
                    <p class="row">
                        <span>预约期限</span>
                        <span>{{ InterestInfo.term || 0 }}天</span>
                    </p>
                    <p class="row">
                        <span class="row help"><label>到期预计返还优惠金</label><img src="@/assets/images/ticket/help.png" @click="seeMore"></span>
                        <span>&yen;{{ InterestInfo.interestMoney || '0.00' }}</span>
                    </p>
                </div>    
            </div>

            <!-- 商品总额 -->
            <div class="totalPrice bg_white text_size_28">
                <p class="row">
                    <span>商品总额</span>
                    <span class="color_gold">&yen;{{ ticketInfo.money || '0.00' }}</span>
                </p>
                <p class="row">
                    <span>手续费</span>
                    <span>&yen;{{ ticketInfo.poundage || '0.00' }}</span>
                </p>
                <p class="row" v-if="label == 'delivery'">
                    <span>运费</span>
                    <span>&yen;{{ ticketInfo.freight || '0.00' }}</span>
                </p>
                <p class="row" v-if="ticketInfo.balanceDeduction">
                    <span>使用账户余额抵扣</span>
                    <span class="color_gold">-&yen;{{ ticketInfo.balanceDeduction || '0.00' }}</span>
                </p>
            </div>

            <!-- 发票信息 -->
            <div class="invoice bg_white text_size_28">
                <p>
                    <span>发票</span>
                    <span v-if="ticketInfo.invoiceFinish && ticketInfo.invoiceFinish.pdfUrl" class="decoration" @click="seeInvoice">{{ ticketInfo.orderInvoice && ticketInfo.orderInvoice.title }}</span>
                    <span v-else>{{ ticketInfo.orderInvoice && ticketInfo.orderInvoice.title }}</span>
                </p>
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
                <p v-if="ticketInfo.sendTime">
                    <span>发货时间</span>
                    <span>{{ ticketInfo.sendTime }}</span>
                </p>
                <p v-if="ticketInfo.finishTime">
                    <span>完成时间</span>
                    <span>{{ ticketInfo.finishTime }}</span>
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
                <p>合计：<span class="color_gold text_size_32">&yen;{{ ticketInfo.totalMoney || 0 }}元</span></p>
                <p>
                    <van-button round class="normal" v-if="state == '预约中' && !isTake" @click="confirmToTake">确认提货</van-button>
                    <van-button round class="another" v-if="state == '待收货'" @click="confirmReceived">确认收货</van-button>
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
                label: '',    //门店自提还是送货上门 gostore delivery
                state: '',   //订单状态  待支付 预约中 待发货 待收货 待自提 已完成 已关闭 
                title: '',        //订单状态对应标题
                ticketType: '',  //预约订单还是商品订单  order immediately
                isTake: false,   //预约商品是否选择提货
                ticketInfo:{},   //订单详情
                addressInfo:{},    //送货地址信息
                storeInfo:{},    //门店自提信息
                InterestInfo:{},    //利息信息（预约）
                exprTraceInfo:{},   //当前物流信息
                flag:true,   //是否弹出付款
            }
        },
        methods: {
            checkDelivery(){
                if(this.state =='待收货'|| (this.state =='已完成'&&this.label=='delivery'&&this.ticketType =='immediately') || (this.state =='已完成'&&this.label=='delivery'&&this.ticketType =='order'&&this.isTake)){
                    //查看物流
                    this.$router.push({path:'/personal/delivery', query:{id:this.$route.query.id}})
                }else if(this.label == 'gostore'){
                    //查看自提门店详情
                    this.$router.push({path:'/submitticket/storedetail', query:{id:this.storeInfo.storeId}})
                } 
            },

            //查看预约金详细
            seeMore(){
                Dialog.alert({
                message: '预约到期后优惠金将自动返回到您的账户余额，可用于订单抵扣或提现'
                }).then(() => {});
            },

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
                        this.$axios('center_order_userordercancel', this.$route.query.id)
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

            //确认提货
            confirmToTake(){
                if(this.ticketInfo.isApplyExtract){
                    Dialog.confirm({
                        title: '确认提货',
                        message: '您确认选择提货吗？'
                        }).then(() => {
                            Toast.loading({
                                message: '加载中...',
                                duration: 0,
                                loadingType: 'spinner'
                            });
                            this.$axios('order_order_applyextractgoods', this.$route.query.id)
                            .then(data => {
                                // if(data.code != 0){
                                //     Toast({message:data.msg, duration:2000});
                                // }else{
                                    Toast.success({message:"确认提货成功", duration:2000});
                                    this.getTicketInfo()
                                // }
                                // this.isTake = true
                            }).catch(() => {})
                        }).catch(() => {});
                }else{
                    Dialog.alert({
                        message: `到期前${this.ticketInfo.applyExtractDay}日才可进行确认`
                    }).then(() => {});
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
                        this.$axios('center_order_orderreceivedgoods', this.$route.query.id)
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
                        this.$axios('center_order_userorderdel', this.$route.query.id)
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
                this.$axios('center_order_userorderbyid', this.$route.query.id)
                .then(data => {
                        Toast.clear()
                        // if(data.code != 0){
                        //     Toast({message:data.msg, duration:2000})
                        // }else{
                        
                        this.ticketInfo = data.result
                        console.log(this.ticketInfo)

                        this.addressInfo = data.result.orderAddress
                        this.storeInfo = data.result.orderExtract
                        this.InterestInfo = data.result.orderInterest
                        this.exprTraceInfo = data.result.exprTrace

                        this.ticketInfo.createTimeStamp = formatDate(Number(this.ticketInfo.createTimeStamp), 'yyyy-MM-dd hh:mm')   //创建时间
                        this.ticketInfo.payTime = formatDate((this.ticketInfo.payTime), 'yyyy-MM-dd hh:mm')   //支付时间
                        this.ticketInfo.sendTime = formatDate(Number(this.ticketInfo.sendTime), 'yyyy-MM-dd hh:mm')   //发货时间
                        this.ticketInfo.finishTime = formatDate(Number(this.ticketInfo.finishTime), 'yyyy-MM-dd hh:mm')  //完成时间
                        this.ticketInfo.closeTime = formatDate(Number(this.ticketInfo.closeTime), 'yyyy-MM-dd hh:mm')   //关闭时间

                        //金额
                        this.ticketInfo.money = this.ticketInfo.money && this.ticketInfo.money.toFixed(2)
                        this.ticketInfo.poundage = this.ticketInfo.poundage && this.ticketInfo.poundage.toFixed(2)
                        this.ticketInfo.freight = this.ticketInfo.freight && this.ticketInfo.freight.toFixed(2)
                        this.ticketInfo.balanceDeduction = this.ticketInfo.balanceDeduction && this.ticketInfo.balanceDeduction.toFixed(2)
                        if(this.InterestInfo){
                            this.InterestInfo.interestMoney = this.InterestInfo.interestMoney && this.InterestInfo.interestMoney.toFixed(2)
                        }

                        //预约订单还是商品订单
                        if(this.ticketInfo.isBespoke){
                            this.ticketType = 'order'
                        }else{
                            this.ticketType = 'immediately'
                        }
                        
                        //送货上门还是门店自提
                        if(this.ticketInfo.isDelivery){
                            this.label = 'delivery'
                        }else{
                            this.label = 'gostore'
                        }

                        //订单状态
                        let stateSimplify = findState(this.ticketInfo.orderStatus)
                        switch(stateSimplify){
                            case 'front_order_show_unpaid' : this.title = '等待付款'; this.state = '待支付'; break;
                            case 'front_order_show_reserve' : this.title = '预约中'; this.state = '预约中'; break;
                            case 'front_order_show_unsend' : this.title = '等待发货'; this.state = '待发货'; break;
                            case 'front_order_show_waitgoods' : this.title = '待确认收货'; this.state = '待收货'; break;
                            case 'front_order_show_extract' : this.title = '待自提'; this.state = '待自提'; break;
                            case 'front_order_show_finish' : this.title = '交易完成'; this.state = '已完成'; break;
                            case 'front_order_show_close' : this.title = '交易关闭'; this.state = '已关闭'; break;
                        }

                        //是否提货
                        if(this.InterestInfo && this.InterestInfo.extractStatus == 1){
                            this.isTake = true
                        }else{
                            this.isTake = false
                        }

                        if(this.$route.query.type == 'pay' && this.flag && this.state == '待支付'){
                            this.toPay()
                        }
                        this.flag = false
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
            },

            //查看发票
            seeInvoice(){
                window.location.href = this.ticketInfo.invoiceFinish && this.ticketInfo.invoiceFinish.pdfUrl
            }
        },
        created(){
            // Toast.loading({
            //     mask: true,
            //     message: '加载中...',
            //     duration: 0,
            //     loadingType: 'spinner'
            // });

            //根据id获取订单信息
            // this.getTicketInfo()
        },
        mounted(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //根据id获取订单信息
            this.getTicketInfo()
        }
        // beforeRouteLeave(to, from, next){     
        //     if(to.path == '/submitticket'){
        //         next('/personal')
        //         return
        //     }
        //     next()
        // }
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
                &.later{
                    height: 310px;
                }
                &.later2{
                    height: 270px;
                }
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
                &.later{
                    top: 234px;
                }
                &.later2{
                    top: 194px;
                }
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
            margin-bottom: 18px;
            padding: 34px 20px 4px 20px;
            .main{
                &>div{  
                    margin-bottom: 30px;
                    padding-bottom: 30px;
                    border-bottom: 1px dashed #e3e3e3;
                    align-items: center;
                    &:last-of-type{
                        margin-bottom: 0;
                        border: none;
                    }
                    img{
                        height: 170px;
                        width: 170px;
                        margin-right: 18px;
                    }
                    .detail{
                        width: 540px;
                        &>p:first-of-type{
                            line-height: 36px;
                            margin-bottom: 30px;
                            overflow:hidden; 
                            text-overflow:ellipsis;
                            display:-webkit-box;
                            /*! autoprefixer: off */
                            -webkit-box-orient:vertical;
                            /*! autoprefixer: on */
                            -webkit-line-clamp:2; 
                        }
                        div{
                            justify-content: space-between;
                            margin-bottom: 10px;
                        }
                    }
                }
            }
            //预约期限
            .later_time{
                border-top: 1px solid #e3e3e3;
                padding-top: 20px;
                p{
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 0;
                    .help{
                        align-items: center;
                        img{
                            width: 30px;
                            height: 30px;
                            margin-left: 12px;
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