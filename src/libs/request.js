import md5 from 'blueimp-md5'
import axios from 'axios'
import { getToken } from './auth'
import { isString } from 'util'
import router from '@/router/index'
import { Toast, Dialog } from 'vant';
import store from '@/store/store' //vuex
import { deleteToken } from '@/libs/auth'

// 创建axios实例
const request = axios.create({
    baseURL: process.env.BASE_API, // api的 base_url
    timeout: 3000 * 1000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

/**
 * 参数加签
 * @param {*} privateKey 私钥
 * @param {*} timestamp 时间错
 * @param {*} data 请求正文
 */
function getSign(data,privateKey, timestamp) {
    privateKey = privateKey || process.env.PRIVATE_KEY
    // 非string 转换string
    if (!isString(data)) {
        data = JSON.stringify(data)
    }
    // 转换data为 string 去除\r \n 以及带长度空字符串
    data = data.replace(/[\r\n]/g, '').replace(/\s+/g, '')
    let dataStrByUrl = encodeURIComponent(data)
    dataStrByUrl = dataStrByUrl.replace(/\~/g, '%7E')
    // dataStrByUrl = dataStrByUrl.replace(/\(/g, '%28')
    // dataStrByUrl = dataStrByUrl.replace(/\)/g, '%29')
    // dataStrByUrl = dataStrByUrl.replace(/\!/g, '%21')
    // dataStrByUrl = dataStrByUrl.replace(/\'/g, '%27')
    // dataStrByUrl = dataStrByUrl.replace(/\~/g, '%7E')
    // dataStrByUrl = dataStrByUrl.replace(/\*/g, '%2A')
    // 加签 私钥+时间戳+请求文本  以md5方式进行加密
    return md5(dataStrByUrl.toUpperCase() + privateKey + timestamp)
}

// request拦截器
request.interceptors.request.use(config => {
 
    config.method = 'post' // 默认请求post
    // 添加API header
    const timestamp = new Date().getTime().toString() // 当前时间戳
    config.headers['apiKeyName'] = store.state.apiKeyName || 'authactionlistbycurrent'
    config.headers['app-id'] = '6c562dd0-0755-4617-ad3a-9a96ec6fd426' // app-id
    config.headers['secret-id'] = 'a4a4f80a-065c-4f3e-9ef0-f8c593bab1d9' // 安全凭证
    config.headers['timestamp'] = timestamp // 时间戳
    config.headers['sign'] = getSign(config.data|| {},'', timestamp) // 签名
    // 如果为空data 加一个非空字符
    if (!config.data) {
        config.data = {}
    }
    if (getToken()) {
        config.headers['token'] = getToken() // 请求携带自定义token
    }
    return config
    }, 
    error => {
        Promise.reject(error)
    }
)

// response拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        if(res.code !== '0') {
            if(response.config.headers.apiKeyName === "authactionlistbycurrent"){
                router.push('/403')
                return
            }
            if((response.config.headers.apiKeyName === "center_transaction_orderpay" || response.config.headers.apiKeyName === 'center_transaction_withdrawinit') && res.code === '24009'){
                return Promise.reject(res)
            }else if(res.code === '24016'){
                Dialog.alert({
                    message: res.msg
                }).then(() => {
                    deleteToken()
                    router.push('/personal')
                });
                return Promise.reject(res)
            }else{
                Toast({message:res.msg,duration:2000})
                return Promise.reject(res)
            }
        }else{
            return Promise.resolve(res);
        }        
    },
    error => {        
        const response = error.response
        //关闭弹框
        Toast.clear()
        //存在响应
        if(!response || response.status != 200){
            //跳页面
            router.push('/403')
        }
        
        return Promise.reject(error)
    }) 

export { request }
