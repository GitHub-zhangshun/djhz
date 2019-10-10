<template>
<!-- 公告列表 -->
    <div class="announce bg_base">
        <div v-if="hasAnnounce">
            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="到底了"
                @load="onLoad"
                >
                    <van-cell
                        v-for="(item,index) in list"
                        :key="index"
                        @click="$router.push({path:'/message/annoucementdetail', query:{id:item.id, title:'公告详情'}})"
                    >
                        <div class="main">
                            <p class="text_size_32 title">{{ item.title }}</p>
                            <p>{{ item.brief }}</p>
                            <p>{{ item.createTime }}</p>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>

        <!-- 暂无公告 -->
        <div v-else class="text_center nodata">
            <img src="@/assets/images/message/noData.png">
            <p>暂无公告</p>
        </div>
    </div>
</template>

<script>
import { List, Cell, Toast } from 'vant';
import global from '@/libs/globalVar'

    export default {
        components:{
            'van-list': List,
            'van-cell': Cell
        },
        data(){
            return {
                list: [],
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                hasAnnounce: true,  //是否有公告
                currentPage: 1,
            }
        },
        methods:{
            //上拉加载
            onLoad() {
                this.hasAnnounce = true
                //请求公告列表
                this.$axios('run_run_contentlistpage', {type:'notice', isShow:true, index:this.currentPage, size:global.sizeCount})
                .then(data => {
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;

                    data.result && data.result.forEach(item => {
                        item.createTime = item.createTime && item.createTime.replace('T', ' ')
                        this.list.push(item)
                    })

                    if(this.currentPage == 1 && this.list.length == 0){
                        this.hasAnnounce = false
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
        },
        created(){
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
    margin: 0
}

.announce{
    .van-pull-refresh{
    min-height: 100vh;
        .van-list{
            .van-cell{
                padding: 30px;
                padding-left: 42px;
                line-height: 40px;
                .main{
                    p{
                        &.title{
                            margin-bottom: 16px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &:nth-of-type(2),&:nth-of-type(3){
                            color: #ababab;
                            line-height: 42px;
                            font-size: 26px;
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
            }
            /deep/.van-list__finished-text{
                margin: 8px 0;
            }
        }
    }

    .nodata{
        img{
            width: 260px;
            height: 164px;
            margin: 120px 0 46px 0;
        }
        p{
            font-size: 30px;
            color: #969696;
        }
    }
}

</style>