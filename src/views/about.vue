<template>
    <div class="about bg_white">
        <img src="@/assets/images/about/banner1.png" alt="" class="banner">
        <div class="title">
            <img src="@/assets/images/about/djhz.png" alt="">
        </div>
        <p class="content">德金惠众是一个为用户提供黄金购买及租赁回收服务的互联网黄金平台。我们致力于以科技赋能金融行业，成为最专业的互联网黄金全流程解决方案供应商，是一个致力于拉近消费者与黄金之间距离的综合电商平台。我们采用金融科技的创新模式将线下到线上的黄金消费场景相连接，致力于打造创新的黄金电商品牌与平台。</p>
        <p class="content">德金惠众成立于2019年，总部位于深圳，德金惠众所有产品线，均受深圳市京鑫科技有限公司严格监管。</p>
        <p class="content">依托于京鑫科技在黄金投资方面的经验优势，“德金惠众”整合了黄金产品、线上/线下的黄金零售、黄金租赁与黄金回收等资源，通过互联网面向用户提供黄金买卖、黄金租赁、黄金回收等服务，同时为用金企业提供黄金租赁/回收服务，开创“互联网+黄金”理财新生态。</p>
        <p class="content">“德金惠众”与中工美物流达成战略合作，把保障服务覆盖至整个交易过程，让黄金存储和交易更安心。</p>
        <div class="title">
            <img src="@/assets/images/about/pt.png" alt="">
        </div>
        <ul class="ptfw_content">
            <li>
                <p><span class="bg_gold"></span>黄金购买：金价参考国内/国际价，买卖便捷有保障</p>
                <p>德金惠众金价以实时国内/国际金价为参考标准，公开透明，用户无论是在线上平台还是线下门店都可轻松交易。</p>
            </li>
            <li>
                <p><span class="bg_gold"></span>商城消费：海量新款随意挑，同款价格更优惠</p>
                <p>德金惠众精选海量高品质饰品，以满足用户个人佩戴、佳节送礼、投资买金等不同的需求。用户可在黄金商城内随意选购。</p>
            </li>
            <li>
                <p><span class="bg_gold"></span>黄金回收：金条首饰变现快，回购收费价格低</p>
                <p>德金惠众提供专业安全的黄金回收服务，用户在平台提交订单，专业的验金团队追踪提供线下验金服务。</p>
            </li>
            <li>
                <p><span class="bg_gold"></span>黄金租赁：金条首饰灵活够，同款价格更优惠</p>
                <p>德金惠众提供专业安全的黄金租赁服务，用户在平台提交订单，线下专业人员追踪服务。</p>
            </li>   
        </ul>  
        <div class="title">
            <img src="@/assets/images/about/ppys.png" alt="">
        </div>  
        <div class="ppys_content">
            <ul>
                <li>
                    <img src="@/assets/images/about/jggd.png" alt="">
                    <p class="text_size_32">价格公道</p>
                    <p class="text_size_26 text_center">黄金原料价格公开透明，对比“上海黄金交易所”、“伦敦黄金交易所”等展示实时金价，价格更公道。</p>
                </li>
                <li>
                    <img src="@/assets/images/about/wlaq.png" alt="">
                    <p class="text_size_32">物流安全</p>
                    <p class="text_size_26 text_center">商城携手中工美物流为商品提供黄金的寄送服务。</p>
                </li>
                <li>
                    <img src="@/assets/images/about/txfw.png" alt="">
                    <p class="text_size_32">贴心服务</p>
                    <p class="text_size_26 text_center">商城为客户提供门店自提、快递配送、黄金回收、黄金租赁等多项服务内容。</p>
                </li>
                <li>
                    <img src="@/assets/images/about/pzbz.png" alt="">
                    <p class="text_size_32">品质保障</p>
                    <p class="text_size_26 text_center">商城所售商品均由质量检测中心质检，商品品质有保障。</p>
                </li>
                <li>
                    <img src="@/assets/images/about/yxbh.png" alt="">
                    <p class="text_size_32">隐私保护</p>
                    <p class="text_size_26 text_center">与腾讯云建构多重防火墙保护系统，客户信息严格加密处理，确保用户数据隐私安全。</p>
                </li>
            </ul>
            
        </div>
        <div class="title">
            <img src="@/assets/images/about/contact.png" alt="">
        </div> 
        <ul class="contact">
            <!-- <li>
                <img src="@/assets/images/about/phone.png" alt="">
                <p class="text_size_28 color_gray">联系电话：<span class="color_black">400-020-0178</span></p>
            </li> -->
            <li>
                <img src="@/assets/images/about/wx.png" alt="">
                <p class="text_size_28 color_gray">公众号：<span class="color_black">德金惠众</span></p>
            </li>
            <li>
                <img src="@/assets/images/about/gw.png" alt="">
                <p class="text_size_28 color_gray">官方网站：<span class="color_black">www.myaubk.com</span></p>
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
.about{
    padding-bottom: 63px;
    .banner{
        width: 100%;
    }
    .title{
        width: 253px;
        height: 60px;
        margin: 60px auto 36px;
        img{
            width: 100%;
        }
    }
    .content{
        text-indent: 2em;
        line-height: 1.5;
        padding: 0 18px;
        font-size: 26px;
        color: #333333;
    }
    .ptfw_content{
        li{
            padding: 0 18px 30px;
            p:nth-of-type(1){
                font-size: 30px;
                color: #333333;
                display: flex;
                align-items: center; 
                font-weight: bold;  
                padding-bottom: 30px;            
                span{
                    margin-right: 18px;
                    width: 14px;
                    height: 14px;
                    display: block;
                    border-radius: 50%;                    
                }
            }
            p:nth-of-type(2){
                line-height: 1.5;
            }
        }
        li:last-child{
            padding-bottom: 0;
        }
    }
    .ppys_content{       
        ul{
            li{
                padding: 0 18px;
                display: flex;
                flex-flow: column;
                align-items: center;
                img{
                    width: 186px;
                    height: 155px;
                    margin-bottom: 38px;
                }
                p:nth-of-type(1){
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                p:nth-of-type(2){
                    line-height: 2;
                    padding-bottom: 18px;
                }
            }
        }
        

    }
    .contact{
        background-color: #f2f2f2;
        margin: 0 18px;
        padding: 62px 34px;
        li{
            display: flex;
            align-items: center;
            padding-bottom: 46px;
            img{
                width: 56px;
                height: 56px;
                margin-right: 22px;
            }
        }
        li:last-child{
            padding-bottom: 0;
        }
    }
}
</style>