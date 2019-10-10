<template>
<!-- 消息详情 -->
    <div class="announceDetail bg_white">
        <div class="text_size_32">{{ noticeInfo.name }}</div>
        <div>{{ noticeInfo.createTime }}</div>
        <div>
            <p>{{ noticeInfo.remark }}</p>
        </div>

    </div>
</template>

<script>
    export default {
        data (){
            return {
                noticeInfo: {}
            }
        },
        created(){
            this.noticeInfo = sessionStorage.notice && JSON.parse(sessionStorage.notice)
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0
}

.announceDetail{
    min-height: 100vh;
    padding: 50px 30px;
    &>div{
        &:not(:last-of-type){
            text-align: center;
        }
        &:nth-of-type(2){
            margin: 16px 0 30px 0;
        }
        &:nth-of-type(2),&:nth-of-type(3){
            color: #ababab;
        }
        &:last-of-type{
            line-height: 40px;
        }
        p{
            margin-bottom: 50px;
        }
    }
}
</style>