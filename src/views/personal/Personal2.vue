<template>
<!-- 个人中心 -->
    <div class="personal bg_base">

        <div class="top"> 
            <img src="@/assets/images/personal/personal_bg.png" class="bg">
            
            <!-- 已登录 -->
            <div v-if="isLogin" class="has_login">
                <div class="row info color_white text_size_32">
                    <div class="row detail">
                        <img :src="img" v-if="img" class="defaultImg" >
                        <img src="@/assets/images/personal/default.png" class="defaultImg" v-else>
                        <div>
                            <p class="account_name">{{ accountInfo && accountInfo.nickName || accountInfo.hidePhone }}</p>
                            <div class="approve">
                                <p v-if="isOpen"><img src="@/assets/images/personal/hasapprove.png"><span>已认证</span></p>
                                <p v-else><img src="@/assets/images/personal/noapprove.png"><span class="color_gray">未认证</span></p>                                
                            </div>
                        </div>
                    </div>
                    <!-- 充值提现 -->
                    <div v-if="isLogin && isOpen" class="money row">
                        <p @click="toTakeMoney">提现</p>
                        <!-- <p class="color_gold" @click="$router.push('/personal/chargemoney')">充值</p> -->
                    </div>
                </div>

                <div class="price">
                    <img src="@/assets/images/personal/price_bg.png" class="price_bg">
                    <p class="remain">{{ accountInfo && accountInfo.moeny || '0.00' }}</p>
                    <p>账户余额(元)</p>
                    <div class="bill row" @click="$router.push('/personal/billList')"><img src="@/assets/images/personal/icon_Bill.png"><span>账单</span></div>
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
            <div class="ticket row bg_white text_size_26">
                <div class="item column" @click="checkTicket(1)">
                    <img src="@/assets/images/personal/01.png">
                    <p>立即购买</p>
                </div>
                <div class="item column" @click="checkTicket(2)">
                    <img src="@/assets/images/personal/02.png">
                    <p>预约购买</p>
                </div>
                <div class="item column" @click="checkTicket(3)">
                    <img src="@/assets/images/personal/03.png">
                    <p>黄金购买</p>
                </div>
                <div class="item column" @click="checkTicket(4)">
                    <img src="@/assets/images/personal/04.png">
                    <p>黄金出租</p>
                </div>
                <div class="item column" @click="checkTicket(5)">
                    <img src="@/assets/images/personal/05.png">
                    <p>黄金提货</p>
                </div>
            </div>

            <div v-if="isLogin && !isOpen" class="bg_white text_size_28 open row" @click="clickBtn(5)">
                <div class="row">
                    <img src="@/assets/images/personal/icon_Safety.png">
                    <!-- <p>为了您的资金安全，请立即开通银行存管账户</p> -->
                    <p>为了您的资金安全，请立即前往实名认证！</p>
                </div>
                <img src="@/assets/images/personal/Path.png" >
            </div>

            <div class="set_list bg_white mygold" @click="clickBtn(4)">
                <div class="text_size_28 row list">
                    <div class="row">
                        <img src="@/assets/images/personal/icon_coffers.png">
                        <p>我的金库</p>
                    </div>
                    <div class="row text_size_28"><span class="color_gold" v-if="isLogin && isOpen">{{ myGoldInfo.goldWeightSum || 0 }}克</span><img src="@/assets/images/personal/Path.png" class="path"></div>
                </div>
                <div class="row income" v-if="isLogin && isOpen">
                    <div class="row">
                        <img src="@/assets/images/personal/gold_01.png">
                        <p class="text_size_32">{{ myGoldInfo.unreceiveProfit || '0.00' }}&nbsp;元<br><span class="color_gray text_size_24">预计收益</span></p>
                    </div>
                    <div class="row">
                        <img src="@/assets/images/personal/gold_02.png">
                        <p class="text_size_32">{{ myGoldInfo.unreceiveInterest || '0.00' }}&nbsp;元<br><span class="color_gray text_size_24">预计优惠金</span></p>
                    </div>
                </div>
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

        <!-- 开户绑卡设置交易密码 -->
        <ToastPop/>
    </div>
</template>

