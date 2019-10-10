<template>
<!-- 联系客服 -->
    <div class="chat bg_base">
        <div class="content">
            <p class="text_size_32">常见问题</p>

            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
                >
                    <van-cell
                        v-for="(item,index) in list"
                        :key="index"
                        class="bg_base"
                    >
                        <div class="row question">
                            <span>●</span>&nbsp;
                            <div class="text_size_28">
                                <p class="title">{{ item.title }}</p>
                                <pre class="text_size_26 color_gray text">{{ item.content }}</pre>
                            </div>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>

         <!-- 页脚 -->
        <div class="footer bg_white row">
            <div @click="toOnlineChat">
                <img src="@/assets/images/index/chat_online.png"><br>
                <span>在线客服</span>
            </div>
            <!-- <div>
                <img src="@/assets/images/index/chat_tel.png"><br>
                <span>电话客服</span>
            </div> -->
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
                onLineUrl:''
            }
        },
        methods:{
            //上拉加载
            onLoad() {
                this.hasAnnounce = true
                //请求公告列表
                this.$axios('run_run_contentlistpage', {type:'qa', isShow:true, index:this.currentPage, size:global.sizeCount})
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

                    console.log(this.list)
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

            //在线客服
            toOnlineChat(){
                location.href = this.onLineUrl
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            this.onLineUrl = sessionStorage.dictionary && JSON.parse(sessionStorage.dictionary).filter(item => { return item.simplify == 'customer_live800' })[0].remark
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0
}

.chat{
    .content{
        min-height: calc(100vh - 100px);
        box-sizing: border-box;
        // overflow-y: scroll;
        // -webkit-overflow-scrolling: touch;
        padding: 44px 30px;
        padding-bottom: 144px;
        .van-pull-refresh{
            min-height: calc(100vh - 200px);
            .van-cell{
                &:not(:last-child):after{
                    border: none;
                }
                .question{
                    margin-top: 30px;
                    line-height: 40px;
                    div{
                        flex: 1;
                        .title{
                            margin-bottom: 10px;
                        }
                        .text{
                            white-space: pre-wrap;
                            margin: 0;
                            font-family: 'Avenir', Helvetica, Arial, sans-serif;
                        }
                    }
                }
            }
        }
    }

    .footer{
        font-size: 20px;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 100px;
        border-top: 1px solid #e3e3e3;
        justify-content: center;
        align-items: center;
        &>div{
            text-align: center;
            width: 50%;
            img{
                width: 46px;
                margin-bottom: 8px;
            }
        }

       
    }

}


</style>