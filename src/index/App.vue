<template>
 <!-- style="height:100%;" -->
	<div class="app" style="height:100%;overflow:hidden;">
		<!-- <head-top signin-up='home'>
		<span slot='logo' class="head_logo" @click="reload">随意借</span>
		</head-top> -->
    <!-- :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" -->
		<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" mode="out-in">
      <!-- router-fade -->
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive" class="router-v"></router-view>
			</keep-alive>
    </transition>
    	<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" mode="out-in">
        <!-- router-fade -->
			<router-view v-if="!$route.meta.keepAlive" class="router-v"></router-view>
		</transition>
    <alert-tip :alertText='alertTextFirst' btnText='确认'  v-if="isShowAlert" @closeTip="closeAlert"/>
    <!-- <vue-loading v-if="showLoading" type='beat' ></vue-loading> -->
    </div>
</template>

<script>
// import headTop from "@@/components/header/head";
import { mapState, mapMutations } from "vuex";
// import { mapState } from "vuex";
import axios from "@@/plugins/rsa/axios";
import { connector as api } from "@@/config/env";
// import vueLoading from 'vue-loading-template'

import { asyncLoaded } from "@@/service/util";

export default {
  components: {
    // headTop
    // vueLoading
  },
  mounted() {
    let that = this
    // 百度地图成功回调用函数
    window.LBSBD_1=function(){
      window.LBSBD(true,()=>{
        that.LATITUDE(window.LATITUDE+'')
        that.LONGITUDE(window.LONGITUDE+'')
      })
    }
    // 异步加载百度地图
    // asyncLoaded(
    //   "https://api.map.baidu.com/api?v=2.0&ak=wrkfH0yCNoWEHrXm0L9A5KdGaU8To9dR&callback=window.LBSBD_1",
    //   () => {}
    // );
  },
  beforeCreate() {},
  created() {},
  computed: {
    ...mapState([
      "direction",
      "alertTextFirst",
      "alertTextSecond",
      "isShowAlert",
      "btnText",
      "isAdmittance"
      // "showLoading"
    ])
  },
  methods: {
    ...mapMutations([
      "ISSHOWALERT",
      "LATITUDE",
      "LONGITUDE"
      // "SHOWLOADING"
    ]),
    async init() {},
    closeAlert() {
      //关闭弹窗
      this.ISSHOWALERT(false);

    }
  }
};
</script>

<style lang="scss">
@import "./style/common";
.app {
  height: 100%;
  width: 100%;
}

.vux-pop-out-enter-active,
.vux-pop-in-enter-active {
  will-change: transform, opacity;
  transition: all 0.1s ease;
  // transition: all 200ms ease;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  perspective: 1000;
}

.vux-pop-out-enter {
  opacity: 0.5;
  transform: translate3d(-100px, 0, 0);
  // transform: translate3d(-100%, 0, 0);
}

.vux-pop-out-leave-active {
  opacity: 0.5;
  transform: translate3d(100px, 0, 0);
  // transform: translate3d(100%, 0, 0);
}

.vux-pop-in-enter {
  opacity: 0.5;
  transform: translate3d(50px, 0, 0);
  // transform: translate3d(100%, 0, 0);
}

.vux-pop-in-leave-active {
  opacity: 0.5;
  transform: translate3d(-50px, 0, 0);
  // transform: translate3d(-100%, 0, 0);
}
.router-v {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}
</style>
