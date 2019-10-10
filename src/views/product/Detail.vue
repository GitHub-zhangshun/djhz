<template>
<!-- 商品详情页 -->
    <div class="product_detail bg_base">
        <!-- 有商品 -->
        <div>
            <div class="container">
                <!-- 轮播 -->
                <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
                    <van-swipe-item v-for="(item,index) in imgList" :key="index"><img :src="item" @click="viewImg(index)"></van-swipe-item>
                    <div class="custom-indicator color_white text_size_28" slot="indicator">
                        {{ CurrentImg + 1 }}&nbsp;/&nbsp;<span class="text_size_24">{{ imgList.length }}</span>
                    </div>
                </van-swipe>
                
                <!-- 基本信息 -->
                <div class="text_size_28 bg_white price row">
                    <p>&yen;&nbsp;<span>{{ productInfo.price || '0.00' }}</span></p>
                    <p class="text_size_32">克重：{{ productInfo.weight || 0 }}g</p>
                </div>
                <div class="info bg_white">
                    <p class="text_size_30">{{ productInfo.name }}</p>
                    <p class="color_gold" v-if="productInfo.tags && productInfo.tags.length > 0"><label v-for="(item,index) in productInfo.tags" :key="index">{{ item.name }}</label></p>
                    <p class="color_gray">已销：{{ productInfo.buyFutureSalesCount + productInfo.buyNowSalesCount || 0 }}</p>
                </div>

                <!-- 购买方式 -->
                <div class="buy_mode">
                    <van-radio-group v-model="radio" class="row" @change="changeWay">
                        <van-radio name="immediately" :disabled="canNotBuyNow">
                            <label :class="{color_gold:radio=='immediately'}">立即购买</label>
                            <img
                            slot="icon"
                            slot-scope="props"
                            :src="props.checked ? icon.active : icon.normal"
                            >
                        </van-radio>
                        <van-radio name="later" :disabled="canNotBuyFuture">
                            <label :class="{color_gold:radio=='later'}">预约购买</label>
                            <img
                            slot="icon"
                            slot-scope="props"
                            :src="props.checked ? icon.active : icon.normal"
                            >             
                        </van-radio>
                    </van-radio-group>

                    <!-- 预约购买的情况显示 -->
                    <div class="later row" v-if="radio == 'later'">
                        <div v-for="(item,index) in bespokes" :key="index" @click="select(index,item.id)" :class="{current:label==index}">
                            <p>预约金{{ item.days || 0}}天</p>
                            <p class="color_gold text_size_30">{{ item.price || '0.00' }}元</p>
                            <img src="@/assets/images/product/selected.png" v-if="label == index">
                        </div>

                        <p class="color_gray">此折扣金价格仅供参考，实际折扣金以下单为准</p>
                    </div>
                </div>

                <!-- 选择规格 -->
                <van-cell title="请选择规格" is-link class="color_black text_size_30" center  @click="showSku"/>

                <!-- 商品详情 -->
                <div class="detail">
                    <p class="text_size_30 text_center"><img src="@/assets/images/product/left.png" width="40px">&emsp;商品详情&emsp;<img src="@/assets/images/product/right.png" width="40px"></p>

                    <div ref="proContent" class="pro_content" v-html="productInfo.content"></div>                    
                </div>
            </div>

            <!-- 底部加入购物车 -->
            <div class="footer row text_size_30 text_center">
                <div class="shopping" @click="goCar">
                    <img src="@/assets/images/footer/icon_Shopping_n.png"><br>
                    <span class="color_gray">购物车</span><label class="bg_gold color_white" v-if="(num+$store.state.carNumber)>0">{{ num + $store.state.carNumber }}</label>
                </div>

                <div v-if="radio == 'immediately'" class="row">
                    <div class="add color_white" @click="showSku">
                        加入购物车
                    </div>

                    <div class="buy_now bg_gold color_white" @click="showSku">
                        立即购买
                    </div>
                </div>

                <div v-else class="buy_later bg_gold color_white" @click="showSku">
                    立即预约
                </div>
            </div>
        </div>

        <!-- 商品规格 -->
        <SkuBox />
    </div>
</template>

