<template>
<!-- 黄金趋势图 -->
    <div class="goldTrendChart">
        <div class="top">
            <p class="text_center">{{platformPrice}}</p>
            <p class="text_size_24 text_center">平台当前最新金价(元/克)</p>            
        </div> 
        <div class="position">
            <div class="chooseLine bg_white">
                <ul>
                    <li @click="clickSelect(0)">
                        <div class="img">
                            <img :src="lundun?require('@/assets/images/select.png'):require('@/assets/images/noSelect.png')" alt="">                            
                        </div>
                        <p class="color_black text_size_28">伦敦黄金交易所所参考金价<span class="color_gold">{{chooseMoneyLine[0] && chooseMoneyLine[0].money}}</span>元/克</p>
                    </li>
                    <li @click="clickSelect(1)">
                        <div class="img">
                            <img :src="shanghai?require('@/assets/images/select.png'):require('@/assets/images/noSelect.png')" alt="">                            
                        </div>
                        <p class="color_black text_size_28">上海黄金交易所所参考金价<span class="color_gold">{{chooseMoneyLine[1] && chooseMoneyLine[1].money}}</span>元/克</p>
                    </li>
                </ul>
            </div>    
            <div class="charts">
                <div class="chooseTime">
                    <button v-for="(item, index) in btnText" :key="index" :class="index==btnIndex?'color_gold':''" @click="btnClick(index)">{{item}}</button>
                </div>
                <div id="myChart" :style="{width: '100%',height:'300px'}"></div>
            </div>
            <h1 class="text_size_32 color_black">金价说明</h1>
            <ul class="color">
                <li class="text_size_28 color_black"><span></span>绿色折线走势为平台黄金实际金价，实时变动</li>
                <li><span></span>红色折线走势参考上海黄金交易所，实时变动</li>
                <li><span></span>橙色折线走势参考伦敦黄金交易所，实时变动</li>
            </ul>
            <ul class="tips">
                <li>1.为了方便您随时进行黄金交易决策，我们提供了上海黄金交易所和伦敦黄金交易所最新的金价。</li>
                <li>2.上海黄金交易所交易时间：<br>每周一至周五20：00至次日02：30，09：00-11：30，13：30-15：30</li>
                <li>3.法定节假日及交易所公告的休市日，交易所的交易时间可能会有所调整。</li>
            </ul>
        </div>              
    </div>
</template>

