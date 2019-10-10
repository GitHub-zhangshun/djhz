<template>
    <div class="reset_trade_password">
        <ul class="bg_white">
            <li>
                <span class="text_size_28">手机号码：{{phone}}</span>
            </li>
            <li>
                <van-field v-model="formData.validateCode" placeholder="请输入短信验证码" />                
                <button :class="canClick?'color_gold':'color_gray'" @click="send_code">{{content}}</button>
            </li>
            <li>
                <van-field
                type="password"
                readonly
                clickable
                :value="formData.password"
                @touchstart.native.stop="show = true"
                placeholder="请设置6位数字的新交易密码"
                />
                <van-number-keyboard
                :transition="false"
                :show="show"
                @input="onInput"
                @delete="onDelete"
                @blur="show = false"
                />
            </li>
        </ul>
        <van-button round :disabled="disabled" :loading="loading" :class="disabled?'bg_gray color_white':' bg_gold color_white'" @click="submit">确定</van-button>
        
    </div>
</template>

<script>
import { deleteToken } from '@/libs/auth'
import { Button , Field, Toast , NumberKeyboard } from 'vant'
import md5 from 'blueimp-md5'
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button,
            'van-field':Field,
            'van-number-keyboard':NumberKeyboard
        },
        data(){
            return{
                show:false,
                phone:'',
                formData:{
                    validateCode:'',
                    password:''
                },
                canClick:true,//验证码点击标识
                totalTime:60,//倒计时总值
                content:'获取验证码',
                clock:null,//定时器
                disabled:true,
                loading:false,
                value:''
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(){
                    this.disabled = false
                    if(this.formData.validateCode == '' || this.formData.password.length != 6){
                        this.disabled = true
                    }
                }
            }
        },
        created(){
            if(sessionStorage.getItem('userInfo')){
                this.phone = JSON.parse(sessionStorage.userInfo).hidePhone
            }else{
                sessionStorage.clear()
                localStorage.clear()
                deleteToken()
                this.$router.push('/login')
            }
        },
        methods:{
            onInput(key) {
                this.formData.password = (this.formData.password + key).slice(0, 6);
            },
            onDelete() {
                this.formData.password = this.formData.password.slice(0, this.formData.password.length - 1);
            },
            send_code(){
                if (!this.canClick) return  //改动的是这两行代码
                this.canClick = false
                this.$axios('center_user_currverifycodesend',4)
                .then(data => {
                    this.content = this.totalTime + '秒'
                    this.clock = window.setInterval(() => {
                        this.totalTime--
                        this.content = this.totalTime + '秒'
                        if (this.totalTime < 0) {                           
                            window.clearInterval(this.clock)
                            this.content = '重新获取'
                            this.totalTime = 60
                            this.canClick = true  //这里重新开启
                        }
                    },1000)
                })
                .catch( () => {
                    this.canClick = true
                })
            },
            submit(){
                this.loading = true
                this.$axios('center_user_accounttranpasswordedit',{validateCode:this.formData.validateCode,password:md5(md5(md5(this.formData.password)))})
                .then( data => {
                    this.loading = false
                    Toast({message:'交易密码修改成功',duration:1500})
                    setTimeout( ()=>{
                        this.$router.go(-1)
                    },1500)
                })
                .catch( () => {
                    this.loading = false    
                })
            }
        }
    }
</script>

<style scoped lang='less'>
.reset_trade_password{   
    min-height: calc(100vh - 20px);
    ul{        
        margin-top: 20px;
        li{
            padding: 0 32px;
            border-bottom: 2px solid #eef3f4;
            display: flex;
            align-items: center;
            /deep/.van-cell{
                flex: 1;
                padding: 0;
                .van-cell__value{
                    .van-field__body{                       
                        .van-field__control{
                            height: 102px;
                            font-size: 28px;
                        }
                        .van-field__control::placeholder{
                            padding-top: 10px;
                            font-size: 28px;
                        }
                    }
                }
            }
            .van-cell::after{
                border: none;
            }
            button{
                background: transparent;                
            }
            span{
                line-height: 102px;
            }
            /deep/.van-number-keyboard{
                .van-number-keyboard__body{
                    i{
                        height: 108px;
                        line-height: 108px;
                        font-size: 40px;
                        color: #000000;
                    }
                    i:last-child{
                        font-size: 32px;
                    }
                }
            }
        }
    }
    /deep/.van-button{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 50px auto 0;
        // margin-top: 50px;
        height: 92px;
        width: 642px;
    }
}
</style>