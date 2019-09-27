<template>
  <div class="title">
    <span class="text">{{vbTitle}}</span>
  </div>
</template>

<script>
  export default {
//  设置props接收数据
    props: {
      vbTitle: { // 外部传入 title属性
        type: String, // 数据类型:String
        default: '' // 默认传一个空值
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    height: 46px;
    line-height: 46px;
    padding-left: 15px;
    border-bottom: 1px solid #E9E9E9;
    box-sizing: border-box;
    .text {
      display: inline-block;
      border-left: 3px solid #FF585C;
      padding-left: 8px;
      font-size: 15px;
      height: 15px;
      line-height: 15px;
      vertical-align: middle;
      color: #929292;
    }
  }
</style>
