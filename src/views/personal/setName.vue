<template>
<!-- 设置昵称 -->
    <div class="setName">
        <van-field
            v-model="setName"
            type="text"
            label="昵称"
            placeholder="请设置1-10个字符的昵称"
        />
        <van-button @click="submit" :disabled="disabled" :class="disabled?'bg_black color_white':'bg_gold color_white'" :loading="loading" loading-text="确认" type="default">确认</van-button>
    </div>
</template>

<script>
import { Button,Field,Toast  } from 'vant';
import { setTimeout } from 'timers';
    export default {
        components:{
            'van-button':Button,
            'van-field':Field
        },
        data(){
            return{
                loading:false,
                disabled:true,
                setName:''
            }
        },
        watch:{
            setName(){
                if(this.setName==''){
                    this.disabled = true
                    return
                }
                this.disabled = false
            }
        },
        created(){
            if(this.$route.query.name){
                this.setName = this.$route.query.name
            }
        },
        methods:{
            submit(){
                if(this.setName.length>10){
                    Toast({message:'请设置1-10个字符的昵称',duration:2000})
                    return
                }
                this.loading = true
                this.$axios('user_user_usernickedit',this.setName)
                .then( res => {
                    this.loading = false
                    Toast({message:'修改成功',duration:2000})
                    setTimeout( () => {
                        this.$router.go(-1)
                    },2000)                    
                })
                .catch( () => {this.loading = false})
            }
        }
    }
</script>

<style scoped lang="less">
.setName{
    padding-top: 18px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    /deep/.van-cell{
        padding-top: 0;
        padding-bottom: 0;
        height: 102px;
        display: flex;
        align-items: center;
        margin-bottom: 82px;
        .van-cell__title{
            span{
                font-size: 28px;
            }
        }
        .van-cell__value{
            .van-field__body{
                input{
                    font-size: 28px;
                }
                input::placeholder{
                    padding-top: 8px;
                }
            }
        }
    }
    .van-button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 680px;
        height: 90px;
        border-radius: 90px;
        span{
            font-size: 30px;
        }
    }
}
</style>