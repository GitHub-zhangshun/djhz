<template>
<!-- 我的回收订单详情 -->
    <div class="leaseOrderInfo">
        <div class="header">
            <div class="orderImg">
                <img src="@/assets/images/recyclingGold/orderImg.png" alt="">
            </div>
            <div class="text">
                <p class="text_size_32">{{frontStatus}}</p>
                <div class="orderHeader">
                    <p class="text_size_24">订单编号：{{number}}</p>
                    <p class="text_size_28 color_black" v-if="state==0">我们已经收到您的订单，客服人员会尽快联系您核实订单信息，请保持电话畅通哦~</p>
                    <p class="text_size_28 color_black" v-if="state==1">您的订单已经处理完成，感谢您对平台的支持！<br>备注：{{auditRemark}}</p>
                </div>
            </div>
        </div>
        <div class="recyclingInfo bg_white">
            <header class="text_size_32 color_black">租凭信息</header>
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
                    <p class="text_size_28 color_gray">黄金重量：<span class="color_black">{{weight}}</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">租凭期限：<span class="color_black">{{leaseTerm}}</span></p>
                </li>
                <li>
                    <p class="text_size_28 color_gray">提交时间：<span class="color_black">{{createTimeStamp}}</span></p>
                </li>
                <li v-if="state==1">
                    <p class="text_size_28 color_gray">处理时间：<span class="color_black">{{auditTime}}</span></p>
                </li> 
            </ul>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { formatDate } from '@/libs/publicFun'
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
                state:-1,
                status:[],
                number:'',
                contactName:'',
                contactPhone:'',
                goldType:'',
                weight:'',
                leaseTerm:'',
                createTimeStamp:'',
                auditTime:'',
                frontStatus:'',
            }
        },
        async created(){
            await this.$axios('dic_face_getlistdetailrtbyindexsimplify','front_lease_status')
            .then( data => {    
                data.result.forEach(item => {
                    this.status.push(item)
                });            
            })
            await this.$axios('order_leaseorder_leaseorderinfobyid',this.$route.query.id)
            .then( data => {
                this.number = data.result.number
                this.contactName = data.result.contactName
                this.contactPhone = data.result.contactPhone
                this.goldType = data.result.goldType
                this.weight = data.result.weight
                this.leaseTerm = data.result.leaseTerm
                this.createTimeStamp = formatDate(data.result.createTimeStamp,'yyyy-MM-dd hh:ss:mm')
                this.auditTime = data.result.auditTime && data.result.auditTime.replace(/T/,"  ")
                this.auditRemark = data.result.auditRemark
                this.frontStatus = this.status.filter( i => { return i.id == data.result.frontStatus})[0].title
                if(this.frontStatus=="待处理"){
                    this.state = 0
                }else{
                    this.state = 1
                }
            })            
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0
}
.leaseOrderInfo{
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
            }
        }
    }
}
</style>