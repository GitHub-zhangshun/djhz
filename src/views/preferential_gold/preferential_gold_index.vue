<template>
<!-- 优惠金首页 -->
    <div class="preferential_gold">
        <div class="top">
            <p class="color_white text_center">{{platformPrice}}</p>
            <p class="text_center text_size_24 color_white">平台实时金价(元/克)</p>
            <div class="img">
                <img src="@/assets/images/preferential_gold/icon.png" alt="">
            </div>
        </div>
        <div class="rulers bg_white">
            <input :placeholder="minimumMoney+'起购'"  class="text_size_30" v-model="val">
            <div ref="ruler"></div>
            <p class="text_size_28 color_black text_center weight">预计克重：{{weight}}克</p>
            <button class="color_white text_size_30 bg_gold" @click="submit">立即买入</button>
        </div>
        <div class="record bg_white" v-if="showMore">
            <ul>
                <li>
                    <span class="text_size_30 color_black">购买记录（{{total}}）</span>
                    <span class="text_size_26 color_gray" @click="$router.push('/recored')">更多<img src="@/assets/images/index/Path.png" alt=""></span>
                </li>
                <li class="list" v-for="(item, index) in list" :key="index">
                    <img :src="item.imgLink" alt="">
                    <div class="phoneAndTime">
                        <span class="text_size_30 color_black">{{item.phone}}</span>
                        <span class="text_size_24 color_gray">{{item.createTimeStamp}}</span>
                    </div>
                    <span class="text_size_30 color_black">{{item.weight}}克</span>
                </li>
            </ul>
        </div>
        <div class="product_info bg_white">
            <ul>
                <li>
                    <span class="text_size_30 color_black">产品介绍</span>
                </li>
                <li v-html="content" class="content"></li>
            </ul>
        </div>
        <!-- 提示框 -->
        <ToastPop/>
    </div>   
</template>

