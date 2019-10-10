<template>
<!-- 账单列表 -->
    <div class="billList">
        <van-tabs v-model="active" sticky @click="onClick" color="#f5ab0b" :swipe-threshold="5" :line-width="24" title-active-color="#f5ab0b" title-inactive-color="#000000">           
            <van-tab v-for="(item, index) in tabList" :key="index"  :title="item.title"></van-tab>
        </van-tabs>
        <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <ul>
                <li class="bg_white" v-for="(item, index) in dataList" :key="index">
                    <header class="bg_base text_size_30">{{item.key}}</header>
                    <div class="content" v-for="(item, index) in item.val" :key="index"  @click="$router.push({path:'/personal/billInfo',query:{id:item.id}})">
                        <div class="left">
                            <img :src="item.icon" alt="">
                        </div>
                        <div class="center">
                            <p class="color_black text_size_30">{{item.state}}</p>
                            <p class="color_gray text_size_22">{{item.time}}</p>
                        </div>
                        <div class="right text_size_34 color_gold">{{item.isIncome?'+':'-'}}{{item.operationMoney}}</div>
                    </div>
                </li>
            </ul>  
            <div id="noList"></div>
        </mescroll-vue>
    </div>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import { Tab, Tabs, List , PullRefresh , Toast } from 'vant';
import { timestampToTimes,number_format,formatDate } from '@/libs/publicFun'
import groupArray from 'group-array'
import   global  from '@/libs/globalVar.js'
    export default {
        components:{
            'van-tabs':Tabs,
            'van-tab':Tab,
            'van-list':List,
            'van-pull-refresh':PullRefresh,
            MescrollVue 
        },
        data(){
            return{
                tabList:[],
                active:0,
                billType:'',
                mescroll: null, // mescroll实例对象
                mescrollUp: { // 上拉加载的配置.
                    auto:false,
                    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                    //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 20 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- 无更多数据 --</p>',
                    noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                                // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                                // 这就是为什么无更多数据有时候不显示的原因
                    empty: {
                    	//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    	warpId: "noList", //父布局的id (1.3.5版本支持传入dom元素)
                    	icon: require("@/assets/images/recyclingGold/noOrder.png"), //图标,默认null,支持网络图
                    	tip: "暂无相关数据~" //提示
                    },                    
                },
                showlist:[],
                dataList:[],
            }
        },
        methods:{
            // mescroll组件初始化的回调,可获取到mescroll对象
            mescrollInit (mescroll) {
                this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
                this.$axios('user_user_frontuserbillbypage',{billType:this.billType,index:page.num,size:global.sizeCount})
                .then( (data) => {
                    // 如果是第一页需手动置空列表
                    if (page.num === 1) this.showlist = []
                    // 把请求到的数据添加到列表
                    data.result.forEach( item => {
                        let findArray = sessionStorage.dictionary && JSON.parse(sessionStorage.dictionary) && JSON.parse(sessionStorage.dictionary).find(i => { return i.id == item.billType })
                        let icon = findArray && findArray.content && JSON.parse(findArray.content).Icon || ''
                        this.showlist.push({
                            icon : icon,
                            id:item.id,
                            time:formatDate(item.createTimeStamp,'yyyy-MM-dd hh:mm:ss'),
                            year:timestampToTimes(item.createTimeStamp,'/'),
                            state:item.title,
                            isIncome:item.isIncome,
                            operationMoney:number_format(item.operationMoney,2,'.',',')
                        })
                    })
                    this.dataList = []
                    let deepList = groupArray(JSON.parse(JSON.stringify(this.showlist)), 'year')
                    Object.keys(deepList).forEach(i => {
                        let obj ={}
                        obj['key'] = i
                        obj['val'] = deepList[i]
                        this.dataList.push(obj)
                    }) 
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(data.result.length)
                    })
                })
                .catch( (e) => {
                    mescroll.endErr()
                })
            },
            onClick(index, title) {
                this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
                this.showlist = []
                if(index==0){
                    this.billType = ''
                }else{
                    this.billType = this.tabList[index].id
                }
                
                this.mescroll.resetUpScroll() // 刷新列表数据
            },
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...'
            });
            this.$axios('dic_face_getlistdetailrtbyindexsimplify','front_bill_type')
            .then( data => {
                this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度   
                this.mescroll.resetUpScroll() // 刷新列表数据
                this.tabList.push({title:'全部'})
                data.result.forEach(item => {
                    this.tabList.push(item)
                });
                Toast.clear()
            })
             
        },
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.billList{
    /deep/.van-tabs{        
        padding-top: 91px;
        .van-tabs__wrap{
            height: 91px;
            background: #fff;
            .van-tabs__nav{
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
    /deep/.mescroll {
        position: fixed;
        top: 91px;
        bottom: 0;
        height: auto;
        &>div{
            ul{
                    
                li{
                    padding-bottom: 64px;
                    header{
                        line-height: 100px;
                        padding: 0 33px;
                    }
                    .content{
                        display: flex;
                        padding: 64px 33px 0;
                        .left{
                            width: 90px;
                            height: 90px;
                            margin-right: 24px;
                            img{
                                height: 100%;
                                width: 100%;
                            }
                        }
                        .center{
                            flex: 1;
                            display: flex;
                            flex-flow: column;
                            justify-content: space-around;
                        }
                        .right{
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            #noList{                
                .mescroll-empty{
                    margin: 0 auto;
                    padding: 90px 0 0;
                    width: 246px;
                    img{
                        width: 100%;
                    }
                    .empty-tip{
                        text-align: center;
                        padding-top: 30px;
                    }
                }
                
            }
        }
    }
}
</style>