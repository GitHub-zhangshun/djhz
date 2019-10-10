<template>
<!-- 个人中心 -->
    <div class="personal bg_base">

        <div class="top"> 
            <img src="@/assets/images/personal/personal_bg.png" class="bg">
            
            <!-- 已登录 -->
            <div v-if="isLogin" class="has_login">
                <div class="row info color_white text_size_32">
                    <div class="row detail">
                        <img :src="accountInfo && accountInfo.headImgLink" v-if="accountInfo.headImgLink" class="defaultImg" >
                        <img src="@/assets/images/personal/default.png" class="defaultImg" v-else>
                        <div>
                            <p class="account_name">{{ accountInfo && accountInfo.nickName || accountInfo.hidePhone }}</p>
                            <div class="approve">
                                <p v-if="isOpen"><img src="@/assets/images/personal/hasapprove.png"><span>已认证</span></p>
                                <p v-else><img src="@/assets/images/personal/noapprove.png"><span class="color_gray">未认证</span></p>                                
                            </div>
                        </div>
                    </div>
                    <div @click="$router.push('/personal/billList')">账单</div>
                </div>

                <div class="price">
                    <img src="@/assets/images/personal/price_bg.png" class="price_bg">
                    <p class="remain">{{ accountInfo && accountInfo.moeny }}</p>
                    <p>账户余额(元)</p>
                </div>
            </div>

            <!-- 未登录 -->
            <div v-else class="not_login">
                <img src="@/assets/images/personal/default.png" class="defaultImg">
                <p class="text_size_32" @click="$router.push('/login')">登录/注册</p>
                <img src="@/assets/images/personal/btn.png" class="btn" @click="$router.push('/login')">
            </div>
        </div>

        <div class="center">
            <!-- 订单 -->
            <div class="ticket row bg_white text_size_30">
                <div class="item row" @click="checkTicket(1)">
                    <img src="@/assets/images/personal/icon_01.png">
                    <p>商品订单</p>
                </div>
                <div class="item row" @click="checkTicket(2)">
                    <img src="@/assets/images/personal/icon_02.png">
                    <p>预约订单</p>
                </div>
            </div>

            <!-- 充值提现 -->
            <div v-if="isLogin && isOpen" class="money row bg_white text_size_28">
                <p @click="$router.push('/personal/takemoney')">提现</p>
                <p class="color_gold" @click="$router.push('/personal/chargemoney')">充值</p>
            </div>

            <div v-if="isLogin && !isOpen" class="bg_white text_size_28 open row">
                <div class="row">
                    <img src="@/assets/images/personal/icon_Safety.png">
                    <p>为了您的资金安全，请立即开通银行存管账户</p>
                </div>
                <img src="@/assets/images/personal/Path.png" >
            </div>

            <div class="set_list bg_white">
                <div class="text_size_28 row list" v-for="(item,index) in list" :key="index" @click="clickBtn(index)">
                    <div class="row">
                        <img :src="item.img">
                        <p>{{ item.txt }}</p>
                    </div>
                    <img src="@/assets/images/personal/Path.png" >
                </div>
            </div>

            <div class="set_list bg_white setting">
                <div class="text_size_28 row list" @click="clickBtn(3)">
                    <div class="row">
                        <img src="@/assets/images/personal/icon_Setup.png">
                        <p>设置</p>
                    </div>
                    <img src="@/assets/images/personal/Path.png" >
                </div>
            </div>

        </div>

        <!-- 弹出框 -->
        <van-popup v-model="showSetPwd">
            <div class="to_setpwd text_center">
                <p class="text_size_32">设置密码</p>
                <p class="text_size_28 color_gray">为了您的账户安全，请立即设置登录密码</p>
                <p class="text_size_30 row">
                    <span @click="showSetPwd = false">取消</span>
                    <span class="color_gold" @click="$router.push('/personal/setpassword')">设置密码</span>
                </p>
            </div>
        </van-popup>

    </div>
</template>

