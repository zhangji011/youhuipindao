<template>
    <section id='foot_guide'>
        <section @click = "gotoAddress({path: '/tab/home'},'home')" class="guide_item" :class="{'active':activeIcon=='home'}">
        	<div class="icon_style icon_1">
            </div>
            <span>随意借</span>
        </section>
        <section @click = "gotoAddress({path: '/tab/shop/'},'shop')" class="guide_item"  :class="{'active':activeIcon=='shop'}">
        	<div class="icon_style icon_2" >
            </div>
            <span>贷款超市</span>
        </section>
        <section @click = "gotoAddress('/tab/mine','mine')" class="guide_item"  :class="{'active':activeIcon=='mine'}">
        	<div class="icon_style icon_3">
            </div>
            <span>我的</span>
        </section>
    </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeIcon: "home"
    };
  },
  created() {},
  mounted() {
    this.setIcon(this.$router.history.current.path)
  },
  computed: {
    ...mapState(["geohash"])
  },
  methods: {
    gotoAddress(path, url) {
      this.activeIcon = url;
      this.$router.push(path);
    },
    setIcon(path) {
      if (path.indexOf("mine")>0) {
        this.activeIcon = 'mine';
        return
      }
      if (path.indexOf("home")>0) {
        this.activeIcon = 'home';
        return
      }
      if (path.indexOf("shop")>0) {
        this.activeIcon = 'shop';
        return
      }
      this.activeIcon = 'home'
    }
  }
  //   props: {
  //     activeIcon: {
  //       // 文本提示
  //       type: String,
  //       default: "home"
  //     }
  //   }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";

#foot_guide {
  background-color: #fff;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  @include wh(100%, 3.09375rem);
  display: flex;
  // @include onepx1(#959595);
  // box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1);
}
#foot_guide:before {
  @include onepx_top(#E9E9E9);
}
.guide_item {
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  .icon_style {
    @include wh(1.125rem, 1.125rem);
    background-size: 100% 100%;
    margin-bottom: 0.1rem;
    margin-top: 0.5rem;
    fill: #ccc;
  }
  .icon_1 {
    background-image: url("../../images/index/tab_home-normal.png");
  }
  .icon_2 {
    background-image: url("../../images/index/tab_market-normal.png");
  }
  .icon_3 {
    background-image: url("../../images/index/tab_mine-normal.png");
  }
  span {
    @include sc(0.6875rem, #959595);
    font-family: PingFangSC;
    font-weight: normal;
  }
}
.active {
  span {
    @include sc(0.6875rem, #FF585C);
  }
  .icon_1 {
    background-image: url("../../images/index/tab_home-pressed.png");
  }
  .icon_2 {
    background-image: url("../../images/index/tab_market-pressed.png");
  }
  .icon_3 {
    background-image: url("../../images/index/tab_mine-pressed.png");
  }
}
</style>
