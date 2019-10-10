<template>
<!-- 我要卖金订单提交成功 -->
    <div class="orderSubmitResult">
        <div class="successImg">
            <img src="@/assets/images/recyclingGold/successImg.png" alt="">
        </div>
        <p class="text_size_32">您的{{text}}订单已经提交成功！</p>
        <p class="text_size_28 color_gray">客服人员会尽快联系您核实订单信息，请保持电话畅通</p>
        <div class="btn">
            <button class="text_size_30" @click="goIndex">回到首页</button>
            <button class="text_size_30 color_white bg_gold" @click="$router.push(path)">查看订单</button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                text:'',
                path:''
            }
        },
        mounted(){
            if(this.$route.query.from=='lease'){
                this.text = '租赁'
                this.path = '/myLease'
                this.$store.commit({type:'m_leaseOrderSubmit',leaseOrderSubmit:""})
            }
            if(this.$route.query.from =='sell'){
                this.text = '回收'
                this.path = '/myRecycling'
                this.$store.commit({type:'m_sellGold',sellGold:""})
            }
        },
        methods:{
            goIndex(){
                if(window.webkit !== undefined && window.webkit.messageHandlers != undefined && window.webkit.messageHandlers.k_jsbackhome !== undefined){ 
                    window.webkit.messageHandlers.k_jsbackhome.postMessage({})
                }else if(window.AndroidApp !== undefined){
                    window.AndroidApp.backHome()    
                }else{
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style scoped lang="less">
.orderSubmitResult{
    .successImg{
        width: 246px;
        margin: 122px auto 48px;
        img{
            width: 100%;
        }
    }
    p{
        margin: 0;
        text-align: center;
    }
    p:nth-of-type(1){
        padding-bottom: 30px;
    }
    p:nth-of-type(2){
        padding-bottom: 84px;
    }
    .btn{
        display: flex;
        justify-content: space-around;
        button{
            width: 278px;
            height: 88px;
            border-radius: 88px;
        }
        button:nth-of-type(1){
            border: 2px solid #e2e2e2;
            background: transparent;
        }
    }
}
</style>