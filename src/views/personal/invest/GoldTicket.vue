<template>
<!-- 黄金单 -->
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
                    <div class="main" @click="toDetail(item.id)"> 
                        <div class="detail text_size_28">
                            <p>购买金价：{{ item.platGoldPrice || '0.00' }}元/克</p>
                            <p>购买克重：{{ item.weight || 0 }}克</p>
                            <p>实际购买金额：{{ item.money || '0.00' }}元</p>
                        </div>
                    </div>
                    <div class="bot row">
                        <div class="text_size_28" >
                            <!-- <p v-if="item.orderStatus == '待支付'">还需支付：<span class="color_gold">{{ item.needPayMoney }}</span>元</p> -->
                        </div>
                        <div class="btn">
                            <div v-if="item.orderStatus == '待支付'">
                                <van-button round class="normal" @click="cancelTicket(item.id)">取消订单</van-button>
                                <van-button round class="another" @click="toPay(item.id)">去支付</van-button>
                            </div>
                            <div v-if="item.orderStatus == '已完成' && item.operStatus == 'gold_order_oper_confirm'">
                                <van-button round class="normal" @click="toTake(item.id)">提货</van-button>
                                <van-button round class="another" @click="toRent(item.id,item)">出租</van-button>
                            </div>
                            <van-button round class="gray" v-if="item.orderStatus == '已完成' && item.operStatus == 'gold_order_oper_extract'" disabled>已提金</van-button>
                            <van-button round class="gray" v-if="item.orderStatus == '已完成' && item.operStatus == 'gold_order_oper_lease'" disabled>已出租</van-button>
                            <van-button round class="normal" v-if="item.orderStatus == '已关闭'" @click="deleteTicket(item.id)">删除订单</van-button> 
                        </div>
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
import { List, Cell, Button, Dialog, Toast, CheckboxGroup,Checkbox } from 'vant';
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
                    obj = {index:this.currentPage, size:global.sizeCount}
                }else{
                    obj = {status:this.label, index:this.currentPage, size:global.sizeCount}
                }

                //请求订单
                this.$axios('order_goldorder_goldorderlistfrontbypage', obj)
                .then(data => {
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;

                    console.log(data)

                    data.result && data.result.forEach(item => {                     
                        item.status = findState(item.status)
                        switch(item.status){
                            case 'gold_order_unpaid' : item.orderStatus = '待支付'; break;
                            case 'gold_order_finish' : item.orderStatus = '已完成'; break;
                            case 'gold_order_close' : item.orderStatus = '已关闭'; break;
                        }

                        // 操作状态
                        item.operStatus = item.operStatus && findState(item.operStatus)

                        item.platGoldPrice = item.platGoldPrice && item.platGoldPrice.toFixed(2)
                        item.money = item.money && item.money.toFixed(2)
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
                this.$router.push({path:'/personal/invest/goldticketdetail', query:{id:id}})
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
                    this.$axios('center_order_goldordercancel',id)
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
                this.$router.push({path:'/personal/invest/goldticketdetail', query:{id:id, type:'pay'}})
            },

            //去出租
            toRent(id,item){
                sessionStorage.setItem('goldInfoToRent',JSON.stringify(item))
                this.$router.push({path: '/personal/invest/rentconfirm', query:{type:1, id:id}})
            },

            //去提金
            toTake(id){
                this.$router.push({path: '/personal/invest/takeconfirm',query:{type:1, id:id}})
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
                    this.$axios('center_order_goldorderdel',id)
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
            this.$axios('dic_face_getlistdetailrtbyindexsimplify', 'gold_order_status')
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
        // overflow-y: scroll;
        // -webkit-overflow-scrolling: touch;
        // margin-top: 100px; 
        .van-pull-refresh{
            min-height: calc(100vh - 100px);
            .van-list{
                padding: 20px;
                .van-cell{
                    margin-bottom: 18px;
                    border-radius: 16px;
                    padding: 0;
                    .state{
                        justify-content: space-between;
                        padding: 30px 20px;
                    }
                    .main{
                        padding: 10px 20px 20px 20px;
                        line-height: 30px;
                        border-bottom: 1px solid #e3e3e3;
                        img{
                            height: 170px;
                            width: 170px;
                            margin-right: 18px;
                        }
                        .detail{
                            p{
                                margin-bottom: 20px;
                            }
                        }
                    }
                    .bot{
                        padding: 0 20px;
                        justify-content: space-between;
                        align-items: center;
                        height: 110px;
                        line-height: 110px;
                        .btn{
                            margin: 26px 0;
                            .van-button{
                                width: 160px;
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
                                &.gray{
                                    color: #fff;
                                    background: #ababab;
                                    opacity: 1;
                                }
                            }
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
