<template>
<!-- 门店详情 -->
    <div class="store_detail bg_white">
        <div class="name">
            <p class="text_size_36 title">{{ storeInfo.name }}</p>
            <p class="color_gray">营业时间：{{ storeInfo.businessHours }}</p>
            <p class="color_gray">门店地址：{{ storeInfo.address }}</p>
        </div>

        <div class="picture">
            <p class="text_size_32 title row"><img src="@/assets/images/ticket/icon_Store.png"><span>门店图片</span></p>
            <swiper :options="swiperOption">
                <swiper-slide v-for="(item,index) in storeInfo.imgList" :key="index">
                        <img :src="item" @click="viewImg">
                </swiper-slide>
            </swiper>
        </div>

        <div class="map">
            <p class="text_size_32 title row"><img src="@/assets/images/ticket/icon_Map.png"><span>门店地图</span></p>

            <!-- 地图 -->
            <div id="container"></div>

            <div class="btn" @click="goMap">去这里</div>

            <!-- 弹出地图 -->
            <van-popup v-model="showMap" position="bottom">
                <div class="select text_center">
                    <div class="title">请选择地图</div>
                    <p @click="gaode">高德地图</p>
                    <p @click="baidu">百度地图</p>
                    <div @click="cancel">取消</div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { ImagePreview, Popup, Toast } from 'vant'
import { MP } from '@/libs/loadMap'

    export default {
        components: {
            swiper,
            swiperSlide,
            'van-popup': Popup
        },
        data(){
            return {
                storeInfo:{},  //门店信息
                swiperOption: {
                    slidesPerView: 'auto',
                    spaceBetween: 8,
                    freeMode: true,
                },
                showMap: false,   //底部弹出层
                position:{ longitude: '', latitude: '' }
            }
        },
        methods: {
            //门店图片点击预览
            viewImg(){
                ImagePreview({
                    images: this.storeInfo.imgList,
                    startPosition: 0,
                    onClose() {}
                });
            },
            goMap(){
                this.showMap = true;
            },
            gaode(){
                location.href = `https://uri.amap.com/marker?position=${this.position.longitude},${this.position.latitude}&name=${this.storeInfo.name}&coordinate=wgs84&callnative=1` 
            },
            baidu(){
                location.href = `http://api.map.baidu.com/marker?location=${this.position.latitude},${this.position.longitude}&title=${this.storeInfo.name}&content=${this.storeInfo.address}&output=html&coord_type=wgs84&zoom=12`
            },
            cancel(){
                this.showMap = false;
            },

            //加载地图
            loadMap(){
                //初始化地图对象，加载地图
                var map = new AMap.Map('container', {
                    resizeEnable: true,
                    center: [this.position.longitude,this.position.latitude],  //传入坐标
                    zoom: 12
                });
                //坐标转换
                var gps = [this.position.longitude,this.position.latitude]
                AMap.convertFrom(gps, 'gps', function (status, result) {
                    if (result.info === 'ok') {
                        var lnglats = result.locations[0]; // Array.<LngLat>
                        //标记点
                        new AMap.Marker({
                            map:map,
                            position:[String(lnglats.lng), String(lnglats.lat)],
                            label: {
                                offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                            } 
                        })
                    }
                });
            }
        },
        created(){
             Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            this.$axios('run_store_storedetail', this.$route.query.id)
            .then(data => {
                Toast.clear()
                // if(data.code != 0){
                //     Toast({message:data.msg, duration:2000})
                // }else{
                    this.storeInfo = data.result
                    let positionArr = this.storeInfo.coordinate.split(',')
                    this.position.longitude = positionArr[0]
                    this.position.latitude = positionArr[1]

                    let _that = this
                    //调用高德地图获取用户所在城市信息
                    MP().then(function (AMap) {
                        _that.loadMap()
                        _that.errNetwork = false;
                        _that.initMap(AMap);
                    }).catch(err=>{
                        _that.errNetwork = true;
                    })
                // }
            }).catch(() => {})
        },
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.store_detail{
    min-height: 100vh;
    padding-left: 20px;
    .name{
        padding: 46px 0;
        padding-right: 20px;
        border-bottom: 1px solid #e3e3e3;
        .title{
            margin-bottom: 28px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        p:nth-of-type(2){
            margin-bottom: 20px;
        }
        p:nth-of-type(3){
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .picture{
        padding: 46px 0;
        border-bottom: 1px solid #e3e3e3;
        .title{
            margin-bottom: 36px;
            align-items: center;
            img{
                width: 32px;
                height: 26px;
                margin-right: 18px;
            }
        }
        .swiper-slide{
            width: 260px;
            img{
                width: 260px;
                height: 200px;
                border-radius: 20px;
            }
        }

    }

    .map{
        padding: 46px 0;
        border-bottom: 1px solid #e3e3e3;
        .title{
            margin-bottom: 36px;
            align-items: center;
            img{
                width: 32px;
                height: 26px;
                margin-right: 18px;
            }
        }
        #container{
            width: 680px;
            height: 300px;
            border-radius: 10px;
        }
        .btn{
            width: 680px;
            height: 88px;
            line-height: 88px;
            margin: 60px 0 46px 0;
            background: #f5ab0b;
            color: #fff;
            font-size: 32px;
            border-radius: 180px;
            text-align: center;
        }
    }

    .van-popup{
        background: transparent;
        .select{
            line-height: 100px;
            &>div{
                height: 100px;
                background: #fff;
            }
            .title{ 
                border-bottom: 1px solid #e3e3e3;
                margin: 0;
            }
            &>p{
                margin: 0 !important;
                width: 100%;
                height: 100px;
                margin: 0 24px;
                background: #fff;
                border-bottom: 1px dashed #e3e3e3;
                &:last-of-type{
                    border: none;
                    margin-bottom: 20px !important;
                }
            }
        }
    }
}

</style>