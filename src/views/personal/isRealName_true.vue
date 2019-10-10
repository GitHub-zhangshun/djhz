<template>
<!-- 已认证 -->
    <ul>
        <li class="bg_white text_size_28">
            <span class="color_black">真实姓名</span>
            <span class="color_gray">{{name}}</span>
        </li>
        <li class="bg_white text_size_28">
            <span class="color_black">身份证号码</span>
            <span class="color_gray">{{idCard}}</span>
        </li>
    </ul>
</template>

<script>
import { Toast } from 'vant';
    export default {
        data(){
            return{
                idCard:'',
                name:''
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
            .then( data => {
                Toast.clear()
                this.idCard = data.result.idCard
                this.name = data.result.name
            })
            .catch( () => {
                Toast.clear()
            })
        }
    }
</script>

<style scoped lang="less">
ul{
    padding-top: 20px;
    li{
        padding: 0 42px;
        display: flex;
        justify-content: space-between;
        line-height: 102px;
        border-bottom: 2px solid #eef3f4;
    }
}
</style>