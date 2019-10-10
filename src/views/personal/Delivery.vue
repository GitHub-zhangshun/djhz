<template>
<!-- 物流详情 -->
    <div class="delivery bg_base">
        <div class="top">
            <img src="@/assets/images/personal/state_bg.png" >
            <div class="text_size_30 state">
                <p>快递公司：{{ traceInfo.exprName }}</p>
                <p>快递单号：{{ traceInfo.exprCode }}</p>
            </div>

            <div class="bg_white info">
                <van-steps direction="vertical" :active="active" active-icon="checked" active-color="#f5ab0b">
                    <van-step v-for="(item,index) in traceInfo.traceDetail" :key="index">
                        <h3>{{ item.opDesc }}</h3>
                        <p>{{ item.opLocation }}</p>
                        <p>{{ item.opTime }}</p>
                    </van-step>
                </van-steps>
            </div>
        </div>
    </div>
</template>

<script>
import { Step, Steps, Toast } from 'vant';

    export default {
        components: {
            'van-steps': Steps,
            'van-step': Step
        },
        data(){
            return {
                active: 0,
                traceInfo:{}  //物流信息
            }
        },
        created(){
            //请求物流信息
              Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            let url = 'center_order_orderlogisticsinfo'
            if(this.$route.query.type == 'take'){
                url = 'center_order_orderlogisticsinfo'
            }
            
            this.$axios(url, this.$route.query.id)
            .then(data => {
                Toast.clear()
                // if(data.code != 0){
                //     Toast({message:data.msg, duration:2000})
                // }else{
                    this.traceInfo = data.result
                // }
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.delivery{
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .top{
        position: relative;
        margin-bottom: 120px;
        &>img{
            height: 260px;
            width: 100%;
        }
        &>div{
            position: absolute;
            top: 50px;
            left: 40px;
            line-height: 44px;
            &.state{
                p{
                    line-height: 50px;
                }
            }
            &.info{
                border-radius: 10px;
                top: 180px;
                left: 20px;
                width: 710px;
                box-sizing: border-box;
                padding: 50px 36px;
                /deep/.van-steps{
                    .van-step--finish{
                        .van-step__circle-container{
                            .van-step__circle{
                                background: #f5ab0b;
                            }
                        }
                        .van-step__line{
                            background: #f5ab0b;
                        }
                    }
                    .van-step--vertical.van-step--process .van-icon{
                        font-size: 24px;
                        left: -26px;
                        top: 46px;
                    }
                    .van-step__circle{
                        width: 14px;
                        height: 14px;
                        left: -21px;
                        top: 52px;
                    }
                    .van-step__line{
                        top: 66px;
                    }
                    .van-step--vertical{
                        padding: 10px 20px;
                        font-size: 26px;
                        line-height: 20px;
                        .van-step__title{
                            p{
                                line-height: 36px;
                                margin: 10px 0;
                            }
                        }
                    }
                }
                .van-step--vertical:not(:last-child):after{
                    border: none;
                }
            }
        }
    }
}

</style>