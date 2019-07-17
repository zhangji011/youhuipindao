import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router/router";
import store from "./store/";
import { routerMode } from "./config/env";
import Cube from 'cube-ui'
Vue.use(Cube)
import weui from 'weui.js'
import 'weui'
Vue.prototype.$weui = weui
import methods from "./config/methods";//方法挂靠全局
Object.keys(methods).forEach((key) => {
	Vue.prototype[key] = methods[key];
});

import "./config/rem";
import FastClick from "fastclick";
// import axios from "@@/plugins/rsa/axios";
import { animationProgress } from "@@/service/util";

// 延迟点击
if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      FastClick.attach(document.body);
    },
    false
  );
}
// if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
//   document.body.addEventListener("touchend", function(event) {
//     console.log(
//       "touchend event caught and default prevented",
//       event.target.tagName
//     );
//     if (event.target.tagName.toLowerCase() == "input") {
//       event.target.click();
//     }
//   });
// }

Vue.use(VueRouter);
const router = new VueRouter({
  history: true,
  hashbang: false,
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== "production",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  animationProgress(to, from, next);
  // if (store.state.flag) {
    next();
    return;
  // }
  // let slider = 0,
  //     slider1 = 0,
  //     slider2 = 0,
  //     tabs = 0,
  //     alertinfo = 0,
  //     bannermarkets = 0,
  //     topTitle = 0,
  //     recommends = 0;

  //     axios.get("index/getIndexAllData")
  //     .then((res) => {
  //         store.commit("SLIDER2", (res.data ? res.data.operations : []));
  //         slider2 += 1;
  //         store.commit("SLIDER", (res.data ? res.data.tops : []));
  //         slider += 1;
  //         store.commit("SLIDER1", (res.data ? res.data.catalogs : []));
  //         slider1 += 1;
  //         store.commit("TABS", (res.data ? res.data.tabs : []));
  //         tabs += 1;
  //         store.commit("ALERTINFO", (res.data ? res.data.popUps : []));
  //         alertinfo += 1;
  //         store.commit("BANNERMARKETS", (res.data ? res.data.bannermarkets : []));
  //         bannermarkets += 1;
  //         store.commit("TOPTITLE", (res.data ? res.data.topSysConfigValue : ""));
  //         topTitle += 1;
  //         store.commit("RECOMMENDS", (res.data ? res.data.recommends : []));
  //         recommends += 1;
  //         // console.log("xiao",store.state.alertinfo)
  //         checkUtil(slider, slider1, slider2, next)
  //     }).catch((res) => {
  //         // window.location.reload()
  //     })
});
new Vue({
    router,
    store
}).$mount("#app")
