<template>
    <div class="shoppingCar">
        <div class="shopcar" v-if="show == 0">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                >
                <showCarDetail v-model="carDetails"></showCarDetail>
                </van-list>
            </van-pull-refresh>
            <div class="SubmitBar bg_white">
                <div class="left">
                    <van-checkbox v-model="checked" @click="check">
                    全选
                    <img
                        slot="icon"
                        slot-scope="props"
                        :src="props.checked ? icon.active : icon.normal"
                    >
                    </van-checkbox>
                </div>
                <div class="right">
                    <p v-if="showDeleted">合计：<span>¥{{money}}</span></p>
                    <button v-if="showDeleted" class="text_size_32 color_white" @click="settlement">结算</button>
                    <button v-else class="text_size_32 color_white" @click="deleted">删除</button>
                </div>
            </div>
        </div>    
        <div v-if="show == 1" class="noLogin">
            <div class="img">
                <img src="@/assets/images/showCar/noLogin.png" alt="">
            </div>
            <button class="bg_gold color_white text_size_32 goLogin" @click="$router.push('/login')">去登录</button>
        </div>
        <div v-if="show == 2" class="noList">
            <div class="img">
                <img src="@/assets/images/showCar/noList.png" alt="">
            </div>
            <p class="text_center text_size_28 color_gray">购物车是空的</p>
            <button class="bg_gold color_white text_size_32" @click="$router.push('/product')">去逛逛</button>
        </div>
    </div>
    
</template>

<script>
import store from '@/store/store' //vuex
import { Checkbox, Toast , List , Dialog  } from 'vant';
import { getToken } from '@/libs/auth'
import { number_format } from '@/libs/publicFun'
import showCarDetail from '@/components/showCar'
    export default {
        components:{
            showCarDetail,
            'van-checkbox':Checkbox,
            'van-list':List
        },
        data(){
            return{
                loading: false,
                finished: false,
                isLoading: false,
                show:-1,
                money:0,
                checked: false,
                icon: {
                    normal: require('@/assets/images/noSelect.png'),
                    active: require('@/assets/images/select.png')
                },
                carDetails: [],
                page : 1,
            }
        },
        computed:{
            showDeleted(){
                return store.state.showDeleted
            }
        },
        methods:{
            //上拉加载
            onLoad() {
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                }); 
                // 异步更新数据
                this.$axios('center_order_cartgoodsbypage',{"index": this.page,"size": 20})
                .then( res => {    
                    Toast.clear()           
                    if(res.result.length == 0 && this.page==1){
                        this.show = 2
                        return
                    }
                    if(this.page == 1){
                        this.carDetails = []
                    }
                    this.show = 0
                    res.result.forEach( i => {
                        if(!i.isInvalid){
                            i["checked"] = false
                        }else{
                            i["checked"] = this.checked    
                        } 
                        this.carDetails.push(i)                    
                    })
                    this.isLoading = false
                    this.loading = false;
                    this.page++;
                    if(res.result.length <20){
                        this.finished = true
                    }
                })
            },
            //下拉刷新
            onRefresh() {
                this.page = 1
                this.onLoad()
            },
            //删除
            deleted(){
                if(!this.carDetails.find(i => i.checked==true)){
                    Toast({message:'请先勾选需要删除的商品哦~',duration:2000})
                    return
                }
                Dialog.confirm({
                    message: '确认删除嘛？'
                }).then(() => {
                    let a = this.carDetails
                    let obj = []
                    this.carDetails.forEach( i => {
                        if(i.checked){
                            obj.push(i.id)
                        }
                    })                    
                    this.$axios('order_order_cartgoodsdel',obj)
                    .then( res => {
                        if(res.code == 0){
                            this.carDetails = a.filter(item => item.checked !== true)
                            if(this.carDetails.length==0){
                                this.show = 2
                            }
                            Toast({message:'删除成功',duration:2000})
                        }else{
                            Toast({message:res.msg,duration:2000})
                        }
                    })
                }).catch(() => {
                // on cancel
                })
                
            },
            // 结算
            settlement(){
                if(!this.carDetails.find(i => i.checked==true)){
                    Toast({message:'请先勾选需要结算的商品哦~',duration:2000})
                    return
                }
                // if(!JSON.parse(sessionStorage.getItem('userInfo')).isOpenDeyAccount){

                // }
                let productList = []
                this.carDetails.forEach( i => {                    
                    if(i.checked == true){
                        productList.push(i.id)
                    }
                })
                sessionStorage.setItem('productList',JSON.stringify(productList))
                this.$router.push({path:'/submitticket', query: {source:'shopcar'}})
            },
            //全选-->修改列表所有的选中状态
            check(){
                if(this.showDeleted){
                    this.carDetails.forEach(i => {
                        if(!i.isInvalid){
                            i.checked = false
                        }else{
                            i.checked = this.checked
                        }
                    })                  
                }else{
                    this.carDetails.forEach(i => {
                        i.checked = this.checked
                    })
                }
            },
            // 总价
            getSum(data){
                this.money = '0.00'
                data.map(i => {
                    if(i.checked){
                        this.money = Number(this.money) + Number(i.unitPrice) * Number(i.count) 
                    }
                });
                this.money = number_format(this.money,2,'.',',')
            },
        },
        watch:{ 
            carDetails:{
                deep:true,
                handler(){           
                    if(this.showDeleted){
                        let a = []
                        this.carDetails.forEach( i => {
                            if(i.isInvalid){
                                a.push(i)
                            }
                        })
                        this.checked = !a.find(i => i.checked === false)
                    }else{
                        this.checked = !this.carDetails.find(i => i.checked === false)
                    }
                    this.getSum(JSON.parse(JSON.stringify(this.carDetails)))
                }
            },
            showDeleted(){
                if(!this.showDeleted){
                    this.checked = !this.carDetails.find(i => i.checked === false)
                }
            }
        },
        created(){
            if(getToken()){
                this.page = 1
                this.onLoad()
            }else{
                this.show = 1
            }
        },
        beforeDestroy(){
            this.$store.commit({type:'management',showDeleted:true})
        }
    }
</script>

<style scoped lang='less'>
.shoppingCar{
    .shopcar{
        .van-pull-refresh{
            .van-pull-refresh__track{
                .van-list{                  
                    .car{
                        min-height: calc(100vh - 142px);
                    }
                }
            }   
        }
        .SubmitBar{
            position: fixed;
            bottom:0;
            width: calc(100% - 60px);
            height: 88px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right{
                display: flex;
                align-items: center;
                p{
                    padding-right: 22px;
                    font-size: 32px;
                    span{
                        color:#FF8025;
                    }
                }
                button{
                    width: 180px;
                    height: 68px;
                    border-radius: 68px;
                    background: #FF8025;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .left{
            padding-right: 20px;
            /deep/.van-checkbox{
                .van-checkbox__icon{
                    width: 32px;
                    height: 32px;
                    img{
                        width: 100%;
                        height: 31px;
                    }
                }
            }
        }
    }
    .noList,.noLogin{
        display: flex;
        flex-flow: column;
        align-items: center;
        .img{
            width: 216px;
            margin: 0 auto;
            img{
                width: 100%;
                padding-top: 150px;
            }
        }
        &>p{
            margin: 30px 0;
        }
        button{
            width: 362px;
            height: 82px;
            border-radius: 82px;
        }
        .goLogin{
            margin-top: 80px;
        }
    }

}
</style>