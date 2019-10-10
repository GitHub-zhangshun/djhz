<template>
    <div class="backGround"></div>
</template>

<script>
import { Dialog } from 'vant'
    export default {
        
        data(){
            return{
                code: '',
                msg: ''
            }
        },
        methods:{
           
        },
        created(){
            console.log(window.location.href)
            console.log(this.$route.query)
            this.code = this.$route.query.retCode
            this.msg = this.$route.query.retMsg
        },
        mounted(){
            if(window.AndroidApp !== undefined) {
                // 安卓
                try {
                    console.log('code', this.code)
                    console.log('msg', this.msg)
                    window.AndroidApp.callBackResult(this.code,this.msg)    
                } catch (error) {
                    
                }
            }else if(window.webkit !== undefined && window.webkit.messageHandlers != undefined && window.webkit.messageHandlers.k_jsbankinfo !== undefined){
                // IOS
                try {
                    console.log('code', this.code)
                    console.log('msg', this.msg)
                    window.webkit.messageHandlers.k_jsbankinfo.postMessage({status: this.code, msg: this.msg});
                } catch (error) {
                    
                }
            }else {
                // H5跳转        
                // debugger        
                console.log(this.code)
                // if(localStorage.getItem('path')){
                //     if(localStorage.getItem('path') && localStorage.getItem('path').indexOf('lend_confirmation') !== -1) {
                //         history.pushState({}, '和掌柜', '/index');
                //         history.pushState({}, '产品', '/product_list?type=product_list');
                //     }


                //     if(localStorage.getItem('recharge') && localStorage.getItem('recharge')==='recharge' && this.code==='111111'){
                //         Dialog.alert({
                //             message: '您的充值已经受理成功，预计2分钟内到账，请稍后刷新查看。',
                //             confirmButtonText:'我知道了'
                //         }).then(() => {
                //         // on close
                //         });
                //     }    
                //     if(!(this.code=='000000' || this.code=='111111')){
                //         Dialog.alert({
                //             message: `<p style="text-align:center">${this.msg}</p>`
                //         }).then(() => {
                //         // on close
                //         });
                //     }
                //     localStorage.removeItem('recharge')
                //     this.$router.push(localStorage.getItem('path'))
                    
                // }else{
                //     this.$router.push('/index')
                // }
            }
           

            
            
            
        }
    }
</script>

<style scoped lang='less'>

</style>