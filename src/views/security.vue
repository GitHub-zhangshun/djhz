<template>
    <div class="security">
        <img src="@/assets/images/about/banner2.png" alt="" class="banner">
        <ul>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">法律支持与保障</span>
                <p class="text_size_28">德金惠众与国内顶级律师事务所合作，保证平台业务的合法合规性。</p>
            </li>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">快捷通三方支付安全无忧</span>
                <p class="text_size_28">快捷通支付平台受平台委托，为德金惠众客户提供资金服务，保证平台用户的充值/提现需求，保障用户支付安全。</p>
            </li>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">国家质检证书</span>
                <ul class="national">
                    <li>
                        <p class="text_size_30">正规货源</p>
                        <p class="text_size_28">所有原料金全部来自于上海黄金交易所</p>
                    </li>
                    <li>
                        <p class="text_size_30">国家三方检验证书</p>
                        <p class="text_size_28">所有金条产品均随货配送国检证书，凭证书信息可在官网查验真伪</p>
                    </li>
                    <li>
                        <p class="text_size_30">专业仓储</p>
                        <p class="text_size_28">德金惠众与中工美（北京）供应链物流管理股份有限公司达成战略合作，所有黄金货物安全均由中工美（北京）供应链物流管理股份有限公司负责，满足金银对存储环境的严苛要求</p>
                    </li>
                </ul>               
            </li>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">技术保障</span>
                <ul class="technical_support">
                    <li>
                        <img src="@/assets/images/about/zjtsjc.png" alt="">
                        <span class="text_size_30">资金安全保障</span>
                        <p class="text_size_28">使用快捷通支付平台保障用户支付安全</p>
                    </li>
                    <li>
                        <img src="@/assets/images/about/jysstx.png" alt="">
                        <span class="text_size_30">交易实时提醒</span>
                        <p class="text_size_28">每笔交易实时消息提醒，保证账户动态实时触达，确保资金安全</p>
                    </li>
                    <li>
                        <img src="@/assets/images/about/hqjz.png" alt="">
                        <span class="text_size_30">行情精准</span>
                        <p class="text_size_28">行情对接上海黄金交易所与伦敦黄金交易所，实时准确</p>
                    </li>
                    <li>
                        <img src="@/assets/images/about/zhysbh.png" alt="">
                        <span class="text_size_30" >账户隐私保护</span>
                        <p class="text_size_28">与腾讯云建构多重防火墙保护系统，客户信息严格加密处理，确保用户数据隐私安全。</p>
                    </li>
                </ul>               
            </li>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">物流安全</span>
                <p class="text_size_28">选用中工美（北京）供应链物流管理股份有限公司负责运输服务，最大程度保证配送速度、物品安全及配送服务体验。</p>
            </li>
            <li class="bg_white">
                <span class="title text_size_32 color_gold">交易保障</span>
                <p class="text_size_28">与上上签合作，实时在线签署具有法律效力的电子合约，为用户提供整个交易过程全生命周期的服务，用最轻松的方式解决/保障德金惠众黄金平台的交易签约问题。</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
    padding: 0;
}
.security{
    padding-bottom:38px; 
    .banner{
        width: 100%;
    }
    &>ul{
        &>li{
            margin: 18px 18px 0;
            .title{
                display: inline-block;
                padding-top: 40px;
                padding-left: 33px;
                padding-right: 20px;
                margin-bottom: 38px;
                background: url(../assets/images/about/background.png) 14px bottom no-repeat;
                background-size: 100% 20px;
            }
            &>p{
                text-indent: 2em; 
                padding: 0 30px 46px;
                line-height: 1.5;
            } 
            .national{
                padding: 0 22px 48px;
                li{
                    margin-bottom: 18px;
                    padding: 0 24px;
                    background: url(../assets/images/about/bg1.png) no-repeat;
                    background-size: 100% 100%;
                    p:nth-of-type(1){
                        padding: 36px 0 30px;
                        font-weight: bold;
                    }
                    p:nth-of-type(2){
                        line-height: 1.5;
                    }
                }
                li:nth-of-type(1),li:nth-of-type(2){
                    height: 204px;
                }
                li:nth-of-type(3){
                    height: 284px;;
                }
            }
            .technical_support{
                padding-bottom: 26px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                li{
                    width: 326px;
                    background: url(../assets/images/about/bg1.png) no-repeat;
                    background-size: 100% 100%;
                    display: flex;
                    align-items: center;
                    flex-flow: column;
                    margin-bottom: 20px;
                    border-radius: 15px;
                    img{
                        width: 80px;
                        height: 80px;
                        margin-top: 36px;
                        margin-bottom: 30px; 
                    }
                    span{
                        font-weight: bold;
                        padding-bottom: 30px;
                    }
                    p{
                        padding: 0 24px 46px;
                        line-height: 1.5;
                        text-align: justify;
                    }
                }
            }
        }
    }
}
</style>