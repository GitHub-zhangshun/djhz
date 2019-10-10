<template>
<!-- 商城 -->
    <div class="product row bg_base"> 
        <!-- 页头 -->
        <div class="row header bg_base">
            <p><img src="@/assets/images/product/icon_cs.png" @click="$router.push('/chat')"></p>
            <form action="javascript:return true" @submit.prevent="false"><van-search placeholder="搜索商品" v-model="searchVal" shape="round" @search="onSearch" background="none" @blur="scrollBack"/></form>
            <p @click="toSwitch">
                <img src="@/assets/images/product/icon_showList.png" v-if="!isSwitch">
                <img src="@/assets/images/product/icon_showMode2.png" v-else>
            </p>
        </div>

        <!-- 内容 -->
        <div class="content">
            <ul>
                <li @click="select(-1)" :class="{active:label==-1}">全部
                    <img src="@/assets/images/product/line.png" v-if="label==-1">
                </li>

                <li v-for="(item,index) in menuList" :key="index" @click="select(item.id)" :class="{active:label==item.id}">
                    {{ item.name }}
                    <img src="@/assets/images/product/line.png" v-if="label==item.id">
                </li>
            </ul>

            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
                >
                    <div class="right">
                        <van-cell
                            v-for="(item,index) in list"
                            :key="index"
                            @click="toDetail(item.id)" 
                            :class="isSwitch == true?'mode2':'mode1'"
                        >
                            <div class="row main">
                                <img :src="item.listPic||require('@/assets/images/product_placeholder.jpg')">
                                <div class="detail">
                                    <p>{{ item.name }}</p>
                                    <p class="color_gold tag"><label v-if="item.tags[0]">{{ item.tags[0].name }}</label></p>
                                    <p class="price text_size_32 color_gold">&yen;&nbsp;<span>{{ item.price }}</span></p>
                                </div>
                            </div>
                        </van-cell>
                        <div v-if="isNoData" class="empty color_gray"><img src="@/assets/images/product/icon_Empty.png"><br>该分类暂无数据</div>   
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { List, Cell, Search, Toast } from 'vant';
import global from '@/libs/globalVar'

    export default {
        components:{
            'van-list': List,
            'van-cell': Cell,
            'van-search': Search
        },
        data(){
            return {
                label: -1,
                menuList:[],    //菜单
                list: [],       //循环产品列表
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                isSwitch: false,
                searchVal: '',  
                isSearch: false,  //是否为搜索状态
                currentPage: 1,
                isNoData: false
            }
        },
        methods:{
            //选择目录
            select(id){
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                })
                
                this.searchVal = ''
                setTimeout(() => {  
                    this.label = id
                    this.isSearch = false
                    this.currentPage = 1
                    this.list = []              
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },
            
            //上拉加载
            onLoad() {
                this.isNoData = false
                let obj = {}
                if(this.isSearch){
                     if(this.label == -1){
                        obj = {index:this.currentPage, size:global.sizeCount, name:this.searchVal}
                    }else{
                        obj  = {index:this.currentPage, size:global.sizeCount, name:this.searchVal, categoryId:this.label}
                    }
                }else{
                    if(this.label == -1){
                        obj = {index: this.currentPage, size:global.sizeCount}
                    }else{
                        obj = {index: this.currentPage, size:global.sizeCount, categoryId:this.label}
                    }
                }
                this.$axios('center_good_getlistproductrt', obj)              
                .then(data => {
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;
                    
                    data.result && data.result.forEach(item => {
                        this.list.push(item)
                    })
                
                    if(this.currentPage == 1 && this.list.length == 0){
                        this.isNoData = true
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
                    this.isSearch = false                  
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },

            //进入详情页
            toDetail(id){
                this.$router.push({path:'/product/detail',query:{id:id}})
            },

            //切换显示样式
            toSwitch(){
                this.isSwitch = !this.isSwitch;
            },

            //搜索商品
            onSearch(){
                //请求商品列表
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                });

                setTimeout(() => {  
                    this.isSearch = true
                    this.currentPage = 1
                    this.list = []              
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },
            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            },
        },
        created(){
            //请求商品分类
            this.$axios('good_face_getlistcategoryrt')
            .then(data => {
                this.menuList = data.result
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
    margin: 0
}

.product{ 
    .header{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        width: 100%;
        height: 90px;
        align-items: center;
        justify-content: space-between;
        p{
            margin: 0 30px; 
            img{
                width: 36px;
                height: 36px;
            }
            span{
                position: relative;
                top: -10px;
            }
        }
        /deep/.van-search{
            .van-search__content{
                width: 460px;
                border-radius: 50px;
                padding: 8px 20px 4px 20px;
                background: #e2e2e2;
            }
            .van-cell{
                .van-field__left-icon{
                    .van-icon-search{
                        font-size: 30px;
                        line-height: 36px;
                        color: #ababab;
                    }
                }
                .van-cell__value{
                    .van-field__body{
                        .van-field__control{
                            font-size: 28px;
                            line-height: 36px;
                            color: #ababab;
                        }
                        .van-icon{
                            font-size: 28px;
                        }
                    }
                }
            }
        }
    }
    .content{
        position: relative;
        top: 90px;
        ul{
            width: 190px;
            height: calc(100vh - 190px);
            background: #f3f3f3;
            padding: 0;
            position: fixed;
            top: 90px;
            left: 0;
            z-index: 10;
            li{
                height: 90px;
                line-height: 90px;
                text-align: center;
                font-size: 30px;
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &.active{
                    background: #fff;
                }
                img{
                    width: 4px;
                    height: 40px;
                    position: absolute;
                    top: 50%;
                    left: 8px;
                    transform: translate(0, -50%)
                }
            }
        }
        .van-pull-refresh{
            width: 560px;
            margin-left: 190px;
            padding-bottom: 90px;
            .van-list{
                // overflow-y: scroll;
                // -webkit-overflow-scrolling: touch;
                background: #fff;
                min-height: calc(100vh - 190px);
                // padding-bottom: 100px;
                .right{
                    .empty{
                        text-align: center;
                        img{
                            width: 246px;
                            margin-top: 60px;
                            margin-bottom: 40px;
                        }
                    }
                }
                .van-cell{
                    background: #fff;       
                    box-sizing: border-box;
                    padding: 18px 20px;
                    .main{
                        align-items: center;
                        img{
                            display: inline-block;
                            border-radius: 20px;
                            margin-right: 20px;                          
                        }
                        .detail{
                            flex: 1;
                            p:first-of-type{
                                font-size: 26px;
                                line-height: 34px;
                                margin-bottom: 16px;
                                overflow:hidden; 
                                text-overflow:ellipsis;
                                display:-webkit-box;
                                /*! autoprefixer: off */
                                -webkit-box-orient:vertical;
                                /*! autoprefixer: on */
                                -webkit-line-clamp:2; 
                            }
                            .tag{
                                height: 40px;
                                margin-bottom: 20px;
                                label{
                                    display: inline-block;
                                    font-size: 22px;
                                    padding: 6px 14px;
                                    border: 1px solid #f5ab0b;
                                    border-radius: 180px;
                                }
                            }
                        }
                    }
                    &.mode1{
                        // flex: 1;
                        img{
                            width: 180px;
                            height: 180px;
                        }
                    }
                    &:not(:last-child):after{
                        border: none
                    }
                    //图表模式样式
                    &.mode2{
                        width: 50%;
                        float: left;
                        &:nth-of-type(2n){
                            padding-left: 9px;
                        }
                        .main{
                            flex-direction: column;
                            align-items: flex-start;
                            .detail{
                                p:first-of-type{
                                    height: 60px;
                                }
                            }
                            img{
                                margin: 0 0 20px 0;
                                width: 100%;
                                height: 250px;
                            }
                        }
                    }
                }
            }
        }

    }
}

button{
    position: absolute;
    top: 0;
    right: 0;
}

</style>