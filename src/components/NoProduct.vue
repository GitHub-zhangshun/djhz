<template>
<!-- 商品已删除或下架 -->
    <div class="no_product bg_white">
            <div class="empty">
                <img src="@/assets/images/product/icon_Empty.png">
                <p class="color_gray text_size_28">该商品已下架或已删除，请查看其他商品</p>
            </div>

            <!-- 推荐 -->
            <div>
                <p class="text_size_30 text_center color_gold"><img src="@/assets/images/product/left_gold.png" width="40px">&emsp;推荐饰品&emsp;<img src="@/assets/images/product/right_gold.png" width="40px"></p>
            
                <!-- 推荐商品列表 -->
                <van-list>
                    <div>
                        <van-cell
                            v-for="(item,index) in recommendList"
                            :key="index"
                            @click="toDetail(item.id)" 
                        >
                            <div class="row main">
                                <img src="@/assets/images/product/product.png">
                                <div class="detail">
                                    <p>{{ item.name }}</p>
                                    <p class="color_gold tag"><label v-if="tag">{{ tag.name }}</label></p>
                                    <p class="price text_size_32 color_gold">&yen;&nbsp;<span>{{ item.price || 0 }}</span></p>
                                </div>
                            </div>
                        </van-cell>
                    </div>
                </van-list>

                <p class="text_center color_gray bg_white bot"><img src="@/assets/images/product/left_gray.png" width="40px">&emsp;到底了&emsp;<img src="@/assets/images/product/right_gray.png" width="40px"></p>
            </div>
    </div>
</template>

<script>
import { List, Cell } from 'vant';

    export default {
        components:{
            'van-list': List,
            'van-cell': Cell
        },
        data(){
            return {
                recommendList:'',  //推荐商品
                tag:''  //标签
            }
        },
        methods: {
            //进入详情页
            toDetail(id){
                this.$router.push({path:'/product/detail',query:{id:id}})
            },
        },
        created(){
            this.$axios('center_good_getlistproductrt',{recommend:true})
            .then( data =>{
                this.recommendList = data.result

                //tag保留一个
                let tagsList = data.result.map(item => {
                    return item.tags[0]
                })
                this.tag = tagsList[0]
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0
}

.no_product{
    height: 100vh;
    .empty{
        height: 460px;
        text-align: center;
        img{
            margin: 120px 0 46px 0;
            width: 246px;
        }
    }

    .van-list{
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
        padding-top: 40px;
        .van-cell{      
            box-sizing: border-box;
            padding: 20px;
            height: 570px;
            width: 50%;
            float: left;
            &:nth-of-type(2n-1){
                padding-right: 0;
            }
            &:nth-of-type(2n){
                padding-left: 10px;
            }
            .main{
                flex-direction: column;
                img{
                    margin: 0 0 20px 0;
                    width: 346px;
                    height: 346px;
                }
                .detail{
                    p:first-of-type{
                        font-size: 26px;
                        line-height: 34px;
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
                        margin: 12px 0 18px 0;
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
            &:not(:last-child):after{
                border: none
            }
        }
    }
    .bot{
        padding-bottom: 30px;
    }
}
</style>