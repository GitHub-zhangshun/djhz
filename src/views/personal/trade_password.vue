<template>
    <div class="trade_password bg_white">
        <p class="text_center text_size_32 setting">设置交易密码</p>
        <p class="text_size_28 text_center">为了您的资金安全，请设置六位数字交易密码</p>
        <!-- <van-field type="password" max="6" @focus="showKeyboard = true" v-model="value" placeholder="请设置6位数字的新交易密码" /> -->
        <van-password-input
        :value="value"
        @focus="showKeyboard = true"
        />

        <!-- 数字键盘 -->
        <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
        :transition="false"
        />
        <van-button round :disabled="disabled" :loading="loading" :class="disabled?'bg_gray color_white':' bg_gold color_white'" @click="submit">确定</van-button>
    </div>
</template>

<script>
import { Field , NumberKeyboard , PasswordInput , Button ,Toast } from 'vant';
import { setTimeout } from 'timers';
import md5 from 'blueimp-md5'
    export default {
        components:{
            'van-field':Field,
            'van-number-keyboard':NumberKeyboard,
            'van-password-input':PasswordInput
        },
        data(){
            return{
                value: '',
                showKeyboard: false,
                disabled:true,
                loading:false
            }
        },
        methods: {
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            submit(){
                this.loading = true
                this.$axios('user_user_accounttranpasswordset',md5(md5(md5(this.value))))
                .then( data => {
                    this.loading = false
                    Toast({message:'设置成功',duration:2000})
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },2000)
                })
                .catch( () => {
                    this.loading = false
                })
            }
        },
        watch:{
            value(){
                this.disabled = true
                if(this.value.length == 6){
                    this.disabled = false
                }
            }
        }
    }
</script>

<style scoped lang='less'>
.trade_password{
    min-height: calc(100vh - 200px);
    padding-top: 200px;
    .setting{
        font-weight: bold;
    }
    p{
        padding: 0 32px;
        margin: 0;
        line-height: 50px;
    }
    /deep/.van-password-input{
        width: 642px;
        margin: 50px auto 0;
        ul{
            height: 80px;
            li{
                border: 1px solid #ababab;
                i{
                    width: 20px;
                    height: 20px;
                    transform: translate(-50%,-50%);
                    margin: 0;
                }
            }
            li{
                border-right: none;
            }
            li:last-child{
                border-right:1px solid #ababab;
            }
        }
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