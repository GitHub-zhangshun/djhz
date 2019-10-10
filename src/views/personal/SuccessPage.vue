<template>
<!-- 成功跳转页 -->
    <div class="success bg_base">
        <img src="@/assets/images/personal/success.png">
        <div class="text" v-if="type=='rent'">
            <p class="text_size_32">恭喜您已经成功出租！</p>
            <p class="text_size_28 color_gray">到期后收益将自动转入您的账户余额</p>
        </div>
        <div class="text" v-if="type=='take'">
            <p class="text_size_32">您的提货订单已经提交成功！</p>
            <p class="text_size_28 color_gray" v-if="code">自提码：{{ code }}</p>
        </div>

        <van-button round @click="$router.push('/')" class="normal">回到首页</van-button>
        <van-button round @click="toDetail" class="another">查看订单</van-button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                type:'',
                code:''
            }
        },
        methods: {
            toDetail(){
                if(this.$route.query.type == 'rent'){
                    this.$router.push({path:'/personal/invest/rentticketdetail', query:{id:this.$route.query.id}})
                }else{
                    this.$router.push({path:'/personal/invest/taketicketdetail', query:{id:this.$route.query.id}})
                }
            }
        },
        created(){
            this.type = this.$route.query.type
            
            if(this.$route.query.code){
                this.code = this.$route.query.code
            }   
        }
    }
</script>
    
<style scoped lang="less">
p,div{
    margin: 0
}

.success{
    min-height: 100vh;
    text-align: center;
    img{
        width: 246px;
        margin: 100px 0 50px 0;
    }
    .text{
        padding: 0 60px;
        p{
            &:first-of-type{
                margin-bottom: 20px;
            }
            &:last-of-type{
                line-height: 40px;
            }
        }
    }
    .van-button{
        width: 280px;
        height: 90px;
        line-height: 90px;
        margin-top: 50px;
        .van-button__text{
            font-size: 30px;
        }
        &.normal{
            margin-left: 18px;
            border: 1px solid #ccc;
            margin-right: 24px;
            background: none;
        }
        &.another{
            color: #fff;
            background: #f5ab0b;
        }
    }
}

</style>