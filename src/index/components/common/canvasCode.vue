<template>
  <div>
    <label>
      <!-- <span v-if='titShow'>{{title}}</span> -->
      <img src="/static/img/yzm.png" alt="">
      <input type="text" :placeholder="deVal" v-model.trim='code' :class='inputCls'>
    </label>
    <canvas id="canvas" :class="canCls" @click='changeCode'></canvas>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        canvas: {},
        code: '',
        title: '',
        deVal: '',
        titShow: true,
        inputCls: '',
        canCls: '',
      }
    },
    props: ['name', 'placeh', 'isTit', 'iCls', 'cCls'],
    methods: {
      changeCode() {
        this.canvasCode.createCode(this.canvas)
      },
      watchCode() {
        this.$emit('codeHasChange', this.code)
      }
    },
    watch: {
      'code': 'watchCode'
    },
    mounted() {
      // 判断标题和占位符是否传递
      // this.title = this.$options.propsData.name === undefined ? '11验证码' : this.$options.propsData.name;
      this.deVal = this.$options.propsData.placeh === undefined ? '请输入图形码' : this.$options.propsData.placeh;
      this.inputCls = this.$options.propsData.iCls === undefined ? '' : this.$options.propsData.iCls;
      this.canCls = this.$options.propsData.cCls === undefined ? 'code-img' : this.$options.propsData.cCls;
      if (this.$options.propsData.isTit === 'false') this.titShow = false;
      // 获取节点并且刷新一次canvas
      this.canvas = document.getElementById('canvas');
      this.changeCode()
    }
  }
</script>


<style lang="scss" scoped>
@import "~@@/style/mixin";
.container {
  overflow: hidden;
  min-height: 100%; }
  label {
    display: block; 
    padding-left: 1.5rem;}
  input {
    font-size: 0.875rem;
    line-height: 1.6rem;
    margin-top: 0.65rem;
    width: 72%;
    background: transparent;
    position: absolute;
    left: 4rem;
    top: 0;
    z-index: 2; }
  img {
    width: 1.3rem;
    height: 1.3rem;    
    position: absolute;
    top: .75rem;}
.code-img {
  position: absolute;
  top: 50%;
  right: 0.625rem;
  width: 5rem;
  height: 1.875rem;
  margin-top: -0.9375rem;
  z-index: 4; }
.code-img img {
  width: 100%;
  height: 100%; }
</style>