<script>
import { Toast } from 'vant';
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
    export default {
        data(){
            return{
                checkSelect:'',
                chooseMoneyLine:[],
                times:'',//定时器
                lineList:[], //图表数据
                option:{
                    color:['#ff3b62','#ff8124','#14cb25'],
                    tooltip:{
                        trigger: 'axis',
                    },                   
                    legend: {
                        itemHeight:4,
                        itemWidth:28,
                        left:"10%",
                        bottom:0,
                        selected:{},
                        data:[],
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        top:'10%',
                        left: '4%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true,
                        height:'80%'
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : [],
                            axisLine:{
                                lineStyle:{color:'#e2e2e2'}  //y轴坐标轴颜色
                            },
                            axisLabel : {color:'#000'},
                            splitLine:{
                                lineStyle:{type:'dashed'}
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine:{
                                lineStyle:{color:'#e2e2e2'}  //y轴坐标轴颜色
                            },
                            axisLabel : {color:'#000'},
                            splitLine:{
                                lineStyle:{type:'dashed'}
                            }
                        }
                    ],
                    series:[],
                },
                oldShowState:[],
                btnText:['今日','近一周','近一月','近半年','近一年'],
                btnIndex:0,
                platformPrice:0,//平台金价
                lineList:[],
                lundun:true,
                shanghai:true,
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration:0
            })
            this.getData()                         
        },
        mounted(){
            this.times = window.setInterval(()=>{
                this.chooseMoneyLine = []
                this.getData()
            },60000)  
        },
        watch:{
            option:{
                deep:true,
                handler(){
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = echarts.init(document.getElementById('myChart'))
                    myChart.setOption(this.option,true)
                }
            },
        },
        beforeDestroy(){
            window.clearInterval(this.times)
        },
        methods: {
            getData(){
                this.$axios('center_goldprice_getallgoldprice')
                .then( res => {
                    this.chooseMoneyLine.push({name:'伦敦',money:res.result.internationalPrice,show:this.lundun})
                    this.chooseMoneyLine.push({name:'上海',money:res.result.shangHaiPrice,show:this.shanghai})
                    this.platformPrice = res.result.platformPrice
                })
                this.$axios('center_goldprice_getgoldpricetrends',this.btnIndex+1)
                .then( res => {
                    let lineList = res.result.reverse()
                    // 构造 legend.data
                    let _data = []
                    if(lineList && lineList.length > 0) {
                        Object.keys(lineList[0]).forEach(item => {
                            if(item !== 'time') {
                                _data.push({
                                    key: item,
                                    name: this.getZh(item),
                                    icon: 'rect'
                                })
                            }
                        })
                    }
                    // 构建X轴
                    let _x = []
                    lineList.forEach(item => {
                        _x.push(item.time)
                    })
                    // 构造 series
                    let _series = []
                    _data.forEach(item => {
                        let seriesInnerData = []
                        lineList.forEach(j => {
                            seriesInnerData.push(j[item.key])
                        })
                        _series.push({
                            name: item.name,
                            type: 'line', 
                            symbol: 'circle',
                            symbolSize: 0,
                            data: seriesInnerData
                        })
                    })
                    this.option.legend.data = _data
                    this.option.xAxis[0].data = _x.map(function (str) { return str.replace(' ', '\n') })
                    this.option.series = _series 
                    Toast.clear()
                }) 
            },
            // 时间选择
            btnClick(index){
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration:0
                })
                this.btnIndex = index
                this.getData()
            },
            // 复选框
            clickSelect(index){
                if(index==0){
                    this.lundun = !this.lundun
                }
                if(index==1){
                    this.shanghai = !this.shanghai
                }
                this.chooseMoneyLine[index].show = !this.chooseMoneyLine[index].show
                let _selected = {}
                this.chooseMoneyLine.forEach( i => {
                    _selected[this.chooseMoneyLine[index].name] = this.chooseMoneyLine[index].show
                })
                this.oldShowState = this.chooseMoneyLine
                this.option.legend.selected = _selected
            },
            // 图例中文
            getZh(para) {
                let zh = '没有匹配'
                switch (para) {
                    case 'shangHaiPrice':
                    zh = '上海'
                    break;
                    case 'internationalPrice':
                    zh = '伦敦'
                    break;
                    case 'platformPrice':
                    zh = '平台'
                    break;
                
                    default:
                        break;
                }
                return zh
            },           
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
}
.goldTrendChart{
    position: relative;
    .top{
        background: url('../assets/images/1.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding-top: 74px;
        p:nth-of-type(1){
            font-size: 80px;
            color:#b8580b;
            padding-bottom: 30px;
        }
        p:nth-of-type(2){
            color:#624813;
            padding-bottom: 100px;
        }
    }
    .position{
        position: absolute;
        top: 234px;
        width: 100%;  
        .chooseLine{                                        
            margin: 0 20px;
            border-radius: 10px;
            padding: 46px 0 46px 22px;
            ul{
                li{
                    display: flex;
                    align-items: center;
                    padding-bottom: 24px;
                    .img{
                        margin-right: 20px;
                        width: 32px;
                        img{
                            vertical-align: middle;
                            width: 100%;                           
                        }
                    }
                    
                }
                li:last-child{
                    padding-bottom: 0;
                }
            }
        }
        .charts{
            padding-bottom: 20px;
            border-radius: 10px;
            margin: 10px 20px 60px;
            background: #fff;
            .chooseTime{
                display: flex;
                padding-top: 30px;
                justify-content: center;
                button{
                    margin: 0;
                    height: 60px;
                    background: #fff;
                    padding: 0 25px;
                    border: 2px solid #e2e2e2;
                    border-left: none;
                }
                button:first-child{
                    border-left: 2px solid #e2e2e2;
                    border-top-left-radius: 60px;
                    border-bottom-left-radius: 60px
                }
                button:last-child{
                    border-right: 2px solid #e2e2e2;
                    border-left: none;
                    border-top-right-radius: 60px;
                    border-bottom-right-radius: 60px
                }
            }
        }
        h1{
            padding: 0 20px 46px
        }
        .color{
            padding: 0 20px;
            li{
                margin-bottom: 30px;
                span{
                    margin-bottom: 10px;
                    margin-right: 20px;
                }
            }
            li:nth-of-type(1){
                span{
                    display: inline-block;
                    width: 46px;
                    height: 6px;
                    background: #14cb25;
                }
            }
            li:nth-of-type(2){
                span{
                    display: inline-block;
                    width: 46px;
                    height: 6px;
                    background: #ff3b62;
                }
            }
            li:nth-of-type(3){
                margin-bottom: 46px;
                span{
                    display: inline-block;
                    width: 46px;
                    height: 6px;
                    background: #ff8124;
                }
            }
        }
        .tips{
            padding: 0 20px;
            li{
                line-height: 1.5;
                padding-bottom: 46px;
            }
        }
    }        
}

</style>