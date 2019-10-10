<template>
<!-- 登录 -->
    <div class="login">
        <div class="logo">
            <img src="@/assets/images/personal/logo.png" alt="logo">
        </div>

        <!-- 登录框 -->
        <div class="login_box text_center">

            <img src="@/assets/images/personal/login_bg2.png" v-if="loginType == 'byCode'">
            <img src="@/assets/images/personal/login_bg3.png" v-if="loginType == 'byPwd'">
            
            <!-- 定位框 -->
            <div class="content">
                <!-- 切换table -->
                <div class="tab row text_size_34 color_white">
                    <p :class="{color_black:loginType == 'byCode'}" @click="select('byCode')">验证码登录</p>
                    <p :class="{color_black:loginType == 'byPwd'}" @click="select('byPwd')">密码登录</p>
                </div>

                <!-- 内容 -->
                <div class="input_box">
                    <div>
                        <div>
                            <img src="@/assets/images/personal/tel.png" class="icon">
                            <input type="tel" placeholder="请输入手机号码" v-model="formData.tel" @blur="scrollBack">
                        </div>
                        <img v-if="formData.tel" src="@/assets/images/personal/icon_Close.png" alt="" class="close" @click="formData.tel=''">
                    </div>

                    <!-- 验证码登录 -->
                    <div v-if="loginType=='byCode'">
                        <div>
                            <img src="@/assets/images/personal/code.png" class="icon">
                            <input type="tel" placeholder="请输入短信验证码" class="get_code" v-model="formData.code" @blur="scrollBack">
                        </div>
                        <div class="row">
                            <img v-if="formData.code" src="@/assets/images/personal/icon_Close.png" alt="" class="close" @click="formData.code=''">
                            <van-button :class="code_disabled?'color_gray':'color_gold'" @click="getCode" :disabled="code_disabled">{{ word }}</van-button>
                        </div>
                    </div>

                    <!-- 密码登录 -->
                    <div v-else>
                        <div>
                            <img src="@/assets/images/personal/pwd.png" class="icon">
                            <input :type="isShowPwd? 'text': 'password'" placeholder="请输入登录密码" v-model="formData.pwd" @blur="scrollBack">
                        </div>
                        <div class="row">
                            <i :class="isShowPwd?'iconfont iconyanjing':'iconfont iconbiyan'" @click="toSwitch" class="biyan"></i>    
                            <img v-if="formData.pwd" src="@/assets/images/personal/icon_Close.png" alt="" class="close" @click="formData.pwd=''">
                        </div>
                    </div>
                </div>

                <div class="submit_btn">
                    <van-button v-if="loginType=='byCode'" class="color_white bg_gold" :disabled="isDisabledCode" @click="login(2)" :loading="isLoading" loading-text="登录中...">登&nbsp;录</van-button>
                    <van-button v-else class="color_white bg_gold" :disabled="isDisabledPwd" @click="login(1)" :loading="isLoading" loading-text="登录中...">登&nbsp;录</van-button>
                </div>

                <p v-if="loginType=='byCode'" class="text_size_28 color_gray agreement">未注册用户登录后将自动注册<br>且表示同意<span class="color_black" @click="$router.push({path:'/message/annoucementdetail', query:{id:'User_Registration_Agreement', title:'德金惠众注册服务协议'}})">《德金惠众注册服务协议》</span></p>     
                <p v-else class="color_gold" @click="$router.push({path:'/personal/setting/forgetPwd',query:{isLogin:1}})">忘记密码？</p>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import {checkPhone, checkPwd} from '@/libs/publicFun'
