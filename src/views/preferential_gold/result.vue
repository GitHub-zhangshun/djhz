<template>
<!-- 优惠金订单提交成功 -->
    <div class="orderSubmitResult">
        <div class="successImg">
            <img src="@/assets/images/preferential_gold/success.png" alt="">
        </div>
        <p class="text_size_32">您的订单已经支付成功</p>
        <p class="text_size_28 color_gray">您购买的产品为黄金Au9999,请查看订单确认是否<br>进行出租，出租的黄金可以获取更多利益</p>
        <div class="btn">
            <button class="text_size_30" @click="$router.push('/')">回到首页</button>
            <button class="text_size_30 color_white bg_gold" @click="lookOrder">查看订单</button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
            }
        },
        mounted(){
        },
        created(){
        },
        methods:{
            lookOrder(){
                this.$router.replace({path:'/personal/invest/goldticketdetail',query:{id:this.$route.query.id}})
            }
        }
    }
</script>

<style scoped lang="less">
.orderSubmitResult{
    .successImg{
        width: 223px;
        margin: 100px auto 46px;
        img{
            width: 100%;
        }
    }
    p{
        margin: 0;
        text-align: center;
    }
    p:nth-of-type(1){
        padding-bottom: 34px;
    }
    p:nth-of-type(2){
        padding-bottom: 60px;
        line-height: 1.5
    }
    .btn{
        display: flex;
        justify-content: space-around;
        button{
            width: 280px;
            height: 90px;
            border-radius: 88px;
        }
        button:nth-of-type(1){
            border: 2px solid #e2e2e2;
            background: transparent;
        }
    }
}
</style>