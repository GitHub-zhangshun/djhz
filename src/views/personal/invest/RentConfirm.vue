<template>
<!-- 出租确认 -->
    <div class="rent_confirm bg_base">
        <div class="content">
            <div class="title bg_white text_size_30">黄金Au9999</div>

            <!-- 列表 -->
            <div class="list">
                <div class="bg_white row">
                    <div>
                        <p class="text_size_36">{{ ticketInfo.money || '0.00' }}元</p>
                        <p class="color_gray">购买金额</p>
                    </div>
                    <div>
                        <p class="text_size_36">{{ ticketInfo.weight || 0 }}克</p>
                        <p class="color_gray">克重</p>
                    </div>
                </div>
            </div>

            <!-- 合计 -->
            <div class="total text_size_28 bg_white">
                <div class="row">
                    <p>出租合计克重</p>
                    <p class="color_gold text_size_36">{{ ticketInfo.weight || 0 }}克</p>
                </div>
                <div class="row">
                    <p>实际购买金额合计</p>
                    <p>{{ ticketInfo.totalMoney || '0.00' }}元</p>
                </div>
            </div>

            <!-- 出租期限 -->
            <div class="period text_size_28 bg_white">
                <p class="text_size_32">出租期限</p>
                <div class="row">
                    <p v-for="(item,index) in rentTimeList" :key="index" class="time"  @click="select(item.id)" :class="{current:label==item.id}">{{ item.dayNumber }}天</p>
                </div>
            </div>

            <!-- 预计收益 -->
            <div class="income text_size_28 bg_white">
                <div class="row">
                    <p>年化利率</p>
                    <p>{{ rate }}%</p>
                </div>
                <div class="row">
                    <p class="row help"><label>预期收益</label><img src="@/assets/images/ticket/help.png" @click="seeMore"></p>
                    <p>{{ income }}元</p>
                </div>
            </div>

            <!-- 同意协议 -->
            <p class="agreement text_size_28">
                我已阅读并同意<span class="color_gold" @click="$router.push({path:'/message/annoucementdetail', query:{id:'Rent_back_purchase_agreement', title:'德金惠众出租协议'}})">《德金惠众出租协议》</span>
            </p>
        </div>

        <!-- 底部 --> 
        <div class="footer row text_center bg_gold color_white">
            <van-button @click="submit" :loading="isLoading" loading-text="提交中...">确&nbsp;认</van-button>
        </div>
    </div>
</template>

<script>
import { Dialog } from 'vant'

    export default {
        data(){
            return {
                isLoading: false,  //确认按钮
                label: '', //出租天数选择
                ticketInfo:{},
                rentTimeList:[],   //出租期限
                rate:'',  //年化利率
                income:'',  //预期收益
            }
        },
        watch:{
            label(val){
                if(val){
                    this.rate = this.rentTimeList.filter(item => {return val == item.id })[0].rate
                    let day = this.rentTimeList.filter(item => { return val == item.id })[0].dayNumber
                    this.income = (this.rate/100 * Number(this.ticketInfo.totalMoney)/365 * day).toFixed(2)
                }
            }
        },
        methods: {
            //选择出租天数
            select(id){
                this.label = id
            },

            //查看收益详细
            seeMore(){
                Dialog.alert({
                message: `预期收益=年化利率 * 实际购买金额合计 / 365 * 出租期限<br>注：实际收益≠预期收益<br>以实际收益为准`
                }).then(() => {
                // on close
                });
            },

            //确认出租
            submit(){
                this.isLoading = true;

                this.$axios('center_order_goldorderlease', {orderIds: [this.$route.query.id], termId: this.label, sourceSimplify: 'order_source_h5'})
                .then(data => {
                    console.log(data)
                    this.isLoading = false;
                    this.$router.replace({path:'/personal/success', query:{type:'rent', id: data.result.orderId}})
                }).catch(() => { this.isLoading = false })
            }
        },
        created(){
            this.ticketInfo = sessionStorage.goldInfoToRent && JSON.parse(sessionStorage.goldInfoToRent)

            //获取利率
            this.$axios('center_other_getallrentalrate')
            .then(data => {
                console.log(data)
                this.rentTimeList = data.result
                this.label = data.result[0].id
                this.rate = data.result[0].rate
                this.income = (data.result[0].rate/100 * Number(this.ticketInfo.totalMoney)/365 * data.result[0].dayNumber).toFixed(2)
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.rent_confirm{
    .content{
        height: calc(100vh - 100px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .title{
            height: 100px;
            line-height: 100px;
            padding: 0 30px;
            border: 1px solid #e3e3e3;
        }
        .list{
            &>div{
                border-bottom: 1px dashed #e3e3e3;
                &:last-of-type{
                    border: none;
                }
                padding: 36px 40px;
                &>div{
                    width: 50%;
                    p{
                        &:first-of-type{
                            margin-bottom: 18px;
                        }
                    }
                }
            }
        }
        .total{
            padding: 50px 30px;
            margin: 18px 0; 
            &>div{
                justify-content: space-between;
                &:first-of-type{
                    margin-bottom: 30px;
                }
            }
        }
        .period{
            padding: 46px 30px 36px 30px;
            margin-bottom: 18px;
            &>div{
                flex-wrap: wrap;
                margin-top: 20px;
                padding-left: 12px;
                .time{
                    width: 200px;
                    height: 68px;
                    line-height: 68px;
                    border: 1px solid #aaa;
                    border-radius: 10px;
                    text-align: center;
                    margin: 10px 0;
                    position: relative;
                    margin-right: 22px;
                    &.current{
                        color: #fff;
                        background: #f5ab0b;
                        border: 1px solid #f5ab0b;
                    }
                }
            }
        }
        .income{
            padding: 46px 30px;
            &>div{
                justify-content: space-between;
                &:first-of-type{
                    margin-bottom: 26px;
                }
                .help{
                    align-items: center;
                    img{
                        width: 30px;
                        height: 30px;
                        margin-left: 12px;
                    }
                }
            }
        }
        //同意协议
        .agreement{
            text-align: center;
            padding: 30px 0;
        }
    }

     // 底部 提交订单
    .footer{
        position: fixed;
        bottom: 0;
        height: 100px;
        width: 100%;  
        .van-button{
            width: 100%;
            height: 100%;
            line-height: 100px;
            background: #f5ab0b;
            color: #fff;
            .van-button__text,.van-button__loading-text{
                font-size: 30px;
            }   
        }
    }
}

</style>