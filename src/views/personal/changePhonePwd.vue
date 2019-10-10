<template>
<!-- 更换登录手机号第一步 -->
    <div class="changePhonePwd">
        <header class="bg_white"> <p class="text_size_32">验证登录密码</p> </header>
        <div class="bg_white">
            <input class="text_size_30" :type="isEyeOpen?'password':'text'" v-model="pwd" placeholder="请输入登录密码">
            <i :class="isEyeOpen?'icon iconfont iconbiyan text_size_30 color_gray':'icon iconfont iconyanjing text_size_30 color_gray'" @click="eye"></i>
        </div>
        <van-button :loading="loading" :disabled="disabled" type="default" :class="disabled?'color_white bg_black':'color_white bg_gold'" loading-text="下一步" @click.native="passwordverify">下一步</van-button>
        <p class="text_right text_size_28 color_gold" @click="$router.push({path:'/personal/setting/forgetPwd',query:{isLogin:0}})">忘记密码</p>
    </div>
</template>

<script>
import { Button, Toast } from 'vant';
import md5 from 'blueimp-md5'
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                isEyeOpen:true,
                loading:false,
                disabled:true,
                pwd:''
            }
        },
        watch:{
            pwd(){
                if(this.pwd==''){
                    this.disabled = true
                    return
                }
                this.disabled = false
            }
        },
        methods:{
            eye(){
                this.isEyeOpen = !this.isEyeOpen
            },
            passwordverify(){
                this.loading = true
                this.$axios('user_user_passwordverify',md5(md5(md5(this.pwd))))
                .then( res => {
                    this.loading = false
                    this.$router.push('/personal/setting/changePhone')
                })
                .catch( () => {
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
.changePhonePwd{
    margin-top: 18px;
    header {
        padding: 36px 0 20px;                      
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