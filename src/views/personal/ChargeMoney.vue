<template>
<!-- 充值 -->
    <div class="charge bg_base">
        <div class="charge_box">
            <div class="content bg_white">
                <img src="@/assets/images/personal/charge_record.png" class="to_detail" @click="$router.push({path:'/personal/moneyrecord', query:{title:'充值记录'}})">

                <div class="row">           
                    <img src="@/assets/images/personal/icon_charge_bank.png">
                    <div class="bank color_gray">
                        <p><span class="text_size_32 color_black">工商银行</span>&emsp;<span>(尾号1766)</span></p>
                        <p>充值限额为您绑定的银行卡卡行规定的限定额度</p>
                    </div>
                </div>

                <div class="price">
                    <p class="text_size_28">充值金额</p>
                    <div class="text_size_36 row">
                        <span class="text_size_42">&yen;</span>&emsp;
                        <input type="number" placeholder="10元起" v-model="chargeMoney" @keydown="handleInput">
                    </div>
                    <p class="color_gold">{{ message }}</p>
                </div>

                <van-button round :disabled="isDisabled" class="color_white bg_gold" @click="toCharge">确认充值</van-button>
            </div>

        </div>
        <div class="footer text_center color_gray bg_base">
            <p>客服电话：400-020-0178</p>
            <p>(工作日 09:00-18:00)</p>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                chargeMoney: '',
                isDisabled: true,
                message: ''
            }
        },
        watch :{
            chargeMoney(val){
                if(val == ''){
                    this.message = ''
                    this.isDisabled = true
                }else{
                    if(Number(val) < 10){
                        this.message = '不可低于10.00元'
                        this.isDisabled = true
                    }else{
                        this.message = ''
                        this.isDisabled = false
                    }

                }
            }
        },
        methods :{
            toCharge(){
                //跳转银行
            },

            //限制输入小数位
            handleInput(e){
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
            }
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}
input::placeholder{
    padding-top: 8px;
}

.charge{
    .charge_box{
        min-height: calc(100vh - 160px);
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
                width: 39px;
            }
            &>div{
                margin-bottom: 74px;
                img{
                    width: 68px;
                    height: 68px;
                    margin-right: 18px;
                }
                .bank{
                    p:first-of-type{
                        margin-bottom: 24px;
                    }
                }
                &.price{
                    p{
                        margin-bottom: 50px
                    }
                    div{
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #ccc;
                        margin-bottom: 14px;
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
        height: 160px;
        box-sizing: border-box;
        width: 100%;    
        padding: 30px 0;
        p{
            padding: 8px 0;
        }
    }
}
</style>