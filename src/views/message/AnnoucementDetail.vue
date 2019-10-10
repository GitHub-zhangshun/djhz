<template>
<!-- 公告详情 -->
    <div class="announceDetail bg_white">
        <div class="content" v-html="detailInfo.content" :class="{agree:$route.query.title !== '公告详情'}"> </div>
    </div> 
</template>

<script>
    export default {
        data(){
            return {
                content:'',
                detailInfo:{}
            }
        },
        created(){
            this.$axios('run_run_contentdetail',this.$route.query.id)
            .then(data => {
                console.log(data)
                data.result.createTime = data.result.createTime && data.result.createTime.replace('T', ' ')
                this.detailInfo = data.result
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">


.announceDetail{
    min-height: 100vh;
    padding: 10px 30px;
    box-sizing: border-box;
    &>div{
        &:not(:last-of-type){
            text-align: center;
        }
        &:nth-of-type(2){
            margin: 22px 0 30px 0;
            color: #ababab;
        }
    }
    /deep/.content{
        img{
            max-width: 100%;
        }
    }
    .agree{
        line-height: 1.5;
    }
}
</style>