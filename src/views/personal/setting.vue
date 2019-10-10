<template>
<!-- 设置 -->
    <div class="setting">
        <ul>
            <li class="touch bg_white" @click="setImg">
                <span class="text_size_28 color_black">设置头像</span>
                <div>
                    <img class="userImg" :src="imgLink" alt="">
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="$router.push({path:'/personal/setting/setName',query:{name:nickName=='请设置'?'':nickName}})">
                <span class="text_size_28 color_black">设置昵称</span>
                <div>
                    <span class="text_size_28 color_gray">{{nickName}}</span>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="$router.push('/submitticket/manageaddress')">
                <span class="text_size_28 color_black">我的收货地址</span>
                <div>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="$router.push('/personal/setting/changePhonePwd')">
                <span class="text_size_28 color_black">登录手机号码</span>
                <div>
                    <span class="text_size_28">{{ hidePhone }}</span>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="setTradingPwd">
                <span class="text_size_28 color_black">重置交易密码</span>
                <div>
                    <span class="text_size_28 color_gray">{{ isOpenDeyAccount }}</span>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="$router.push('/personal/setting/setLoginPwd')">
                <span class="text_size_28 color_black">修改登录密码</span>
                <div>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="personal_information">
                <span class="text_size_28 color_black">个人信息</span>
                <div>
                    <span class="text_size_28 color_gray">{{ open }}</span>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
            <li class="touch bg_white" @click="myBank">
                <span class="text_size_28 color_black">我的银行卡</span>
                <div>
                    <span class="text_size_28 color_gray">{{ isOpenDeyAccount }}</span>
                    <img class="path" src="@/assets/images/index/Path.png" alt="">
                </div>
            </li>
        </ul>
        <van-button type="default" class="color_white bg_gold" @click="loginOut">安全退出</van-button>
        <van-button type="default" class="color_black" @click="cancellation">申请注销账户</van-button>
        <OpenAccountPop/>
    </div>
</template>

<script>
import { Button,Dialog,Toast  } from 'vant';
import  { deleteToken }   from '@/libs/auth'
import OpenAccountPop from '@/components/OpenAccountPop'
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button,
            OpenAccountPop,
        },
        data(){
            return{
                index:0,
                userInfo:'',
                nickName:'',
                hidePhone:'',
                isOpenDeyAccount:'',
                imgLink:'',
                open:''
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            })
            this.$axios('user_user_getuserinfo')
            .then( res => {
                sessionStorage.setItem('userInfo',JSON.stringify(res.result))
                Toast.clear()
                this.userInfo = res.result
                this.imgLink = res.result.imgLink?res.result.imgLink:require('@/assets/images/personal/default.png')
                this.nickName = res.result.nickName?res.result.nickName:'请设置'
                this.hidePhone = res.result.hidePhone
                this.isOpenDeyAccount = res.result.isRealName?'':'请先实名认证'
                this.open = res.result.isRealName?'':'未认证'
            })
            .catch( () => {
                Toast.clear()
            })
        },
        methods:{
            //设置头像
            setImg(){
                Toast({message:'请在APP上进行头像修改',duration:2000})
            },
            // 重置交易密码
            setTradingPwd(){
                if(this.userInfo.isRealName){
                    this.$router.push('/personal/setting/reset_trade_password')
                    // this.$store.commit('m_toShowOpenAccount')
                }else{
                    Toast({message:'请先实名认证',duration:2000})
                }
            },
            // 个人信息
            personal_information(){
                if(this.userInfo.isRealName){
                    // this.$router.push('/personal/setting/bankDepositAccount')
                    this.$router.push('/personal/setting/isRealName_true')
                }else{
                    this.$router.push('/personal/setting/isRealName_false')
                }
            },
            // 我的银行卡
            myBank(){
                if(this.userInfo.isRealName){
                    this.$router.push('/personal/setting/myBankCard')
                }else{
                    Toast({message:'请先实名认证',duration:2000})
                }
            },
            //点击加样式
            onClick(index){
                this.index = index
            },
            //退出
            loginOut(){
                Dialog.confirm({
                    message: '确定要退出当前账号吗？'
                }).then(() => {
                    deleteToken()
                    this.$router.push('/personal')
                }).catch(() => {
                // on cancel
                });
                

            },
            // 注销
            cancellation(){
                if(this.userInfo.moeny!=0){
                    Dialog.alert({
                        message: '为了您的资金安全，您的账户余额需为0元才可申请注销账户。'
                    }).then(() => {
                    // on close
                    });
                }else{
                    Dialog.confirm({
                        message:'注销后所有数据将无法找回，确认要申请注销账户吗？'
                    }).then(() => {
                        Toast.loading({
                            mask: true,
                            message: '加载中...',
                            mask:false
                        });
                        this.$axios('center_user_accountlogoutapply')
                        .then( res =>{
                            if(res.code==0){
                                Toast({message:'申请成功',duration:1200})
                                setTimeout( () => {
                                    deleteToken()
                                    this.$router.push('/personal')
                                },1200)  
                            }else{
                                Toast({message:res.msg,duration:1200})
                            }
                        })
                    }).catch(() => {
                    // on cancel
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">
.setting{
    ul{
        .touch:active{
            background: #e2e2e2 !important;
        }
        li{
            padding: 0 34px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e2e2e2;
            div{
                display: flex;
                align-items: center;
                span{
                    margin-right: 10px;
                }
                .userImg{
                    margin-right: 10px;
                    width: 86px;
                    height: 86px;
                    border-radius: 50%;
                }
                .path{
                    width: 26px;
                    height: 26px;
                    vertical-align: top;
                }
            }
        }   
        li:nth-of-type(4),
        li:nth-of-type(7){
            margin-top: 20px;
        }        
    }
    .van-button{
        display: flex;
        justify-content: center;
        margin: 0 auto;
        width: 642px;
        height: 92px;
        border-radius: 92px;
        span{
            // font-size: 28px;
        }
    }
    .van-button:nth-of-type(1){
        margin-top: 48px;
        margin-bottom: 32px;
    }
}
</style>