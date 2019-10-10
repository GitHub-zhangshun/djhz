<template>
<!-- 提现结果 -->
    <div class="take_result bg_base text_center">
        <img src="@/assets/images/personal/takesuccess.png" >
        <p class="text_size_32">您已成功提交提现申请</p>
        <p class="color_gray">预计1个工作日内到账，具体到账时间以银行为准</p>
        <van-button @click="confirm">完成</van-button>
    </div>
</template>

<script>
    export default {
        methods:{
            confirm(){
                this.$router.push('/personal')
            }
        }
    }
</script>

<style scoped lang="less">
div,p{
    margin: 0;
}

.take_result{
    min-height: 100vh;
    img{
        width: 140px;
        height: 140px;
        margin-top: 146px;
        margin-bottom: 32px;
    }
    p{
        margin-bottom: 24px;
    }

    .van-button{
        height: 90px;
        width: 640px;
        line-height: 90px;
        background: #f5ab0b;
        color: #fff;
        border-radius: 180px;  
        margin-top: 50px;                                 
        .van-button__text,.van-button__loading-text{
            font-size: 30px;
        }   
    }
}

</style>