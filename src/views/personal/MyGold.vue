<template>
<!-- 我的金库 -->
    <div class="my_gold bg_base">
        <div id="main" class="bg_white"></div>

        <div class="center text_center">
            <p class="color_gray mb18">黄金总克数&nbsp;(克)</p>
            <p class="color_gold text_size_46">{{ myGoldInfo.goldWeightSum || 0 }}</p>
        </div>

        <div class="row hei180 total_income">
            <div>
                <p class="color_gray">累计已收收益&nbsp;(元)</p>
                <p class="text_bold text_size_40">{{ myGoldInfo.receiveProfit || '0.00' }}</p>
            </div>
            <div>
                <p class="color_gray">累计获得优惠金&nbsp;(元)</p>
                <p class="text_bold text_size_40">{{ myGoldInfo.receiveInterest || '0.00' }}</p>
            </div>
        </div>

        <div class="row wait_confirm hei180">
            <div>
                <p class="color_gray mb18">待确认黄金&nbsp;(克)</p>
                <p class="text_size_36">{{ myGoldInfo.confirmGold || 0 }}</p>
            </div>
            <div>
                <van-button round class="normal" @click="$router.push('/personal/invest/goldticket')">提货</van-button>
                <van-button round class="another" @click="$router.push('/personal/invest/goldticket')">出租</van-button>
            </div>
        </div>

        <div class="row hei180 to_ticket" @click="$router.push('/personal/invest/rentticket')">
            <div>
                <p class="color_gray mb18">出租中黄金&nbsp;(克)</p>
                <p class="text_size_36">{{ myGoldInfo.leaseingGold || 0 }}</p>
            </div>
            <div class="row path">
                <div>
                    <p class="color_gray mb18">预计待收收益&nbsp;(元)</p>
                    <p class="text_size_36">{{ myGoldInfo.unreceiveProfit || '0.00'}}</p>
                </div>
                <img src="@/assets/images/ticket/path.png">
            </div>
        </div>

        <div class="row hei180 to_ticket" @click="$router.push({path: '/personal/ticket', query:{title:'预约订单'}})">
            <div>
                <p class="color_gray mb18">预约中黄金&nbsp;(克)</p>
                <p class="text_size_36">{{ myGoldInfo.reserveGold || 0 }}</p>
            </div>
            <div class="row path">
                <div>
                    <p class="color_gray mb18">预计获得优惠金&nbsp;(元)</p>
                    <p class="text_size_36">{{ myGoldInfo.unreceiveInterest || '0.00' }}</p>
                </div>
                <img src="@/assets/images/ticket/path.png">
            </div>
        </div>

    </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/pie');
// 引入提示框
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend')
import { Toast } from 'vant';

    export default {
        data() {
            return {
                option: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        y: 'bottom',
                        top: '82%',
                        itemHeight : 10,
                        itemWidth : 10,
                        itemGap: 30,
                        data:['待确认','出租中','预约中']
                    },
                    series: [
                        {
                            name:'黄金克重',
                            type:'pie',
                            center: ['50%', '42%'],
                            radius: ['48%', '60%'],
                            avoidLabelOverlap: false,   
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                               
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            color: ['#f5ab0a', '#2cbb7d', '#83b4ef'],
                            startAngle: [-90],
                            data:[
                                {value:0, name:'待确认'},
                                {value:0, name:'出租中'},
                                {value:0, name:'预约中'},
                            ]
                        }
                    ]
                },
                myGoldInfo:{},   //金库数据
            }
        },
        mounted(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //我的金库
            this.$axios('order_goldorder_userpersonalvault')
            .then(data => {
                Toast.clear()

                data.result.receiveProfit = data.result.receiveProfit && data.result.receiveProfit.toFixed(2)
                data.result.receiveInterest = data.result.receiveInterest && data.result.receiveInterest.toFixed(2)
                data.result.unreceiveProfit = data.result.unreceiveProfit && data.result.unreceiveProfit.toFixed(2)
                data.result.unreceiveInterest = data.result.unreceiveInterest && data.result.unreceiveInterest.toFixed(2)
                this.myGoldInfo = data.result

                if(this.myGoldInfo.goldWeightSum == 0){
                    this.option.series[0].color = ['#ababab']
                }
                
                this.option.series[0].data[0].value = this.myGoldInfo.confirmGold
                this.option.series[0].data[1].value = this.myGoldInfo.leaseingGold
                this.option.series[0].data[2].value = this.myGoldInfo.reserveGold
                    
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('main'))
                myChart.setOption(this.option)

            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.my_gold{
    min-height: 100vh;
    position: relative;
    #main{
        width: 100%;
        height: 504px;
        box-sizing: border-box;
        border-bottom: 1px solid #e2e2e2;
    }

    .center{
        position: absolute;
        top: 174px;
        left: 50%;
        transform: translateX(-50%)
    }

    .hei180{
        height: 180px;
        background: #fff;
        margin-bottom: 18px;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        .path{
            align-items: center;
            div{
                margin-right: 120px;
            }
            img{
                width: 20px;
            }
        }
    }
    .to_ticket{
        &:active{
            background: #e2e2e2;
        }
    }
    .mb18{
        margin-bottom: 18px;
    }

    .total_income{
        &>div{
            p{
                &:first-of-type{
                    margin-bottom: 24px;
                }
            }
        }
    }

    .wait_confirm{
        .van-button{
            width: 160px;
            height: 68px;
            line-height: 68px;
            margin-left: 18px;
            .van-button__text{
                font-size: 28px;
            }
            &.normal{
                border: 1px solid #ccc;
            }
            &.another{
                color: #fff;
                background: #f5ab0b;
            }
        }
    }
}

</style>