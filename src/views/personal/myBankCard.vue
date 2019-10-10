<template>
<!-- 我的银行卡 -->
    <div class="myBankCard">        
            <ul>
                <li v-if="bankCard.length!=0" v-for="(item, index) in bankCard" :key="index">
                    <van-swipe-cell :right-width="60">
                        <div class="left bg_gold">
                            <div class="card">
                                <!-- <img src="@/assets/images/personal/bank-logo.png" alt=""> -->
                                <img :src="item.link" alt="">
                            </div>
                            <div class="text">
                                <p class="color_black text_size_36">{{item.bankName}}</p>
                                <p class="color_black text_size_26">{{item.cardNumber}}</p>
                            </div>
                        </div>
                        <van-button
                            square
                            slot="right"
                            type="danger"
                            text="解除绑定"  
                            @click="removeBinding(index,item.id)"                       
                        />
                    </van-swipe-cell>
                </li>
                <li v-if="bankCard.length==0" class="noBank">
                    <p class="color_white" >您还没有绑定银行卡~~</p>
                </li>
            </ul>      
        <button class="change color_white" @click="$router.push('/personal/setting/myBankCard/bindCard')"><img src="@/assets/images/personal/icon_Increase.png" alt="">添加银行卡</button>
        <!-- <div class="tips">
            <p class="color_white text_center">为了您的账户安全，仅支持绑定1张银行卡进行提现和充值</p>
            <p class="color_white text_center">如有疑问，请联系客服电话400-020-0178</p>
        </div> -->
    </div>
</template>

<script>
import { SwipeCell,Button,Dialog, Toast } from 'vant'
    export default {
        components:{
            'van-swipe-cell':SwipeCell,
            'van-button':Button
        },
        data(){
            return{
                bankCard:[]
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            })
            this.$axios('center_user_bankaccount')
            .then( data => {
                Toast.clear()
                data.result.forEach(item => {
                    this.bankCard.push(item)
                });
            })
            .catch( () => {
                Toast.clear()
            })
        },
        methods: {
            removeBinding(index,id){
                Dialog.confirm({
                    message: '确定要解除绑定该银行卡吗？'
                }).then(() => {
                    Toast.loading({
                        mask: true,
                        message: '加载中...',
                        duration: 0,
                        loadingType: 'spinner'
                    })
                    this.$axios('center_user_bankaccountdel',id)
                    .then(data => {
                        Toast.clear()                 
                        this.bankCard.splice(index,1)
                    })
                    .catch( () => {
                        Toast.clear()
                    })
                });
            }
        },
    }
</script>

<style lang="less" scoped>
p{
    margin: 0
}
.myBankCard{
    min-height: calc(100vh - 18px);
    background: rgb(51,51,51);
    padding: 18px 42px 0; 
    ul{
        min-height: calc(100vh - 350px);
        position: relative;
        li{
            margin-bottom: 20px;
            /deep/.van-swipe-cell{
                .van-swipe-cell__wrapper{
                    width: 100%;
                    .left{
                        height: 200px;
                        border-radius: 10px;
                        display: flex;
                        .card{
                            margin: 26px 20px 0 26px;
                            border-radius: 100%;
                            width: 100px;
                            height: 100px;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            img{
                                width: 70px;
                                height: 70px;
                            }
                        }
                        .text{
                            padding-top: 56px;
                            p:first-child{
                                padding-bottom: 26px;
                            }
                        }
                    }
                    .van-swipe-cell__right{
                        margin-left: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 110px;
                        .van-button{
                            margin-left: 10px;
                            border-radius: 10px;
                            width: 100%;
                            height: 100%;
                            span{
                                display: inline-block;
                                width: 90%
                            }
                        }
                    }
                }
            }   
        }
        li:last-child{
            margin-bottom: 0;
        }
        .noBank{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
        }
    }   
    .change{
        margin: 0 auto 100px;
        height: 88px;
        width:  476px;
        border-radius: 88px;
        background: transparent;
        border:2px solid #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 28px;
            height: 28px;
            margin-right: 10px;
        }
    }
    // .tips{
    //     p:first-child{
    //         padding-bottom: 10px;
    //     }
    // }
}
</style>