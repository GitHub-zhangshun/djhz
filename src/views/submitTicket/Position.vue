<template>
<!-- 选择城市 -->
    <div class="position bg_base">
        <!-- 页头 -->
        <div class="row header bg_base">
            <van-search placeholder="搜索城市" v-model="searchVal" shape="round" background="none" show-action @blur="scrollBack"/>
        </div>  

        <!-- 城市列表 -->
        <div class="content">
            <p class="text_size_28 cur_city bg_white" @click="selectCity(city)">当前定位城市：{{ city }}</p> 

            <div class="city_list_box">
                <div class="city_list" v-for="(item,index) in letters" :key="index">
                    <div>{{ item }}</div>
                    <p v-for="(city,index) in cityList" :key="index" @click="selectCity(city.title)" v-if="city.initial==item">{{ city.title }}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { Search, Toast } from 'vant';
import { MP } from '@/libs/loadMap'

    export default {
        components:{
            'van-search': Search
        },
        data(){
            return {
                searchVal: '',
                city:'未定位',  //当前城市
                cityList:[],  //城市列表
                letters:[],
            }
        },
        watch: {
            searchVal(val){
                this.cityList = this.totalList
                if(val){
                    let value = (val).toUpperCase()
                    this.cityList = this.cityList.filter(item => {
                        return item.initial == value || item.title == value || item.title.slice(0,1) == value || item.title.slice(0,2) == value
                    })
                    let letters = this.cityList.map(item => {
                        return item.initial
                    })
                    this.letters = [...new Set(letters)]
                }else{
                    this.cityList = this.totalList
                    this.letters = this.allLetters
                }
            }
        },
        methods: {
            
            //选择城市
            selectCity(i){
                this.$router.replace({path:'/submitticket/store', query:{city:i}})
            },

            //调用高德地图获取用户所在城市信息
            getCity(){        
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                let _that = this
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            var cityinfo = result.city;
                            _that.city = cityinfo;
                        }
                    } else {
                        console.log(result.info)
                    }
                })
            },
            //输入框失焦之后回弹底部
            scrollBack(){        
                window.scroll(0, 0);
            }  
        },
        created(){
            let _that = this
            //调用高德地图获取用户所在城市信息
            MP().then(function (AMap) {
                _that.getCity()
                _that.errNetwork = false;
                _that.initMap(AMap);
            }).catch(err=>{
                _that.errNetwork = true;
            })

            //获取城市列表
            this.$axios('run_store_regionlistlevel', 2)
            .then(data => {
                // if(data.code != 0){
                //     Toast({message:data.msg, duration:2000})
                // }else{
                    this.cityList = data.result
                    this.totalList = data.result
                    let letters = this.cityList.map(item => {
                        return item.initial
                    })
                    this.letters = [...new Set(letters)]
                    this.allLetters = [...new Set(letters)]
                // }
            }).catch(() => {})
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.position{
    .header{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        height: 90px;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        /deep/.van-search{
            margin-right: 40px;
            .van-search__content{
                width: 530px;
                border-radius: 50px;
                padding: 8px 20px 4px 20px;
                background: #e2e2e2;
            }
            .van-cell{
                .van-field__left-icon{
                    .van-icon-search{
                        font-size: 30px;
                        line-height: 36px;
                        color: #ababab;
                    }
                }
                .van-cell__value{
                    .van-field__body{
                        .van-field__control{
                            font-size: 28px;
                            line-height: 36px;
                            color: #ababab;
                        }
                        .van-icon{
                            font-size: 28px;
                        }
                    }
                }
            }
            .van-search__action{
                font-size: 28px;
                margin-left: 20px;
            }
        }
    }

    .content{
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        padding: 90px 20px 0 20px;
        box-shadow: 0 0 1px #ccc;
        min-height: calc(100vh - 90px);
        .cur_city{
            padding: 0 30px;
            height: 90px;
            line-height: 90px;
        }
        .city_list_box{
            .city_list{
                div{
                    padding: 0 30px;
                    height: 60px;
                    line-height: 60px;
                    background: #f3f3f3;
                }
                p{
                    padding: 0 30px;
                    height: 90px;
                    line-height: 90px;
                    background: #fff;
                    font-size: 28px;
                }
            }
        }
    }
}
    

</style>