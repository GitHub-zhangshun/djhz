<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 图片预览
.van-image-preview{
  .van-image-preview__index{
    font-size: 24px;
  }
}
.downwarp-tip,.upwarp-tip,.upwarp-nodata{
  font-size: 28px!important;
}
.mescroll-empty>p{
  font-size: 26px!important;
}
</style>