<script>
import { Popup, Toast } from 'vant';
import { getToken } from '@/libs/auth'
import ToastPop from '@/components/Toast'

    export default {
        components: {
            'van-popup': Popup,
            ToastPop
        },
        data(){
            return {
                isLogin: false,  //是否有token
                isOpen: false,     //是否开户 → 实名认证
                list:[
                    {img:require('@/assets/images/personal/icon_cs_l.png'), txt:'联系客服'},
                    {img:require('@/assets/images/personal/icon_Help.png'), txt:'帮助中心'},
                    {img:require('@/assets/images/personal/icon_About.png'), txt:'关于我们'},
                ],
                showSetPwd: false,  //是否提示设置密码
                accountInfo:{},   //用户信息
                myGoldInfo:{},    //我的金库
                isHasBank:false,     //是否绑有银行卡
                isSetTranPwd:false,   //是否设置交易密码
                img:'',   //头像图片
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
                    case 3:
                    this.$router.push('/personal/invest/goldticket')
                    break;
                    case 4: 
                    this.$router.push('/personal/invest/rentticket')
                    break;
                    case 5:
                    this.$router.push('/personal/invest/taketicket')
                    break;
                }
            },

            //设置
            clickBtn(i){
                switch(i){
                    case 0: this.$router.push('/chat') ; break;
                    case 1: this.$router.push('/help_center') ; break;
                    case 2: this.$router.push('/about') ; break;
                    case 3: this.$router.push('/personal/setting'); break;
                    case 4: this.$router.push('/personal/mygold'); break;
                    case 5: this.$router.push('/personal/setting/isRealName_false'); break;
                }
            },

            //提现
            toTakeMoney(){
                if(this.isOpen){   //是否开户  → 实名认证 
                        if(this.isHasBank){   //是否绑有银行卡
                            if(this.isSetTranPwd){   //是否设置交易密码
                                this.$router.push('/personal/takemoney')
                            }else{
                            //弹出设置交易密码提示
                            this.$store.commit({
                                type: "m_toShowToast",
                                showToast: true,
                                hintType:3,
                            });
                        }
                    }else{
                        // 弹出绑定银行卡提示
                        this.$store.commit({
                            type: "m_toShowToast",
                            showToast: true,
                            hintType:2,
                        });
                    }
                }else{
                //弹出开通存管提示
                //  this.$store.commit('m_toShowOpenAccount')
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:1,
                    });
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

                //获取用户信息
                this.$axios('user_user_getuserinfo')
                .then(data => {  
                    Toast.clear()
                    data.result.moeny = data.result.moeny && data.result.moeny.toFixed(2)
                    this.accountInfo = data.result
                    this.img = data.result.imgLink
                    // this.isOpen = data.result && data.result.isOpenDeyAccount    //开户　　　  
                    this.isOpen = data.result && data.result.isRealName      //实名认证
                    this.isHasBank = data.result && data.result.isHasBankCard
                    this.isSetTranPwd = data.result && data.result.account && data.result.account.isSetTranPassword

                    if(this.$route.query.type == 'nopwd'){
                        this.showSetPwd = !(data.result && data.result.account.isSetPassword) && this.isLogin 
                    }
                }).catch(() => {})

                //我的金库
                this.$axios('order_goldorder_userpersonalvault')
                .then(data => {
                    data.result.unreceiveProfit = data.result.unreceiveProfit && data.result.unreceiveProfit.toFixed(2)
                    data.result.unreceiveInterest = data.result.unreceiveInterest && data.result.unreceiveInterest.toFixed(2)
                    this.myGoldInfo = data.result
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
                    //充值提现
                    .money{
                        p{
                            // &:first-of-type{
                            //     border-right: 1px solid #e3e3e3;
                            //     margin-right: 28px;
                            //     padding-right: 28px;
                            // }
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
                        text-align: left;
                        margin-left: 34px;
                        &.remain{ 
                            padding-top: 70px;
                            font-size: 64px;
                            color: #d1640b;
                        }
                    }
                    .bill{
                        width: 170px;
                        height: 68px;
                        line-height: 68px;
                        color: #ede489;
                        background: #d2640b;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        align-items: center;
                        justify-content: center;
                        border-top-left-radius: 180px;
                        border-bottom-left-radius: 180px;
                        img{
                            width: 30px;
                            margin-right: 12px;
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
            padding: 0 30px;
            justify-content: space-between;
            align-items: center;
            border-radius: 16px;
            margin-bottom: 18px;
            border: 1px solid #e1e1e1;
            .item{
                align-items: center;
                img{
                    width: 62px;
                    height: 62px;
                    margin-bottom: 20px;
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
                    img{
                        width: 26px;
                        height: 26px;
                        margin-right: 10px;
                    }
                }
                &>img,.path{
                    width: 15px;
                    height: 25px;
                    margin-left: 16px;
                }
            }
            &.setting{
                margin-top: 18px;
                .list{
                    border: none;
                }
            }
            &.mygold{
                margin-bottom: 18px;
                .list{
                    border: none;
                }
                &:active{
                    background: #e2e2e2;
                }
                .income{
                    &>div{
                        align-items: center;
                        width: 50%;
                        padding: 10px 40px 40px 40px;
                        p{
                            line-height: 40px;
                        }
                        img{
                            height: 60px;
                            width: 60px;
                            margin-right: 20px;
                        }
                    }
                }
            }
        }
    }

    //弹框
    .van-popup{
        padding: 0 20px;
        border-radius: 12px;
        .to_setpwd{
            width: 560px;
            p{
                &:first-of-type{
                    margin: 60px 0 46px 0;
                }
                &:nth-of-type(2){
                    padding-bottom: 66px;
                    border-bottom: 2px solid #e3e3e3;
                    line-height: 46px;
                }
                &:nth-of-type(3){
                    span{
                        width: 50%;
                        display: inline-block;
                        padding: 30px 0;
                        &:active{
                            background: #e2e2e2;
                        }
                    } 
                }
            }
        }
    }
}

</style>
