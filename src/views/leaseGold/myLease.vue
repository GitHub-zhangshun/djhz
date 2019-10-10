<template>
<!-- 我的回收 -->
    <div class="myLease">
        <van-tabs v-model="active" sticky @click="onClick" color="#f5ab0b" :line-width="24" title-active-color="#f5ab0b" title-inactive-color="#000000">           
            <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title"></van-tab>
        </van-tabs>
        <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <ul>
                <li class="bg_white list" v-for="(item, index) in dataList" :key="index" @click="$router.push({path:'/leaseOrderInfo',query:{id:item.id}})">
                    <div class="header">
                        <div class="left color_gray">订单编号：{{item.number}}</div>
                        <div :class="item.frontStatus=='待处理'?'right color_gold':'right color_black'">{{item.frontStatus}}</div>
                    </div>
                    <div class="content">
                        <div class="left">
                            <img src="@/assets/images/leaseGold/zp.png" alt="">
                        </div>
                        <div class="right">
                            <p class="color_black text_size_28">黄金类型：{{item.goldType}}</p>
                            <p class="color_black text_size_28">重量：{{item.weight}}</p>
                            <p class="color_gray text_size_24">提交时间：{{item.createTimeStamp}}</p>
                        </div>
                    </div>
                </li>
                <li id="noList"></li>
            </ul>
        </mescroll-vue>
    </div>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import { Tab, Tabs } from 'vant';
import   global  from '@/libs/globalVar.js'
import { getToken } from '@/libs/auth'
import { formatDate } from '@/libs/publicFun'
    export default {
        beforeRouteEnter (to, from, next) {
            if(!getToken()){
                next({path:'/login',query:{redirect:to.fullPath}})
            }
            next()
        },
        components:{
            'van-tabs':Tabs,
            'van-tab':Tab,
            MescrollVue 
        },
        data(){
            return{
                active:0,
                tabs:[],//tabs
                status:'',//分类
                mescroll: null, // mescroll实例对象
                mescrollUp: { // 上拉加载的配置.
                    auto:false,
			        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                        //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 20 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- 没有更多数据 --</p>',
                    noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                                // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                                // 这就是为什么无更多数据有时候不显示的原因
                    empty: {
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                        warpId: "noList", //父布局的id (1.3.5版本支持传入dom元素)
                        icon: require('@/assets/images/recyclingGold/noOrder.png'), //图标,默认null,支持网络图
                        tip: "暂无数据~", //提示
                    }
                },
                dataList: [] // 列表数据
            }
        },
        methods:{
            // mescroll组件初始化的回调,可获取到mescroll对象
            mescrollInit (mescroll) {
                this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
                // 联网请求
                this.$axios('order_leaseorder_frontleaseorderinfobypage',{status:this.status,index:page.num,size:page.size})
                .then( (data) => {
                    // 如果是第一页需手动置空列表
                    if (page.num === 1) this.dataList = []
                    data.result.forEach(item => { 
                        this.dataList.push({
                            id:item.id,
                            number:item.number,
                            goldType:item.goldType,
                            createTimeStamp:formatDate(item.createTimeStamp,'yyyy-MM-dd hh:ss:mm'),
                            frontStatus:this.tabs.filter( i => { return i.id == item.frontStatus})[0].title || '',
                            weight:item.weight
                        })
                    });
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(data.result.length)
                    })
                })
                .catch((e) => {
                    // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    mescroll.endErr()
                })
            },
            onClick(index, title) {
                this.status = this.tabs[index].id
                this.dataList = []   
                this.mescroll.resetUpScroll() // 刷新列表数据                      
            },
        },
        created(){
            this.$axios('dic_face_getlistdetailrtbyindexsimplify','front_lease_status')
            .then( data => {                
                data.result.forEach( item => {
                    this.tabs.unshift(item)
                })
                this.tabs.unshift({
                    title:'全部',
                    id:''
                })
                this.mescroll.resetUpScroll() // 刷新列表数据
            })
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.myLease{
    /deep/.van-tabs{
        padding-top: 91px;
        .van-tabs__wrap{
            height: 91px;
            background: #fff;
            .van-tabs__nav{
                width: 70%;
                padding-bottom: 0;
                .van-tab{
                    span{
                        line-height: 91px;
                        font-size: 28px;
                    }
                }
            }
        }
    } 
    /deep/.mescroll{
        position: absolute;
        top: 91px;
        bottom: 0;
        height: auto;
        &>div:nth-of-type(2){ 
            ul{    
                margin: 18px 22px;
                .list{
                    padding: 34px 20px 46px;
                    border-radius: 10px;
                    margin-bottom: 18px;
                    .header{
                        margin-bottom: 36px;
                        display: flex;
                        justify-content: space-between;
                        .left,.right{
                            font-size: 26px;
                        }
                        .right{
                            font-weight: bold;
                        }
                    }
                    .content{
                        display: flex;
                        .left{
                            width: 113px;
                            margin-right: 30px;
                            img{
                                width: 100%;
                            }
                        }
                        .right{
                            p:nth-of-type(1),
                            p:nth-of-type(2){
                                margin-bottom: 26px;
                            }
                        }
                    }
                }
                #noList{
                    .mescroll-empty{
                        .empty-tip{
                            margin: 0;
                            padding-top: 20px;
                        }
                    }
                }
            }
        }
        .mescroll-upwarp{
            padding: 0;
        }
    }
}
</style>