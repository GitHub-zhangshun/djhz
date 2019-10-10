<template>
<!-- 提交订单 -->
    <div class="ticket bg_base">
        <!-- 页头 -->
        <div class="header row bg_white text_size_32">
            <p @click="select('delivery')" :class="{active:label == 'delivery'}">送货上门<img src="@/assets/images/ticket/line.png" v-if="label=='delivery'"></p>
            <p @click="select('gostore')" :class="{active:label == 'gostore'}">门店自提<img src="@/assets/images/ticket/line.png" v-if="label=='gostore'"></p>
        </div>

        <!-- 内容 -->
        <div class="content">
            <div class="bg_white address" @click="manageAddress">
                <div class="row cover">
                    <p class="left">
                        <img src="@/assets/images/ticket/address.png" v-if="label == 'delivery'">
                        <img src="@/assets/images/ticket/store.png" v-if="label == 'gostore'">
                    </p>
                    <div class="center">
                        <div v-if="label == 'delivery'">
                            <!-- 默认收货地址 -->
                            <div v-if="hasAddress" class="has_default">
                                <p class="text_size_36">{{ addressInfo.userName }}&emsp;<span class="text_size_32">{{ addressInfo.phone }}</span></p>
                                <p class="color_gray"><img src="@/assets/images/ticket/default.png" v-if="addressInfo.isDefault">{{ addressInfo.roughlyAddress }}&emsp;{{ addressInfo.address }}</p>
                            </div>
                            <!-- 无默认收货地址 -->
                            <div v-else class="text_size_28">请选择收货地址</div>
                        </div>

                        <div v-if="label == 'gostore'">
                            <!-- 已有门店地址 -->
                            <div v-if="hasStore" class="has_default">
                                <p class="text_size_36">{{ storeInfo.name }}</p>
                                <p class="color_gray">门店地址：{{ storeInfo.address }}</p>
                            </div>
                            <!-- 无门店地址 -->
                            <div v-else class="text_size_28">选择门店</div>
                        </div>

                    </div>
                    <img src="@/assets/images/ticket/path.png" class="right">
                </div>
                <img v-if="label == 'delivery'" src="@/assets/images/ticket/bottemLine.png" class="bot_line">
            </div>

            <!-- 购买商品列表 -->
             <van-list>
                <van-cell
                    v-for="(item,index) in ticketInfo.cartGoodsList"
                    :key="index"
                >
                    <div class="row main">
                        <img :src="item.goodsImgLink?item.goodsImgLink:require('@/assets/images/product_placeholder.jpg')">
                        <div class="detail">
                            <p class="name text_size_28">{{ item.goodsName }}</p>
                            <div class="info color_gray text_size_22 row"><p><span v-for="(item,index) in item.orderGoodsSpecList" :key="index">{{ item.attrTxt }}&emsp;</span></p><span>克重：{{ item.weight || 0 }}g</span></div>
                            <div class="price row">
                                <p class="text_size_32">&yen;&nbsp;<span>{{ item.unitPrice || 0 }}</span></p>
                                <p class="color_gray text_size_28">x{{ item.count }}</p>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>

            <!-- 预约期限 -->
            <div v-if="$store.state.buyWay == 'later'"  class="later_time bg_white text_size_28">
                <p class="row">
                    <span>预约期限</span>
                    <span>{{ ticketInfo.term || 0 }}天</span>
                </p>
                <p class="row">
                    <span class="row help"><label>到期预计返还优惠金</label><img src="@/assets/images/ticket/help.png" @click="seeMore"></span>
                    <span>&yen;{{ ticketInfo.interestMoney || 0 }}</span>
                </p>
            </div>

            <!-- 商品总额 -->
            <div class="totalPrice bg_white text_size_28">
                <p class="row">
                    <span>商品总额</span>
                    <span class="color_gold">&yen;{{ ticketInfo.goodsMoney || 0 }}</span>
                </p>
                <p class="row">
                    <span>手续费</span>
                    <span>&yen;{{ ticketInfo.poundage || 0 }}</span>
                </p>
                <p class="row" v-if="label == 'delivery'">
                    <span>运费</span>
                    <span>&yen;<label v-if="hasAddress">{{ ticketInfo.freight || 0 }}</label><label v-else>0.00</label></span>
                </p>
            </div>

            <!-- 开具发票及留言 -->
            <div class="invoice bg_white text_size_28">
                <div class="row" @click="$router.push('/submitticket/invoice')">
                    <p>开具发票</p>
                    <div class="row">
                        <span class="color_gray">电子发票&nbsp;-&nbsp;<label v-if="!invoice.title">个人</label><label v-else>{{ invoice.title }}</label></span>
                        <img src="@/assets/images/ticket/path.png">
                    </div>
                </div>
                <div class="row" v-if="label =='gostore'&&$store.state.buyWay =='immediately'" @click="chooseTakeDate">
                    <p>预约自提时间</p>
                    <div class="row">
                        <span class="color_gray"><label v-if="selectedDate">{{ selectedDate }}</label><label v-else>选填</label></span>
                        <img src="@/assets/images/ticket/path.png" >
                    </div>
                </div>

                <!-- 买家留言 -->
                <van-field
                    v-model="message"
                    label="买家留言"
                    type="textarea"
                    placeholder="选填"
                    rows="1"
                    autosize
                    maxlength="30"
                    @blur="scrollBack"
                />
            </div>

            <!-- 使用账户余额抵扣 -->
            <div class="deduction row bg_white text_size_28">
                <p>使用账户余额抵扣<span class="color_gold">&nbsp;&yen;{{ Number(price) >= Number(needPayPrice) ? (label=='delivery'? ticketInfo.totalMoney:(Number(ticketInfo.totalMoney) - Number(ticketInfo.freight).toFixed(2))) : price || '0.00' }}&nbsp;</span>元</p>
                <van-switch
                v-model="checked"
                active-color="#f5ab0b"
                inactive-color="#e2e2e2"
                size="22px"
                />
            </div>

            <!-- 同意协议 -->
            <p class="agreement color_gray text_size_28">
                我已阅读并同意<span class="color_black" v-if="$store.state.buyWay == 'immediately'" @click="$router.push({path:'/message/annoucementdetail', query:{id:'Gold_Jewelry_Purchase_Agreement', title:'黄金珠宝购买协议'}})">《黄金珠宝购买协议》</span><span class="color_black" v-else @click="$router.push({path:'/message/annoucementdetail', query:{id:'Reservation_Commodity_Purchase_Agreement', title:'德金惠众预约商品购买协议'}})">《德金惠众预约商品购买协议》</span>
            </p>

        </div>

        <!-- 底部 --> 
        <div class="footer row text_size_28 text_center">
            <div class="price">
                还需支付：<span class="color_gold text_size_30">&yen;{{ needPayPrice || '0.00' }}</span>
            </div>
            <van-button v-if="label == 'delivery'" :disabled="hasAddress?false:true"  @click="submit" :loading="isLoading" loading-text="提交中...">提交订单</van-button>
            <van-button v-if="label == 'gostore'" :disabled="hasStore?false:true"  @click="submit" :loading="isLoading" loading-text="提交中...">提交订单</van-button>
        </div>

        <!-- 选择自提时间 -->
        <van-popup v-model="showDate" position="bottom" >
            <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            @cancel="showDate = false"
            @confirm="chooseDate"
            />
        </van-popup>

        <!-- 银行卡 -->
        <SelectBankCard />
        <!-- 交易密码输入框 -->
         <PwdInput />   
        <!-- 提示余额支付 -->
        <ToastPop/>
    </div>