<script>
import ToastPop from '@/components/Toast'
import { formatDate } from '@/libs/publicFun'
import SlideRuler from '@/components/rulers/slide-ruler'
import { setInterval } from 'timers'
import { getToken } from '@/libs/auth'
import { Toast } from 'vant'
import axios from 'axios'
import { Promise } from 'q';
    export default {
        components:{
            ToastPop
        },
        data(){
            return{
                val:'',
                platformPrice:'',
                timerId: '',
                weight:'',
                list:[],
                total:'',
                showMore:false,
                isHasBankCard:false,//是否有银行卡
                isRealName:false,//是否实名认证
                isSetTranPassword:false,//是否设置交易密码
                content:'',
                minimumMoney:0,//起投金额
            }
        },
        created(){
            if(sessionStorage.unpaid){
                sessionStorage.removeItem('unpaid')
            }
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
            });
            // axios.all([this.platformPrice_money1(),this.goldorderpayrecordlistbypage(),this.contentlistpage(),this.getcureenlimitsmoney()])
            // .then(axios.spread(function(platformPrice_money1, goldorderpayrecordlistbypage,contentlistpage,getcureenlimitsmoney){
            //     console.log(platformPrice_money1)

            //     console.log(goldorderpayrecordlistbypage)
            //     console.log(contentlistpage)
            //     console.log(getcureenlimitsmoney)
                
            // }))


            this.platformPrice_money()  
            this.$axios('order_goldorder_goldorderpayrecordlistbypage',{index:1,size:1})     
            .then( data => {
                if(data.total==0){
                    this.showMore = false
                    return
                }
                this.showMore = true
                this.total = data.total
                data.result.forEach(item => {
                    this.list.push({
                        imgLink:item.imgLink?item.imgLink:require('@/assets/images/personal/default.png'),
                        phone:item.phone,
                        createTimeStamp:formatDate(item.createTimeStamp,'yyyy-MM-dd hh:ss'),
                        weight:(item.weight).toFixed(2),
                    })
                });
            })
            this.$axios('run_run_contentlistpage',{type:'invest-gold',index:1,size:1})
            .then( data => {
                this.content = data.result[0].content
            })
            this.$axios('center_transaction_getcureenlimitsmoney')
            .then( data => {             
                this.minimumMoney = data.result.minimumMoney || 0
            })
            let userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
            this.isHasBankCard = userinfo && userinfo.isHasBankCard
            this.isRealName = userinfo && userinfo.isRealName
            this.isSetTranPassword = userinfo && userinfo.account.isSetTranPassword 

                 
        },
        mounted () {
            this.timerId = window.setInterval( () => {
                this.platformPrice_money()               
            },60000)
            this._renderSlideRuler();
        },
        watch:{
            val(newVal,oldVal){
                if(newVal==0){
                    this.val = ''
                }
                if(newVal>99999999){
                    this.val = oldVal
                }
                this.weight = ((parseInt(this.val/Number(this.platformPrice || 0)*100)/100) || 0).toFixed(2)
            }
        },
        methods:{
            platformPrice_money1(){
                return this.$axios('center_goldprice_getallgoldprice')
                .catch( () => {
                    return Promise.resolve()
                })
            },
            goldorderpayrecordlistbypage(){
                return this.$axios('order_goldorder_goldorderpayrecordlistbypage',{index:1,size:1}).catch( () => {return Promise.resolve()})                 
            },
            contentlistpage(){
                return this.$axios('run_run_contentlistpage',{type:'invest-gold',index:1,size:1}).catch( () => {return Promise.resolve()})
            },
            getcureenlimitsmoney(){
                return this.$axios('center_transaction_getcureenlimitsmoney').catch( () => {return Promise.resolve()})
            },
            submit(){
                if(!getToken()) {
                    this.$router.push({path:'/login',query:{redirect:this.$route.fullPath}})
                }else if(!this.isRealName){
                    //弹出开通存管提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:1,
                    });
                }else if(!this.isHasBankCard){
                    // 弹出绑定银行卡提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:2,
                    });
                }else if(!this.isSetTranPassword){
                    //弹出设置交易密码提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:3,
                    });
                }else if(this.val<this.minimumMoney){
                    Toast({message:`起购金额不能低于${this.minimumMoney.toFixed(2)}元`,duration:2000})
                }else{
                    this.$router.push({path:'/submit_order',query:{money:this.val,minimumMoney:this.minimumMoney}})
                }
            },
            platformPrice_money(){
                this.$axios('center_goldprice_getallgoldprice')
                .then(data => {
                    Toast.clear()
                    this.platformPrice = data.result.platformPrice
                    this.weight = ((parseInt(this.val/Number(this.platformPrice || 0)*100)/100) || 0).toFixed(2)
                })
            },          
            _renderSlideRuler() {
                return new SlideRuler (
                    {
                        el: this.$refs.ruler,
                        maxValue: 50000,
                        minValue: 0,
                        currentValue: this.val,
                        handleValue: this.handleValue,
                        precision: 100,
                        canvasHeight:60,
                        fontSize:14
                    }
                );
            },
            handleValue(value) {
                this.val = value
            },
        },
        destroyed(){
            window.clearInterval(this.timerId)               
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
    padding: 0;
}
.preferential_gold{
    .top{
        background-image: url('../../assets/images/preferential_gold/bg.jpg');
        background-size: 100% 100%;
        p:nth-of-type(1){
            padding-top: 80px;
            padding-bottom: 30px;
            font-size: 80px;
            font-weight: 500;
        }
        p:nth-of-type(2){
            padding-bottom: 46px;
        }
        .img{
            margin: 0 auto;
            padding-bottom:90px; 
            width: 524px;
            height: 30px;
            img{
                width: 100%;
            }
        }
    }
    .rulers{ 
        display: flex;
        flex-flow: column;
        align-items: center;
        input{     
            outline: none;
            -webkit-appearance: none; 
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            text-align: center;
            line-height: 88px;
            // display: block;       
            width: 690px;
            height: 88px;
            border-radius:88px;
            border: 1px solid rgb(216, 208, 208);
            margin: 0 auto 10px;
        }
        .weight{
            padding: 36px 0 46px;
        }
        button{
            width: 480px;
            height: 90px;
            border-radius: 90px;
            margin-bottom: 60px;
        }
    }
    .record{
        margin-top:18px; 
        ul{
            li:nth-of-type(1){
                padding: 36px 30px 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                span{      
                    display: flex;
                    align-items: center;              
                    img{
                        padding-left: 10px;
                        width: 26px;
                    }
                }
            }
            .list{
                padding: 0 30px 46px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                img{
                    border-radius: 50%;
                    width: 90px;
                    height: 90px;
                    margin-right: 20px;
                }
                .phoneAndTime{
                    flex: 1;
                    display: flex;
                    flex-flow: column;
                    span:nth-of-type(1){
                        padding-bottom: 18px;
                    }
                }         
            }
        }
    }
    .product_info{
        margin-top: 18px;
        ul{
            li:nth-of-type(1){
                padding: 36px 46px;
            }
            /deep/.content{
                padding: 0 20px;
                line-height: 1.8;
                img{
                    max-width: 100% ;
                }
            }
        }
    }
}
/deep/.box::before {
    position: absolute;
    z-index: 1;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    content: '';
    width: 218px;
    height: 29px;
    background: url(../../assets/images/preferential_gold/ls_kd@2x.png) no-repeat;
    background-size: 100%;
//   background-color: #00b0ab;
}
</style>