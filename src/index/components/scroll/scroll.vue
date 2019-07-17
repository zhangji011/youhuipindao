<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot>
          
          <!-- <ul class="list-content">
            <li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>
          </ul> -->
        </slot>
      </div>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span style="color:#999999;font-size:0.6875rem;">{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <!-- <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span style="color:#999999;font-size:0.6875rem;">{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot> -->
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Loading from "@@/components/loading/loading.vue";
import Bubble from "@@/components/bubble/bubble.vue";
import { getRect } from "@@/components/common/js/dom";

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
    },
    data1:{
      type: Boolean,
      default: false
    },
    refreshNow:{
      type: Boolean,
      default: true
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    probeType: {
      type: Number,
      default: 3
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollbar: {
      type: null,
      default: true
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    startY: {
      type: Number,
      default: 0
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: false
    },
    mouseWheel: {
      type: Boolean,
      default: false
    },
    bounce: {
      default: false
    },
    zoom: {
      default: false
    }
  },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true,
      pullDownStyle: "",
      bubbleY: 0
    };
  },
  computed: {
    pullUpTxt() {
      const moreTxt =
        (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) ||
        "";

      const noMoreTxt =
        (this.pullUpLoad &&
          this.pullUpLoad.txt &&
          this.pullUpLoad.txt.noMore) ||
        "亲，我是有底线的";

      return this.pullUpDirty ? moreTxt : noMoreTxt;
    },
    refreshTxt() {
      return (this.pullDownRefresh && this.pullDownRefresh.txt) || "刷新成功";
    }
  },
  created() {
    this.pullDownInitTop = -50;
  },
  mounted() {
    setTimeout(() => {
      this.initScroll();
    }, 20);
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper)
          .height + 1}px`;
      }

      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: true,//this.scrollY, //true,//this.freeScroll || this.direction === DIRECTION_V,
        scrollX: false,
        scrollbar: false, //this.scrollbar,
        // pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        mouseWheel: false,
        useTransition: false,
        bounce: false, //this.bounce
        stopPropagation: false, // this.stopPropagation
        preventDefault: true
        // deceleration:0.002
        // directionLockThreshold:10
      };

      this.scroll = new BScroll(this.$refs.wrapper, options);

      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          // console.log(pos)
          this.$emit("scroll", pos);
        });
      }

      if (this.listenBeforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScrollStart");
        });
      }

      if (this.pullDownRefresh) {
        this._initPullDownRefresh();
      }

      if (this.pullUpLoad) {
        this._initPullUpLoad();
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    clickItem(e, item) {
      console.log(e);
      this.$emit("click", item);
    },
    destroy() {
      this.scroll.destroy();
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false;
        this._reboundPullDown().then(() => {
          this._afterPullDown();
        });
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        console.log(33)
        this.isPullUpLoad = false;
        this.scroll.finishPullUp();
        this.pullUpDirty = dirty;
        this.refresh();
      } else {
        console.log(34)
        console.log(this.data1)
        if(this.data1){
          
          console.log(35)
          this.pullUpDirty = false
        }
        
        this.refresh();
      }
    },
    _initPullDownRefresh() {
      this.scroll.on("pullingDown", () => {
        this.beforePullDown = false;
        this.isPullingDown = true;
        this.$emit("pullingDown");
      });

      this.scroll.on("scroll", pos => {
        if (!this.pullDownRefresh) {
          return;
        }
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
          this.pullDownStyle = `top:${Math.min(
            pos.y + this.pullDownInitTop,
            10
          )}px`;
        } else {
          this.bubbleY = 0;
        }

        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 -
            (this.pullDownRefresh.stop - pos.y)}px`;
        }
      });
    },
    _initPullUpLoad() {
      this.scroll.on("pullingUp", () => {
        if(!this.data1){
          this.isPullUpLoad = true;
        }else{
          this.isPullUpLoad = false;
        }
        
        this.$emit("pullingUp");
      });
    },
    _reboundPullDown() {
      const { stopTime = 600 } = this.pullDownRefresh;
      return new Promise(resolve => {
        setTimeout(() => {
          this.isRebounding = true;
          this.scroll.finishPullDown();
          resolve();
        }, stopTime);
      });
    },
    _afterPullDown() {
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`;
        this.beforePullDown = true;
        this.isRebounding = false;
        this.refresh();
      }, this.scroll.options.bounceTime);
    },
    update() {
      if (this.scroll) {
        this.scroll.destroy();
      }
      this.$nextTick(() => {
        this.initScroll();
      });
    }
  },
  watch: {
    data() {
      // this.refresh()
      console.log(898934)
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.refreshDelay);
    },
    // scrollY() {
    //   console.log(this.scrollY+'---------')
    //   if(this.scrollY){
    //     this.scroll.enable();
    //   }else{
    //     this.scroll.disable()
    //   }
    // },
    refreshNow(){
      // console.log(2345)
      this.refresh()
    },
    data1(){
      // this.isPullingDown = false;
      // this.pullUpTxt = '没有更多数据了'
      this.refresh();
      setTimeout(() => {
        this.forceUpdate(false);
      }, 300);
    }
  },
  components: {
    Loading,
    Bubble
  }
};
</script>

<style lang="scss">
.list-wrapper {
  position: relative;
  height: 100%;
  /*position: absolute
  /*left: 0*/
  /*top: 0*/
  /*right: 0*/
  /*bottom: 0*/
  overflow: hidden;
  background: #fff;

  .scroll-content {
    position: relative;
    z-index: 1;
    background: #fff;
  }
  .list-content {
    position: relative;
    z-index: 10;
    background: #fff;
    .list-item {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      padding-left: 20px;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}

.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  .after-trigger {
    margin-top: 10px;
  }
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  // margin-bottom: 30px;
}
</style>
