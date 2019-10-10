// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();
import Vue from 'vue'
import App from './App'
import router from './router'
import { getToken } from '@/libs/auth'
import store from './store/store' //vuex
import { request } from '@/libs/request'
import { axios } from '@/libs/publicFun' //axios
// import fastclick from 'fastclick';

import { PullRefresh, Dialog, Button } from 'vant';
Vue.use(PullRefresh);
Vue.use(Dialog)
Vue.use(Button)

import '@/assets/style/css.css'

//挂在vue原型上
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

// fastclick.attach(document.body);

router.beforeEach(async  (to, from, next) => {
    
    // 页面位置从（0,0）开始
    window.scrollTo(0,0)
    //接口管理
    if(store.state.interface == '' && to.path.indexOf('403') < 0 && to.path.indexOf('404') < 0){
        await request({url:'/gateway/gatewayrun/authactionlistbycurrent'})
        .then(data=>{
            store.commit ({type:'JK_interface',result:data.result})
        })
    }

    //所有字典
    if(!sessionStorage.getItem('dictionary') && to.path.indexOf('403') < 0 && to.path.indexOf('404') < 0){
        await axios('dic_face_getlistalldetailrt')
        .then(data=>{
            sessionStorage.setItem('dictionary',JSON.stringify(data.result))
        })
    }
    //拉取用户信息
    if(!sessionStorage.getItem('userInfo') && getToken() && to.path.indexOf('403') < 0 && to.path.indexOf('404') < 0){
        await axios('user_user_getuserinfo')
        .then(data=>{
            sessionStorage.setItem('userInfo',JSON.stringify(data.result))
        })
    }
    
    
     
    /* 路由发生变化修改页面title */
    let title = to.query.title || to.meta.title || ''
    window.document.title = title;   
    
    // 验证token，若没有跳到登陆页面，有就继续操作
    if(to.meta.requireAuth){
        if(getToken()){
            next()
        }else{
            next({path:'/login',query:{redirect:to.fullPath}})
        }
    }   

    //提交订单拦截
    if(from.path == '/personal/ticketdetail' || from.path == '/personal'){
        if(to.path == '/submitticket'){
            next('/personal')
            return
        }
        next()
    }
    next()
    
})

new Vue({
    el: '#app',
    router,
    store,
    components: { 
        App,
        'van-button':Button
    },
    template: '<App/>'
})
