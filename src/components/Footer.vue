<template>
<!-- 页脚 -->
    <div class="footer">
        <van-tabbar v-model="active" active-color="orange">
            <van-tabbar-item to="/index"><span>首页</span><img slot="icon" slot-scope="props" :src="props.active ? icon.active1 : icon.normal1"></van-tabbar-item>
            <van-tabbar-item to="/product"><span>商城</span><img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2"></van-tabbar-item>
            <van-tabbar-item to="/preferential_gold"><span>德金惠众</span><img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3" ></van-tabbar-item>
            <van-tabbar-item to="/showCarIndex"><span>购物车</span><img slot="icon" slot-scope="props" :src="props.active ? icon.active4 : icon.normal4"></van-tabbar-item>
            <van-tabbar-item to="/personal"><span>我的</span><img slot="icon" slot-scope="props" :src="props.active ? icon.active5 : icon.normal5"></van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

    export default {
        components:{
            'van-tabbar':Tabbar,
            'van-tabbar-item':TabbarItem,
        },
        data(){
            return {                
                active:0,
                icon: {
                    normal1: require('@/assets/images/footer/icon_home_n.png'),
                    active1: require('@/assets/images/footer/icon_home_s.png'),
                    normal2: require('@/assets/images/footer/icon_Shops_n.png'),
                    active2: require('@/assets/images/footer/icon_Shops_s.png'),
                    normal3: require('@/assets/images/footer/icon_Enterprise_n.png'),
                    active3: require('@/assets/images/footer/icon_Enterprise_s.png'),
                    normal4: require('@/assets/images/footer/icon_Shopping_n.png'),
                    active4: require('@/assets/images/footer/icon_Shopping_s.png'),
                    normal5: require('@/assets/images/footer/icon_Personal_n.png'),
                    active5: require('@/assets/images/footer/icon_Personal_s.png'),
                },
            }
        },
        watch:{
            $route(to){   
                switch(to.path){
                    case '/index': this.active = 0; break;
                    case '/product': case '/product/detail': this.active = 1; break;
                    case '/showCarIndex': this.active = 3; break;
                    case '/personal': this.active = 4; break;
                    case '/preferential_gold': this.active = 2; break;
                }
            }
        },
        created(){
            switch(this.$route.path){
                case '/index': this.active = 0; break;
                case '/product': case '/product/detail': this.active = 1; break;
                case '/showCarIndex': this.active = 3; break;
                case '/personal': this.active = 4; break;
                case '/preferential_gold': this.active = 2; break;
            }
        }
    }
</script>

<style scoped lang="less">
.footer{
    .van-tabbar{
        height: 100px;
        border-top: 1px solid #e3e3e3;  
        .van-tabbar-item{
            font-size: 20px;
        }
        img{
            width: 52px;
            height: 52px;
            margin-bottom: 2px;
        }
    }
}

</style>