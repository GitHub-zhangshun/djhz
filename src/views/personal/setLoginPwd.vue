<template>
<!-- 修改登录密码 -->
    <div class="setLoginPwd">
        <header class="bg_white"> <p class="text_size_32">修改登录密码</p> </header>
        <div class="bg_white">
            <input class="text_size_30" v-model="formData.oldPassword" :type="oldEye?'password':'text'" placeholder="请输入原密码">
            <i :class="oldEye?'icon iconfont iconbiyan text_size_30 color_gray':'icon iconfont iconyanjing text_size_30 color_gray'" @click="eye(1)"></i>
        </div>
        <div class="bg_white">
            <input class="text_size_30" v-model="formData.newPassword" :type="newEye?'password':'text'" placeholder="请输入6-16字符的新登录密码">
            <i :class="newEye?'icon iconfont iconbiyan text_size_30 color_gray':'icon iconfont iconyanjing text_size_30 color_gray'" @click="eye(2)"></i>
        </div>
        <van-button :disabled="disabled" :loading="loading" type="default" :class="disabled?'color_white bg_black':'color_white bg_gold'" loading-text="确定" @click="submit">确定</van-button>
        <p class="text_right text_size_28 color_gold" @click="$router.push({path:'/personal/setting/forgetPwd',query:{isLogin:0}})">忘记密码</p>
    </div>
</template>

<script>
import { Button, Toast } from 'vant';
import {checkPwd} from '@/libs/publicFun'
import md5 from 'blueimp-md5'
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                oldEye:true,
                newEye:true,
                loading:false,
                disabled:true,
                formData:{
                    oldPassword:'',
                    newPassword:''
                }
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(){
                    if(this.formData.oldPassword == "" || this.formData.newPassword == ""){
                        this.disabled = true
                        return
                    }
                    this.disabled = false
                }
            }
        },
        methods:{
            eye(index){
                if(index==1){
                    this.oldEye = !this.oldEye
                }
                if(index==2){
                    this.newEye = !this.newEye
                }
            },
            submit(){
                if(this.formData.newPassword.length < 6 || this.formData.newPassword.length > 16){
                    Toast({message:"请输入6-16字符的新登录密码",duration:2000})
                    return
                }
                if(!checkPwd(this.formData.newPassword)){
                    Toast({message:"新登录密码格式不正确",duration:2000})
                    return
                }
                this.loading = true
                this.disabled = true
                this.$axios('user_user_accountpasswordedit',{oldPassword:md5(md5(md5(this.formData.oldPassword))),newPassword:md5(md5(md5(this.formData.newPassword)))})
                .then( data => {
                    this.disabled = false
                    this.loading = false
                    Toast({message:'密码修改成功',duration:1500})
                    setTimeout( ()=>{
                        this.$router.go(-1)
                    },1500)                   
                })
                .catch( () => {
                    this.disabled = false
                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.setLoginPwd{
    margin-top: 18px;
    header {
        padding: 36px 0 68px;                      
        font-weight: bold;
        p{
            padding-left: 38px;
            border-left: 4px #333333 solid;
        }
    }
    &>div{
        height: 102px;
        border-bottom: 2px solid #e2e2e2; 
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input{
            flex: 1;
        }
        input::placeholder{
            padding-top: 8px;
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
            font-size: 30px;
        }
        .van-button__loading-text{
            font-size: 30px
        }
    }
    &>p{
        width: 642px;
        margin: 38px auto 0;
    }
}
</style>