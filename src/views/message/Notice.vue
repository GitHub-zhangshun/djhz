<template>
<!-- 提醒列表 -->
    <div class="announce bg_base">
        <div v-if="isLogin">
            <div v-if="hasNotice">
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
                            @click="toDetail(item.id)"
                        >

                        <van-swipe-cell>
                            <div class="row main">
                                <p><span class="circle bg_gold" v-if="!item.isRead"></span></p>&nbsp;&nbsp;
                                <div>
                                    <p class="text_size_32">{{ item.name }}</p>
                                    <p>{{ item.remark }}</p>
                                    <p>{{ item.createTime }}</p>
                                </div>
                            </div>
                        </van-swipe-cell>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </div>

            <!-- 暂无提醒 -->
            <div v-else class="text_center nodata">
                <img src="@/assets/images/message/noData.png">
                <p>暂无提醒</p>
            </div>
        </div>
        
        <!-- 未登录 -->
        <div v-else class="text_center not_login">    
            <img src="@/assets/images/message/notLogin.png"><br>
            <van-button round @click="$router.push('/login')">去登录</van-button>
        </div>
        
    </div>
</template>

<script>
import { List, Cell, Button, SwipeCell, CellGroup, Dialog, Toast } from 'vant';
import global from '@/libs/globalVar'
import { getToken } from '@/libs/auth'

    export default {
        components:{
            'van-list': List,
            'van-cell': Cell,
            'van-button': Button,
            'van-swipe-cell': SwipeCell,
            'van-cell-group': CellGroup
        },
        data(){
            return {
                list: [],
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                hasNotice: true,  //有无提醒
                isLogin: false,
                currentPage: 1,
            }
        },
        methods:{
            //上拉加载  
            onLoad() {
                this.hasNotice = true

                //请求提醒列表
                this.$axios('user_message_messagelistbywebpage', {index:this.currentPage, size:global.sizeCount})
                .then(data => {
                    console.log(data)
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;
                    
                    data.result && data.result.forEach(item => {
                        item.createTime = item.createTime && item.createTime.replace('T', ' ')
                        this.list.push(item)
                    })

                    if(this.currentPage == 1 && this.list.length == 0){
                        this.hasNotice = false
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

            //进入提醒详情
            toDetail(id){
                //设为已读
                this.$axios('user_message_messagesetread', id)
                .then(data => {}).catch(() => {})

                sessionStorage.setItem('notice', JSON.stringify(this.list.filter(item => {return item.id == id})[0]))

                this.$router.push('/message/noticedetail')
            },
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            if(getToken()){
                this.isLogin = true
            }else{
                Toast.clear()
            }
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
                padding-left: 20px;
                line-height: 40px;
                .main{
                    &>p{
                        width: 12px;
                        .circle{
                            display: block;
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            margin-top: 10px;
                            margin-right: 10px;
                        }
                    }
                    &>div{
                        flex: 1;
                        p{
                            &:first-of-type{
                                margin-bottom: 16px;
                            }
                            &:nth-child(2),&:nth-child(3){
                                color: #ababab;
                                line-height: 42px;
                                font-size: 26px;
                            }
                        }
                    }
                }
                // /deep/.van-swipe-cell__right{
                //     background: #ff4444;
                //     color: #fff;
                //     width: 100%;
                //     display: flex;
                //     align-items: center;
                //     span{
                //         position: relative;
                //         left: 36px;
                //         font-size: 26px;
                //     }
                // }
            }
            /deep/.van-list__finished-text{
                margin: 8px 0;
            }
        }
    }

    .nodata,.not_login{
        img{
            width: 260px;
            height: 164px;
            margin: 120px 0 46px 0;
        }
        .van-button{
            background: #f5ab0b;
            color: #fff;
            width: 360px;
            height: 80px;
            line-height: 80px;
            margin-top: 14px;
            .van-button__text{
                font-size: 32px;
            }
        }
        p{
            font-size: 30px;
            color: #969696;
        }
    }
    .not_login{
        img{
            width: 247px;
            height: 172px;
        }
    }

}

</style>