<script>
import { Popup, Toast } from 'vant';
import { getToken } from '@/libs/auth'

    export default {
        components: {
            'van-popup': Popup
        },
        data(){
            return {
                isLogin: false,  //是否有token
                isOpen: false,     //是否开户
                list:[
                    {img:require('@/assets/images/personal/icon_cs_l.png'), txt:'联系客服'},
                    {img:require('@/assets/images/personal/icon_Help.png'), txt:'帮助中心'},
                    {img:require('@/assets/images/personal/icon_About.png'), txt:'关于我们'},
                ],
                showSetPwd: false,  //是否提示设置密码
                accountInfo:''
            }
        },
        methods: {
            //查看订单
            checkTicket(a){
                switch(a){
                    case 1:
                    this.$router.push({path:'/personal/ticket',query:{title:'商品订单'}})
                    break;
                    case 2:
                    this.$router.push({path:'/personal/ticket',query:{title:'预约订单'}})
                    break;
                }
            },


            //设置
            clickBtn(i){
                switch(i){
                    case 0: this.$router.push('/chat') ; break;
                    case 1: console.log(i) ; break;
                    case 2: this.$router.push('/about') ; break;
                    case 3: this.$router.push('/personal/setting'); break;
                }
            }
        },
        created(){
 
            if(getToken()){
                this.isLogin = true

                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                });
                this.$axios('user_user_getuserinfo')
                .then(data => {  
                    Toast.clear()
                    this.accountInfo = data.result
                    this.isOpen = data.result && data.result.isOpenDeyAccount   
                    this.showSetPwd = !(data.result && data.result.account.isSetPassword) && this.isLogin
                }).catch(() => {})
            }        
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.personal{
    min-height: calc(100vh - 100px);
    .top{
        position: relative;
        .bg{
            width: 100%;
            height: 500px;
        }
        &>div{
            position: absolute;
            left: 50%;
            top: 70px;
            transform: translate(-50%, 0);
            text-align: center;
            // 未登录
            &.not_login{
                margin-top: 50px;
                .defaultImg{
                    height: 110px;
                    margin-bottom: 36px;
                }
                .btn{
                    width: 286px;
                    height: 80px;
                }
                p{
                    position: absolute;
                    bottom: 24px;
                    left: 50%;
                    transform: translate( -50%, 0);
                }
            }
            // 已登录
            &.has_login{
                .info{
                    width: 648px;
                    justify-content: space-between;
                    align-items: center;
                    .detail{
                        align-items: center;
                        .defaultImg{
                            height: 110px;
                            width: 110px;
                            border-radius: 50%;
                            margin-right: 20px;
                        }
                        .account_name{
                            display: flex;
                        }
                        .approve{
                            p{
                                display: flex;
                                margin-top: 20px;
                                font-size: 26px;
                                img{
                                    width: 32px;
                                    height: 25px;
                                    margin-right: 10px
                                }
                            }
                        }
                    }
                }

                .price{
                    margin-top: 42px;
                    position: relative;
                    height: 228px;
                    .price_bg{
                        height: 228px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                    }
                    p{
                        color: #ab5711;
                        line-height: 60px;
                        &.remain{
                            padding-top: 70px;
                            font-size: 64px;
                            color: #d1640b;
                        }
                    }
                }
            }

        }
    }

    .center{
        padding: 0 20px;
        position: relative;
        top: -50px;
        // 订单
        .ticket{
            height: 182px;
            padding: 0 52px;
            justify-content: space-between;
            border-radius: 16px;
            margin-bottom: 18px;
            border: 1px solid #e1e1e1;
            .item{
                align-items: center;
                img{
                    width: 90px;
                    height: 90px;
                    margin-right: 20px;
                }
            }
        }
        //充值提现
        .money{
            height: 100px;
            box-sizing: border-box;
            border-radius: 16px;
            align-items: center;
            justify-content: center;
            margin-bottom: 18px;
            border: 1px solid #e1e1e1;
            p{
                padding: 0 140px;
                height: 100px;
                line-height: 100px;
                &:first-of-type{
                    border-right: 1px solid #e3e3e3;
                }
            }
        }
        //开通存管账户
        .open{
            height: 100px;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            margin-bottom: 18px;
            border-radius: 16px;
            border: 1px solid #e1e1e1;
            &:active{
                background: #e2e2e2;
            }
            &>div{
                align-items: center;
                color: #f5ab0b;
                img{
                    width: 26px;
                    height: 28px;
                    margin-right: 10px;
                }
            }
            &>img{
                width: 15px;
                height: 25px;
            }
        }

        
        .set_list{
            border: 1px solid #e1e1e1;
            border-radius: 16px;
            .list{
                &:active{
                    background: #e2e2e2;
                }
                height: 100px;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                &:nth-of-type(1),&:nth-of-type(2){
                    border-bottom: 1px solid #e1e1e1;
                }
                &>div{
                    align-items: center;
                    img{
                        width: 26px;
                        height: 26px;
                        margin-right: 10px;
                    }
                }
                &>img{
                    width: 15px;
                    height: 25px;
                }
            }
            &.setting{
                margin-top: 18px;
                .list{
                    border: none;
                }
            }
        }
    }

    //弹框
    .to_setpwd{
        width: 560px;
        padding: 0 20px;
        p{
            &:first-of-type{
                margin: 60px 0 46px 0;
            }
            &:nth-of-type(2){
                padding-bottom: 66px;
                border-bottom: 2px solid #e3e3e3;
            }
            &:nth-of-type(3){
                span{
                    width: 50%;
                    display: inline-block;
                    padding: 30px 0;
                } 
            }
        }
    }

}

</style>
