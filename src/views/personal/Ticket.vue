<template>
<!-- 订单 -->
    <div class="ticket bg_base">
        <!-- 顶部 -->
        <div class="header bg_white text_size_28 row" v-if="isShowLabel">
            <p @click="select(-1)" :class="{active:label==-1}">全部<img src="@/assets/images/ticket/line.png" v-if="label==-1"></p>
            <p v-for="(item,index) in labelList" :key="index" @click="select(item.id)" :class="{active:label == item.id}">{{ item.title }}<img src="@/assets/images/ticket/line.png" v-if="label==item.id"></p> 
        </div>

        <!-- 订单列表 -->
        <div class="content">
            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="到底了"
                @load="onLoad"
                v-if="hasTicket"
                >
                    <van-cell
                        v-for="(item,index) in list"
                        :key="index"
                    >   
                        <div class="row state text_size_30"  @click="toDetail(item.id)">
                            <p class="color_gray text_size_28">{{ item.number }}</p>
                            <p :class="item.orderStatus == '已关闭'?'color_gray':'color_gold'">{{ item.orderStatus }}</p>
                        </div>
                        <div class="row main" v-for="(good,index) in item.goodsList" :key="index" @click="toDetail(item.id)"> 
                            <img :src="good.goodsImgLink||require('@/assets/images/product_placeholder.jpg')">
                            <div class="detail">
                                <p class="name text_size_28">{{ good.goodsName }}</p>
                                <div class="color_gray text_size_26 row"><p><span v-for="(spec,index) in good.orderGoodsSpecList" :key="index">{{spec.attrTxt}}&nbsp;&nbsp;</span></p><span>x{{ good.count || 0}}</span></div>
                                <p class="color_gray text_size_26">商品克重：{{ good.weight }}g</p>
                            </div>
                        </div>
                        <p v-if="item.orderStatus == '待自提'" class="text_size_32 text_right code">自提码：{{ item.code }}</p>
                        <div v-if="item.orderStatus == '预约中'" class="text_right text_size_28 ordering">
                            <p>到期日：{{ item.endTimeTxt }}</p>
                            <p>预计优惠金：&yen;{{ item.interestMoney || '0.00'}}元</p>
                        </div>
                        <p class="text_right text_size_28">合计：&yen;{{ item.totalMoney || '0.00' }}元</p>
                        <div class="btn text_right">
                            <div v-if="item.orderStatus == '待支付'">
                                <van-button round class="normal" @click="cancelTicket(item.id)">取消订单</van-button>
                                <van-button round class="another" @click="toPay(item.id)">去支付</van-button>
                            </div>
                            <van-button round class="normal" v-if="item.orderStatus == '待发货'" @click="$router.push('/chat')">联系客服</van-button>
                            <div v-if="item.orderStatus == '待收货'">
                                <van-button round class="normal" @click="$router.push({path:'/personal/delivery', query:{id:item.id}})">查看物流</van-button>
                                <van-button round class="another" @click="confirmReceived(item.id)">确认收货</van-button>
                            </div>
                            <van-button round class="normal" v-if="item.orderStatus == '已关闭'" @click="deleteTicket(item.id)">删除订单</van-button>
                        </div>
                    </van-cell>
                </van-list>

                <div v-else class="nodata">
                    <img src="@/assets/images/ticket/noticket.png" class="noticket">
                    <p class="color_gray text_size_26">暂无相关的订单</p>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { List, Cell, Button, Dialog, Toast } from 'vant';
