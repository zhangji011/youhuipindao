<template>
  <div ref="wrapper" class="list-wrapper-v ZJgoods">
    <!-- <div class="scroll-content"> -->
      <!-- <div class="aa" ref="listWrapper"> -->
        <slot>
        </slot>
      <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import BScroll from "better-scroll";
// import Loading from "@@/components/loading/loading.vue";
// import Bubble from "@@/components/bubble/bubble.vue";
import { getRect } from "@@/components/common/js/dom";
import Bus from '@@/page/home/children/gongtong.js'
const COMPONENT_NAME = "scroll";
const DIRECTION_H = "horizontal";
const DIRECTION_V = "vertical";

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
	  
  },
  created() {

  },
  mounted() {
    // setTimeout(() => {
      this.initScroll();
    // }, 20);
	var _that=this;
	Bus.$on('scrollGoods',() => {   //ZJ20190930  解决tab栏引起的不滑动问题
		setTimeout(function(){
			_that.initScroll();
		},200)
	})
  },
  methods: {
    initSetWidth(){
      // console.log(this.$refs.wrapper.children[0])
      this.children = this.$refs.wrapper.children[0].children;
      let width = 0;

      let size = this.data.length<=2 ? 2 :this.data.length;
      for (let i = 0; i < size; i++) {
        // let child = this.children[i];
        width += 7.3;
      }

      // this.$refs.listWrapper.children[0].style.width=width+'px'
      // this.$refs.listWrapper.style.width=width+'px'
      if(size>2){
        width+=5
        width+='rem';
      }else{
        width='100%'
      }
      this.$refs.wrapper.children[0].style.width = width;
    },
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.initSetWidth()

      let options = {
        probeType: 3,
        click: false,
        scrollY: false,
        scrollX: true,
        // momentum: false,
        scrollbar: false,
        mouseWheel:false,
        // eventPassthrough: "vertical",
        startX: 0,
        bounce: true,
        useTransition:false,
        stopPropagation: false, // this.stopPropagation
        // stopPropagation: this.stopPropagation, // this.stopPropagation
        preventDefault: true,
        momentum: true,
        momentumLimitDistance:10  //滑动多长距离开启动画效果
      };
      // console.log('99999')
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, options);
      } else {
        this.scroll.refresh();
      }
    }
  },
  watch: {
    data(){
      this.initScroll()
    }
  }
};
</script>

<style lang="scss" scoped>
.list-wrapper-v {
  position: relative;
  height: 10.3125rem;
  // height: 100%;
  // width: 375px;
  overflow: hidden;
  // padding-bottom: 2rem;
  // background: #fff;

  // .scroll-content {
  //   position: relative;
  //   z-index: 1;
  // }
  // .list-content {
  //   position: relative;
  //   z-index: 10;
  //   background: #fff;
  //   .list-item {
  //     height: 60px;
  //     line-height: 60px;
  //     font-size: 18px;
  //     padding-left: 20px;
  //     border-bottom: 1px solid #e5e5e5;
  //   }
  // }
}
</style>