</template>

<script>
import { List, Cell, Switch, Button, Field, Toast, Dialog, Popup, DatetimePicker } from 'vant';
import { formatDate } from '@/libs/publicFun'
import SelectBankCard from '@/components/SelectBankCard'
import PwdInput from '@/components/PwdInput'
import ToastPop from '@/components/Toast'

    export default {
        components: {
            'van-list': List,
            'van-cell': Cell,
            'van-switch': Switch,
            'van-button': Button,
            'van-field': Field,
            'van-popup': Popup,
            'van-datetime-picker': DatetimePicker,
            SelectBankCard,
            PwdInput,
            ToastPop
        },
        data(){
            return {
                label:'delivery',   //送货上门还是门店自提
                hasAddress: true,  //是否有收货地址
                hasStore: false, //是否有门店地址
                isBespoke:false, //是否预约购买
                list: [],
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                message:'',     //买家留言
                checked: false,  //余额抵扣
                showDate: false,  //选择时间弹出层
                currentDate: new Date(),
                minDate: new Date(),
                selectedDate:'', //选择的提货时间
                isLoading: false,  //提交按钮

                ticketInfo:{},  //订单信息
                price:'',   //余额
                needPayPrice:0,  //还需支付
                count:0,
                
                addressInfo:{},  //地址信息
                addressId:"\"\"", 
                storeInfo:{},  //门店信息
                storeId:'',  
                invoice:{},   //发票信息
                keyFromCar:[]  //购物车标识
            }
        },
        watch:{
            checked(val){
                if(val){
                    if(Number(this.price) >= Number(this.needPayPrice)){
                        this.needPayPrice = '0.00'
                    }else{
                        this.needPayPrice = (Number(this.needPayPrice) - Number(this.price)).toFixed(2)
                    }
                }else{
                    if(this.label == 'delivery'){
                        this.needPayPrice = this.ticketInfo.totalMoney
                    }else{
                        this.needPayPrice = (Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                    }
                }
            },
            label(val){
                if(val == 'delivery'){
                    if(this.checked){
                        if(Number(this.price) >= Number(this.needPayPrice)){
                            this.needPayPrice = '0.00'
                        }else{
                            this.needPayPrice = (Number(this.needPayPrice) - Number(this.price)).toFixed(2)
                        }
                    }else{
                        this.needPayPrice = this.ticketInfo.totalMoney
                    }
                }else{
                    if(this.checked){
                        if(Number(this.price) >= Number(this.needPayPrice)){
                            this.needPayPrice = '0.00'
                        }else{
                            this.needPayPrice = (Number(this.needPayPrice) - Number(this.price)).toFixed(2)
                        }
                    }else{
                        this.needPayPrice = (Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                    }
                }
            }
        },
        methods: {
            select(i){
                window.scroll(0, 0);
                this.label = i
                //修改提货方式
                this.$store.commit({
                    type: 'm_changeTakeWay',
                    way: i
                })
            },

            //跳转管理收货地址/门店列表
            manageAddress(){
                switch(this.label){
                    case 'delivery' : this.$router.push({path:'/submitticket/manageaddress', query:{type:'select'}}); break;
                    case 'gostore' : this.$router.push('/submitticket/store')
                }
            },

            //提交订单
            submit(){
                let isdelivery = false;
                if(this.label == 'delivery'){
                    isdelivery = true
                }

                this.isLoading = true
                
                let title = '个人'
                let taxNumber = ''
                let isPersonal = true
                if(JSON.stringify(this.invoice) != "{}"){
                    title = this.invoice.title
                    taxNumber = this.invoice.taxNumber
                    isPersonal = this.invoice.isPersonal
                }

                //购物车订单
                 if(this.$route.query.source == 'shopcar'){
                    this.$axios(
                        'center_order_cartorderconfirm',
                        {cartGoodsIds:this.keyFromCar, isDelivery:isdelivery, isBalanceDeduction:this.checked, addressId:this.addressId, storeId:this.storeId, extractTime:this.selectedDate, isPersonal:isPersonal, title:title, taxNumber:taxNumber, sourceSimplify:'order_source_h5', remark:this.message}
                    ).then(data => {
                        this.isLoading = false
                        console.log(data)
                        //  if(data.code != 0){
                        //     Toast({message:data.msg, duration:2000})
                        //  }else{
                            // sessionStorage.removeItem('invioce')  //清除发票信息 
                            // sessionStorage.removeItem('productList')  //清除购物车id信息 
                            // sessionStorage.removeItem('ticketInfo')  //清除来自详情的订单信息 

                            //将方式改回默认发货
                            this.$store.commit({
                                type: 'm_changeTakeWay',
                                way: 'delivery'
                            })

                            //保存订单id
                            sessionStorage.setItem('orderId',data.result.orderId)

                            //选择银行卡
                            if(!data.result.isBankCardPay){
                                this.$store.commit({
                                    type: "m_toShowToast",
                                    showToast: true,
                                    hintType:4,
                                    needpaymoney:this.label=='delivery'? this.ticketInfo.totalMoney:(Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                                });
                            }else{
                                //选择银行卡
                                this.$store.commit("m_toShowBankCard")  
                            }

                        //  }
                     }).catch(() => { this.isLoading = false })                   
                 }else{   //商品详情下单
                    let goodsid = this.ticketInfo.cartGoodsList[0].goodsId

                     this.$axios(
                         'center_order_userorderconfirm',
                         {isBespoke:this.isBespoke, goodsId:goodsid, skuId:this.$route.query.skuId, count:this.count, bespeakTermId:this.$store.state.bespokesId, isDelivery:isdelivery, isBalanceDeduction:this.checked, addressId:this.addressId, storeId:this.storeId, extractTime:this.selectedDate, isPersonal:isPersonal, title: title, taxNumber:taxNumber, sourceSimplify:'order_source_h5', remark:this.message } 
                     ).then(data => {
                         this.isLoading = false
                         console.log(data)
                        //  if(data.code != 0){
                        //      Toast({message:data.msg, duration:2000})
                        //  }else{
                            // sessionStorage.removeItem('invioce')  //清除发票信息 
                            // sessionStorage.removeItem('productList')  //清除购物车id信息 
                            // sessionStorage.removeItem('ticketInfo')  //清除来自详情的订单信息 
                            
                            //将方式改回默认发货
                            this.$store.commit({
                                type: 'm_changeTakeWay',
                                way: 'delivery'
                            })

                            //跳转银行
                            // localStorage.setItem('backPath',`/personal/ticketdetail?id=${data.result.orderId}`)    //存入返回标识
                            // location.href = data.result.payUrl

                            // this.$router.push({path:'/personal/ticketdetail', query:{id:data.result.orderId}})

                            //保存订单id
                            sessionStorage.setItem('orderId',data.result.orderId)

                            //选择银行卡
                            if(!data.result.isBankCardPay){
                                this.$store.commit({
                                    type: "m_toShowToast",
                                    showToast: true,
                                    hintType:4,
                                    needpaymoney:this.label=='delivery'? this.ticketInfo.totalMoney:(Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                                });
                            }else{
                                //选择银行卡
                                this.$store.commit("m_toShowBankCard")  
                            }
                        //  }
                     }).catch(() => { this.isLoading = false })
                 }
            },

            //查看预约金详细
            seeMore(){
                Dialog.alert({
                    message: '预约到期后优惠金将自动返回到您的账户余额，可用于订单抵扣或提现'
                }).then(() => {
                    // on close
                });
            },

            //选择自提时间
            chooseTakeDate(){
                this.showDate = true
            },

            //选择完自提时间
            chooseDate(val){
                this.selectedDate = formatDate(val, 'yyyy-MM-dd')
                this.showDate = false
            },

            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            }  
        },
        created(){      
            //如果未支付保留密码输入框
            if(sessionStorage.getItem('unpaid')){
                this.$store.commit("m_toShowBankCard")
                this.$store.commit("m_toShowPwdInput")  
            }

            this.label = this.$store.state.takeWay   //取货方式

            //是否预约
            if(this.$store.state.buyWay == 'later'){
                this.isBespoke = true
            }

            //获取余额
            this.$axios('user_user_getuserinfo')
            .then(data => {
                this.price = data.result && data.result.moeny.toFixed(2)
            }).catch(() => {})

            //收货地址
            if(sessionStorage.addressIdToSubmit){
                this.addressId = JSON.parse(sessionStorage.addressIdToSubmit)
            }

            this.$axios('user_user_getaddressbyid',this.addressId)
            .then(data => {
                // if(data.code != 0){
                //     Toast({message:data.msg, duration:2000})
                //     this.hasAddress = false
                // }else{
                    this.addressInfo = data.result
                    this.addressId = this.addressInfo.id
                // }
            }).catch(() => { this.hasAddress = false })

            //门店信息
            if(sessionStorage.storeIdToSubmit){
                this.storeId = JSON.parse(sessionStorage.storeIdToSubmit)
                this.$axios('run_store_storedetail', this.storeId)
                .then(data => {
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    // }else{
                        this.storeInfo = data.result
                        console.log(this.storeInfo)
                        this.hasStore = true
                    // }
                }).catch(() => {})
            }

            //发票信息
            if(sessionStorage.invioce){
                this.invoice = JSON.parse(sessionStorage.invioce)
            }

            //商品详情直接下来过来的订单信息
            if(sessionStorage.ticketInfo){
                this.ticketInfo = JSON.parse(sessionStorage.ticketInfo) //详情页传过来的信息
                //金额
                this.ticketInfo.freight = this.ticketInfo.freight && this.ticketInfo.freight.toFixed(2)      
                this.ticketInfo.totalMoney = this.ticketInfo.totalMoney && this.ticketInfo.totalMoney.toFixed(2)
                this.ticketInfo.goodsMoney = this.ticketInfo.goodsMoney && this.ticketInfo.goodsMoney.toFixed(2)
                this.ticketInfo.poundage = this.ticketInfo.poundage && this.ticketInfo.poundage.toFixed(2)
                this.ticketInfo.interestMoney = this.ticketInfo.interestMoney && this.ticketInfo.interestMoney.toFixed(2)
                this.ticketInfo.cartGoodsList.forEach(item => {
                    item.unitPrice = item.unitPrice && item.unitPrice.toFixed(2)
                })

                if(this.label == 'delivery'){
                    this.needPayPrice = this.ticketInfo.totalMoney
                }else{
                    this.needPayPrice = (Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                }
                this.count = this.ticketInfo.cartGoodsList[0].count
            }
            //购物车过来的订单信息
            if(this.$route.query.source == 'shopcar'){
                this.keyFromCar = JSON.parse(sessionStorage.productList)
                //获取购物车信息
                this.$axios('center_order_getcartgoodsbyids',this.keyFromCar)
                .then(data => {
                    this.ticketInfo = data.result

                    if(this.label == 'delivery'){
                        this.needPayPrice = this.ticketInfo.totalMoney
                    }else{
                        this.needPayPrice = (Number(this.ticketInfo.totalMoney) - Number(this.ticketInfo.freight)).toFixed(2)
                    }
                }).catch(() => {})
            }

        },
        //离开页面时除修改交易密码之外清除未支付标识
        beforeRouteLeave (to, from, next) {
            if(to.path !== '/personal/setting/reset_trade_password'){
                sessionStorage.removeItem('unpaid')     
                sessionStorage.removeItem('bankId')   //清除银行卡标识
            }
            if(to.path === '/product/detail'){
                sessionStorage.removeItem('addressIdToSubmit')   //清除地址
                sessionStorage.removeItem('invioce')   //清除发票信息
                sessionStorage.removeItem('storeIdToSubmit')   //清除门店信息
            }   
            next()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.ticket{
    .header{
        width: 100%;
        height: 90px;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 20;
        p{
            padding: 0 20px;
            position: relative;
            &.active{
                font-size: 36px;
                color: #f5ab0b;
            }
            img{
                width: 60px;
                position: absolute;
                top: 23px;
                left: 50%;
                transform: translate(-50%, 0 )
            }
        }
    }

    .content{        
        padding: 90px 0 100px;
        min-height: calc(100vh - 190px);
        //地址
        .address{
            margin-top: 18px;
            position: relative;
            .cover{
                height: 190px;
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
                        p:first-of-type{
                            margin: 20px 0;
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
                            img{
                                width: 90px;
                                height: 36px;
                                position: relative;
                                top: -6px;
                                margin-right: 20px;
                            }
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

        //购买商品列表
        .van-list{
            margin-top: 18px;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            border-bottom: 1px solid #e2e2e2;
            .van-cell{
                background: #fff;       
                box-sizing: border-box;
                padding: 36px 30px;
                img{
                    display: inline-block;
                    height: 160px;
                    width: 160px;
                    border-radius: 20px;
                    margin-right: 20px;
                }
                .detail{
                    width: 540px;
                    .name{
                        line-height: 34px;
                        overflow:hidden; 
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        /*! autoprefixer: off */
                        -webkit-box-orient:vertical;
                        /*! autoprefixer: on */
                        -webkit-line-clamp:2; 
                    }
                    .info{
                        margin: 20px 0 30px 0;
                        justify-content: space-between;
                    }
                    .price{
                        align-items: center;
                        justify-content: space-between;
                    }
                }
                &:not(:last-child):after{
                    border: 1px dashed #e2e2e2;
                }
            }
        }

        //费用和预约期限
        .totalPrice,.later_time{
            margin-bottom: 18px;
            padding: 28px 30px;
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
        
        //发票和留言
        .invoice{
            padding: 20px 0; 
            &>div{
                align-items: center;
                justify-content: space-between;
                padding: 16px 30px;
                &:active{
                    background: #e2e2e2;
                }
                &:last-of-type:active{
                    background: transparent;
                }
                img{
                    width: 14px;
                    margin-left: 14px;
                }
                &>div{
                    align-items: center;
                } 
            }
            /deep/.van-cell{
                font-size: 28px;
                .van-field__label{
                    min-width: 140px !important;
                }
                textarea::placeholder{
                    padding-top: 5px;
                }
                .van-field__control{
                    padding-top: 6px;
                }
            }
        }

        //余额抵扣
        .deduction{
            height: 100px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;    
            margin-top: 18px; 
        }

        //同意协议
        .agreement{
            padding: 20px 0 46px 18px;
        }
    }

     // 底部 提交订单
    .footer{
        position: fixed;
        bottom: 0;
        z-index: 9;
        height: 100px;
        width: 100%;
        background: #fff;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e3e3e3;
        .price{
            padding-left: 40px;
        }
        .van-button{
            height: 100%;
            width: 270px;
            line-height: 100px;
            background: #f5ab0b;
            color: #fff;
            .van-button__text,.van-button__loading-text{
                font-size: 30px;
            }   
        }
        .van-button--disabled{
            opacity: 1;
            background: #ababab;
        }
    }

    // 选择时间
    /deep/.van-popup{
        padding: 0;
        .van-picker__toolbar{
            height: 90px;
            line-height: 90px;
            .van-picker__cancel, .van-picker__confirm{
                padding: 0 30px;
                font-size: 32px;
                &:active{
                    background: #e2e2e2;
                }
            }
        }
        .van-picker__columns{
            height: 400px !important;
            .van-picker-column{
                font-size: 30px !important;
            }
        }
    }
}
</style>
