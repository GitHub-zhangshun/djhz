<template>
  <!-- 商品规格选择 -->
  <div>
    <van-popup v-model="$store.state.isShowSku" position="bottom" :overlay="true">
      <div class="header text_size_26 color_gray row">
        <img :src="headPic" class="mainPic">
        <div>
          <p class="price color_gold text_size_42">
            &yen;&nbsp;
            {{ proInfo.price }}
          </p>
          <p v-if="skuId">已选：<span v-for="(item, index) in selectedSpecItemList" :key="index">{{ item.Name }}&nbsp;</span></p>
          <p v-else>请选择&nbsp;<span v-for="(item, index) in specItemList" :key="index">{{ item.Name }}&nbsp;</span></p>
        </div>
        <img src="@/assets/images/product/icon_Close.png" @click="close" class="close">
      </div>

      <!-- 选择规格 -->
      <div class="specs">
        <div v-for="(item, index) in specsList" :key="index">
          <p>{{ item.name }}</p>
          <p><label v-for="(spec, i) in item.attributeRts" :key="i"
              @click="select({specType: item, spec, innerIndex: i, index})"
              :class="{current: spec.status == 1, disable: spec.status == 0}">{{ spec.name }}</label>
          </p>
        </div>

        <div class="num">
          <p>数量</p>
          <van-stepper v-model="number" />
        </div>
      </div>

      <div class="footer">
        <div v-if="$store.state.buyWay == 'immediately'" class="row">
          <van-button @click="onAddCartClicked" class="add" :loading="isLoading1">加入购物车</van-button>
          <van-button @click="onBuyClicked" class="buyNow" :loading="isLoading2">立即购买</van-button>
        </div>
        <van-button v-if="$store.state.buyWay == 'later'" @click="onLaterClicked" class="orderNow"
          :loading="isLoading3">立即预约</van-button>
      </div>
    </van-popup>

    <!-- 提示框 -->
    <!-- <OpenAccountPop /> -->
    <ToastPop />
  </div>
</template>

