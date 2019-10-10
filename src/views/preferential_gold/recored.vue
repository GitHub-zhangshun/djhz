<template>
    <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
        <div class="recored">
            <ul>
                <li class="list bg_white" v-for="(item, index) in dataList" :key="index">
                    <img :src="item.imgLink" alt="">
                    <div class="phoneAndTime">
                        <span class="text_size_30 color_black">{{item.phone}}</span>
                        <span class="text_size_24 color_gray">{{item.createTimeStamp}}</span>
                    </div>
                    <span class="text_size_30 color_black">{{item.weight}}克</span>
                </li>
            </ul>
            <div id="noList"></div>
        </div>
    </mescroll-vue>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import { formatDate } from '@/libs/publicFun'
    export default {
        components: {
            MescrollVue // 注册mescroll组件
        },
        data () {
            return {
                mescroll: null, // mescroll实例对象
                mescrollUp: { // 上拉加载的配置.
                    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                    //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 20 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- 无更多数据 --</p>',
                    noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                                // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                    empty: {
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                        warpId: "noList", //父布局的id (1.3.5版本支持传入dom元素)
                        icon: require("@/assets/images/recyclingGold/noOrder.png"), //图标,默认null,支持网络图
                        tip: "暂无相关数据~" //提示
                    }
                },
                dataList: [] // 列表数据
            }
        },
        methods: {
            // mescroll组件初始化的回调,可获取到mescroll对象
            mescrollInit (mescroll) {
                this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
                // 联网请求
                this.$axios('order_goldorder_goldorderpayrecordlistbypage',{index:page.num,size:page.size})  
                .then( data => {
                    // 如果是第一页需手动置空列表
                    if (page.num === 1) this.dataList = []
                    data.result.forEach(item => {
                        this.dataList.push({
                            imgLink:item.imgLink?item.imgLink:require('@/assets/images/personal/default.png'),
                            phone:item.phone,
                            createTimeStamp:formatDate(item.createTimeStamp,'yyyy-MM-dd hh:ss'),
                            weight:(item.weight).toFixed(2),
                        })
                    });
                    this.$nextTick(() => {
                        mescroll.endSuccess(data.result.length)
                    })
                })   
                .catch( (e) => {
                    mescroll.endErr()
                })
            }
        }
    }
</script>

<style scoped lang="less">
.mescroll{
    position: absolute;
    top: 0;
    bottom: 0;
    height: auto;
    .recored{
        ul{
            .list{
                margin-top: 18px;
                padding: 36px 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                img{
                    width: 90px;
                    height: 90px;
                    margin-right: 20px;
                    border-radius: 50%;
                }
                .phoneAndTime{
                    flex: 1;
                    display: flex;
                    flex-flow: column;
                    span:nth-of-type(1){
                        padding-bottom: 18px;
                    }
                }         
            }
        }
    }
}

</style>