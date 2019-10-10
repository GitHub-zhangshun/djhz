<template>
    <div class="ManageAddress" :style="datashow?'':styleObject">
        <ul v-if="datashow">
            <li v-for="(item, index) in addressList" :key="index">
                <van-swipe-cell :right-width="65" :on-close="onClose">
                    <div class="content">
                        <img src="@/assets/images/check_address.png" v-if="showIconLabel == item.id">
                        <div>
                            <div class="left" @click="selectAddress(item.id)">
                                <p class="header">
                                    <span class="color_black">{{ item.userName }}</span>
                                    <span class="color_black">{{ item.phone }}</span>
                                </p>
                                <p class="adress"><img src="@/assets/images/ticket/default.png" alt="" v-if="item.isDefault">{{ item.roughlyAddress }}&emsp;{{ item.address }}</p>
                            </div>
                            <div class="right" @click="$router.push({path: '/submitticket/editaddress', query:{type:'edit', id:item.id}})">
                                <img src="@/assets/images/ticket/Edit.png" alt="">
                            </div>
                        </div>
                    </div>
                    <p slot="right" @click="del(item.id)">删除</p>
                </van-swipe-cell>
            </li>
        </ul>
        <div class="noAdress" v-else>
            <img src="@/assets/images/ticket/noAdress.png" alt="暂无收货地址">
        </div>
        <button><span>+</span><span class="text_size_30" @click="$router.push('/submitticket/editaddress')">新增收货地址</span></button>
    </div>
</template>

<script>
import { SwipeCell, Toast } from 'vant';
    export default {
        components:{
            'van-swipe-cell':SwipeCell
        },
        methods:{
            onClose(clickPosition, instance){
                switch (clickPosition) {
                    case 'left':
                    case 'cell':
                    case 'outside':
                    instance.close();
                    break;
                    case 'right':
                    this.$dialog.confirm({
                        message: '确定删除吗？'
                    }).then(() => {
                        instance.close();
                        this.$axios('user_user_addressdel',[this.selectId])
                        .then(data => {
                            console.log(data)
                            // if(data.code != 0){
                            //     Toast({message:data.msg, duration:2000});
                            // }else{
                                this.getAddressList()
                                Toast.success({message:"删除成功", duration:2000});
                            // }
                        }).catch(() => {})
                    }).catch(() => {
                        instance.close();
                    });
                    break;
                }
            },
            del(id){
                this.selectId = id
                if(this.addressList.length==0){
                    this.datashow = false
                }
            },

            //获取地址列表
            getAddressList(){
                this.$axios('user_user_getaddressbyuserid')
                .then(data => {
                    Toast.clear()
                    this.addressList = data.result
                    if(data.result.length==0){
                        this.datashow = false
                    }

                    if(this.$route.query.type == 'select'){
                        if(sessionStorage.addressIdToSubmit){
                            this.showIconLabel = sessionStorage.getItem('addressIdToSubmit').slice(1,sessionStorage.getItem('addressIdToSubmit').length-1)
                        }else{    
                            this.showIconLabel = data.result.filter(item => {
                                return item.isDefault == true
                            })[0].id

                        }
                    }
                })
                .catch(() => {
                    Toast.clear()
                })
            },

            //选择该地址
            selectAddress(id){
                if(this.$route.query.type == 'select'){
                    this.showIconLabel = id
                    sessionStorage.setItem('addressIdToSubmit',JSON.stringify(id))
                    this.$router.go(-1)
                }
            }   
        },
        data(){
            return{
                datashow:true,//有无数据的切换
                styleObject: {
                    minHeight: '100vh',
                    background: '#FEFEFE'
                },
                addressList:[],   //地址数组
                selectId:'',
                showIconLabel:''
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            })
            this.getAddressList()
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
    padding: 0;
}
.ManageAddress{
    padding: 20px;
    ul{
        li{
            overflow: hidden;
            margin-bottom: 20px;
            /deep/.van-swipe-cell{
                .van-swipe-cell__wrapper{
                    border-radius: 10px;
                    background: #fff;
                    .content{
                        min-height: 144px;
                        border-radius: 10px;
                        // background: #fff;
                        padding: 20px 30px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        &>img{
                            width: 32px;
                            height: 32px;
                            margin-right: 28px;
                        }
                        &>div{
                            display: flex;
                            flex: 1;
                            align-items: center;
                            justify-content: space-between;
                            .left{
                                .header{
                                    padding-bottom: 30px;
                                    span:first-child{
                                        font-size: 34px;
                                        padding-right: 30px;
                                    }
                                    span:last-child{
                                        font-size: 26px;
                                    }
                                }
                                .adress{
                                    width: 537px;
                                    line-height: 1.5;
                                    img{
                                        width: 88px;
                                        height: 36px;
                                        margin-right: 20px;
                                    }
                                }
                            }
                            .right{
                                flex: 1;
                                text-align: right;
                                img{
                                    width: 24px;
                                    height: 25px;
                                }
                            }
                        }
                    }
                    .van-swipe-cell__right{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 118px;
                        color: #fff;
                        background: red;
                        border-radius: 10px;
                    }
                }               
            }
        }
    }
    .noAdress{
        padding: 80px 0 0;
        display: flex;
        justify-content: center;
        img{
            width: 260px;
            height: 179px;
        }
    }
    button{
        margin: 60px auto 0;
        width: 480px;
        height: 86px;
        border-radius: 86px;
        border:1px solid #ababab;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        span:first-child{
            padding-right: 20px;
            font-size: 60px;
        }
        span:last-child{
            padding-top: 10px;
        }
    }
}

</style>