<script>
  import { Popup, Toast, Stepper} from "vant";
  import { getToken } from '@/libs/auth'
  // import OpenAccountPop from '@/components/OpenAccountPop'
  import ToastPop from '@/components/Toast'
  var Enumerable = require('linq');

  export default {
    components: {
      'van-popup': Popup,
      'van-stepper': Stepper,
      // OpenAccountPop,
      ToastPop
    },
    data() {
      return {
        proInfo: [], //商品信息
        productId: '', //商品id
        mainPic: '', //主图
        headPic: '', //显示图片
        skuPic: '', //sku图片
        specsList: [], //规格
        isActive: [], //激活样式
        skuId: '',
        selectedSpecItemList:[],
        specItemList:[],
        number: 0,
        isLoading1: false,
        isLoading2: false,
        isLoading3: false,
        isLogin: false, //是否登录
        isOpenAccount: false, //是否开户  → 认证
        isHasBank: false, //是否绑有银行卡
        isSetTranPwd: false, //是否设置交易密码
        currentIntersectList: [],
        selectedSku:{}
      }
    },
    methods: {
      select({specType, spec, innerIndex, index}) {
        if (spec.status == 0){
          return
        }

        // 显示已选择和未选择规格
        let selectedSpecItem = {Index:index,InnerIndex:innerIndex,Name:spec.name,SkuIds:spec.skuIds}
        let selectedSpecIndexList = Enumerable.from(this.selectedSpecItemList).where(w => w.Index==index).toArray()
        if(selectedSpecIndexList.length > 0){
            if(Enumerable.from(selectedSpecIndexList).any(a => a.InnerIndex==innerIndex)){
                // 已选择过当前Index且InnerIndex,则删除已选择列表并添加到可选列表中
                this.selectedSpecItemList = Enumerable.from(this.selectedSpecItemList).where(w=>w.Index!=index).toArray()
                this.specItemList.push({Index:index,Name:specType.name})
            }else{
                // 已选择过当前Index但是非当前InnerIndex,则更新列表对象
                selectedSpecIndexList[0].InnerIndex = innerIndex
                selectedSpecIndexList[0].Name = spec.name
                selectedSpecIndexList[0].SkuIds = spec.skuIds
            }
        }else{
          // 如果未选择过当前Index,则从可选列表中删除且添加到已选择列表中
            this.selectedSpecItemList.push(selectedSpecItem)
            this.specItemList = Enumerable.from(this.specItemList).where(w => w.Index!=index).toArray()
        }

        // 如果当前已经没有可选择的项且已有选择的项,则计算所有选择项的skuId计算交集
        // 每次需要重新计算skuId
        this.skuId = ''
        if (this.specItemList.length == 0 && this.selectedSpecItemList.length > 0){
            let selectedSkuIds = this.selectedSpecItemList[0].SkuIds
            for (var i = 1; i < this.selectedSpecItemList.length; i++){
                selectedSkuIds = Enumerable.from(selectedSkuIds).intersect(this.selectedSpecItemList[i].SkuIds).toArray()
            }

            if (selectedSkuIds.length > 0){
                this.skuId = selectedSkuIds[0]
            }
        }
        console.log(this.skuId)

        // 选择规格样式
        if(!this.selectedSku[index]){
            this.selectedSku[index] = spec.skuIds
            spec.status = 1
        }else{
            for( var i = 0; i<specType.attributeRts.length; i++ ){
                let item = specType.attributeRts[i]
                if(JSON.stringify(spec) === JSON.stringify(item)){
                    continue
                }
                if(item.status == 1) {
                    item.status = 2
                    delete (this.selectedSku[index])
                }
            }
            if( spec.status == 2 ){
                spec.status = 1
                this.selectedSku[index] = spec.skuIds
            }else if( spec.status == 1 ){
                spec.status = 2
                delete (this.selectedSku[index])
            }
        }

        let allKeys = Object.keys(this.selectedSku)
        if(allKeys.length == 0){
            this.specsList.forEach(Element3 => {
                Element3.attributeRts.forEach(Element4 => {
                    Element4.status = 2
                })
            })
            this.$forceUpdate()
            return
        }
        let allValue = Object.values(this.selectedSku)

        //取交集
        let arr = []
        for( var i = 0; i<allValue.length; i++ ){
            let obj = allValue[i]
            if(i==0){
                arr = obj
            }else{
                arr = arr.filter(item => {
                    return obj.includes(item)
                })
            }
        }
        
        for( var i = 0; i<this.specsList.length; i++ ){
            let spec = this.specsList[i] 

            for(var j = 0 ; j<spec.attributeRts.length; j++){
                let item = spec.attributeRts[j]
                if(item.status == 0){
                    item.status = 2
                }  
                if(allKeys.includes(i.toString())){
                    let obj2 = JSON.parse(JSON.stringify(this.selectedSku)) 
                    delete (obj2[i])
                    let allValue2 = Object.values(obj2)
                    if(allValue2.length > 0){
                        let arr2 = []
                        for( var k = 0; k<allValue2.length; k++ ){
                            let obj3 = allValue2[k]
                            if(k==0){
                                arr2 = obj3
                            }else{
                                arr2 = arr2.filter(Element1 => {
                                    return obj3.includes(Element1)
                                })
                            }
                        }
                        let rst = this.intersect(item.skuIds,arr2)

                        
                        if(rst.length == 0 && item.status == 2){
                            item.status = 0
                        }
                    }
                }else{
                    let rst = this.intersect(item.skuIds,arr)

                    if(rst.length == 0 && item.status == 2){
                        item.status = 0
                    }
                }
            }
        }
             
        this.$forceUpdate()
      },


      //取交集方法
      intersect(a, b) {
        let set1 = new Set(a),
          set2 = new Set(b);
        return [...new Set([...set1].filter(x => set2.has(x)))];
      },
  
      //加入购物车
      onAddCartClicked() {
        if (this.isLogin) {
          if (this.isOpenAccount) { //是否开户  → 实名认证
            if (this.isHasBank) { //是否绑有银行卡
              if (this.isSetTranPwd) { //是否设置交易密码
                if (this.skuId) {
                  // 添加到购物车
                  this.isLoading1 = true
                  this.$axios(
                    'center_order_cartgoodsadd', {
                      goodsId: this.productId,
                      skuId: this.skuId,
                      count: this.number
                    }
                  ).then(data => {
                    this.isLoading1 = false

                    // if(data.code!=0){
                    //     Toast({message:data.msg, duration:2000});
                    // }else{
                    this.$store.commit({
                      type: "m_toHideSku",
                      addNum: this.number,
                      isShow: false
                    });
                    Toast.success({
                      message: "添加成功",
                      duration: 2000
                    });
                    // }
                  }).catch(() => {
                    this.isLoading1 = false
                  })
                } else {
                  Toast({
                    message: '请选择规格',
                    duration: 2000
                  });
                }
              } else {
                //弹出设置交易密码提示
                this.$store.commit({
                  type: "m_toShowToast",
                  showToast: true,
                  hintType: 3,
                });
              }
            } else {
              // 弹出绑定银行卡提示
              this.$store.commit({
                type: "m_toShowToast",
                showToast: true,
                hintType: 2,
              });
            }
          } else {
            //弹出开通存管提示
            //  this.$store.commit('m_toShowOpenAccount')
            this.$store.commit({
              type: "m_toShowToast",
              showToast: true,
              hintType: 1,
            });
          }
        } else {
          this.$router.push('/login')
        }
      },

      //立即购买
      onBuyClicked() {
        if (this.isLogin) { //是否登录
          if (this.isOpenAccount) { //是否开户  → 实名认证
            if (this.isHasBank) { //是否绑有银行卡
              if (this.isSetTranPwd) { //是否设置交易密码
                if (this.skuId) {
                  // 订单预算
                  this.isLoading2 = true
                  this.$axios(
                    'center_order_orderbudget', {
                      goodsId: this.productId,
                      skuId: this.skuId,
                      count: this.number
                    }
                  ).then(data => {
                    this.isLoading2 = false
                    // if(data.code!=0){
                    //     Toast({message:data.msg, duration:2000});
                    // }else{
                    this.$store.commit({
                      type: "m_toHideSku",
                      addNum: 0,
                      isShow: false
                    });
                    this.$router.push({
                      path: "/submitticket",
                      query: {
                        skuId: this.skuId
                      }
                    })
                    sessionStorage.setItem('ticketInfo', JSON.stringify(data.result))
                    // }
                  }).catch(() => {
                    this.isLoading2 = false
                  })
                } else {
                  Toast({
                    message: '请选择规格',
                    duration: 2000
                  });
                }
              } else {
                //弹出设置交易密码提示
                this.$store.commit({
                  type: "m_toShowToast",
                  showToast: true,
                  hintType: 3,
                });
              }
            } else {
              // 弹出绑定银行卡提示
              this.$store.commit({
                type: "m_toShowToast",
                showToast: true,
                hintType: 2,
              });
            }
          } else {
            //弹出开通存管提示
            //  this.$store.commit('m_toShowOpenAccount')
            this.$store.commit({
              type: "m_toShowToast",
              showToast: true,
              hintType: 1,
            });
          }
        } else {
          this.$router.push('/login')
        }
      },

      //立即预约
      onLaterClicked() {
        if (this.isLogin) {
          if (this.isOpenAccount) { //是否开户  → 实名认证
            if (this.isHasBank) { //是否绑有银行卡
              if (this.isSetTranPwd) { //是否设置交易密码
                if (this.skuId) {
                  // 添加到购物车
                  this.isLoading3 = true
                  this.$axios(
                    'center_order_orderbudget', {
                      goodsId: this.productId,
                      skuId: this.skuId,
                      count: this.number,
                      bespeakTermId: this.$store.state.bespokesId
                    }
                  ).then(data => {
                    this.isLoading3 = false
                    // if(data.code!=0){
                    //     Toast({message:data.msg, duration:2000});
                    // }else{
                    this.$store.commit({
                      type: "m_toHideSku",
                      addNum: 0,
                      isShow: false
                    });
                    this.$router.push({
                      path: "/submitticket",
                      query: {
                        skuId: this.skuId
                      }
                    })
                    sessionStorage.setItem('ticketInfo', JSON.stringify(data.result))
                    // }
                  }).catch(() => {
                    this.isLoading3 = false
                  })
                } else {
                  Toast({
                    message: '请选择规格',
                    duration: 2000
                  });
                }
              } else {
                //弹出设置交易密码提示
                this.$store.commit({
                  type: "m_toShowToast",
                  showToast: true,
                  hintType: 3,
                });
              }
            } else {
              // 弹出绑定银行卡提示
              this.$store.commit({
                type: "m_toShowToast",
                showToast: true,
                hintType: 2,
              });
            }
          } else {
            //弹出开通存管提示
            //  this.$store.commit('m_toShowOpenAccount')
            this.$store.commit({
              type: "m_toShowToast",
              showToast: true,
              hintType: 1,
            });
          }
          // }else{
          //     //弹出开通存管
          //     this.$store.commit('m_toShowOpenAccount')
          // }
        } else {
          this.$router.push('/login')
        }
      },

      //关闭
      close() {
        this.$store.commit({
          type: "m_toHideSku",
          addNum: 0,
          isShow: false
        });
      }
    },
    created() {
      this.productId = this.$route.query.id

      //获取商品信息
      this.$axios('center_good_getoneproductrt', this.productId)
        .then(data => {
          this.proInfo = data.result

          let mainPicList = this.proInfo.pics.filter(item => {
            return item.isMain == true
          })
          this.mainPic = mainPicList[0] && mainPicList[0].url
          this.headPic = this.mainPic || require('@/assets/images/product_placeholder.jpg')

          this.specsList = this.proInfo.specs
          this.specsList.map(item => {
            item.attributeRts.map(j => {
              j.status = 2
            })
          })

          this.specsList.forEach((item,index) => {
            this.specItemList.push({Index:index,Name:item.name})
          })
        }).catch(() => {})

      //判断是否登录
      if (getToken()) {
        this.isLogin = true

        //获取用户信息
        this.$axios('user_user_getuserinfo')
          .then(data => {
            // this.isOpenAccount = data.result && data.result.isOpenDeyAccount
            this.isOpenAccount = data.result && data.result.isRealName
            this.isHasBank = data.result && data.result.isHasBankCard
            this.isSetTranPwd = data.result && data.result.account && data.result.account.isSetTranPassword
          }).catch(() => {})
      }

    },
  };

