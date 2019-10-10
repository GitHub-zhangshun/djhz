import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showDeleted:true,//购物车删除
        isShowSku:false,    //商品规格弹出层
        buyWay:'immediately',   // immediately later
        takeWay:'delivery',      // delivery gostore
        carNumber: 0,   //购物车添加数量
        bespokesId:'',   //预约金id
        interface:'',//全局的接口
        isShowOpenAccountPop:false,  //开通存管弹框
        isShowToast:false,   //各种提示弹框
        toastType: 0,   //提示类型   实名认证（1）、绑卡（2）、设置交易密码（3）、确认支付（4）、支付密码不正确（5）
        paymoney:0,   //支付金额
        isShowBankCard:false,  //银行卡绑卡弹框
        isShowPwdInput:false,  //交易密码输入框
        apiKeyName:'',//api的key,
        leaseOrderSubmit:"",//租赁表单填写数据
        sellGold:"",//回收表单填写数据
    },
    mutations: {
        //更改apikey的名称
        apiKeyNameFun(state,obj){
            state.apiKeyName = obj.b
        },
        //购物车管理
        management(state,obj){
            state.showDeleted = obj.showDeleted
        },
        //接口方法
        JK_interface(state,obj){
            state.interface = obj.result
        },
        
        //显示sku规格
        m_toShowSku(state) {
            state.isShowSku = true
        },
        //隐藏sku规格
        m_toHideSku(state, obj) {
            state.isShowSku = obj.isShow
            state.carNumber = obj.addNum
        },
        // 预约还是立即购买
        m_changeBuyWay(state,obj){
            state.buyWay = obj.way
        },
        // 送货还是上门自提
        m_changeTakeWay(state,obj){
            state.takeWay = obj.way
        },

        //预约金选择
        m_selectBespokes(state,obj){
            state.bespokesId = obj.bespokesId
        },

        //显示存管弹框
        m_toShowOpenAccount(state){
            state.isShowOpenAccountPop = true
        },
        //隐藏存管弹框
        m_toHideOpenAccount(state){
            state.isShowOpenAccountPop = false
        },

        //显示各种提示框
        m_toShowToast(state,obj){
            state.isShowToast = obj.showToast
            state.toastType = obj.hintType
            state.paymoney = obj.needpaymoney
        },
        //隐藏各种提示框
        m_toHideToast(state,obj){
            state.isShowToast = obj.showToast
            state.toastType = obj.hintType
            state.paymoney = obj.needpaymoney
        },

        //显示银行卡绑卡
        m_toShowBankCard(state){
            state.isShowBankCard = true
        },
        //隐藏银行卡绑卡
        m_toHideBankCard(state){
            state.isShowBankCard = false
        },

        //显示密码输入键盘
        m_toShowPwdInput(state){
            state.isShowPwdInput = true
        },

        //隐藏密码输入键盘
        m_toHidePwdInput(state){
            state.isShowPwdInput = false
        },
        //租赁表单填写数据
        m_leaseOrderSubmit(state,obj){
            state.leaseOrderSubmit = obj.leaseOrderSubmit
        },
        //回收表单填写数据
        m_sellGold(state,obj){
            state.sellGold = obj.sellGold
        }
    },
    actions: {
        // a_getProduct(context){    
        //   //发送异步请求得到商品数据
        //   let arr = data.result
        //   context.commit({
        //       type: 'm_getProduct',
        //       data: arr
        //   })
        // }
    },
    getters: {

    },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        reducer(val) {
            return {
            // 只储存state中的user
            buyWay: val.buyWay,
            takeWay: val.takeWay,
            bespokesId: val.bespokesId,
            interface:val.interface
          }
       }
    })]
})
