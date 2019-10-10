<template>
  <div>
    <div v-for="item in result.specs">
      {{item.name}} &nbsp;&nbsp;&nbsp;&nbsp;
      <span v-for="it in item.attributeRts"
            @click="handle(it,item,$event)"
            class = '123456' :class="{unenable:checkIsenable(it) ,isActivit:it.state}">{{it.name}}&nbsp;</span></div>
  </div>

</template>

<script>
	export default {
		name: "Sku",
		data() {
			return {
				result: {
					"id": "cc579428-9f3f-4999-bbcd-70461591523d",
					"name": "缺规格商品",
					"categoryId": "cea7439f-1def-4062-9ab4-2d7d97b11908",
					"brandId": null,
					"code": "1562218098722004865",
					"origin": null,
					"material": null,
					"parts": null,
					"isUse": true,
					"buyNowSalesCount": 1,
					"buyFutureSalesCount": 0,
					"content": "",
					"specTypeId": "23050ea4-26b3-4715-b643-c697978e43b0",
					"buyNow": true,
					"buyFuture": true,
					"madePrice": 30,
					"poundageRate": 1,
					"price": "34169.00",
					"weight": 100,
					"popular": null,
					"recommend": null,
					"categoryName": "大黄金",
					"specTypeName": "颜色/大小/形状",
					"brandName": null,
					"sort": 1,
					"listPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562218012007555",
					"specs": [
						{
							"id": "6161dda8-6dd3-420c-98d3-a29f26648981",
							"name": "形状",
							"sort": 30,
							"isUse": true,
							"attributeRts": [
								{
									"id": "1b267d00-c5ed-470a-a59c-8b9de68466eb",
									"name": "圆形",
									"specId": "6161dda8-6dd3-420c-98d3-a29f26648981",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"8d5d0fff-6728-46c5-a81b-639e434c73a3",
										"215d2bf7-d7f1-4e09-8eec-c05426f827aa",
										"a538a8f2-73fe-44d9-8d29-98d410d6c24d"
									]
								},
								{
									"id": "50291f97-11c3-4a01-a09e-f9b1a7cbbaf2",
									"name": "方形",
									"specId": "6161dda8-6dd3-420c-98d3-a29f26648981",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"96a95f3e-3793-41ca-b425-6e65a1a9ec82",
										"e6a926dc-5ec4-4b3e-b11a-15e89db1dbb9"
									]
								}
							]
						},
						{
							"id": "fa61c01f-40a6-46e2-8e08-45bffec4aaef",
							"name": "大小",
							"sort": 20,
							"isUse": true,
							"attributeRts": [
								{
									"id": "63bcd0e9-3072-4b5b-a06a-da88162285c6",
									"name": "XXXXL",
									"specId": "fa61c01f-40a6-46e2-8e08-45bffec4aaef",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"a538a8f2-73fe-44d9-8d29-98d410d6c24d"
									]
								},
								{
									"id": "05c47f50-06ad-474a-bf42-2a28267f9470",
									"name": "M",
									"specId": "fa61c01f-40a6-46e2-8e08-45bffec4aaef",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"8d5d0fff-6728-46c5-a81b-639e434c73a3",
										"e6a926dc-5ec4-4b3e-b11a-15e89db1dbb9"
									]
								},
								{
									"id": "962886b4-18d8-47f1-ab60-fc5e12496bed",
									"name": "S",
									"specId": "fa61c01f-40a6-46e2-8e08-45bffec4aaef",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"96a95f3e-3793-41ca-b425-6e65a1a9ec82",
										"215d2bf7-d7f1-4e09-8eec-c05426f827aa"
									]
								}
							]
						},
						{
							"id": "3239f41c-6af7-44ba-b0e0-9b4bd580bb54",
							"name": "颜色",
							"sort": 10,
							"isUse": true,
							"attributeRts": [
								{
									"id": "28c85242-8b29-45c9-927a-cb654392a1ba",
									"name": "五彩斑斓的黑",
									"specId": "3239f41c-6af7-44ba-b0e0-9b4bd580bb54",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"a538a8f2-73fe-44d9-8d29-98d410d6c24d"
									]
								},
								{
									"id": "839218cc-ffb1-4a3a-ad74-647bf77b580c",
									"name": "蓝色",
									"specId": "3239f41c-6af7-44ba-b0e0-9b4bd580bb54",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"e6a926dc-5ec4-4b3e-b11a-15e89db1dbb9"
									]
								},
								{
									"id": "fe854bc2-e910-48c3-baf4-40b5301e4261",
									"name": "红色",
									"specId": "3239f41c-6af7-44ba-b0e0-9b4bd580bb54",
									"sort": null,
									"isUse": null,
									"skuIds": [
										"8d5d0fff-6728-46c5-a81b-639e434c73a3",
										"96a95f3e-3793-41ca-b425-6e65a1a9ec82",
										"215d2bf7-d7f1-4e09-8eec-c05426f827aa"
									]
								}
							]
						}
					],
					"tags": [
						{
							"id": "fdc7b3c8-1fea-4a6d-a88b-69ebe1dbddec",
							"name": "2019新款",
							"isUse": true,
							"sort": 1
						},
						{
							"id": "d1ca16c8-bd40-41c3-a976-a9b653065b66",
							"name": "test新品",
							"isUse": true,
							"sort": 0
						}
					],
					"pics": [
						{
							"id": "6d25eebc-65e6-4d26-b4be-ede8a6795650",
							"url": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562218025004772",
							"title": "",
							"isMain": false
						},
						{
							"id": "82eb655e-4b12-4357-ad2a-6bfef5eacbdf",
							"url": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562218018002602",
							"title": "",
							"isMain": true
						},
						{
							"id": "c2438006-63a0-4dbd-bdb0-a38d22ae3fdf",
							"url": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562218029006588",
							"title": "",
							"isMain": false
						},
						{
							"id": "e7dc9cc6-be5e-4a2f-8cc6-221216384063",
							"url": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562218022006540",
							"title": "",
							"isMain": false
						}
					],
					"bespokes": [
						{
							"id": "6f367021-ecf3-4009-8b03-885816108333",
							"days": 60,
							"dayRate": 6,
							"price": "337.00"
						},
						{
							"id": "8c151ab2-aaf8-4341-a913-327f69c0b661",
							"days": 90,
							"dayRate": 7,
							"price": "589.76"
						},
						{
							"id": "f7cc48b9-5c5e-4f75-83e3-9c6a73e51514",
							"days": 180,
							"dayRate": 8,
							"price": "1348.03"
						}
					],
					"skus": [
						{
							"id": "8d5d0fff-6728-46c5-a81b-639e434c73a3",
							"skuCode": "8677162",
							"isUse": true,
							"sort": null,
							"topPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562217932001672"
						},
						{
							"id": "e6a926dc-5ec4-4b3e-b11a-15e89db1dbb9",
							"skuCode": "7047119",
							"isUse": true,
							"sort": null,
							"topPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562217887006478"
						},
						{
							"id": "96a95f3e-3793-41ca-b425-6e65a1a9ec82",
							"skuCode": "2565635",
							"isUse": true,
							"sort": null,
							"topPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562217883003039"
						},
						{
							"id": "a538a8f2-73fe-44d9-8d29-98d410d6c24d",
							"skuCode": "0216600",
							"isUse": true,
							"sort": null,
							"topPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562217879004560"
						},
						{
							"id": "215d2bf7-d7f1-4e09-8eec-c05426f827aa",
							"skuCode": "5173993",
							"isUse": true,
							"sort": null,
							"topPic": "https://gg-1258929075.cos.ap-guangzhou.myqcloud.com/common/image/1562217875005331"
						}
					]
				},
				Warehouse:[]
			}
		},
    methods:{
			checkIsenable(v){
				let flag=false, b=[]
				this.Warehouse.forEach(item=>{
					v.skuIds.indexOf(item)!==-1?flag=true:''
        })
        return this.Warehouse.length!=0&&!flag
			},
			handle(it,item,e){
				if([...e.target.classList].indexOf('unenable')!=-1)return;
				item.attributeRts.map((i)=>{
					if(it.id===i.id){
						this.$set(i,'state',!it['state'])
					}else{
						this.$set(i,'state',false)
          }
				})
        this.hd()
      },
      hd(){
				let newArray=[],array2=[]
				this.Warehouse=[]
				this.result.specs.map(item=>{
					item.attributeRts.map(it=>{
            if(it['state']){
            	if(newArray.length==0){
								newArray.push(...it.skuIds)
								this.Warehouse=newArray
							}else{
								it.skuIds.map(i=>{
									newArray.indexOf(i)!==-1?array2.push(i):''
								})
              }
						}
          })
        })
        array2.length!=0?this.Warehouse=array2:''
				console.log(this.Warehouse)
      },
    }
	}
</script>

<style scoped>
.isActivit{
  color: #f00;
}
  .unenable{
    background: #eaeaea;
  }
</style>
