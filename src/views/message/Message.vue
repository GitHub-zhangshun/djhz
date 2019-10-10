<template>
<!-- 消息 -->
    <div class="message bg_base">
        <div class="row top text_size_30">
            <p @click="select('/message/announcement')" :class="{current:label == '/message/announcement'}">公告</p>
            <p @click="select('/message/notice')" :class="{current:label == '/message/notice'}">提醒&nbsp;<span v-if="isShowDot" class="circle bg_gold"></span></p>
        </div>

        <!-- 内容 -->
        <router-view></router-view>
    </div>
</template>

<script>
import { getToken } from '@/libs/auth'

    export default {
        data(){
            return {
                label:'',
                isShowDot: false
            }
        },
        methods: {
            select(lab){
                this.label = lab
                this.$router.push(lab)
            }
        },
        created(){
            this.label = this.$route.path

            if(getToken()){
                this.$axios('user_message_messageunreadcount')
                .then(data => {
                    if(data.result > 0){
                        this.isShowDot = true
                    }else{
                        this.isShowDot = false
                    }
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.message{
    height: 100vh;
    .top{
        height: 100px;
        text-align: center;
        padding: 26px 0;
        box-sizing: border-box;
        background: #fff;
        margin-bottom: 18px;
        p{
            width: 50%;
            line-height: 2;
            &:first-of-type{
                border-right: 1px solid #ccc;
            }
            &.current{
                color: #f5ab0b;
            }
            .circle{
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                position: relative;
                top: -16px;
            }
        }
    }
}

</style>