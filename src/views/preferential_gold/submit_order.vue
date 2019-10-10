<template>
    <div class="submit_order">
        <div class="gold_money bg_white">
            <span class="color_black text_size_28">黄金Au9999</span>
            <span class="color_gold text_size_30">{{platformPrice}}元/克</span>
        </div>
        <div class="buy_money bg_white">
            <div class="tips">
                <span class="color_black text_size_28">购买金额</span>
                <span class="color_gray text_size_26">预计克重：{{weight}}克</span>
            </div>
            <div class="input_money">
                <span>&yen;</span>&emsp;
                <input type="number" placeholder="" v-model="chargeMoney">
            </div>
            <span class="remaining text_size_24 color_gray ">当前余额{{money}}元</span>
        </div>
        <van-button :class="disabled?'color_white text_size_30 bg_gray':'color_white text_size_30 bg_gold'" @click="buying" :disabled="disabled">确认买入</van-button>
        <!-- <button >确认买入</button> -->
        <p class="text_center text_size_26 color_gray">我已阅读并同意<span class="color_black" @click="$router.push({path:'/message/annoucementdetail', query:{id:'Investment_Purchase_Agreement', title:'德金惠众Au9999购买协议'}})">《德金惠众Au9999购买协议》</span></p>
        <van-popup v-model="show" position="bottom">
            <div class="top">
                <span class="text_center text_size_32 color_black">付款</span>
                <img src="@/assets/images/preferential_gold/icon_Close.png" alt="" @click="show=false">
            </div>
            <div class="info">
                <ul>
                    <li>
                        <span class="text_size_28 color_gray">实际购买金额</span>
                        <span class="text_size_30 color_black">{{reality_money}}元</span>
                    </li>
                    <li>
                        <span class="text_size_28 color_gray">购买克重</span>
                        <span class="text_size_30 color_black">{{weight}}克</span>
                    </li>
                    <li>
                        <span class="text_size_28 color_gray">余额抵扣</span>
                        <span class="text_size_30 color_black">{{deduction_money}}元</span>
                    </li>
                </ul>
            </div>
            <p class="text_size_28 color_black text_center">还需支付：&emsp;<span class="color_red text_size_38">&yen;{{gpfd_money==0?'0.00':gpfd_money}}</span></p>
            <van-button :loading="loading" :disabled="loading" class="color_white text_size_30 bg_gold" @click="submit">去付款</van-button>
        </van-popup>
        <!-- 绑银行卡 -->
        <SelectBankCard />
        <!-- 交易密码输入框 -->
        <PwdInput />   
        <!-- 提示余额支付 -->
        <ToastPop/>
    </div>
</template>

