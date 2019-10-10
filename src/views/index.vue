<template>
<!-- 首页 -->
    <div class="index">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 公告 -->
            <div id='announcement' class="announcement bg_white" v-if="showAnnouncement">
                <div class="announcementImg">
                    <img src="@/assets/images/index/icon_Announcement.png" alt="公告图标">
                </div>
                <p class="text_size_28 color_black" @click="$router.push({path:'/message/annoucementdetail',query:{id:notice.id,title:'公告详情'}})">{{notice.title}}</p>
                <div class="closeImg" @click="closeImg">
                    <img src="@/assets/images/index/icon_Close.png" alt="关闭图标">
                </div>
            </div>
            <!-- banner -->
            <van-swipe :autoplay="3000" indicator-color="#f5ab0b" >
                <van-swipe-item v-for="(item, index) in banner" :key="index"><a :href="item.link"><img :src="item.imgLink" alt="banner"></a></van-swipe-item>
            </van-swipe>
            <!-- 四个list -->
            <ul class="listFour bg_white">
                <li @click="$router.push('/recyclingGoldIndex')">
                    <div class="img">
                        <img src="@/assets/images/index/icon_Goldrecovery.png" alt="">
                    </div>
                    <p class="color_black">黄金回收</p>
                </li>
                <li @click="$router.push('/leaseGold')">
                    <div class="img">
                        <img src="@/assets/images/index/icon_Lease12.png" alt="">
                    </div>
                    <p class="color_black">租赁黄金</p>
                </li>
                <li @click="$router.push('/about')">
                    <div class="img">
                        <img src="@/assets/images/index/icon_Lease.png" alt="">
                    </div>
                    <p class="color_black">了解我们</p>
                </li>
                <li @click="$router.push('/security')">
                    <div class="img">
                        <img src="@/assets/images/index/icon_guarantee.png" alt="">
                    </div>
                    <p class="color_black">安全保障</p>
                </li>
            </ul>
            <!-- 实时金价 -->
            <div class="real_time_gold bg_white">
                <header>
                    <div class="goldImg">
                        <img src="@/assets/images/index/icon_goldprice.png" alt="">
                    </div>
                    <p class="color_black">实时金价</p>
                    <div class="goldHeaderRight">
                        <p @click="$router.push('/goldTrendChart')">查看金价走势图</p>
                        <div class="goImg">
                            <img src="@/assets/images/index/Path.png" alt="">
                        </div>
                    </div>
                </header>
                <div class="content">
                    <div class="bgIMG">
                        <img src="@/assets/images/index/bg3.png" alt="">
                    </div>
                    <div class="content_money">
                        <div class="PT">
                            <p class="text_size_28">平台金价</p>
                            <p class="leftBottom"><i>{{platformPrice}}</i><span class="text_size_28">元/克</span></p>
                        </div>
                        <div class="vs">
                            <img src="@/assets/images/index/vs.png" alt="">
                        </div>
                        <div class="left">
                            <div class="top">
                                <p class="text_size_22">上交所</p>
                                <p class="text_size_24">{{shangHaiPrice}}<span>元/克</span></p>
                            </div>
                            <div class="bottom">
                                <p class="text_size_22">{{opponentName}}</p>
                                <p class="text_size_24">{{opponentPrice}}<span>元/克</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 热门榜 -->
            <div class="hot_product bg_white" v-if="good_face">
                <header>
                    <div class="goldImg">
                        <img src="@/assets/images/index/icon_Hot.png" alt="">
                    </div>
                    <p class="color_black">热门榜</p>
                    <div class="goldHeaderRight" @click="$router.push('/product')">
                        <p>更多</p>
                        <div class="goImg">
                            <img src="@/assets/images/index/Path.png" alt="">
                        </div>
                    </div>
                </header>
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item, index) in hotList" :key="index" @click.native="$router.push({path:'/product/detail',query:{id:item.id}})">
                        <div class="product_img">
                            <img src="@/assets/images/product_placeholder.jpg" alt="" v-if="hotList==[] || !item.listPic">
                            <img :src="item.listPic" alt="" v-else>
                        </div>
                        <p class="describe color_black">{{item.name}}</p>
                        <p class="money text_size_32 color_gold">￥{{item.price}} </p>
                    </swiper-slide>
                </swiper>
            </div>
            <!-- 推荐饰品 -->
            <div class="recommended_accessories bg_white" v-if="recommendList_face">
                <header>
                    <div class="goldImg">
                        <img src="@/assets/images/index/icon_Hot.png" alt="">
                    </div>
                    <p class="color_black">推荐饰品</p>
                    <div class="goldHeaderRight" @click="$router.push('/product')">
                        <p>更多</p>
                        <div class="goImg">
                            <img src="@/assets/images/index/Path.png" alt="">
                        </div>
                    </div>
                </header>
                <ul class="recommended">
                    <li v-for="(item, index) in recommendList" :key="index" @click="$router.push({path:'/product/detail',query:{id:item.id}})">
                        <div class="recommended_img">
                            <img src="@/assets/images/product_placeholder.jpg" alt="" v-if="recommendList==[] || !item.listPic">
                            <img :src="item.listPic" alt="" v-else>
                        </div>
                        <p class="content color_black">{{item.name}}</p>
                        <p class="text_size_32 color_gold">￥{{item.price}}</p>
                    </li>
                </ul>                
            </div>
            <!-- 联系我们 -->
            <ul class="contact">
                <li @click="$router.push('/about')">
                    <div class="img">
                        <img src="@/assets/images/index/bg_1.png" alt="">
                    </div>
                    <div class="content">
                        <div class="icon">
                            <img src="@/assets/images/index/icon_Lease_1.png" alt="">
                        </div>
                        <div class="text">
                            <p class="text_size_30 color_white" >了解我们</p>
                            <p>互联网+黄金</p>
                        </div>
                    </div>
                </li>
                <li  @click="$router.push('/security')">
                    <div class="img">
                        <img src="@/assets/images/index/bg_2.png" alt="">
                    </div>
                    <div class="content">
                        <div class="icon">
                            <img src="@/assets/images/index/icon_guarantee_1.png" alt="">
                        </div>
                        <div class="text">
                            <p class="text_size_30 color_white">安全保障</p>
                            <p>平台正规 资金安全</p>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 合作伙伴 -->
            <div class="friends">
                <header>
                    <span></span>
                    <p class="color_gray">合作伙伴</p>
                    <span></span>
                </header>
                <ul>
                    <li v-for="(item, index) in friends" :key="index">
                        <img :src="item.link" alt="">
                    </li>
                </ul>
            </div>
        </van-pull-refresh>
        <div class="customerInfo" :style="{top:top}">
            <div class="customer" @click="$router.push('/chat')">
                <img src="@/assets/images/index/icon_cs.png" alt="">
            </div>
            <div class="info" @click="toMessage">
                <img src="@/assets/images/index/icon_Message.png" alt="">
                <span v-if="isShowDot" class="circle bg_gold"></span>
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Swipe, SwipeItem } from 'vant';
import { setInterval, clearInterval } from 'timers';
import { getToken } from '@/libs/auth'

    export default {
        components: {
            'van-swipe':Swipe,
            'van-swipe-item':SwipeItem,
            swiper,
            swiperSlide
        },
        data(){
            return {
                top:'',
                showAnnouncementFixed:false,
                isLoading: false,
                banner:[{imgLink:require('@/assets/images/index/banner.png'),link:''}],
                showAnnouncement:false,
                swiperOption: {
                    slidesPerView: 'auto',   
                    spaceBetween: 18,
                    freeMode: true,
                },
                good_face:false,//热门展示
                hotList:[],//热门数据
                recommendList_face:false,//推荐展示
                recommendList:[],//推荐数据
                platformPrice:'',
                shangHaiPrice:'',
                opponentName:'',
                opponentPrice:'',
                times:'',
                notice:'',//公告
                isShowDot:false,  //是否显示消息点
                friends:[]//合作伙伴
            }
        },
        watch:{
            showAnnouncementFixed(){
                if(this.showAnnouncement) {
                    this.top = '40px'
                    if(this.showAnnouncementFixed){
                        this.top = '10px'
                    }
                }else{
                    this.top = '10px'
                }
            }
        },
        methods: { 
            onRefresh(){
                this.getData()
                setTimeout(() => {                   
                    this.isLoading = false;
                }, 500);
            },
            // 获取数据
            getData(){
                //公告
                this.$axios('run_run_contentlistpage',{type:'notice', isShow:true, index:1, size:1})
                .then( data => {
                    this.notice = []
                    if(data.result && data.result.length !== 0){
                        this.top = '40px'
                        this.showAnnouncement = true
                        this.notice = data.result[0]
                    }else{
                        this.top = '10px'
                        this.showAnnouncement = false
                    }
                    
                })
                // banner
                this.$axios('run_run_bannerlisttype',"banner_h5")
                .then( data => {   
                    if(data.result && data.result.length !==0){
                        this.banner = []
                        this.banner = data.result
                    }           
                })
                //热门
                this.$axios('center_good_getlistproductrt',{popular:true})
                .then( data =>{
                    this.good_face = true
                    if(data.result && data.result.length !== 0){
                        this.good_face = true
                        this.hotList = []
                        data.result.forEach(item => {
                            this.hotList.push(item)
                        });
                    }else{
                        this.good_face = false
                    }                    
                })
                // 推荐
                this.$axios('center_good_getlistproductrt',{recommend:true})
                .then( data =>{
                    this.recommendList = []
                    if(data.result && data.result.length !== 0){
                        this.recommendList_face = true                        
                        data.result.forEach(item => {
                            this.recommendList.push(item)
                        });
                    }else{
                        this.recommendList_face = false
                    }                    
                })
                //合作伙伴
                this.$axios('run_run_contentlistpage',{type:'partners', isShow:true, index:1,size:10000})
                .then( data => {
                    this.friends = []
                    data.result.forEach( item => {
                        this.friends.push(item)
                    })
                })
            },
            closeImg(){
                sessionStorage.setItem('showAnnouncement',true)
                this.showAnnouncement = false
                this.top = '10px'
            },
            // 黄金金价
            goldMoney(){
                this.$axios('center_goldprice_getallgoldprice')
                .then( res => {
                    this.platformPrice = res.result.platformPrice
                    this.opponentName = res.result.opponentName
                    this.opponentPrice = res.result.opponentPrice
                    this.shangHaiPrice = res.result.shangHaiPrice
                })
            },
            //消息
            toMessage(){
                if(this.isShowDot){
                    this.$router.push('/message/notice')
                }else{
                    this.$router.push('/message/announcement')
                }                
            },
            handleScroll () {
                if(!this.showAnnouncement) return
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                scrollTop > 31 ? this.showAnnouncementFixed = true : this.showAnnouncementFixed = false
            },
        },
        created(){ 
            window.scrollTo(0, 0)
            this.goldMoney()     
            this.times = window.setInterval( () => {
                this.goldMoney()
            },60000)   
            
            this.getData()
            if(getToken()){
                this.$axios('user_message_messageunreadcount')
                .then(data => {
                    if(data.result > 0){
                        this.isShowDot = true
                    }else{
                        this.isShowDot = false
                    }
                })
            }
            window.addEventListener('scroll', this.handleScroll)
        },
        beforeDestroy(){
            window.clearInterval(this.times)
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
    padding: 0;
}
.index{
    /deep/.van-pull-refresh{
        .van-pull-refresh__track{
            min-height: calc(100vh - 100px);
            .announcement{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                height: 68px;
                .announcementImg{
                    width: 32px;
                    padding-right: 14px;
                    img{
                        width: 100%;
                    }
                }
                p{
                    flex: 1;
                    white-space:nowrap; 
                    text-overflow:ellipsis; 
                    overflow:hidden;
                }
                .closeImg{
                    width: 20px;
                    img{
                        width: 100%;
                    }
                }
            }
            .van-swipe{
                height: 300px;
                .van-swipe__track{
                    .van-swipe-item{
                        a{
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
                .van-swipe__indicators{
                    right: 20px;
                    bottom: 20px;
                    transform: none; 
                    justify-content: flex-end;              
                    .van-swipe__indicator{
                        width: 12px;
                        background-color: #fff;
                        height: 12px;
                        opacity: 1;
                    }
                    .van-swipe__indicator:not(:last-child){
                        margin-right: 12px;
                    }
                }
            }
            .listFour{
                margin-bottom: 18px;
                display: flex;
                justify-content: space-around;
                li{
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .img{
                        width: 88px;
                        padding-bottom: 18px;
                        img{
                            width: 100%;
                        }
                    }
                    p{
                        font-size: 22px;
                    }
                }
            }
            .real_time_gold{
                margin-bottom: 18px;
                header{
                    height: 92px;
                    border-bottom: 1px solid #E1E1E1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    .goldImg{
                        width: 32px;
                        padding-right: 16px;
                        img{
                            width: 100%;
                        }
                    }
                    &>p{
                        flex: 1;
                        font-size: 32px;
                    }
                    .goldHeaderRight{
                        display: flex;
                        align-items: center;
                        p{
                            font-size: 26px;
                            color: #ababab;
                        }
                        .goImg{
                            padding-left: 14px;
                            width: 26px;
                            img{
                                width: 100%;
                                vertical-align: baseline;
                            }
                        }
                    }
                }
                .content{
                    position: relative;
                    padding: 36px 30px 46px;
                    .bgIMG{
                        width: 690px;
                        img{
                            width: 100%;
                        }
                    }
                    .content_money{
                        position: absolute;
                        color: #F4D213;
                        top: 78px;
                        left: 98px;
                        width: calc(100% - 198px);
                        display: flex;
                        justify-content: space-between;
                        .PT{
                            padding-top: 28px;
                            p:first-child{
                                padding-bottom: 18px;
                            }
                            .leftBottom{
                                font-size: 50px;
                                i{
                                    font-family: "Segoe UI Semibold";
                                    margin-right: 10px;
                                }
                            }
                        }
                        .vs{
                            width: 120px;
                            img{
                                width: 100%;
                            }
                        }
                        .left{
                            // padding-top: 13px;
                            .top,.bottom{
                                p:first-child{
                                    padding-bottom: 12px;
                                    min-height: 18px;
                                }
                                p:last-child{
                                    // padding-bottom: 25px;
                                }
                            }
                        }
                        .left{
                            display: flex;
                            flex-flow: column;
                            justify-content: space-around;
                        }
                    }
                }
            }
            .hot_product{
                margin-bottom: 18px;
                header{
                    height: 92px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    .goldImg{
                        width: 32px;
                        padding-right: 16px;
                        img{
                            width: 100%;
                        }
                    }
                    &>p{
                        flex: 1;
                        font-size: 32px;
                    }
                    .goldHeaderRight{
                        display: flex;
                        align-items: center;
                        p{
                            font-size: 26px;
                            color: #ababab;
                        }
                        .goImg{
                            padding-left: 14px;
                            width: 26px;
                            img{
                                width: 100%;
                                vertical-align: baseline;
                            }
                        }
                    }
                }
                .swiper-container{
                    padding-bottom: 46px;
                    .swiper-wrapper{
                        .swiper-slide:first-child{
                            margin-left: 30px
                        }
                        .swiper-slide{
                            width: 260px;
                            .product_img{
                                padding-bottom: 30px;
                                width: 260px;
                                height: 260px;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .describe{
                                width: 260px;
                                height: 74px;
                                text-align: justify;
                                font-size: 26px;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                                line-height: 1.5;
                                margin-bottom: 20px;
                            }
                        }
                    }                    
                }
            }
            .recommended_accessories{
                margin-bottom: 18px;
                header{
                    height: 92px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    .goldImg{
                        width: 32px;
                        padding-right: 16px;
                        img{
                            width: 100%;
                        }
                    }
                    &>p{
                        flex: 1;
                        font-size: 32px;
                    }
                    .goldHeaderRight{
                        display: flex;
                        align-items: center;
                        p{
                            font-size: 26px;
                            color: #ababab;
                        }
                        .goImg{
                            padding-left: 14px;
                            width: 26px;
                            img{
                                width: 100%;
                                vertical-align: baseline;
                            }
                        }
                    }
                }
                .recommended{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    padding: 0 30px;
                    li{
                        width: 334px;
                        padding-bottom: 46px;
                        .recommended_img{
                            padding-bottom: 30px;
                            width: 334px;
                            height: 334px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .content{
                            height: 78px;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            font-size: 26px;
                            line-height: 1.5;
                            margin-bottom: 20px;
                        }
                    }
                }
            }
            .contact{
                display: flex;
                justify-content: space-between;
                padding: 0 20px 46px;    
                li{
                    position: relative;
                    .img{
                        width: 346px;
                        img{
                            width: 100%;
                        }
                    }
                    .content{
                        position: absolute;
                        left: 15px;
                        top: 44px;
                        display: flex;
                        .icon{
                            width: 40px;
                            margin-right: 10px;
                            img{
                                width: 100%;
                            }
                        }
                        .text{
                            p{
                                line-height: 1.5;
                            }
                            p:last-child{
                                font-size: 24px;
                                color: #fff;
                            }
                        }
                    }
                }
            }
            .friends{
                header{
                    padding-bottom: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span{
                        height: 1px;
                        width: 60px;
                        background: #ababab;
                    }
                    p{
                        font-size: 24px;
                        padding: 0 20px;
                    }
                }
                ul{
                    padding: 0 20px 46px;
                    display: flex;
                    flex-wrap: wrap;
                    li{
                        margin-right: 18px;
                        width: 164px;
                        margin-bottom: 18px;
                        height: 78px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }   
                    li:nth-of-type(4n){
                        margin-right: 0;
                    } 
                }
            }
        }
    }
    .customerInfo{
        transition: all .5s;
        position: fixed;
        left: 0;
        padding: 0 20px;
        display: flex;
        z-index: 20;
        width: calc(100% - 40px);
        justify-content: space-between;
        .customer,.info{
            width: 62px;
            height: 62px;
            border-radius: 100%;
            background: #000;
            opacity: 0.5;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            img{
                width: 36px;
                height: 36px;
            }
            .circle{
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                position: absolute;
                top: 8px;
                right: 7px;
            }
        }
    }
}
</style>