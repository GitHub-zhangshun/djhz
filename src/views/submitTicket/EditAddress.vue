<template>
<!-- 编辑地址 -->
    <div class="editorAdress">
        <ul>
            <li>
                <span>收货人</span>
                <input type="text" placeholder="收货人姓名" v-model="name">
            </li>
            <li>
                <span>联系电话</span>
                <input type="text" placeholder="请输入手机号" v-model="tel">
            </li>
            <li>
                <span>所在地区</span>
                <div class="choose" @click="areaShow">
                    <span>{{PCC==""?'请选择':PCC}}</span>
                    <div>
                        <img src="@/assets/images/index/Path.png" alt="">
                    </div>
                </div>
            </li>
            <li class="textarea">
                <textarea placeholder="请输入详细地址" maxlength="25" v-model="desc"></textarea>
                <p class="remaining">{{remnant}}/25</p>
            </li>
        </ul>
        <div class="chooseDefault">
            <span>设为默认地址</span>
            <van-switch
                v-model="checked"
                active-color="#f5ab0b"
                inactive-color="#e2e2e2"
            />
        </div>
        <van-button round type="danger" :loading="loading" class="save color_white" loading-text="加载中..." @click="saveAdress">保存收货地址</van-button>
        <van-popup v-model="areaPopupshow" position="bottom">
            <van-area :area-list="areaList"  @confirm="onconfirm" @cancel="onCancel"/>
        </van-popup>
    </div>
</template>

<script>
import { Switch,Popup,Area,Toast  } from 'vant';
import area from '@/libs/area'
import {checkPhone} from '@/libs/publicFun'
import { setTimeout } from 'timers';
export default {
    components:{
        'van-switch':Switch,
        'van-popup':Popup,
        'van-area':Area,
    },
    data(){
        return{
            name:'',
            tel:'',
            checked:true,
            areaPopupshow:false,
            areaList:area,
            PCC:'',
            remnant:0,
            desc:'',
            loading:false,
        }
    },
    watch:{
        desc(){
            this.descInput()
        }
    },
    methods:{
        areaShow(){
            this.areaPopupshow = true
        },
        onCancel(){
            this.areaPopupshow = false
        },
        onconfirm(value){
            this.areaPopupshow = false
            this.PCC = `${value[0].name} ${value[1].name} ${value[2].name}`
        },
        descInput(){
            var txtVal = this.desc.length;
            this.remnant = 0 +  txtVal;
        },

        //保存地址
        saveAdress(){
            if(this.name==''){
                Toast({message:'收货人不能为空',duration:2000})
                return
            }
            if(!checkPhone(this.tel)){
                Toast({message:'联系电话格式不正确',duration:2000})
                return
            }
            if(this.PCC==''){
                Toast({message:'请选择所在地区',duration:2000})
                return
            }
            if(this.desc==''){
                Toast({message:'请输入详细地址',duration:2000})
                return
            }
            
            this.loading = true;

            if(this.$route.query.type == 'edit'){
                //修改
                this.$axios(
                    'user_user_addressedit',
                    {userName:this.name, phone:this.tel, roughlyAddress:this.PCC, address:this.desc, isDefault:this.checked, id:this.$route.query.id }
                ).then(data => {
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    //     this.loading = false
                    // }else{
                        this.loading = false
                        this.$router.go(-1)
                    // }
                }).catch(() => { this.loading = false })
            }else{
                //新增
                this.$axios(
                    'user_user_addressadd',
                    {userName:this.name, phone:this.tel, roughlyAddress:this.PCC, address:this.desc, isDefault:this.checked }
                ).then(data => {
                    // if(data.code != 0){
                    //     Toast({message:data.msg, duration:2000})
                    // }else{
                        this.loading = false
                        this.$router.go(-1)
                    // }
                }).catch(() => { this.loading = false })
            }
        }
    },
    created(){
        if(this.$route.query.type == 'edit'){
            document.title = '编辑'
            this.$axios('user_user_getaddressbyid',this.$route.query.id)
            .then(data => {
                let rst = data.result
                this.name = rst.userName
                this.tel = rst.phone
                this.PCC = rst.roughlyAddress
                this.desc = rst.address
                this.checked = rst.isDefault
            }).catch(() => {})
        }else{
            document.title = '新增'
        }
    }

}
</script>

<style scoped lang="less">
p{
    margin: 0
}
.editorAdress{
    ul{
        li{
            position: relative;
            background: #fff;
            font-size: 28px;
            padding: 0 30px;
            height: 100px;
            display: flex;
            align-items: center;
            border: 1px solid #F1F2F5;
            &>span{
                display: block;
                width: 180px;
            }
            input{
                flex: 1;
                font-weight: bold;
            }
            input::placeholder{
                font-weight: normal;
            }
            .choose{
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                div{
                    padding-left: 10px;
                    width: 26px;
                    img{
                        width: 100%;
                    }
                }
            }
            
        }
        .textarea{
            padding: 15px 30px;
            textarea{
                line-height: 1.2;
                font-weight: bold;
                width: 100%;
                height: calc(100% - 30px);
                padding: 30px 0 0;
            }
            textarea::placeholder{
                font-weight: normal;
            }
            .remaining{
                position: absolute;
                right: 30px;
                bottom: 15px;
            }
        }
    }
    .chooseDefault{
        margin-top: 20px;
        padding: 0 30px;
        background: #fff;
        display: flex;
        justify-content: space-between;
        height: 100px;
        align-items: center;
        .van-switch{
            height: 48px;
            width: 102px;
            .van-switch__node{
                width: 36px;
                height: 36px;
                top: 50%;
                left: 6px;
                transform: translateY(-50%);
            }
        }
        .van-switch--on{
            .van-switch__node{
                top: 50%;
                transform: translate(1em,-50%);
            }
        }
    }
    .save{
        display: flex;
        justify-content: center;
        margin: 82px auto 0;
        width: 642px;
        height: 92px;
        border-radius: 92px;
        background: #f5ab0b;
        border: none;
        span{
            font-size: 30px;
        }
    }
    /deep/.van-popup{
        .van-picker{
            .van-hairline--top-bottom{
                padding: 10px 0;
                .van-picker__cancel,
                .van-picker__confirm{
                    font-size: 28px;
                }
            }
            .van-picker__columns{
                ul{
                    li{
                        font-size: 28px;
                    }
                }
            }
        }
    }
}
</style>