<script>
import { Swipe, SwipeItem, ImagePreview, RadioGroup, Radio, Cell, Toast } from 'vant';
import NoProduct from '@/components/NoProduct'
import SkuBox from '@/components/SkuBox'
import { getToken } from '@/libs/auth'

    export default {
        components:{
           'van-swipe': Swipe,
           'van-swipe-item':SwipeItem,
           'van-radio-group':RadioGroup,
           'van-radio':Radio,
           'van-cell':Cell,
           NoProduct,   
           SkuBox
        },
        data() {
            return {
                imgList:[require('@/assets/images/product_placeholder.jpg')],
                CurrentImg: 0,
                radio: 'immediately',  // immediately later
                icon: {
                    normal: require('@/assets/images/product/radio.png'),
                    active: require('@/assets/images/product/radio_checked.png')
                },
                canNotBuyNow: false,  //是否可选
                canNotBuyFuture: false,  //是否可选
                productInfo: {},  //商品信息 
                bespokes:'', //预约金信息
                label: 0, //预约金选择
                num: 0,  //购物车数量
            }
        },
        methods:{
            //轮播图片监听
            onChange(index){
                this.CurrentImg = index;
            },

            //轮播图片点击预览
            viewImg(i){
                ImagePreview({
                    images: this.imgList,
                    startPosition: i,
                    onClose() {        
                    }
                });
            },
            
            //选择预约金
            select(i,id){
                this.label = i

                //预约金选择
                this.$store.commit({
                    type: 'm_selectBespokes',
                    bespokesId: id
                })
            },

            //跳到购物车
            goCar(){
                this.$router.push({path:'/showCarDetail',query:{from:'detail'}})
            },

            //展示商品规格
            showSku(){
                this.$store.commit('m_toShowSku')
            },

            //监听购买方式变化
            changeWay(val){
                this.$store.commit({
                    type: 'm_changeBuyWay',
                    way: val
                })
            }
        },
        created(){
            this.$store.commit({
                type: 'm_changeBuyWay',
                way: 'immediately'
            })
            
            let productId = this.$route.query.id

             Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //请求商品详情
            this.$axios(
                'center_good_getoneproductrt', productId)
            .then(data => {
                Toast.clear()
                this.productInfo = data.result
            
                //产品下架
                if(!this.productInfo.isUse){
                    this.$router.replace('/product/nodata')
                }

                //轮播
                this.imgList = []
                data.result.pics.forEach(item => {
                    this.imgList.push(item.url)
                })
                if(this.imgList.length == 0){
                    this.imgList.push(require('@/assets/images/product_placeholder.jpg'))
                }
                console.log(this.productInfo)

                //预约金
                this.bespokes = this.productInfo.bespokes
                //设置默认预约id
                this.$store.commit({
                    type: 'm_selectBespokes',
                    bespokesId: this.bespokes[0].id
                })
            
                //是否可以预约/立即购买
                if(!this.productInfo.buyFuture){
                    this.canNotBuyFuture = true
                }
                if(!this.productInfo.buyNow){
                    this.canNotBuyNow = true
                    this.radio = 'later'
                }
            }).catch(() => {})

            if(getToken()){
                // 请求购物车数量
                this.$axios('order_order_getcartgoodscount')
                .then(data => {
                    this.num = data.result || 0

                    //清空一次
                    this.$store.commit({
                        type: "m_toHideSku",
                        addNum: 0,
                        isShow:false   
                    });
                }).catch(() => {})
            }
        },
    }
</script>

<style scoped lang="less">

.container{
    padding-bottom: 100px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}

.product_detail{
    //轮播
    .van-swipe{
        p,div{
            margin: 0
        }
        position: relative;
        .van-swipe-item{
            img{
                height: 750px;
                width: 100%;
            }
        }
        .custom-indicator{
            position: absolute;
            right: 30px;
            bottom: 30px;
            background: #000;
            opacity: 0.5;
            padding: 8px 18px;
            border-radius: 20px;
        }
    }
    
    .price{
        p,div{
            margin: 0
        }
        padding: 30px 30px 0 30px;
        align-items: center;
        justify-content: space-between;
        span{
            font-size: 52px;
        }
        p:last-of-type{
            padding: 0 30px;
            border-left: 1px solid #ccc;
        }
    }
    
    .info{
        p,div{
            margin: 0
        }
        padding: 30px 30px 46px 30px;
        margin-bottom: 18px;
        p{
            &:first-of-type{
                margin-bottom: 24px;
            }
            label{
                display: inline-block;
                text-align: center;
                padding: 0 20px;
                height: 40px;
                line-height: 42px;
                border-radius: 180px;
                border: 1px solid #f5ab0b;
                margin: 0 20px 30px 0;
                font-size: 22px;
            }
        }
    }

    .buy_mode{
        p,div{
            margin: 0
        }
        margin-bottom: 18px;
        .van-radio-group{
            height: 100px;
            box-sizing: border-box;
            padding: 30px;
            background: #fff;
        }
        .van-radio{
            margin-right: 170px;
            img{
                width: 30px;
                height: 30px;
                margin-right: 6px;
            }
            label{
                font-size: 30px;
                position: relative;
                top: 6px;
            }
        }

        // 预约购买
        .later{
            padding: 36px 46px;
            flex-wrap: wrap;
            &>div{
                width: 318px;
                height: 120px;
                line-height: 40px;
                padding: 24px 0;
                box-sizing: border-box;
                border-radius: 12px;
                border: 1px solid #e4e4e4;
                background: #fff;
                text-align: center;
                margin-bottom: 20px;
                position: relative;
                &:nth-of-type(2n-1){
                    margin-right: 20px;
                }
                &.current{
                    border: 1px solid #f5ab0b;
                }
                img{
                    width: 80px;
                    height: 65px;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
            &>P{
                margin: 6px auto;
                margin-bottom: 0;
            }
        }
    }

    //选择规格
    .van-cell{
        &:active{
            background: #e2e2e2;
        }
        p,div{
            margin: 0
        }
        height: 100px;
        padding: 0 30px;
        .van-cell__left-icon, .van-cell__right-icon{
            font-size: 30px;
        }
    }

    //商品详情
    .detail{
        &>p{
            padding: 46px 0 30px 0;
        }
        /deep/.pro_content{
            padding: 0 20px;
            line-height: 1.8;
            overflow: hidden;
            img{
                max-width: 710px;
            }
        }
    }

    // 底部 加入购物车
    .footer{
        p,div{
            margin: 0
        }
        position: fixed;
        bottom: 0;
        height: 100px;
        width: 100%;
        background: #fff;
        .shopping{
            padding: 14px 0;
            width: 230px;
            font-size: 20px;
            position: relative;
            img{
                width: 44px;
                height: 44px;
                margin-bottom: 6px;
            }
            label{
                position: absolute;
                border-radius: 20px;
                padding: 4px 10px;
                top: 10px;
                right: 64px;
            }
        }
        .add{
            width: 260px;
            background: #ff8025;
            line-height: 100px;
        }
        .buy_now{
            width: 260px;
            line-height: 100px;  
        }
        .buy_later{
            width: 520px;
            line-height: 100px;  
        }
    }
}

</style>