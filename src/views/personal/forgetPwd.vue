<template>
<!-- 忘记密码 -->
    <div class="forgetPwd">
        <div class="top bg_white">
            <p class="text_size_28" v-if="showPhone=='0'">手机号码：{{text}}</p>
            <input type="tel" placeholder="请输入手机号码" class="phone text_size_28" v-model="formDate.phone" v-if="showPhone=='1'">
            <div class="code">
                <input type="tel" placeholder="请输入验证码" class="text_size_28" v-model="formDate.code">
                <button :class="disabled_code?'text_size_28 bg_white color_gray':'text_size_28 bg_white color_gold'" @click="sendCode" :disabled="disabled_code">{{content}}</button>
            </div>
            <input type="password" class="text_size_28 pwd" v-model="formDate.pwd" placeholder="请设置6-16字符的新登录密码">
        </div>
        <van-button :disabled="disabled" :loading="loading" type="default" loading-text="确定" @click="submit" :class="disabled?'color_white bg_black':'color_white bg_gold'">确定</van-button>
    </div>
</template>

<script>
import { Button,Toast } from 'vant';
import {checkPhone} from '@/libs/publicFun'
import { deleteToken } from '@/libs/auth'
import md5 from 'blueimp-md5'
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                showPhone:'-1',//0：已登录，1：未登录
                loading:false,
                text:'',
                content: '发送验证码',
                totalTime: 60,
                formDate:{
                    phone:'',
                    code:'',
                    pwd:''
                },
                disabled_code:false,
                disabled:true
            }
        },
        watch:{
            formDate:{
                deep:true,
                handler(){
                    this.disabled = false
                    if(this.$route.query.isLogin == 0){
                        if(this.formDate.code=='' || this.formDate.pwd==''){
                            this.disabled = true
                        }
                    }else{
                        if(this.formDate.phone=='' || this.formDate.code=='' || this.formDate.pwd==''){
                            this.disabled = true
                        }
                    }   
                }
            }
        },
        methods:{
            sendCode(){
                this.disabled_code = true
                if(this.$route.query.isLogin==0){
                    this.$axios('center_user_currverifycodesend',2)
                    .then(data => {
                        this.content = this.totalTime + 's'
                        let clock = window.setInterval(() => {
                            this.totalTime--
                            this.content = this.totalTime + 's'
                            if (this.totalTime < 0) {
                                window.clearInterval(clock)
                                this.content = '重新发送验证码'
                                this.totalTime = 60
                                this.disabled_code = false  //这里重新开启
                            }
                        },1000)
                    })
                    .catch( () => {
                        this.disabled_code = false  //这里重新开启
                    })
                }else{
                    if(!checkPhone(this.formDate.phone)){
                        this.disabled_code = false  //这里重新开启
                        Toast({message:'手机号格式不正确',duration:2000})
                        return
                    }                                  
                    this.$axios(
                        'center_user_verifycodesend',
                        {phone:this.formDate.phone, type:2}
                    )
                    .then(data => {
                        this.content = this.totalTime + 's'
                        let clock = window.setInterval(() => {
                            this.totalTime--
                            this.content = this.totalTime + 's'
                            if (this.totalTime < 0) {
                                window.clearInterval(clock)
                                this.content = '重新发送验证码'
                                this.totalTime = 60
                                this.disabled_code = false  //这里重新开启
                            }
                        },1000)
                    })
                    .catch( () => {
                        this.disabled_code = false  //这里重新开启
                    })
                }      
                         
            },
            submit(){
                if(this.$route.query.isLogin==0){
                    if(this.formDate.pwd.length<6 || this.formDate.pwd.length>16){
                        Toast({message:'请设置6-16字符的新登录密码',duration:2000})
                        return
                    }
                    this.loading = true
                    this.$axios('center_user_accountpasswordrecovered',{password:md5(md5(md5(this.formDate.pwd))),validateCode:this.formDate.code})
                    .then( res => {
                        this.loading = false

                        
                        Toast({message:'密码修改成功',duration:2000})
                        setTimeout( () => {
                            this.$router.go(-1)
                        },2000)
                    })
                    .catch( () => {
                        this.loading = false
                    })
                }else{
                    if(!checkPhone(this.formDate.phone)){
                        Toast({message:'手机号格式不正确',duration:2000})
                        return
                    }
                    if(this.formDate.pwd.length<6 || this.formDate.pwd.length>16){
                        Toast({message:'请设置6-16字符的新登录密码',duration:2000})
                        return
                    }
                    this.loading = true
                    this.$axios('center_user_accountpasswordforget',{phone:this.formDate.phone,password:md5(md5(md5(this.formDate.pwd))),validateCode:this.formDate.code})
                    .then( res => {
                        this.loading = false
                        
                        Toast({message:'密码修改成功',duration:2000})
                        setTimeout( () => {
                            this.$router.go(-1)
                        },2000)
                        
                    })
                    .catch( () => {
                        this.loading = false
                    })
                }
            }
        },
        created(){
            if(this.$route.query.isLogin==0){
                this.showPhone = 0
                if(sessionStorage.getItem('userInfo')){
                    this.text = JSON.parse(sessionStorage.userInfo).hidePhone
                }else{
                    sessionStorage.clear()
                    localStorage.clear()
                    deleteToken()
                    this.$router.push('/login')
                }
            }else{
                this.showPhone = 1
            }
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.forgetPwd{
    margin-top: 18px;
    .top{
        input::placeholder{
            padding-top: 8px;
        }  
        p{
            padding: 0 32px;
            line-height: 100px;
            border-bottom: 2px solid #e2e2e2;
        }
        .phone{
            border-bottom: 2px solid #e2e2e2;
        }
        .code{
            height: 96px;
            border-bottom: 2px solid #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            input{
                flex:1;
                padding-left: 32px;
            }
            
            button{
                margin-right: 32px;
            }
        }
        .pwd,.phone{
            padding: 34px 32px;
            width: calc(100% - 64px)
        }
    }
    .van-button{
        margin: 82px auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 642px;
        height: 90px;
        border-radius: 90px;
        .van-button__text{
            width: 100%;
            font-size: 30px;
        }
        .van-button__loading-text{
            font-size: 30px
        }
    }
}
</style>