<template>
<!-- 开通存管账户 -->
    <div class="open_account">
        <van-popup v-model="$store.state.isShowOpenAccountPop" >
            <img src="@/assets/images/personal/openAccount.png">
            <div class="bg_white text_size_30 text_box">
                <p class="title text_center">德金惠众已接入晋城银行资金存管</p>
                <p class="text_size_26">为了保证您的资金安全，您需要先开通银行存管账户，才可以购买、充值、提现哦~</p>
                <div class="btn row"><van-button round class="gray" @click="toClose">暂不开通</van-button><van-button round class="blue" @click="toOpen">立即开通</van-button></div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup  } from 'vant'

    export default {
        components: {
            'van-popup': Popup
        },
        methods: {
            toClose(){
                //关闭弹框
                this.$store.commit('m_toHideOpenAccount')
            },
            toOpen(){
                //开通存管账户
            }
        },
    }
</script>

<style scoped lang="less">
div,p{
    margin: 0
}

.open_account{
    .van-popup{
        padding: 0;
        background: transparent; 
        img{
            width: 550px;
        }
        .text_box{
            line-height: 42px;
            padding: 0px 32px;
            padding-bottom: 30px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            .title{
                margin-bottom: 30px;
            }
            .btn{
                justify-content: space-between;
                margin: 50px 0 30px 0;
                .van-button{
                    height: 80px;
                    line-height: 80px;
                    color: #fff;
                    &.gray{
                        width: 190px;
                        background: #ababab;
                    }
                    &.blue{
                        width: 260px;
                        background: #48a3f9
                    }
                }
            }
        }
    }
}

</style>