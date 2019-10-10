<template>
<!-- 设置密码 -->
    <div class="setPassword">
        <input type="password" placeholder="请设置6-16字符的登录密码" v-model="pwd">
        <van-button :disabled="disabled" @click="submit" :class="disabled?'bg_black color_white':'bg_gold color_white'" :loading="loading" loading-text="确认" type="default">确认</van-button>
    </div>
</template>

<script>
import md5 from 'blueimp-md5'
import { Button,Toast } from 'vant';
import { checkPwd } from '@/libs/publicFun'
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button,
        },
        data(){
            return{
                loading:false,
                disabled:true,
                pwd:''
            }
        },
        watch:{
            pwd(){
                this.disabled = true
                if(this.pwd.length>=6 && this.pwd.length<=16){
                    this.disabled = false
                }
            }
        },
        methods:{
            submit(){
                this.loading = true
                this.$axios('user_user_accountpasswordset',md5(md5(md5(this.pwd))))
                .then( res => {
                    this.loading = false                    
                    Toast({message:'设置成功',duration:2000})
                    setTimeout( () => {
                        this.$router.go(-1)
                    }) 
                })
                .catch( () => {
                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped lang="less">
.setPassword{
    padding-top: 18px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    input{
        padding-left: 32px;
        width: 100%;
        height: 102px;
        font-size: 30px;
        margin-bottom: 82px;
    }
    input::placeholder{
        padding-top: 10px;
    }
    .van-button{
        width: 680px;
        height: 90px;
        border-radius: 90px;
        span{
            font-size: 30px;
        }
    }
}
</style>