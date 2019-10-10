<template>
<!-- 提现 -->
    <div class="take bg_base">
        <div class="take_box">
            <div class="content bg_white">
                <div class="to_detail">
                    <!-- <img src="@/assets/images/personal/help.png"  @click="seeMore"> -->
                    <img src="@/assets/images/personal/take_record.png" @click="$router.push({path:'/personal/moneyrecord', query:{title:'提现记录'}})">
                </div>

                <div class="row bank"> 
                    <div class="text_size_30">提现到</div>
                    <div class="row bank_info">
                        <div class="row" @click="selectBank">
                            <img :src="defaultBank.link">
                            <p class="color_gray"><span class="text_size_32 color_black">{{ defaultBank.bankName }}</span>&emsp;<span>(尾号{{ defaultBank.cardNumber}})</span></p>
                        </div>
                        <img src="@/assets/images/ticket/path.png" class="path" @click="selectBank">
                    </div>
                </div>

                <div class="price">
                    <p class="text_size_28">提现金额</p>
                    <div class="text_size_36 row">
                        <span class="text_size_42">&yen;</span>&emsp;
                        <input type="number" :placeholder="minMoney+'元起'" v-model="chargeMoney" @keydown="handleInput" @blur="scrollBack">
                        <p class="take_all color_gold text_size_26" @click="takeAll">全部提现</p> 
                    </div>
                    <p>{{ message }}</p>
                </div>

                <!-- <div>
                    <van-radio-group v-model="radio">
                        <van-radio v-for="(item,index) in 2" :key="index" :name="index">
                            <label class="text_size_28">普通提现<br><span class="text_size_24 color_gray">预计<span class="color_gold">下一个工作日 23:59前</span>到账，手续费2元</span></label>
                            <img
                            slot="icon"
                            slot-scope="props"
                            :src="props.checked ? icon.active : icon.normal"
                            >
                        </van-radio>
                    </van-radio-group>
                </div> -->

                <div class="service color_gray row">扣除手续费{{ service || '0.00' }}元<img src="@/assets/images/personal/help.png"  @click="aboutService"></div>                

                <van-button round :disabled="isDisabled" class="color_white bg_gold" @click="toTake">确认提现</van-button>
            </div>

        </div>
        <div class="footer text_center color_gray bg_base">
            <p>预计1个工作日内到账，具体时间以银行为准</p>
            <p>客服电话：400-020-0178</p>
            <p>(工作日 09:00-18:00)</p>
        </div>

        <!-- 银行卡 -->
        <SelectBankCard />
        <!-- 交易密码输入框 -->
         <PwdInput />  
    </div>
</template>

