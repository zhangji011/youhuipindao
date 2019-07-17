<template>
  <div class="loading">
    <img width="50" height="50" src="./loading.gif">
    <div style="font-size:12px" class="desc">{{title}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="scss">
  .loading{
    width: 100%;
    text-align: center;
    .desc {
      color: #7e7e7e;
    }
  }
</style>
