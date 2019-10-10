<template>
<!-- 修改手机号最后一步 -->
    <div class="changePhone">
        <header class="bg_white"> <p class="text_size_32">新手机号码</p> </header>
        <div class="top bg_white">
            <input type="tel" placeholder="请输入新的手机号码" class="phone text_size_28" v-model="formData.phone">
            <div class="code">
                <input type="text" placeholder="请输入验证码" class="text_size_28" v-model="formData.code">
                <button :class="canClick?'text_size_28 bg_white color_gold':'text_size_28 bg_white color_gray'" @click="sendCode">{{content}}</button>
            </div>
        </div>
        <van-button :loading="loading" :disabled="disabled" type="default" @click="submit" loading-text="确定" :class="disabled?'color_white bg_black':'color_white bg_gold'">确定</van-button>
    </div>
</template>

<script>
import { Button, Toast } from 'vant';
import {checkPhone} from '@/libs/publicFun'
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                loading:false,
                formData:{
                    phone:'',
                    code:''
                },
                content: '发送验证码',
                totalTime: 60,
                canClick: true, //添加canClick
                disabled:true,
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(){
                    this.disabled = false
                    if(this.formData.code=='' || this.formData.phone==''){
                        this.disabled = true
                    }
                }
            }
        },
        methods:{
            sendCode(){
                if(!checkPhone(this.formData.phone)){
                    Toast({message:'手机号格式不正确'})
                    return
                }               
                if (!this.canClick) return  //改动的是这两行代码
                this.canClick = false
                this.content = this.totalTime + 's'
                let clock = window.setInterval(() => {
                    this.totalTime--
                    this.content = this.totalTime + 's'
                    if (this.totalTime < 0) {
                        window.clearInterval(clock)
                        this.content = '重新发送验证码'
                        this.totalTime = 60
                        this.canClick = true  //这里重新开启
                    }
                },1000)
                this.$axios(
                    'center_user_verifycodesend',
                    {phone:this.formData.phone, type:3}
                )
                .then(data => {
                    if(data.code!=0){
                        Toast({message:data.msg,duration:2000});
                    }
                })
            },
            submit(){
                if(!checkPhone(this.formData.phone)){
                    Toast({message:'手机号格式不正确',duration:2000})
                    return
                } 
                this.loading = true
                this.$axios('center_user_accountphoneedit',{phone:this.formData.phone,validateCode:this.formData.code})
                .then(res=>{
                    this.loading = false
                    Toast({message:'手机号修改成功',duration:2000})
                    this.$router.go(-2)
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
.changePhone{
    margin-top: 18px;
    header {
        padding: 36px 0 20px;                      
        font-weight: bold;
        p{
            padding-left: 38px;
            border-left: 4px #333333 solid;
        }
    }
    input::placeholder{
        padding-top: 8px;
    }
    .code{
            height: 96px;
            border-top: 2px solid #e2e2e2;
            border-bottom: 2px solid #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            // padding: 0 32px;
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
}
</style>