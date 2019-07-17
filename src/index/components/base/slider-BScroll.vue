<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div v-if="showDot" class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" @click="goToIndex(index)">
        {{item}}
      </span>
      <div v-if="dots_.length>0" class="hr-1"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from "@@/components/common/js/dom";
import {mapState, mapMutations } from "vuex";
import BScroll from "better-scroll";

const COMPONENT_NAME = "slide";

export default {
  name: COMPONENT_NAME,
  props: {
    loop: {
      type: Boolean,
      default: false
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2500
    },
    showDot: {
      type: Boolean,
      default: true
    },
    dots_:{
      type:Array,
       default() {
          return []
        }
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.2
    },
    speed: {
      type: Number,
      default: 400
    },
    openAndClose:{
      type: Boolean,
      default: true
    },
    sliderIndex:{
      type: Number,
      default: 0
    },
    loopX:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      "slideIndex"
    ])
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      preIndex:1
    };
  },
  mounted() {
    this.update();

    window.addEventListener("resize", () => {
      if (!this.slide || !this.slide.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() {
    if (!this.slide) {
      return;
    }
    this.slide.enable();
    let pageIndex = this.slide.getCurrentPage().pageX;
    this.slide.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    !this.autoPlay && this.SLIDEINDEX(this.currentPageIndex)
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  methods: {
    ...mapMutations([
      'SLIDEINDEX'
    ]),
    goToIndex(index){
      console.log('我被点击');
      let aa = index - this.preIndex;
      this.slide.goToPage(this.currentPageIndex + aa);
      this.currentPageIndex += aa
      !this.autoPlay && this.SLIDEINDEX(this.currentPageIndex)
      this.preIndex = index;
      // let aa = index - this.preIndex
      // // alert(aa)
      // switch(aa){
      //   case -1:
      //      this.slide.prev();
      //      break;
      //   case -2:
      //      this.slide.prev();
      //      this.slide.prev()
      //      break;
      //   case -3:
      //      this.slide.prev();
      //      this.slide.prev();
      //      this.slide.prev();
      //      break;
      //   case 1:
      //      this.slide.next();
      //      break;
      //   case 2:
      //      this.slide.next();
      //      this.slide.next();
      //      break;
      //   case 3:
      //      this.slide.next();
      //      this.slide.next();
      //      this.slide.next();
      //      break;
      // }
      // this.preIndex = index
      // this.slide.next();
      // if(index)
      // alert(index)
      // this.currentPageIndex = index;
    },
    update() {
      if (this.slide) {
        this.slide.destroy();
      }
      this.$nextTick(() => {
        this.init();
      });
    },
    refresh() {
      this._setSlideWidth(true);
      this.slide.refresh();
    },
    prev() {
      this.slide.prev();
    },
    next() {
      this.slide.next();
    },
    init() {
      clearTimeout(this.timer);
      this.currentPageIndex = this.loopX ? 1 : 0;
      !this.autoPlay && this.SLIDEINDEX(this.currentPageIndex)
      this._setSlideWidth();
      if (this.showDot) {
        this._initDots();
      }
      this._initSlide();

      if (this.autoPlay) {
        this._play();
      }
    },
    _setSlideWidth(isResize) {
      this.children = this.$refs.slideGroup.children;

      let width = 0;
      let slideWidth = this.$refs.slide.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slide-item");

        child.style.width = slideWidth + "px";
        width += slideWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * slideWidth;
      }
      this.$refs.slideGroup.style.width = width + "px";
    },
    _initSlide() {
      console.log(this.threshold);
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        startX:375,
        // startY:100,
        snap: {
          loop: this.loop,
          // el:'aaaa',
          _loopX:this.loopX,
          threshold: this.threshold,
          speed: this.speed
        },
        // directionLockThreshold:10,
        bounce: false,
        // stopPropagation: true,
        stopPropagation: true,
        click: this.click,
        tap:true
      });
      // setTimeout(()=>{
      //   this.slide.goToPage(this.slide.getCurrentPage().pageX+1)
      // })
      
      this.slide.on("scrollEnd", this._onScrollEnd);

      this.slide.on("touchEnd", () => {
        if (this.autoPlay) {
          this._play();
        }
      });

      this.slide.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      !this.autoPlay && this.SLIDEINDEX(this.currentPageIndex)
      if (this.autoPlay) {
        this._play();
      }
    },
    _initDots() {
      // this.dots = new Array(this.children.length);
      if(this.dots_.length>0){
        this.dots = this.dots_
      }else{
        this.dots = new Array(this.children.length);
      }
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.next();
      }, this.interval);
    }
  },
  watch: {
    loop() {
      this.update();
    },
    autoPlay() {
      this.update();
    },
    speed() {
      this.update();
    },
    threshold() {
      this.update();
    },
    sliderIndex(){
      this.slide.goToPage(this.sliderIndex)
    }
  }
};
</script>
<style  lang="scss" scoped>
.slide {
  min-height: .0625rem;
  .slide-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slide-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 17.75rem;
    bottom: 6px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 3px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      // background: #fff;
      border: 1px solid #fff;
      box-sizing: content-box;
      &.active {
        width: 3px;
        border-radius: 50%;
        background: #ed1991;
        // border-width:0;
        border: 1px solid #ed1991;
      }
    }
  }
}
.tab-slider{
  .slide-group{
        // padding: 0 0.9375rem;
  }
    .dots {
      height: 3.5625rem!important;
      top: 0rem!important;
      background: white;
      line-height: 3rem;
      display: flex;
      // &::after{
      //   	content: "  ";
      //     position: absolute;
      //     left: 0;
      //     bottom: 0;
      //     width: 120%;
      //     height: .0625rem;
      //     background-color: #d8d8d8;
      //     /* 如果不用 background-color, 使用 border-top:.0625rem solid #f00; 效果是一样的*/
      //     -webkit-transform: scaleY(.5);
      //     transform:scaleY(.5);
      // }
      .dot{
        flex:1;
        height: 3.5625rem;
        line-height: 3rem;
        padding-top: 0.5625rem;
        background: #fff;
        font-family: PingFangSC-Regular;
        
        color: #13252E;
        font-size: .9375rem;
      }
      .dot.active{
        background: #fff;
        color:#ED1991;
        border-bottom: .125rem solid #ED1991;
        border-radius: 0;
      }
  }
  .slide-item{
    top: 3.5625rem;
  }
  .slide-item{
    position: relative!important;
  }
}
.hr-1 {
  display: block;
  position: absolute;
  height: 0.0625rem;
  float: left;
  width: 100%;
  bottom: 0;
  background-color: #d8d8d8;
  -webkit-transform-origin: 0, 0;
  transform-origin: 0, 0;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
  // &::after {
  //   @include onepx1(#d8d8d8);
  // }
}
</style>