<script>
import { RadioGroup, Radio, Dialog, Toast } from 'vant';
import SelectBankCard from '@/components/SelectBankCard'
import PwdInput from '@/components/PwdInput'

    export default {
        components: {
            'van-radio-group':RadioGroup,
            'van-radio':Radio,
            SelectBankCard,
            PwdInput
        },
        data(){
            return {
                chargeMoney: '',
                isDisabled: true,
                message: '',   
                radio: 0,   //普通提现 快速提现
                icon: {
                    normal: require('@/assets/images/product/radio.png'),
                    active: require('@/assets/images/product/radio_checked.png')
                },
                remain:'',   //用户钱包余额 
                defaultBank:{},   //默认银行信息
                minMoney:'',   //最低起提金额
                service:'',   //手续费 
                serviceInfo:{},  //手续费相关 
                serviceHint:'',  //手续费提示
                bankList:[],    //银行卡列表 
            }
        },
        watch :{
            chargeMoney(val){
                if(val == ""){
                    this.message = `当前余额${this.remain}元`
                    this.isDisabled = true   //禁用按钮
                    this.service = 0
                }else {
                    if(Number(val) > Number(this.remain) ){
                        this.message = `不可超出余额${this.remain}元`
                        this.isDisabled = true  //禁用按钮
                    }else if(Number(val) < Number(this.minMoney)){
                        this.message = `不可低于起提金额${this.minMoney}元`
                        this.isDisabled = true  //禁用按钮
                    }else{
                        this.message = `当前余额${this.remain}元`
                        this.isDisabled = false   //按钮状态
                    }

                    if(this.serviceInfo.isOpenTimely){  
                        if(Number(this.chargeMoney) > Number(this.serviceInfo.limitTimelyMoney)){
                            this.service = (this.serviceInfo.timelyUpperMoney + Number(this.chargeMoney) * (this.serviceInfo.timelyUpperRate/100)).toFixed(2)
                        }else{
                            this.service = (this.serviceInfo.timelyLowerMoney + Number(this.chargeMoney) * (this.serviceInfo.timelyLowerRate/100)).toFixed(2)
                        }
                    }
                }  
            },
            bankState(val){
                if(sessionStorage.getItem('bankId') && !val){
                    this.defaultBank = this.bankList.filter(item => { return item.id == sessionStorage.getItem('bankId') })[0]
                }
            }
        },
        computed:{
            bankState:{
                get(){ return this.$store.state.isShowBankCard },
                set(){ }
            }
        },
        methods :{
            //确认提现
            toTake(){
                sessionStorage.setItem('takeMoney', this.chargeMoney)
                this.$store.commit("m_toShowPwdInput");
            },

            //全部提现
            takeAll(){
                this.chargeMoney = this.remain
            },
            
            //限制输入小数位
            handleInput(e){
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
            },
            
            //查看提现详细
            seeMore(){
                Dialog.alert({
                message: `1.普通提现：预计下一个工作日到账，手续费=提现金额x手续费率+2元/笔<br>2.快速提现：预计24小时内到账，手续费=2元/笔`
                }).then(() => {
                // on close
                });
            },
            //查看手续费详细
            aboutService(){
                Dialog.alert({
                message: `${this.serviceHint}`
                }).then(() => {
                // on close
                }); 
            },

            //选择银行
            selectBank(){
                this.$store.commit("m_toShowBankCard")  
            },

            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            }     
        },
        created(){
            //如果未支付保留密码输入框
            if(sessionStorage.getItem('unpaid')){
                this.$store.commit("m_toShowPwdInput")  
            }

            //获取用户余额
            this.$axios('user_wallet_frontusermoney')
            .then(data => {
                //钱包余额
                this.remain = data.result.toFixed(2)
                this.message = `当前余额${this.remain}元`
            }).catch(() => {})

            //银行信息
            this.$axios('center_user_bankaccount')
            .then(data => {
                Toast.clear()
                data.result.forEach(item => { item.cardNumber = item.cardNumber.slice(-4) })
                this.bankList = data.result
                this.defaultBank =  this.bankList[0]
                sessionStorage.setItem('bankId',this.defaultBank.id)
            }).catch(() => {})

            //起提金额及手续费
            this.$axios('center_transaction_getcureentransactionfee')
            .then(data => {
                this.serviceInfo = data.result
                this.minMoney = data.result && data.result.minimumWithdraw
                this.serviceHint = data.result && data.result.timelyRemark
            }).catch(() => {})

            if(sessionStorage.getItem('takeMoney')){
                this.chargeMoney = sessionStorage.getItem('takeMoney')
                this.isDisabled = false  //禁用按钮
            }
        },
        mounted(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });
        },
        //离开页面时除修改交易密码之外清除未支付标识
        beforeRouteLeave (to, from, next) {
            if(to.path !== '/personal/setting/reset_trade_password'){  
                sessionStorage.removeItem('unpaid')    
                sessionStorage.removeItem('bankId')   //清除银行卡标识
                sessionStorage.removeItem('takeMoney')   //清除输入提现金额
            }   
            next()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

input::placeholder{
    padding-top: 10px;
}
.take{
    .take_box{
        min-height: calc(100vh - 260px);
        box-sizing: border-box;
        padding: 20px;
        .content{
            width: 100%;
            box-sizing: border-box;
            padding: 110px 40px 60px 40px;
            box-shadow: 1px 1px 2px 1px #e1e1e1;
            position: relative;
            .to_detail{
                position: absolute;
                right: 40px;
                top: 30px;
                img{
                    width: 39px;
                    margin-left: 20px;
                }
            }
            &>div{
                margin-bottom: 74px;
                &.bank{
                    align-items: center;
                    justify-content: space-between;
                    .bank_info{
                        align-items: center;
                        justify-content: space-between;
                        width: 80%;
                        .path{
                            width: 14px;
                        }
                        div{
                            align-items: center;
                            img{
                                width: 68px;
                                height: 68px; 
                                margin-right: 20px;
                            }
                        }
                    }
                }
                &.price{
                    p{
                        margin-bottom: 50px
                    }
                    div{
                        padding: 10px 0;
                        border-bottom: 1px solid #ccc;
                        margin-bottom: 14px;
                        align-items: center;
                        position: relative;
                        .take_all{
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            right: 0;
                        }
                    }
                }
                &.service{
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 26px;
                    img{
                        width: 34px;
                        height: 34px;
                        margin-left: 14px;
                    }
                }

                .van-radio{
                    margin-bottom: 36px;
                    display: flex;
                    img{
                        width: 30px;
                        height: 30px;
                        margin-right: 6px;
                    }
                    label{
                        line-height: 40px;
                    }
                }
            }
    
            .van-button{
                width: 100%;
                height: 90px;
                line-height: 90px; 
                .van-button__text{
                    font-size: 34px;
                }
            }
            .van-button--disabled{
                opacity: 1;
                background: #ababab;
            }
        }
    }

    .footer{
        height: 260px;
        box-sizing: border-box;
        width: 100%;    
        padding: 40px 0;
        p{
            padding: 8px 0;
            &:first-of-type{
                padding-bottom: 50px;
            }
        }
    }
}
</style>