import md5 from 'blueimp-md5'
import { setToken } from '@/libs/auth.js'
import global from '@/libs/globalVar'

    export default {

        data(){
            return {
                loginType:'byCode',    //byCode  byPwd
                formData:{
                    tel:'',
                    code: '',
                    pwd: '',
                },
                code_disabled: false,
                word: '获取验证码',
                isShowPwd: false,
                isDisabledCode: true,   //按钮是否可点(验证码登录)
                isDisabledPwd: true,   //按钮是否可点（密码登录）
                isLoading: false,
                regId:'',
                isToPersonal:false,  //是否跳转个人中心（如果直接进入登录页）
            }
        },
        watch: {
            formData:{
                handler(val){
                    if(this.formData.tel && this.formData.code){           
                        this.isDisabledCode = false
                    }else{
                        this.isDisabledCode = true
                    };

                    if(this.formData.tel && this.formData.pwd){           
                        this.isDisabledPwd = false
                    }else{
                        this.isDisabledPwd = true
                    };
                },
                deep: true
            }
        },
        methods: {
            select(i){
                this.loginType = i
            },

            // 显示密码
            toSwitch(){
                this.isShowPwd = !this.isShowPwd
            },
            
            // 获取验证码
            getCode(){
                if(!checkPhone(this.formData.tel)){
                    Toast({message:'请输入正确的手机号码', duration:2000});
                    return
                }
                this.code_disabled = true
                this.$axios(
                    'center_user_verifycodesend',
                    {phone:this.formData.tel, type:1}
                )
                .then(data => {
                    let time = 60,that = this
                    var sendTimer = window.setInterval(function(){
                        time--;
                        that.word = time+'S';
                        if(time < 0){
                            that.code_disabled = false;
                            window.clearInterval(sendTimer);
                            that.word = "获取验证码";
                        }
                    },1000)
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000});
                    // }
                }).catch(() => {
                    this.code_disabled = false
                })
            },
            

            // 点击登录
            login(loginType){
                if(!checkPhone(this.formData.tel)){
                    Toast({message:'请输入正确的手机号码', duration:2000});
                    return
                }
                if(loginType==1){
                    if(!checkPwd(this.formData.pwd)){
                        Toast({message:'请输入6-16字符的登录密码', duration:2000});
                        return
                    }
                }   
                this.isLoading = true
                this.$axios(
                    'center_user_userlogin',
                    {phone:this.formData.tel, userPassword:md5(md5(md5(this.formData.pwd))), validateCode:this.formData.code, type:loginType, sourceSimplify:'h5'}
                ).then(data => {
                    if(window.webkit !== undefined && window.webkit.messageHandlers != undefined && window.webkit.messageHandlers.k_jsloginsuccess !== undefined){
                        window.webkit.messageHandlers.k_jsloginsuccess.postMessage({token:data.result.token})
                    }
                    if(window.AndroidApp !== undefined) {
                        // 安卓
                        window.AndroidApp.loginSucceed(data.result.token)    
                    }
                    this.isLoading = false
                    let rst = data.result

                    // if(data.code!=0){
                    //     Toast({message:data.msg, duration:2000});
                    // }else{
                        Toast.success({message:"登录成功", duration:2000});
                        
                        setToken(rst.token)   //存token

                        sessionStorage.setItem('userInfo',JSON.stringify(rst))   //保存本地

                        setTimeout(() => {
                            if(!rst.account.isSetPassword){
                                this.$router.replace({path:'/personal',query:{type:'nopwd'}})
                            }else{
                                if(this.$route.query.redirect){
                                    this.$router.replace(this.$route.query.redirect)
                                }else{
                                    if(this.isToPersonal){
                                        this.$router.replace('/personal')
                                    }else{
                                        this.$router.go(-1)     
                                    }
                                }
                            }
                        },1500)
                    // }
                }).catch(() => { this.isLoading = false })        
            },

            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            }        
        },
        created(){
            if(history.length == 1 || history.length == 2){
                this.isToPersonal = true
            }
        },
        beforeRouteEnter (to, from, next) {
            if(from.path == '/personal/setting/forgetPwd'){
                next(vm=>{
                    vm.loginType='byPwd';
                })
            }
            next()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0
}

.login{
    height: 100vh;
    width: 100%;
    background: url('~@/assets/images/personal/login_bg.png') center no-repeat;
    background-size: cover;

    .logo{
        text-align: center;
        padding: 60px 0 50px 0;
        img{
            width: 150px;
        }
    }

    .login_box{
        width: 649px;
        height: 806px;
        margin: 0 auto;
        position: relative;
        img{
            width: 649px;
        }
        .content{
            width: 649px;
            height: 806px;
            position: absolute;
            top: 0;
            left: 0;

            // 切换
            .tab{
                height: 100px;
                width: 100%;
                box-sizing: border-box;
                align-items: center;
                p{
                    height: 100%;
                    width: 50%;
                    line-height: 100px;
                }
            }

            // 输入框
            .input_box{
                margin: 80px 0 60px 0;
                &>div{
                    width: 580px;
                    height: 100px;
                    box-sizing: border-box;
                    margin: 0 auto;
                    margin-bottom: 30px;
                    box-shadow: 0 2.533vw 5.333vw 0.333vw #f3f3f3;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    &>div{
                        display: flex;
                        align-items: center;
                        i{
                           margin-left: 16px; 
                        }
                    }
                    .icon{
                        width: 30px;
                        height: 36px;
                        margin-right: 18px;
                    }
                    input{
                        height: 60px;
                        font-size: 28px;
                        &::placeholder {
                            padding-top: 6px;
                            color: #ababab;
                            font-size: 28px;
                        }
                        &.get_code{
                            max-width: 230px;
                        }
                    }
                    .van-button{
                        height: 56px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #f5ab0b; 
                        border-radius: 10px;  
                        margin-left: 16px;     
                    }
                    .close{
                        width: 26px;
                        margin-left: 18px;
                    }
                }
            }

            // 登录按钮
            .submit_btn{
                padding: 0 20px;
                margin-bottom: 50px;
                .van-button{
                    width: 100%;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;   
                    border: none;
                    box-shadow: 0 1.533vw 5.333vw -0.667vw #f5ab0b8c;
                    .van-button__text,.van-button__loading-text{
                        font-size: 34px;
                    }   
                }
                .van-button--disabled{
                    opacity: 1;
                    background: #ababab;
                    box-shadow: none;
                }
            }

            // 注册协议
            .agreement{
                line-height: 50px;
            }

        }
    }
}

</style>