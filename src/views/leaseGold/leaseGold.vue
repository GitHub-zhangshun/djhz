<template>
<!-- 黄金租赁 -->
    <div class="leaseGold">
        <div class="leaseGoldContent">
            <header>
                <div class="bgImg">
                    <img src="@/assets/images/leaseGold/bg.png" alt="">
                </div>
                <div class="content">
                    <span class="text_size_28" @click="$router.push('/myLease')">我的租赁</span>
                    <div class="bg_white">
                        <h2 class="text_size_30">黄金租赁</h2>
                        <p class="text_size_30">产品简介Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                    </div>
                </div>
            </header>
            <div class="product_advantage">
                <div class="title">
                    <img src="@/assets/images/leaseGold/left.png" alt="">
                    <span class="text_size_30 color_black">产品优势</span>
                    <img src="@/assets/images/leaseGold/right.png" alt="">
                </div>
                <ul>
                    <li>
                        <img src="@/assets/images/leaseGold/adv1.png" alt="">
                        <p class="text_size_28">短期黄金面临波动，企业把短期内要生产的黄金提前销售</p>
                    </li>
                    <li>
                        <img src="@/assets/images/leaseGold/adv2.png" alt="">
                        <p class="text_size_28">企业借入黄金，通过销售获得资金，用于经营和投资，用未来的黄金产量做归还</p>
                    </li>
                    <li>
                        <img src="@/assets/images/leaseGold/adv3.png" alt="">
                        <p class="text_size_28">看空黄金市场，借入黄金卖空黄金价格，待市场回调后，再补回</p>
                    </li>
                </ul>
            </div>
            <div class="application_process">
                <div class="title">
                    <img src="@/assets/images/leaseGold/left.png" alt="">
                    <span class="text_size_30 color_black">申请流程</span>
                    <img src="@/assets/images/leaseGold/right.png" alt="">
                </div>
                <div class="steps">
                    <ul>
                        <li class="bg_white">
                            <div>
                                <img src="@/assets/images/leaseGold/icon_bg.png" alt="">
                                <span class="text_size_24 color_gold">01</span>
                            </div>
                            <p class="text_size_28">线上提交订单，提交成功后我们会有专门的业务人员与您联系</p>
                        </li>
                        <li class="bg_white">
                            <div>
                                <img src="@/assets/images/leaseGold/icon_bg.png" alt="">
                                <span class="text_size_24 color_gold">02</span>
                            </div>
                            <p class="text_size_28">线下签订租赁合约，当面签收黄金</p>
                        </li>
                        <li class="bg_white">
                            <div>
                                <img src="@/assets/images/leaseGold/icon_bg.png" alt="">
                                <span class="text_size_24 color_gold">03</span>
                            </div>
                            <p class="text_size_28">到期日或客户提前归还，完成相应的租赁费和黄金的清算</p>
                        </li>
                        <li class="bg_white">
                            <div>
                                <img src="@/assets/images/leaseGold/icon_bg.png" alt="">
                                <span class="text_size_24 color_gold">04</span>
                            </div>
                            <p class="text_size_28">具体步骤待提供</p>
                        </li>
                        <li class="bg_white">
                            <div>
                                <img src="@/assets/images/leaseGold/icon_bg.png" alt="">
                                <span class="text_size_24 color_gold">05</span>
                            </div>
                            <p class="text_size_28">具体步骤待提供</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="risk_warning">
                <div class="title">
                    <img src="@/assets/images/leaseGold/left.png" alt="">
                    <span class="text_size_30 color_black">风险提示</span>
                    <img src="@/assets/images/leaseGold/right.png" alt="">
                </div>
                <p class="text_size_28 color_969696">一、利率风险：客户必须承担租赁费的支出，不同市况下，租赁费率是不同的。</p>
                <p class="text_size_28 color_969696">二、黄金价格风险：租赁到期时必须全额偿还黄金，对于没有确定黄金产出或来源的租借方，将面临市场价格上涨的风险。</p>
                <p class="text_size_28 color_969696">三、利用租赁交易叙做远期保值的产金商，面临和远期交易相同的风险。</p>
                <p class="text_size_28 color_969696">四、目前交易所规定，非购入黄金的提取不能开具增值税发票，通过租赁方式获取的黄金可在归还时通过交易所买入现货获得增值税发票。</p>
            </div>
        </div>
        <van-button type="default" class="submit text_size_30 color_white bg_gold" :loading="loading" loading-text="提交订单" @click="$router.push('/leaseOrderSubmit')">我要租赁</van-button>
    </div>
</template>

<script>
import { Button } from 'vant';
import { setToken } from '@/libs/auth'
import { debuglog } from 'util';
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                loading:false
            }
        },
        created(){
            if(this.$route.query.token){
                setToken(this.$route.query.token)
            }
        },
        beforeRouteLeave (to, from, next) {
            this.$store.commit({type:'m_leaseOrderSubmit',leaseOrderSubmit:""})
            next()
        }
    }
</script>

<style scoped lang="less">
p,h2{
    margin: 0;
}
.leaseGold{
    .leaseGoldContent{
        padding-bottom: 102px;
        header{
            .bgImg{
                width: 100%;
                img{
                    width: 100%;
                }
            }
            .content{
                position: absolute;
                top: 28px;
                padding: 0 30px;            
                &>span{
                    display: inline-block;
                    margin-left: calc(100% - 114px);
                    margin-bottom: 30px;
                }
                &>div{
                    padding: 46px 30px;
                    border-radius: 10px;
                    h2{
                        text-align: center;
                        font-weight: normal;
                        padding-bottom: 36px;   
                    }
                    p{
                        line-height: 1.3;
                        text-align: justify;
                    }
                }
            }
        }
        .product_advantage{
            margin-top: 120px;
            .title{
                margin-bottom: 46px;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 55px;
                    height: 7px;
                }
                span{
                    padding: 0 20px;
                }
            }
            ul{
                padding: 0 30px 60px;
                li{
                    display: flex;
                    margin-bottom: 46px;
                    img{
                        width: 87px;
                        height: 88px;
                        margin-right: 20px;
                    }
                    p{
                        line-height: 1.5;
                    }
                }
                li:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .application_process{
            .title{
                margin-bottom: 122px;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 55px;
                    height: 7px;
                }
                span{
                    padding: 0 20px;
                }
            }
            .steps{
                width: 708px;
                height: 727px;
                border: 2px solid #aaaaaa;
                border-radius: 10px;
                margin: 0 auto;
                position: relative;
                ul{
                    position: absolute;
                    left: 50%;
                    top: -76px;
                    transform: translateX(-50%);
                    li{
                        width: 610px;
                        height: 160px;
                        padding: 0 20px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        div{
                            position: relative;
                            width: 56px;
                            height: 56px;
                            margin-right: 20px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                            span{
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                            }
                        }
                        p{
                            flex: 1;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
        .risk_warning{
            padding-top: 131px;
            .title{
                margin-bottom: 46px;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 55px;
                    height: 7px;
                }
                span{
                    padding: 0 20px;
                }
            }
            p{
                padding: 0 30px 52px;
                line-height: 1.5;
            }
        }
    }   
    .submit{
        border: none;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 102px;
        span{
            font-size: 30px;
        }
    } 
}
</style>