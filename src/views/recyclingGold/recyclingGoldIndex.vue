<template>
<!-- 黄金回收 -->
    <div class="recyclingGoldIndex">
        <div class="headerImg">   
            <p class="refresh"><img src="@/assets/images/recyclingGold/refresh.png" alt="" @click="refresh"></p>
            <p class="real_time text_size_32">实时回收金价（元/克）</p>
            <ul class="bottom">
                <li>
                    <p>Au999</p>
                    <p>{{goldPrice}}</p>
                    <button class="text_size_32" @click="$router.push('/myRecycling')">我的回收</button>
                </li>
                <li>
                    <p>Au9999</p>
                    <p>{{highPrecisionGoldPrice}}</p>
                    <button class="text_size_32" @click="$router.push('/sellGold')">我要卖金</button>
                </li>
            </ul>
        </div> 
        <div class="process">
            <header class="text_size_32 color_gold"><span></span>回收流程</header>
            <ul>
                <li>
                    <div class="lc">
                        <img src="@/assets/images/recyclingGold/lc1.png" alt="">
                    </div>
                    <p>在线预约</p>
                </li>
                <li>
                    <div class="jiantou">
                        <img src="@/assets/images/recyclingGold/jiantou.png" alt="">
                    </div>
                </li>
                <li>
                    <div class="lc">
                        <img src="@/assets/images/recyclingGold/lc2.png" alt="">
                    </div>
                    <p>客服追踪</p>
                </li>
                <li>
                    <div class="jiantou">
                        <img src="@/assets/images/recyclingGold/jiantou.png" alt="">
                    </div>
                </li>
                <li>
                    <div class="lc">
                        <img src="@/assets/images/recyclingGold/lc3.png" alt="">
                    </div>
                    <p>专业质检</p>
                </li>
                <li>
                    <div class="jiantou">
                        <img src="@/assets/images/recyclingGold/jiantou.png" alt="">
                    </div>
                </li>
                <li>
                    <div class="lc">
                        <img src="@/assets/images/recyclingGold/lc4.png" alt="">
                    </div>
                    <p>快捷变现</p>
                </li>
            </ul>
        </div>
        <div class="problem">
            <header class="text_size_32 color_gold"><span></span>回收指南</header>
            <ul>
                <li>
                    <p class="text_size_30 color_black">问题一:个人储存的黄金平台可以回收吗？</p>
                    <p class="text_size_28">目前平台只针对企业储存的黄金进行回收，个人的黄金回收业务我们暂时不做，若您有回收需求，敬请期待我们以后的发展，若您还有疑问，可以联系哈我们的客服嘛，客服可以给你专业的解答哈。</p>
                </li>
                <li>
                    <p class="text_size_30 color_black">问题:标题二</p>
                    <p class="text_size_28">内容Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { setToken } from '@/libs/auth'
import { Toast } from 'vant'
    export default {
        data(){
            return{
                goldPrice:'--',
                highPrecisionGoldPrice:'--',
            }
        },
        methods:{
            refresh(){
                Toast.loading({
                duration: 0,
                mask: true,
                message: '加载中...'
                });
                this.$axios('center_goldprice_getcurrenrecyclinggoldpriceset')
                .then(data => {
                    Toast.clear()
                    if(data.code==0){
                        this.goldPrice = (data.result.goldPrice==0 || data.result.goldPrice==null)?'--':data.result.goldPrice
                        this.highPrecisionGoldPrice = (data.result.highPrecisionGoldPrice==0 || data.result.highPrecisionGoldPrice==null)?'--':data.result.highPrecisionGoldPrice
                    }
                })
            }
        },
        created(){
            if(this.$route.query.token){
                setToken(this.$route.query.token)
            }
            this.refresh()
        },
        beforeRouteLeave (to, from, next) {
            this.$store.commit({type:'m_sellGold',sellGold:""})
            next()
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.recyclingGoldIndex{
    .headerImg{
        margin: 18px;
        background-image:url('../../assets/images/recyclingGold/recyclGoldpg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .refresh{
            padding-top: 26px;
            padding-right: 30px;
            text-align: right;
            img{
                width: 28px;
            }
        }
        .real_time{
            text-align: center;
            color: #624813;
            padding-bottom: 46px;
        }
        .bottom{
            display: flex;
            justify-content: space-around;
            li{
                p:nth-of-type(1){
                    font-size: 26px;
                    color:#624813;
                    padding-bottom: 20px;
                }
                p:nth-of-type(2){
                    font-size: 60px;
                    color: #b8580b;
                    padding-bottom: 54px;
                }
                button{
                    width: 280px;
                    height: 90px;
                    border-radius: 90px;
                    color: #b8580b;
                    margin-bottom: 48px;
                }
            }
            li:nth-of-type(1){
                button{
                    background: #fff9e6;
                }
            }
            li:nth-of-type(2){
                button{
                    background: #fde38c;
                }
            }
        }
    }
    .process{
        background: #fff;
        header{
            padding: 36px 0 46px 0;
            display: flex;
            align-items: center;
            span{
                margin-left: 6px;
                margin-right: 25px;
                display: inline-block;
                height: 32px;
                width: 8px;
                background: #f5ab0b;
            }
        }
        ul{
            display: flex;
            justify-content: space-between;
            padding: 0 40px 60px;
            li{
                .lc{
                    width: 89px;
                    padding-bottom: 26px;
                    img{
                        width: 100%;
                    }
                }
                .jiantou{
                    padding-top: 30px;
                    width: 27px;
                    img{
                        width: 100%;
                    }
                }
            }
            li:nth-of-type(2n+1){
                display: flex;
                flex-flow: column;
                align-items: center;
            }
        }
    }
    .problem{
        margin-top: 18px;
        background: #fff;
        header{
            padding: 36px 0;
            display: flex;
            align-items: center;
            span{
                margin-left: 6px;
                margin-right: 25px;
                display: inline-block;
                height: 32px;
                width: 8px;
                background: #f5ab0b;
            }
        }
        ul{
            padding: 0 30px;
            li{
                padding-bottom: 46px;
                p:nth-of-type(2){
                    color: #969696;
                    padding-top: 30px;
                    line-height: 1.5;
                    text-align: justify;
                }
            }
        }
    }
}
</style>