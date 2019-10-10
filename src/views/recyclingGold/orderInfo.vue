<template>
<!-- 我的回收订单详情 -->
    <div class="orderInfo">
        <div class="header">
            <div class="orderImg">
                <img src="@/assets/images/recyclingGold/orderImg.png" alt="">
            </div>
            <div class="text">
                <p class="text_size_32">{{frontStatus==0?'待处理':'已处理'}}</p>
                <div class="orderHeader">
                    <p class="text_size_24">订单编号：{{number}}</p>
                    <p class="text_size_28 color_black" v-if="frontStatus==0">我们已经收到您的订单，客服人员会尽快联系您核实订单信息，请保持电话畅通哦~</p>
                    <p class="text_size_28 color_black" v-if="frontStatus==1">您的订单已经处理完成，感谢您对平台的支持！<br>备注：{{auditRemark}}</p>
                </div>
            </div>
        </div>
        <div class="recyclingInfo bg_white">
            <header class="text_size_32 color_black">回收信息</header>
            <ul>
                <li>
                    <p class="text_size_28 color_gray">联系人：<span class="color_black">{{contactName}}</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">联系电话：<span class="color_black">{{contactPhone}}</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">黄金类型：<span class="color_black">{{goldType}}</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">黄金重量：<span class="color_black">{{weight}}g</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">黄金品牌：<span class="color_black">{{goldBrand}}</span></p>
                </li>
                <li>
                    <div class="text_size_28 color_gray photo">图片：</div>
                    <swiper :options="swiperOption">
                        <swiper-slide v-for="(item, index) in resourceList" :key="index" @click.native="lookImg(index)">
                            <div class="img">
                                <img :src="item.resourceLink" alt="">
                            </div>
                        </swiper-slide>
                    </swiper>
                </li>
                <li>
                    <p class="text_size_28 color_gray">提交时间：<span class="color_black">{{createTimeStamp}}</span></p>
                </li>
                <li v-if="frontStatus==1">
                    <p class="text_size_28 color_gray">处理时间：<span class="color_black">{{auditTime}}</span></p>
                </li> 
            </ul>
        </div>
    </div>
</template>

<script>
import { ImagePreview } from 'vant';
import { formatDate } from '@/libs/publicFun'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        components:{
            swiper,
            swiperSlide,
        },
        data(){
            return{
                swiperOption: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    freeMode: true,
                },
                number:'',
                contactName:'',
                contactPhone:'',
                goldType:'',
                weight:'',
                goldBrand:'',
                resourceList:[],
                createTimeStamp:'',
                auditRemark:'',
                frontStatus:'',
                images:[],
                auditTime:''
            }
        },
        methods:{
            lookImg(a){
                ImagePreview({
                    images: this.images,
                        startPosition:a,
                        showIndex:false,
                        loop:false
                    }
                );
            }
        },
        created(){
            this.$axios('order_recoveryorder_getrecoveryorderinfobyid',this.$route.query.id)
            .then( data => {
                this.number = data.result.number
                this.frontStatus = data.result.frontStatus
                this.contactName = data.result.contactName
                this.contactPhone = data.result.contactPhone
                this.goldType = data.result.goldType
                this.weight = data.result.weight
                this.number = data.result.number
                this.goldBrand = JSON.parse(sessionStorage.dictionary).filter(i => { return i.id == data.result.goldBrand})[0].title, 
                data.result.resourceList.forEach(item => {
                    this.resourceList.push(item)
                    this.images.push(item.resourceLink)
                });
                this.createTimeStamp = formatDate(data.result.createTimeStamp,'yyyy-MM-dd hh:ss:mm')
                this.auditRemark = data.result.auditRemark
                this.auditTime = data.result.auditTime && data.result.auditTime.replace(/T/,' ')
            })
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0
}
.orderInfo{
    .header{
        position: relative;
        .orderImg{
            width: 750px;
            img{
                width: 100%;
            }
        }
        .text{
            position: absolute;
            top: 46px;
            margin: 0 22px;
            &>p{
                padding-left: 32px;
                padding-bottom: 50px;
            }
            .orderHeader{
                width: 646px;
                border-radius: 10px;
                padding: 36px 30px 30px;
                background: #fff;
                p:nth-of-type(1){
                    color: #969696;
                    padding-bottom: 20px;
                }
                p:nth-of-type(2){
                    line-height: 1.2;
                }
            }
        }
    }
    .recyclingInfo{ 
        margin-top: 98px;
        padding-top: 35px;
        header{
            border-left: 6px solid #f5ab0b;
            padding-left: 24px;
            font-weight: bold;
            margin-left: 4px;
            margin-bottom: 45px;
        }
        ul{
            padding: 0 33px;
            li{
                padding-bottom: 30px;
                .photo{
                    padding-bottom: 30px;
                }
                .swiper-container{
                    margin-bottom: 16px;
                    .swiper-wrapper{
                        .swiper-slide{
                            width: 160px;
                            .img{
                                width: 160px;
                                height: 160px;
                                img{
                                    width: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>