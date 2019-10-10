<template>
<!-- 充值/提现记录 -->
    <div class="container bg_base">
        <div class="record">
            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                 <van-list
                v-model="loading"
                :finished="finished"
                finished-text="到底了"
                @load="onLoad"
                v-if="hasList"
                >
                    <van-cell v-for="(item,index) in list" :key="index">   
                        <div class="row text_size_28">
                            <p>{{ item.title + item.status }}</p>
                            <p class="color_gold">-{{ item.money || '0.00'}}</p>
                        </div>

                        <div class="row color_gray text_size_26">
                            <p>{{ item.createTimeStamp }}</p>
                            <p>{{ item.number }}</p>
                        </div>
                    </van-cell>
                </van-list>

                <div v-else class="nodata">
                    <img src="@/assets/images/ticket/noticket.png" class="noticket">
                    <p class="color_gray text_size_26">暂无提现记录</p>
                </div>

            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { List, Cell, Toast } from 'vant';
import global from '@/libs/globalVar'
import { findStateName, formatDate } from '@/libs/publicFun'

    export default {
        components: {
            'van-list': List,
            'van-cell': Cell,
        },
        data(){
            return {
                list:[],    //提现记录列表
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                currentPage: 1,
                hasList: true,   //是否有列表
            }
        },
        methods:{
            //上拉加载
            onLoad() {
                this.hasList = true

                //请求列表
                this.$axios('order_order_frontwalletorderlistbypage', { type: 2, index:this.currentPage, size:global.sizeCount})
                .then(data => {
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;

                    console.log(data)

                    data.result.forEach(item => {
                        item.status = findStateName(item.status)
                        item.createTimeStamp = formatDate(Number(item.createTimeStamp), 'yyyy/MM/dd hh:mm')
                        item.money = item.money && item.money.toFixed(2)
                        this.list.push(item)
                    })

                    if(this.currentPage == 1 && this.list.length == 0){
                        this.hasList = false
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
    margin: 0;
}

.container{
    padding-top: 18px;
    .record,.van-pull-refresh{
        min-height: calc(100vh - 18px);
        .van-cell{
            padding: 30px 40px;
            border-bottom: 2px solid #f3f3f3;
            &>div{
                &>div{
                    justify-content: space-between;
                    padding-top: 6px;
                    &:first-of-type{
                        margin-bottom: 24px;
                    }
                }
            }
        }
        /deep/.van-list__finished-text{
            margin: 8px 0;
        }
    }
    .nodata{
        margin: 80px 0;
        text-align: center;
        img{
            margin-bottom: 50px;
            width: 246px;
            height: 191px;
        }
    }
}

</style>