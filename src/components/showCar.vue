<template>
    <div class="car">
        <div class="top">
            <button class="text_size_32" @click="management" v-if="switchBtn">管理</button>
            <button class="text_size_32" @click="managementOK" v-else>完成</button>
        </div>
        <div class="content">
            <ul>
                <li class="bg_white" v-for="(item, index) in value" :key="index">
                    <div class="radioImg">
                        <van-checkbox v-model="item.checked" v-if="state =='管理' || (state =='结算' && item.isInvalid)" @click="checkChoose">
                        <img
                            slot="icon"
                            slot-scope="props"
                            :src="props.checked ? icon.active : icon.normal"
                        >
                        </van-checkbox>
                        <div class="imgHidden" v-else></div>
                    </div>
                    <div class="rightContent">
                        <div class="content_img" @click="$router.push({path:'/product/detail',query:{id:item.goodsId}})">
                            <img :src="item.goodsImgLink?item.goodsImgLink:require('@/assets/images/product/product.png')" alt="">
                        </div>
                        <div class="contentRight">
                            <p class="title">{{item.goodsName}}</p>
                            <div class="colorWeight">
                                <div class="left">
                                    <span v-for="(item, index) in item.orderGoodsSpecList" :key="index">{{index==0?`${item.attrTxt}`:`/${item.attrTxt}`}}</span>
                                </div>
                                <span class="weight">商品克重：{{item.weight}}g</span>
                            </div>
                            <div class="moneyCount">
                                <span>￥{{item.unitPrice}}</span>
                                <van-stepper v-if="item.isInvalid" v-model="item.count" @change="onChange(item.id,item.count)"/>
                                <span v-else class="color_gray text_size_24">已下架</span>
                            </div>
                        </div>                       
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Checkbox,Stepper,Toast  } from 'vant';
    export default {
        components:{
            'van-checkbox':Checkbox,
            'van-stepper':Stepper
        },
        data(){
            return{
                state:'结算',
                switchBtn:true,//删除 完成切换
                checked: true,
                icon: {
                    normal: require('@/assets/images/noSelect.png'),
                    active: require('@/assets/images/select.png')
                },
            }
        },
        methods:{
            //完成
            managementOK(){
                this.state = '结算'
                this.switchBtn = true
                this.$store.commit({type:'management',showDeleted:true})
                this.value.forEach( i => {
                    if(!i.isInvalid){
                        i.checked = false
                    }
                })
            },
            //选择商品
            checkChoose(){
                this.$emit('input',this.value)
            },
            //商品数量
            onChange(id,count) {
                if(count==1){
                    Toast({message:'不能再减少啦~',duration:2000})
                    return
                }
                this.$axios('center_order_cartgoodsedit',{cartGoodsId:id,count:count})
               .then( res => {
                   if(res.code!=0){
                       Toast({message:res.msg,duration:2000})
                   }
               })
            },
            //管理
            management(){
                this.state = '管理'
                this.switchBtn = false
                this.$store.commit({type:'management',showDeleted:false})
            } 
        },
        props:{
            value:{
                type:Array
            },
        },
    }
</script>

<style scoped lang='less'>
p{
    margin: 0
}
.car{
    height: 100%;
    .top{
        width: calc(100% - 40px);
        height: 92px;
        display: flex;
        justify-content: flex-end;
        padding: 0 20px;
        button{
            background: transparent;
        }
    }
    .content{
        padding: 0 20px 20px;
        ul{
            li:last-child{
                margin-bottom: 0;
            }
            li{
                border-radius: 10px;
                box-shadow: 0 0 15px #e6e6e6;
                padding: 36px 20px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                .radioImg{
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
                    .imgHidden{
                        width: 32px;
                    }
                }
                .rightContent{  
                    flex: 1;
                    display: flex;     
                    justify-content: space-between;            
                    .content_img{
                        margin-right: 20px;
                        overflow: hidden;
                        border-radius: 10px;
                        width: 200px;
                        height: 168px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .contentRight{
                        flex: 1;
                        .title{
                            font-size: 22px;
                            text-align: justify;
                            padding-top: 10px;
                            line-height: 1.4;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }
                        .colorWeight{
                            font-size: 22px;
                            color:#ababab;
                            padding-top: 20px;
                            display: flex;
                            justify-content: space-between;
                            line-height: 1.5;
                            .weight{
                                min-width: 172px;
                            }
                        }
                        .moneyCount{
                            width: 100%;
                            padding-top: 30px;
                            display: flex;
                            justify-content: space-between;
                            span{
                                font-size: 32px;
                                color: #ff8124;
                            }
                            /deep/.van-stepper{
                                border: 2px solid #e2e2e2;
                                border-radius: 5px;
                                .van-stepper__minus,
                                .van-stepper__plus{
                                    background: #fff;
                                    margin: 0;
                                    padding: 0;
                                    width: 42px;
                                    height: 31px;
                                }
                                .van-stepper__input{
                                    padding: 0;
                                    line-height: 20px;
                                    font-size: 24px;
                                    margin: 0;
                                    background: #fff;
                                    width: 48px;
                                    height: 31px;
                                    border-right: 2px solid #e2e2e2;
                                    border-left: 2px solid #e2e2e2;
                                }
                                .van-stepper__minus:before{
                                    width: 18px;
                                    height: 1px;
                                }
                                .van-stepper__plus:before{
                                    width: 18px;
                                    height: 1px;
                                }
                                .van-stepper__plus:after{
                                    width: 1px;
                                    height: 18px;
                                }
                            }
                        }
                    }
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
}

</style>