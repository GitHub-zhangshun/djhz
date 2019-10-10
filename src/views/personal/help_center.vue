<template>
    <van-collapse v-model="activeNames" class="bg_base" accordion>
        <van-collapse-item title="1、支持哪些支付方式？" name="1">
            <p>① 账户余额足够的情况下，可使用账户余额抵扣支付；</p>
            <p>② 账户余额不足的情况下，抵扣账户余额后剩余的部分可使用银行卡支付；</p>
            <p>③ 可使用银行卡直接支付。</p>
        </van-collapse-item>
        <van-collapse-item title="2、如何修改登录密码？" name="2">
            <p>进入个人中心——设置——修改登录密码——根据提示填写信息，完成修改登录密码</p>
        </van-collapse-item>
        <van-collapse-item title="3、如何修改交易密码？" name="3">
            <p>进入个人中心——设置——修改交易密码——根据提示填写信息，完成修改交易密码</p>
        </van-collapse-item>
        <van-collapse-item title="4、如果修改手机号码？" name="4">
            <p>进入个人中心——设置——登录手机号码——根据提示填写信息，完成修改手机号码</p>
        </van-collapse-item>
        <van-collapse-item title="5、银行卡绑定失败" name="5">
            <p>① 请先确认所绑定银行卡是否为支持绑定银行；</p>
            <p>② 如果是支持绑定的银行，遇到绑卡失败，您可以联系客服协助解决。 </p>
            <p>③ 银行卡解绑：进入个人中心——我的银行卡，可直接解除银行卡绑定。</p>
        </van-collapse-item>
        <van-collapse-item title="6、提现" name="6">
            <p>① 若您想将账户内的余额转入银行中，您可以进行提现操作</p>
            <p>② 在个人中心页面点击提现，根据操作提示输入提现金额，确认提现金额是否准确，然后通过交易密码验证完成提现；</p>
            <p>③ 手续费：账户提现时会扣除部分提现手续费，具体手续费用在确认提现页面有展示。</p>
        </van-collapse-item>
        <van-collapse-item title="7、支付" name="7">
            <p>① 您在进行支付订单时需要进行支付操作；</p>
            <p>② 在下单成功并跳转到支付页面后，您需要根据提示进行付款操作，付款完成后订单生成并保存在交易记录中。</p>
        </van-collapse-item>
        <van-collapse-item title="8、注销申请" name="8">
            <p>① 用户的账户余额必须为零；</p>
            <p>② 账户的所有订单状态都必须为“已完成”或“已关闭”；</p>
            <p>③ 进入个人中心——设置——申请注销账户，提交注销账户的申请即可。</p>
        </van-collapse-item>
    </van-collapse>
</template>

<script>
import { Collapse, CollapseItem } from 'vant';
    export default {
        components:{
            'van-collapse':Collapse,
            'van-collapse-item':CollapseItem,
        },
        data(){
            return{
                activeNames: []
            }
        }
    }
</script>

<style scoped lang="less">
.van-collapse{
    min-height: 100vh;
    .van-collapse-item{
        /deep/.van-cell{
            height: 100px;
            display: flex;
            align-items: center;
            .van-cell__title{
                span{
                    font-size: 28px;
                }
            }
        } 
        .van-collapse-item__wrapper{
            .van-collapse-item__content{
                p{
                    margin: 0;
                    padding: 0;
                    font-size: 24px;
                    line-height: 1.8;
                }
            }
        }       
    }
}
</style>