import global from '@/libs/globalVar'
import { findState, formatDate } from '@/libs/publicFun'

    export default {        
        components: {
            'van-list': List,
            'van-cell': Cell,
        },
        data(){
            return {
                labelList: [], //状态列表
                label: -1,
                list:[],   //订单列表
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                currentPage: 1,
                hasTicket: true,
                isbespoke: false,  //是商品订单还是预约订单 
                //各订单状态   待支付 预约中 待发货 待收货 待自提 已完成 已关闭 
                isShowLabel:false,   //显示顶部状态列表
            }
        },
        methods: {
            select(id){       
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                })
                
                setTimeout(() => {  
                    this.label = id
                    this.list = []              
                    this.currentPage = 1
                    this.pullRefresh = false
                    this.loading = true;
                    this.finished = false; 
                    if(this.loading){
                        this.onLoad()
                    }
                }, 10); 
            },

            //上拉加载
            onLoad() {
                this.hasTicket = true
                let obj = {}
                if(this.label == -1){
                    obj = {index:this.currentPage, size:global.sizeCount, isBespoke:this.isbespoke}
                }else{
                    obj = {status:[this.label], index:this.currentPage, size:global.sizeCount, isBespoke:this.isbespoke}
                }

                //请求订单
                this.$axios('order_order_frontuserorderlistbypage', obj)
                .then(data => {
                    console.log(data)
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;
                    data.result && data.result.forEach(item => {
                        item.frontRealStatus = findState(item.frontRealStatus)
                        switch(item.frontRealStatus){
                            case 'front_order_show_unpaid' : item.orderStatus = '待支付'; break;
                            case 'front_order_show_reserve' : item.orderStatus = '预约中'; break;
                            case 'front_order_show_unsend' : item.orderStatus = '待发货'; break;
                            case 'front_order_show_waitgoods' : item.orderStatus = '待收货'; break;
                            case 'front_order_show_extract' : item.orderStatus = '待自提'; break;
                            case 'front_order_show_finish' : item.orderStatus = '已完成'; break;
                            case 'front_order_show_close' : item.orderStatus = '已关闭'; break;
                        }

                        item.interestMoney = item.interestMoney && item.interestMoney.toFixed(2)
                        item.totalMoney = item.totalMoney && item.totalMoney.toFixed(2)
                        this.list.push(item)
                    })

                    if(this.currentPage == 1 && this.list.length == 0){
                        this.hasTicket = false
                    }
                    
                    this.currentPage++
                    if(this.list.length >= data.total){
                        this.finished = true
                    }                   
                }).catch(() => { 
                    this.pullRefresh = false
                    this.loading = false;
                })          
            },

            //下拉刷新
            onRefresh(){
                this.finished = true
                setTimeout(() => {                    
                    this.list = []
                    this.currentPage = 1                   
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },

            //跳转订单详情
            toDetail(id){
                this.$router.push({path:'/personal/ticketdetail', query:{id:id}})
            },

            //取消订单
            cancelTicket(id){
                Dialog.confirm({
                    title: '取消订单',
                    message: '您确认要取消该订单吗？'
                }).then(() => {
                    Toast.loading({
                        message: '加载中...',
                        duration: 0,
                        loadingType: 'spinner',
                    });
                    this.$axios('center_order_userordercancel',id)
                    .then(data => {
                        // if(data.code != 0){
                        //     Toast({message:data.msg, duration:2000});
                        // }else{
                            Toast.success({message:"取消成功", duration:2000});

                            this.finished = true
                            setTimeout(() => {  
                                this.currentPage = 1
                                this.list = []              
                                this.pullRefresh = false
                                this.loading = false;
                                this.finished = false;                                    
                            }, 10); 
                        // }
                    }).catch(() => {})
                }).catch(() => {});
            },

            //去付款
            toPay(id){
               //跳转银行
                this.$router.push({path:'/personal/ticketdetail', query:{id:id, type:'pay'}})
            },

            //确认收货
            confirmReceived(id){
                Dialog.confirm({
                    title: '确认收货',
                    message: '您确认收到货了吗？'
                }).then(() => {
                    Toast.loading({
                        message: '加载中...',
                        duration: 0,
                        loadingType: 'spinner',
                    });
                    this.$axios('center_order_orderreceivedgoods',id)
                    .then(data => {
                        // if(data.code != 0){
                        //     Toast({message:data.msg, duration:2000});
                        // }else{
                            Toast.success({message:"确认收货成功", duration:2000});

                            this.finished = true
                            setTimeout(() => {  
                                this.currentPage = 1
                                this.list = []              
                                this.pullRefresh = false
                                this.loading = false;
                                this.finished = false;                                    
                            }, 10); 
                        // }
                    }).catch(() => {})
                }).catch(() => {});
            },
            
            //删除订单
            deleteTicket(id){
                Dialog.confirm({
                    title: '删除订单',
                    message: '您确认要删除该订单吗？'
                }).then(() => {
                    Toast.loading({
                        message: '加载中...',
                        duration: 0,
                        loadingType: 'spinner',
                    });
                    this.$axios('center_order_userorderdel',id)
                    .then(data => {
                        // if(data.code != 0){
                        //     Toast({message:data.msg, duration:2000});
                        // }else{
                            Toast.success({message:"删除成功", duration:2000});
                            
                            this.finished = true
                            setTimeout(() => {  
                                this.currentPage = 1
                                this.list = []              
                                this.pullRefresh = false
                                this.loading = false;
                                this.finished = false;                                    
                            }, 10); 
                        // }
                    }).catch(() => {})
                }).catch(() => {});
            },
        },
        created(){
            //获取状态列表
            this.$axios('dic_face_getlistdetailrtbyindexsimplify', 'front_order_status')
            .then(data => {
                this.labelList = data.result 
                this.isShowLabel = true  
            }).catch(() => {})

            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //判断是商品订单还是预约订单
            if(this.$route.query.title == '商品订单'){
                this.isbespoke = false
            }else{
                this.isbespoke = true
            }
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
        height: 100px;
        line-height: 100px;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 20;
        p{
            padding: 0 50px;
            position: relative;
            &.active{
                color: #f5ab0b;
            }
            img{
                width: 60px;
                position: absolute;
                top: 50px;
                left: 50%;
                transform: translate(-50%, 0 )
            }
        }
    }

    .content{
        padding-top: 100px;
        min-height: calc(100vh - 100px);
        .van-pull-refresh{
            min-height: calc(100vh - 100px);
            .van-list{
                padding: 20px;
                .van-cell{
                    margin-bottom: 18px;
                    border-radius: 16px;
                    padding: 0 20px;
                    .state{
                        justify-content: space-between;
                        padding: 30px 0;
                    }
                    .main{
                        padding-bottom: 30px;
                        align-items: center;
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
                            &>div{
                                justify-content: space-between;
                                margin-bottom: 10px;
                            }
                        }
                    }
                    .btn{
                        margin: 26px 0;
                        .van-button{
                            width: 170px;
                            height: 68px;
                            line-height: 68px;
                            margin-left: 18px;
                            .van-button__text{
                                font-size: 28px;
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
                    //提取码
                    .code{
                        margin-bottom: 20px;
                    }
                    //预约中
                    .ordering{
                        p{
                            margin-bottom: 20px;
                        }
                    }
                }
            }

            //没有订单
            .nodata{
                text-align: center;
                .noticket{
                    width: 246px;
                    margin: 60px 0;
                }
            }
        }
        
    }
}

</style>