<script>
import SelectBankCard from '@/components/SelectBankCard'
import ToastPop from '@/components/Toast'
import PwdInput from '@/components/PwdInput'
import { Popup , Button , Toast } from 'vant';
import { setInterval, clearInterval } from 'timers';
import { getToken } from '@/libs/auth'
import { checkReg ,number_format_two } from '@/libs/publicFun'
    export default {
        components:{
            'van-popup':Popup,
            SelectBankCard,
            PwdInput,
            ToastPop
        },
        data(){
            return{
                chargeMoney:sessionStorage.unpaid? sessionStorage.money : this.$route.query.money,//用户输入的金额
                show:false,//付款显示控制
                platformPrice:'',//平台金额
                times:'',//定时器
                money:'',//用户余额
                disabled:false,//按钮禁用控制
                weight:'',//克重
                gpfd_money:'',//还需支付
                reality_money:'',//实际购买金额
                deduction_money:'',//余额抵扣,
                loading:false,//按钮提交数据等待动画
                isHasBankCard:'',//银行卡
                isRealName:'',//实名
                isSetTranPassword:'',//交易密码
            }
        },
        watch:{
            chargeMoney(){
                this.disabled = false
                if(this.chargeMoney<100 || this.chargeMoney>99999999){
                    this.disabled = true
                }
                this.weight = number_format_two(Number(this.chargeMoney) / Number(this.platformPrice))
            }
        },
        async created(){
            //如果未支付保留密码输入框
            if(sessionStorage.getItem('unpaid')){
                this.$store.commit("m_toShowBankCard")
                this.$store.commit("m_toShowPwdInput")  
            }
            
            await this.get_gold()
            await this.$axios('user_user_getuserinfo')
            .then( data => {
                Toast.clear()
                this.money = data.result.moeny
                this.isHasBankCard = data.result.isHasBankCard
                this.isRealName = data.result.isRealName
                this.isSetTranPassword = data.result.account.isSetTranPassword
            })
        },
        methods:{
            submit(){
                this.loading = true
                this.$axios('center_order_goldorderconfirm',{money:this.chargeMoney,sourceSimplify:'order_source_h5'})
                .then( data => {
                    this.show=false
                    this.loading = false
                    sessionStorage.setItem('money',this.chargeMoney)
                    sessionStorage.setItem('orderId',data.result.orderId)
                    
                    if(data.result.isBankCardPay){
                        //选择银行卡
                        this.$store.commit("m_toShowBankCard")  
                    }else{
                        this.$store.commit({
                            type: "m_toShowToast",
                            showToast: true,
                            hintType:4,
                            needpaymoney:this.reality_money
                        });
                    }
                                  
                })
                .catch( () => {
                    this.loading = false
                })
                
            },
            get_gold(){
                this.$axios('center_goldprice_getallgoldprice')
                .then( data => { 
                    this.platformPrice = data.result.platformPrice
                    this.weight = number_format_two(Number(this.chargeMoney) / Number(this.platformPrice))
                })
            },
            buying(){
                let minimumMoney = Number(this.$route.query.minimumMoney)
                if(!getToken()) {
                    this.$router.push({path:'/login',query:{redirect:this.$route.fullPath}})
                }else if(!this.isRealName){
                    //弹出开通存管提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:1,
                    });
                    return
                }else if(!this.isHasBankCard){
                    // 弹出绑定银行卡提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:2,
                    });
                    return
                }else if(!this.isSetTranPassword){
                    //弹出设置交易密码提示
                    this.$store.commit({
                        type: "m_toShowToast",
                        showToast: true,
                        hintType:3,
                    });
                    return
                }else if(!checkReg(this.chargeMoney)){
                    Toast({message:"金额格式不正确"})
                    return
                }else if(this.chargeMoney < minimumMoney){
                    Toast({message:`起购金额不能低于${minimumMoney.toFixed(2)}元`,duration:1200})
                    return
                }
                // if(Number(this.chargeMoney) > this.moeny){
                //     Toast({message:"金额大于可用余额"})
                //     return
                // }
                this.reality_money = number_format_two(Number(this.weight) * Number(this.platformPrice))         
                if(Number(this.reality_money) >= Number(this.money)){
                    this.deduction_money = this.money
                    this.gpfd_money = number_format_two(Number(this.reality_money) - Number(this.money))
                }else{
                    this.deduction_money = this.reality_money
                    this.gpfd_money = 0
                }
                this.show=true
            }
        },
        mounted(){
             Toast.loading({
                mask: true,
                message: '加载中...'
            });
            this.times = window.setInterval(i => {
                this.get_gold()
            },60000) 
        },
        beforeDestroy(){
            window.clearInterval(this.times)
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.submit_order{
    .gold_money{
        margin: 18px;
        display: flex;
        justify-content: space-between;
        padding: 42px 40px;
    }
    .buy_money{
        padding: 60px 40px;
        margin: 0 18px 60px;
        .tips{
            display: flex;
            justify-content: space-between;
            padding-bottom: 60px;
        }
        .input_money{
            padding-left:34px; 
            padding-bottom: 36px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #e3e3e3;
            span{
                font-size: 45px;
                // padding-right: 36px;
            }
            input{
                flex: 1;
                font-size: 45px;
            }
        }
        .remaining{
            display: inline-block;
            padding-top: 18px;
        }
    }
    button{
        display:block;
        margin: 0 auto;
        border-radius: 90px;
        width: 690px;
        height: 90px;
    }
    &>p{
        padding-top: 30px;
    }
    .van-popup{
        .top{
            border-bottom: 2px solid #e3e3e3;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            line-height: 100px;
            span{
                flex: 1;
            }
            img{
                width: 30px;
                height: 30px;
            }
        }
        .info{
            padding: 60px 30px 160px;
            ul{
                li{
                    display: flex;
                    justify-content: space-between;
                }  
                li:nth-of-type(1),
                li:nth-of-type(2){
                    padding-bottom: 46px;
                }             
            }
        }
        button{
            display: block;
            width: 690px;
            height: 90px;
            margin: 36px auto 20px;
        }
    }
}
</style>