</script>

<style lang="less">
  p,
  div {
    margin: 0;
  }

  .van-popup {
    padding: 30px 30px 0 30px;
    font-size: 28px;

    // 头部
    .header {
      height: 180px;
      align-items: center;
      margin-bottom: 16px;
      position: relative;

      .mainPic {
        width: 160px;
        height: 160px;
        margin-right: 16px;
        margin-left: 20px;
      }

      .price {
        margin-bottom: 20px;
      }

      .close {
        width: 40px;
        position: absolute;
        right: 20px;
        top: 0px;
      }
    }

    // 选择规格
    .specs {
      padding: 20px 30px;

      &>div {
        margin-bottom: 30px;

        &>p {
          margin-bottom: 24px;

          label {
            display: inline-block;
            height: 50px;
            line-height: 50px;
            padding: 0 32px;
            background: #fff;
            border: 1px solid #ababab;
            color: #555;
            border-radius: 180px;
            margin-right: 36px;
            margin-bottom: 18px;

            &.current {
              border: 1px solid #f5ab0b;
              color: #f5ab0b;
            }

            &.disable {
              background: #f1f1f1;
              color: #ccc;
              border: 1px solid #ccc;
            }
          }
        }
      }

      // 数量
      .num {
        .van-stepper {
          border: 1px solid #ccc;
          width: 216px;
        }

        .van-stepper__minus,
        .van-stepper__plus {
          width: 60px;
          height: 48px;
          font-size: 40px;
          background: transparent;

          &::before {
            width: 18px;
          }

          &::after {
            height: 18px;
          }
        }

        .van-stepper__input {
          width: 74px;
          height: 46px;
          font-size: 28px;
          background: transparent;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      }
    }

    // 底部按钮
    .footer {
      height: 100px;

      &>div {
        .van-button {
          height: 100px;
          line-height: 100px;
          width: 50%;
          border: none;
          font-size: 30px;
        }

        .add {
          background: #ff8124
        }

        .buyNow {
          background: #f5ab0b;
        }
      }

      .van-button__text,
      .van-dialog__message {
        font-size: 30px;
        color: #fff;
      }

      .orderNow {
        background: #f5ab0b;
        height: 100px;
        width: 100%;
        border: none;
      }
    }
  }

</style>
