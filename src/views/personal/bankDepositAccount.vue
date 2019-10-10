<template>
<!-- 银行存管账户 -->
    <div class="bankDepositAccount">
        <header>
            <div class="top">
                <div>
                    <img src="@/assets/images/personal/jinchen.png">
                </div>       
                <span>晋城存管银行</span>
            </div>
            <p>您的资金由晋城银行管理</p>
        </header>
        <ul>
            <li>
                <span>开户人</span>
                <span>开户人</span>
                <!-- <span>{{realName}}</span> -->
            </li>
            <li>
                <span>存管账户</span>
                <span>存管账户</span>
                <!-- <span>{{account}}</span> -->
            </li>
            <li>
                <span>开户手机号</span>
                <span>开户手机号</span>
                <!-- <span>{{bankPhone}}</span> -->
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped lang='less'>
p{
    margin: 0;
}
.bankDepositAccount{
    header{
        background: #fff;
        margin: 18px 20px;
        padding: 46px 0 46px 20px;
        .top{
            line-height: 54px;
            // padding-bottom: 30px;
            display: flex;
            div{
                width: 72px;
                height: 72px; 
                padding-right: 24px;
                img{
                    width: 100%;
                    height: 100%; 
                } 
            }
                      
            span{
                font-size: 36px;
                font-weight: bold;
                vertical-align: middle;
            }
        }
        &>p{
            padding-left: 97px;
            font-size: 32px;
            color: #848a93;
        }
    }
    ul{
        background: #fff;
        li{
            display: flex;
            border-bottom: 1px solid #eff2f7;
            justify-content: space-between;
            padding: 0 40px;
            line-height: 100px;           
            span{
                font-size: 28px;
            }
            span:nth-of-type(2){
                color: #848a93;
            }
        }
    }
}

</style>