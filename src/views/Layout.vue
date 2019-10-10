<template>
<!-- layout样式结构 -->
    <div class="layout">
        <div class="container">
            <router-view></router-view> 
        </div>

        <Footer/>  

    </div>
</template>

<script>
import Footer from '@/components/Footer'
    export default {
        components:{
            Footer
        },
        computed:{  
            // showMenu(){
            //     return this.$store.state.showCarMenu
            // }
        },
        data(){
            return{
                
            }
        },
        mounted(){           
            
        
        },
        watch:{

        }
    }
</script>

<style scoped lang="less">
.container{
    padding-bottom: 100px;
}

</style>