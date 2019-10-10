<template>
<!-- 门店列表 -->
    <div class="store bg_base">
         <!-- 页头 -->
        <div class="row header bg_base">
            <p class="text_size_28" @click="$router.replace('/submitticket/position')"><span id="city">{{ city }}</span><img src="@/assets/images/ticket/path_down.png"></p>
            <form action="javascript:return true" @submit.prevent="false"><van-search placeholder="寻找周边门店" v-model="searchVal" shape="round" @search="onSearch" background="none" @blur="scrollBack"/></form>
        </div>

        <div class="content">
            <van-pull-refresh v-model="pullRefresh" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="到底了"
                    @load="onLoad"
                    :immediate-check="false"
                    >
                    <van-cell
                        v-for="(item,index) in cityList"
                        :key="index"
                    >
                        <div @click="selectStore(item.id)">
                            <p class="text_size_34">{{ item.name }}</p>
                            <p class="color_gray text_size_28">门店地址：{{ item.address }}</p>
                        </div>
                        <van-button round class="color_gold" @click="toDetail(item.id)">门店详情</van-button>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { List, Cell, Search, Toast } from 'vant';
import global from '@/libs/globalVar'
import { MP } from '@/libs/loadMap'

    export default {
        components:{
            'van-list': List,
            'van-cell': Cell,
            'van-search': Search
        },
         data(){
            return {
                cityList: [],
                loading: false,  //上拉加载
                finished: false,    //上拉加载
                pullRefresh: false,  //下拉刷新
                searchVal: '',
                isSearch: false,  //是否为搜索状态
                city:'未定位',  //当前城市
                currentPage: 1,
            }
        },
        methods: {
            //搜索门店
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
                    this.cityList = []              
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },

            //上拉加载
            onLoad() {
                this.getStoreList()     
            },

            //下拉刷新
            onRefresh(){
                this.finished = true
                setTimeout(() => {                    
                    this.cityList = []
                    this.currentPage = 1 
                    this.isSearch = false                  
                    this.pullRefresh = false
                    this.loading = false;
                    this.finished = false;                                    
                }, 10); 
            },

            //选择门店
            selectStore(id){
                sessionStorage.setItem('storeIdToSubmit',JSON.stringify(id))
                this.$router.go(-1)
            },

            //查看门店详情
            toDetail(id){
                this.$router.push({path:'/submitticket/storedetail', query:{id:id}})
            },

            //获取门店列表
            getStoreList(){
                let obj = {}
                if(this.isSearch){
                    if(this.city && this.city!='未定位'){
                        obj = {index:this.currentPage, size:global.sizeCount, city:this.city, keyword:this.searchVal}
                    }else{
                        obj = {index:this.currentPage, size:global.sizeCount, keyword:this.searchVal}
                    }
                }else{
                    if(this.city && this.city!='未定位'){
                        obj = {index: this.currentPage, size:global.sizeCount, city:this.city}
                    }else{
                        obj = {index: this.currentPage, size:global.sizeCount}
                    }
                }

                this.$axios('run_store_storelistwebpage', obj)              
                .then(data => {
                    Toast.clear()
                    this.pullRefresh = false
                    this.loading = false;
                    
                    data.result.forEach(item => {
                        this.cityList.push(item)
                    })
                    
                    this.currentPage++
                    if(this.cityList.length >= data.total){
                        this.finished = true
                    }
                }).catch(() => {
                    this.pullRefresh = false
                    this.loading = false;
                })
            },

            //调用高德地图获取用户所在城市信息
            getCity(){
                let that = this  
                return new Promise(function (resolve, reject) {     
                    //实例化城市查询类
                    var citysearch = new AMap.CitySearch();
                    //自动获取用户IP，返回当前城市
                    citysearch.getLocalCity(function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                var cityinfo = result.city;
                                resolve(cityinfo)
                                that.city = cityinfo;
                            }
                        } else {
                            console.log(result.info)
                        }
                    })
                })
            },
            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            }  
        },
        async created(){
            if(this.$route.query.city){
                this.city = this.$route.query.city
            }else{
                //调用高德地图获取用户所在城市信息
                let AMap = await MP()
                this.city = await this.getCity()
                // this.errNetwork = false;
                // this.initMap(AMap)
            }

            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            this.getStoreList()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.store{
    .header{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        height: 90px;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        p{
            margin-right: 20px;
            img{
                width: 24px;
                height: 13px;
                margin-left: 10px;
            }
        }
        /deep/.van-search{
            margin-right: 40px;
            .van-search__content{
                width: 500px;
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
        min-height: calc(100vh - 90px);
        // overflow-y: scroll;
        // -webkit-overflow-scrolling: touch;
        padding: 0 20px;
        padding-top: 90px;
        .van-pull-refresh{
        min-height: calc(100vh - 90px);
            .van-list{
                .van-cell{
                    height: 146px;
                    margin-bottom: 18px;
                    border-radius: 10px;
                    .van-cell__value{
                        display: flex;
                        justify-content: space-between; 
                        align-items: center;
                        p{
                            width: 490px;
                            line-height: 50px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .van-button{
                            width: 154px;
                            height: 58px;
                            line-height: 58px;
                            border: 1px solid #f5ab0b; 
                            .van-button__text{
                                font-size: 28px;
                            }         
                        }
                    }
                    &:not(:last-child):after{
                        border: none;
                    }
                }
            }
        }
    }
}

</style>