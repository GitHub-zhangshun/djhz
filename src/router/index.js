import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/Layout.vue'
//消息
import messageRouter from './message'

let Personal
if(0==0){
    Personal = require('@/views/personal/Personal2.vue')
}else{
    Personal = require('@/views/personal/Personal.vue')
}

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: 'index',
            component: layout,
            children: [
                //首页
                {
                    path: 'index',
                    name: 'index',
                    component: (resolve) => require(['@/views/index.vue'], resolve),
                    meta: {
                        title: '首页'
                    }
                },
                //商城
                {
                    path: 'product',
                    name: 'product',
                    component: (resolve) => require(['@/views/product/Product.vue'], resolve),
                    meta: {
                        title: '商城'
                    }
                },
                //优惠金
                {
                    path: 'preferential_gold',
                    name: 'preferential_gold',
                    component: (resolve) => require(['@/views/preferential_gold/preferential_gold_index.vue'], resolve),
                    meta: {
                        title: '投资金'
                    }
                },
                //菜单-->购物车
                {
                    path: 'ShowCarIndex',
                    name: 'ShowCarIndex',
                    component: (resolve) => require(['@/views/showCar/ShowCarIndex.vue'], resolve),
                    meta: {
                        title: '购物车',
                        // requireAuth: true,
                    }
                },
                //个人中心
                {
                    path: 'personal',
                    name: 'personal',
                    component: Personal.default,
                    meta: {
                        title: '个人中心',
                    }
                },
            ]
        },
        //商品详情-->购物车
        {
            path: '/showCarDetail',
            name: 'showCarDetail',
            component: (resolve) => require(['@/views/showCar/showCarDetail.vue'], resolve),
            meta: {
                title: '购物车'
            }
        },
        //商品详情
        {
            path: '/product/detail',
            component: (resolve) => require(['@/views/product/Detail.vue'], resolve),
            meta: {
                title: '商品详情'
            }
        },
        //商品下架
        {
            path: '/product/nodata',
            component: (resolve) => require(['@/components/NoProduct.vue'], resolve),
            meta: {
                title: '商品下架'
            }
        },
        // 消息
        {
            path: '/message',
            component: (resolve) => require(['@/views/message/Message.vue'], resolve),
            redirect: '/message/announcement',
            children: [
                ...messageRouter
            ]
        },
        //公告详情
        {
            path: '/message/annoucementdetail',
            component: (resolve) => require(['@/views/message/Annoucementdetail.vue'], resolve),
        },
        //提醒详情
        {
            path: '/message/noticedetail',
            component: (resolve) => require(['@/views/message/NoticeDetail.vue'], resolve),
            meta: {
                title: '提醒详情',
                requireAuth: true,
            }
        },
        //提交订单
        {
            path: '/submitticket',
            component: (resolve) => require(['@/views/submitTicket/SubmitTicket.vue'], resolve),
            meta: {
                title: '提交订单',
                requireAuth: true,
            }
        },
        //管理收货地址
        {
            path: '/submitticket/manageaddress',
            component: (resolve) => require(['@/views/submitTicket/ManageAddress.vue'], resolve),
            meta: {
                title: '收货地址',
                requireAuth: true,
            }
        },
        //编辑 新增收货地址
        {
            path: '/submitticket/editaddress',
            component: (resolve) => require(['@/views/submitTicket/EditAddress.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        //开具发票
        {
            path: '/submitticket/invoice',
            component: (resolve) => require(['@/views/submitTicket/invoice.vue'], resolve),
            meta: {
                title: '开具发票',
                requireAuth: true
            }
        },
        //门店列表
        {
            path: '/submitticket/store',
            component: (resolve) => require(['@/views/submitTicket/Store.vue'], resolve),
            meta: {
                title: '门店列表',
                requireAuth: true
            }
        },
        //选择城市
        {
            path: '/submitticket/position',
            component: (resolve) => require(['@/views/submitTicket/Position.vue'], resolve),
            meta: {
                title: '选择城市',
                requireAuth: true
            }
        },
        //门店详情
        {
            path: '/submitticket/storedetail',
            component: (resolve) => require(['@/views/submitTicket/StoreDetail.vue'], resolve),
            meta: {
                title: '门店详情',
                requireAuth: true
            }
        },
        //黄金回收
        {
            path: '/recyclingGoldIndex',
            component: (resolve) => require(['@/views/recyclingGold/recyclingGoldIndex.vue'], resolve),
            meta: {
                title: '黄金回收'
            }
        },
        //我的回收订单列表
        {
            path: '/myRecycling',
            component: (resolve) => require(['@/views/recyclingGold/myRecycling.vue'], resolve),
            meta: {
                title: '我的回收'
            }
        },
        //设置密码
        {
            path: '/personal/setpassword',
            component: (resolve) => require(['@/views/personal/SetPassword.vue'], resolve),
            meta: {
                title: '设置登录密码',
                requireAuth: true,
            }
        },
        //订单
        {
            path: '/personal/ticket',
            component: (resolve) => require(['@/views/personal/Ticket.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        //订单详情
        {
            path: '/personal/ticketdetail',
            component: (resolve) => require(['@/views/personal/TicketDetail.vue'], resolve),
            meta: {
                title: '订单详情',
                requireAuth: true
            }
        },
        //物流详情
        {
            path: '/personal/delivery',
            component: (resolve) => require(['@/views/personal/Delivery.vue'], resolve),
            meta: {
                title: '物流详情',
                requireAuth: true
            }
        },

        //黄金单
        {
            path: '/personal/invest/goldticket',
            component: (resolve) => require(['@/views/personal/invest/GoldTicket.vue'], resolve),
            meta: {
                title: '黄金单',
                requireAuth: true
            }
        },
        //黄金单详情
        {
            path: '/personal/invest/goldticketdetail',
            component: (resolve) => require(['@/views/personal/invest/GoldTicketDetail.vue'], resolve),
            meta: {
                title: '订单详情',
                requireAuth: true
            }
        },
        //出租单
        {
            path: '/personal/invest/rentticket',
            component: (resolve) => require(['@/views/personal/invest/RentTicket.vue'], resolve),
            meta: {
                title: '出租单',
                requireAuth: true
            }
        },
        //出租单详情
        {
            path: '/personal/invest/rentticketdetail',
            component: (resolve) => require(['@/views/personal/invest/RentTicketDetail.vue'], resolve),
            meta: {
                title: '订单详情',
                requireAuth: true
            }
        },
        //提货单
        {
            path: '/personal/invest/taketicket',
            component: (resolve) => require(['@/views/personal/invest/TakeTicket.vue'], resolve),
            meta: {
                title: '提货单',
                requireAuth: true
            }
        },
        //提货单详情
        {
            path: '/personal/invest/taketicketdetail',
            component: (resolve) => require(['@/views/personal/invest/TakeTicketDetail.vue'], resolve),
            meta: {
                title: '订单详情',
                requireAuth: true
            }
        },
        //我的金库
        {
            path: '/personal/mygold',
            component: (resolve) => require(['@/views/personal/MyGold.vue'], resolve),
            meta: {
                title: '我的金库',
                requireAuth: true
            }
        },
        //出租确认
        {
            path: '/personal/invest/rentconfirm',
            component: (resolve) => require(['@/views/personal/invest/RentConfirm.vue'], resolve),
            meta: {
                title: '出租确认',
                requireAuth: true
            }
        },
        //提金确认
        {
            path: '/personal/invest/takeconfirm',
            component: (resolve) => require(['@/views/personal/invest/TakeConfirm.vue'], resolve),
            meta: {
                title: '提金确认',
                requireAuth: true
            }
        },
        //提交成功
        {
            path: '/personal/success',
            component: (resolve) => require(['@/views/personal/SuccessPage.vue'], resolve),
            meta: {
                title: '提交成功',
                requireAuth: true
            }
        },
        
        //我的回收订单详情
        {
            path: '/myRecycling/orderInfo',
            component: (resolve) => require(['@/views/recyclingGold/orderInfo.vue'], resolve),
            meta: {
                title: '订单详情'
            }
        },
        //我要卖金
        {
            path: '/sellGold',
            component: (resolve) => require(['@/views/recyclingGold/sellGold.vue'], resolve),
            meta: {
                title: '我要卖金',
                keepAlive:true
            }
        },
        //我要卖金订单提交结果页
        {
            path: '/orderSubmitResult',
            component: (resolve) => require(['@/views/recyclingGold/orderSubmitResult.vue'], resolve),
            meta: {
                title: '提交成功'
            }
        },
        // 黄金租赁
        {
            path: '/leaseGold',
            component: (resolve) => require(['@/views/leaseGold/leaseGold.vue'], resolve),
            meta: {
                title: '租赁黄金'
            }
        },
        // 我要租赁订单列表
        {
            path: '/myLease',
            component: (resolve) => require(['@/views/leaseGold/myLease.vue'], resolve),
            meta: {
                title: '我的订单'
            }
        },
        // 我要租赁订单详情
        {
            path: '/leaseOrderInfo',
            component: (resolve) => require(['@/views/leaseGold/leaseOrderInfo.vue'], resolve),
            meta: {
                title: '订单详情'
            }
        },
        // 我要租赁订单填写
        {
            path: '/leaseOrderSubmit',
            component: (resolve) => require(['@/views/leaseGold/leaseOrderSubmit.vue'], resolve),
            meta: {
                title: '填写订单',
            }
        },
        //联系客服
        {
            path: '/chat',
            component: (resolve) => require(['@/views/Chat.vue'], resolve),
            meta: {
                title: '联系客服'
            }
        },
        //登录
        {
            path: '/login',
            component: (resolve) => require(['@/views/Login.vue'], resolve),
            meta: {
                title: '登录'
            }
        },
        // 充值
        {
            path: '/personal/chargemoney',
            component: (resolve) => require(['@/views/personal/ChargeMoney.vue'], resolve),
            meta: {
                title: '充值',
                requireAuth: true
            }
        },
        // 提现
        {
            path: '/personal/takemoney',
            component: (resolve) => require(['@/views/personal/TakeMoney.vue'], resolve),
            meta: {
                title: '提现',
                requireAuth: true,
            }
        },
        // 提现结果
        {
            path: '/personal/takeresult',
            component: (resolve) => require(['@/views/personal/TakeResult.vue'], resolve),
            meta: {
                title: '提现结果',
                requireAuth: true,
            }
        },
        // 充值/提现记录
        {
            path: '/personal/moneyrecord',
            component: (resolve) => require(['@/views/personal/MoneyRecord.vue'], resolve),
            meta:{
                requireAuth: true
            }
        },
        //账单列表
        {
            path: '/personal/billList',
            component: (resolve) => require(['@/views/personal/billList.vue'], resolve),
            meta: {
                title: '账单',
                requireAuth: true
            }
        },
        //账单详情
        {
            path: '/personal/billInfo',
            component: (resolve) => require(['@/views/personal/billInfo.vue'], resolve),
            meta: {
                title: '账单',
                requireAuth: true
            }
        },       
        //设置
        {
            path: '/personal/setting',
            component: (resolve) => require(['@/views/personal/setting.vue'], resolve),
            meta: {
                title: '设置',
                requireAuth: true,
            }
        },
        //设置昵称
        {
            path: '/personal/setting/setName',
            component: (resolve) => require(['@/views/personal/setName.vue'], resolve),
            meta: {
                title: '设置昵称',
                requireAuth: true,
            }
        },
        //已实名认证
        {
            path: '/personal/setting/isRealName_true',
            component: (resolve) => require(['@/views/personal/isRealName_true.vue'], resolve),
            meta: {
                title: '银行存管账户',
                requireAuth: true,
            }
        },
        //未实名认证
        {
            path: '/personal/setting/isRealName_false',
            component: (resolve) => require(['@/views/personal/isRealName_false.vue'], resolve),
            meta: {
                title: '实名认证',
                requireAuth: true,
            }
        },
        //设置交易密码
        {
            path: '/personal/setting/trade_password',
            component: (resolve) => require(['@/views/personal/trade_password.vue'], resolve),
            meta: {
                title: '设置交易密码',
                requireAuth: true,
            }
        },
        //修改交易密码
        {
            path: '/personal/setting/reset_trade_password',
            component: (resolve) => require(['@/views/personal/reset_trade_password.vue'], resolve),
            meta: {
                title: '修改交易密码',
                requireAuth: true,
            }
        },
        //我的银行卡
        {
            path: '/personal/setting/myBankCard',
            component: (resolve) => require(['@/views/personal/myBankCard.vue'], resolve),
            meta: {
                title: '我的银行卡',
                requireAuth: true
            }
        },
        //添加银行卡
        {
            path: '/personal/setting/myBankCard/bindCard',
            component: (resolve) => require(['@/views/personal/bindCard.vue'], resolve),
            meta: {
                title: '添加银行卡',
                requireAuth: true
            }
        },
        //银行存管账户
        {
            path: '/personal/setting/bankDepositAccount',
            component: (resolve) => require(['@/views/personal/bankDepositAccount.vue'], resolve),
            meta: {
                title: '银行存管账户',
                requireAuth: true
            }
        },
        //修改登录密码
        {
            path: '/personal/setting/setLoginPwd',
            component: (resolve) => require(['@/views/personal/setLoginPwd.vue'], resolve),
            meta: {
                title: '修改登录密码',
                requireAuth: true
            }
        },
        //找回登录密码
        {
            path: '/personal/setting/forgetPwd',
            component: (resolve) => require(['@/views/personal/forgetPwd.vue'], resolve),
            meta: {
                title: '找回登录密码'
            }
        },
        //更换登录手机号 第一步
        {
            path: '/personal/setting/changePhonePwd',
            component: (resolve) => require(['@/views/personal/changePhonePwd.vue'], resolve),
            meta: {
                title: '更换登录手机号',
                requireAuth: true
            }
        },
        //更换登录手机号 第二步
        {
            path: '/personal/setting/changePhone',
            component: (resolve) => require(['@/views/personal/changePhone.vue'], resolve),
            meta: {
                title: '更换登录手机号',
                requireAuth: true
            }
        },
        //金价走势图
        {
            path: '/goldTrendChart',
            component: (resolve) => require(['@/views/goldTrendChart.vue'], resolve),
            meta: {
                title: '金价走势'
            }
        },
        //购买记录
        {
            path: '/recored',
            component: (resolve) => require(['@/views/preferential_gold/recored.vue'], resolve),
            meta: {
                title: '购买记录'
            }
        },
        //优惠金填写订单
        {
            path: '/submit_order',
            component: (resolve) => require(['@/views/preferential_gold/submit_order.vue'], resolve),
            meta: {
                title: '填写订单',
            }
        },
        //优惠金填写订单
        {
            path: '/result',
            component: (resolve) => require(['@/views/preferential_gold/result.vue'], resolve),
            meta: {
                title: '支付成功'
            }
        },
        //了解我们
        {
            path: '/about',
            component: (resolve) => require(['@/views/about.vue'], resolve),
            meta: {
                title: '了解我们'
            }
        },
        //安全保障
        {
            path: '/security',
            component: (resolve) => require(['@/views/security.vue'], resolve),
            meta: {
                title: '安全保障'
            }
        },
        //隐私政策
        {
            path: '/privacy_policy',
            component: (resolve) => require(['@/views/privacy_policy.vue'], resolve),
            meta: {
                title: '隐私政策'
            }
        },
        //帮助中心
        {
            path: '/help_center',
            component: (resolve) => require(['@/views/personal/help_center.vue'], resolve),
            meta: {
                title: '帮助中心'
            }
        },
        // 中转页
        {
            path: '/redirect',
            component: (resolve) => require(['@/views/redirect.vue'], resolve),
            meta: {
                title: '跳转中...'
            }
        },
        //403
        {
            path: '/403',
            component: (resolve) => require(['@/views/403Page.vue'], resolve),
            meta: {
                title: '网络异常，请检查网络设置或稍后重试'
            }
        },
        //403
        {
            path: '/sku',
            component: (resolve) => require(['@/views/Sku.vue'], resolve),
            meta: {
                title: 'sku'
            }
        },
        //404
        {
            path: '/404',
            component: (resolve) => require(['@/views/404NotFound.vue'], resolve),
            meta: {
                title: '找不到页面'
            }
        },
        {
            path: '*', 
            redirect: "/404"
        },
    ]
})
