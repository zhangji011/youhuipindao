// import 'babel-polyfill'
import Vue from "vue";
// import Es6Promise from 'es6-promise'

// require('es6-promise').polyfill()

// Es6Promise.polyfill()

// import Vue from "vue";
// import App from "./App";
import VueRouter from "vue-router";
import VueLazyload from "vue-lazyload";
import routes from "./router/router";
// import bestpay from "@@/service/bestpay";
// import { getProduct, getSessionKey, system, setTopRightBar } from "@@/service/bestpay_";
// import { getUUID,animationProgress } from "@@/service/util";
import store from "./store/";
import { routerMode } from "./config/env";
import "./config/rem";
import FastClick from "fastclick";
import axios from "@@/plugins/rsa/axios";
import AlertTip from "@@/components/common/alertTip";
import { checkUtil, isHebaoApp, animationProgress, formatDate_1,asyncLoaded } from "@@/service/util";
import methods from "./config/methods";//方法挂靠全局
Object.keys(methods).forEach((key) => {
	Vue.prototype[key] = methods[key];
});
// 神策
import sa from "sa-sdk-javascript";
import 'swiper/dist/css/swiper.css'

sa.init({
    sdk_url: "https://static.sensorsdata.cn/sdk/1.10.9/sensorsdata.min.js",
    heatmap_url: "https://static.sensorsdata.cn/sdk/1.10.9/heatmap.min.js",
    name: "sa",
    //配置打通 App 与 H5 的参数
    use_app_track: true,
    use_client_time: true,
    is_single_page: true,
    web_url: "https://hebaopay.cloud.sensorsdata.cn/",
    // 测试地址
    // server_url: "https://hebaopay.cloud.sensorsdata.cn:4006/sa?token=e852cbf8dc40a8d1",
    // 正式地址
    server_url: "https://uba.cmpay.com:8106/sa?project=production",
    heatmap: {
       clickmap: "not_collect",
       scroll_notice_map: "not_collect"
    }
  });
// sa.login('100422801839');
sa.quick("autoTrack", {
    platForm: "h5"
});

Vue.use(VueLazyload)
Vue.use(VueLazyload, {
    preLoad: 0.5,
    error: require('@@/images/tipIcon.png'),
    loading: require('@@/images/tipIcon.png'),
    attempt: 1,
    // listenEvents: [ 'animationend' ]
})

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
// let isIPhone = /iP(ad|hone|od)/.test(navigator.userAgent)
// ios 防止select焦点跳动
if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
  document.body.addEventListener("touchend", function(event) {
    console.log(
      "touchend event caught and default prevented",
      event.target.tagName
    );
    if (event.target.tagName.toLowerCase() == "input") {
      event.target.click();
    }
  });
}

//注册全局组件 弹窗
Vue.component("alert-tip", AlertTip);

Vue.use(VueRouter);
// Vue.use(bestpay)

const router = new VueRouter({
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
  if (store.state.flag) {
    next();
    return;
  }
  let slider = 0,
      slider1 = 0,
      slider2 = 0,
      tabs = 0,
      alertinfo = 0,
      bannermarkets = 0,
      topTitle = 0,
      recommends = 0;

  // 单点登录
  //?SERVICE=user_ssoservice&VERSION=1.0&PARTNER=80010003&SIGN_TYPE=MD5&CREDTENTIAL=1593305,1502335609,1502336209,1502335609,218.77.2.82,client.cmpay.com&SIGN_DATA=08229a7a638c243bb7ab0a0e67e6d81c&viewCode=html
  // 测试临时添加
  // store.commit('TOKEN', {"session":"TESTSSION","productNo":'13795442667'})
  // let userId = '';
  let startTime = new Date();
  // if(isHebaoApp()) {
  console.log("和包端");
  axios
    .post("queryAccount", {})
    .then(res => {
      //神策
      sa.login(res.data.usrNo);
      console.log("sa.login登录成功");
      let endTime = new Date();
      sa.track("loadDelay", {
        currentBusinessLine: "优惠频道",
        currentActivity: "调用高阳queryAccount接口",
        currentURL: window.location.href,
        currentURL: window.location.href,
        delayTime: endTime - startTime,
        endTime: formatDate_1(endTime.getTime()),
        startTime: formatDate_1(startTime.getTime())
      });
      sa.track("pageLoadingStart", {
        $title: "优惠",
        $url: window.location.href,
        $url_path: window.location.href,
        currentBusinessLine: "优惠频道"
      });
      store.commit("TOKEN", res.data || {});
      store.commit("TOKENSTATUS", res.data.productNo.length);
      if (!res.data || res.data.length <= 0) {
      } else {
      }

      // 请求banner1
      axios.get("index/getIndexAllData")
      .then((res) => {
          store.commit("SLIDER2", (res.data ? res.data.operations : []));
          slider2 += 1;
          store.commit("SLIDER", (res.data ? res.data.tops : []));
          slider += 1;
          store.commit("SLIDER1", (res.data ? res.data.catalogs : []));
          slider1 += 1;
          store.commit("TABS", (res.data ? res.data.tabs : []));
          tabs += 1;
          store.commit("ALERTINFO", (res.data ? res.data.popUps : []));
          alertinfo += 1;
          store.commit("BANNERMARKETS", (res.data ? res.data.bannermarkets : []));
          bannermarkets += 1;
          store.commit("TOPTITLE", (res.data ? res.data.topSysConfigValue : ""));
          topTitle += 1;
          store.commit("RECOMMENDS", (res.data ? res.data.recommends : []));
          recommends += 1;
          // console.log("xiao",store.state.recommends)
          checkUtil(slider, slider1, slider2, next)
      }).catch((res) => {
          // window.location.reload()
      })
    }).catch((res) => {
      // console.log("加载失败了")
      console.log("No queryAccount");
      axios.post("queryAccount", {})
      .then(res => {
        //神策
        sa.login(res.data.usrNo);
        console.log(res.data.usrNo);
        console.log("sa.login登录成功");
        let endTime = new Date();
        sa.track("loadDelay", {
          currentBusinessLine: "优惠频道",
          currentActivity: "调用高阳queryAccount接口",
          currentURL: window.location.href,
          currentURL: window.location.href,
          delayTime: endTime - startTime,
          endTime: formatDate_1(endTime.getTime()),
          startTime: formatDate_1(startTime.getTime())
        });
        store.commit("TOKEN", res.data || {});
        store.commit("TOKENSTATUS", res.data.productNo.length);
        console.log("xxxxxxxxxxxxx",store.state.token.productNo.length);
        
        }).catch((res) => {
          // console.log("加载失败了")
          // window.location.reload()
        })
          // 请求banner1
        axios.get("index/getIndexAllData")
        .then((res) => {
            store.commit("SLIDER2", (res.data ? res.data.operations : []));
            slider2 += 1;
            store.commit("SLIDER", (res.data ? res.data.tops : []));
            slider += 1;
            store.commit("SLIDER1", (res.data ? res.data.catalogs : []));
            slider1 += 1;
            store.commit("TABS", (res.data ? res.data.tabs : []));
            tabs += 1;
            store.commit("ALERTINFO", (res.data ? res.data.popUps : []));
            alertinfo += 1;
            store.commit("BANNERMARKETS", (res.data ? res.data.bannermarkets : []));
            bannermarkets += 1;
            store.commit("TOPTITLE", (res.data ? res.data.topSysConfigValue : ""));
            topTitle += 1;
            store.commit("RECOMMENDS", (res.data ? res.data.recommends : []));
            recommends += 1;
            // console.log("xiao",store.state.alertinfo)
            checkUtil(slider, slider1, slider2, next)
        }).catch((res) => {
            // window.location.reload()
        })
      
    })
  // } else {
  //     console.log("外放端");
  //     axios.post("queryAccount", {})
  //     .then(res => {
  //       //神策
  //       sa.login(res.data.usrNo);
  //       console.log(res.data.usrNo);
  //       console.log("sa.login登录成功");
  //       let endTime = new Date();
  //       sa.track("loadDelay", {
  //         currentBusinessLine: "优惠频道",
  //         currentActivity: "调用高阳queryAccount接口",
  //         currentURL: window.location.href,
  //         currentURL: window.location.href,
  //         delayTime: endTime - startTime,
  //         endTime: formatDate_1(endTime.getTime()),
  //         startTime: formatDate_1(startTime.getTime())
  //       });
  //       store.commit("TOKEN", res.data || {});
  //       store.commit("TOKENSTATUS", res.data.productNo.length);
  //       console.log("xxxxxxxxxxxxx",store.state.token.productNo.length);
        
  //       }).catch((res) => {
  //         // console.log("加载失败了")
  //         // window.location.reload()
  //       })
  //         // 请求banner1
  //       axios.get("index/getIndexAllData")
  //       .then((res) => {
  //           store.commit("SLIDER2", (res.data ? res.data.operations : []));
  //           slider2 += 1;
  //           store.commit("SLIDER", (res.data ? res.data.tops : []));
  //           slider += 1;
  //           store.commit("SLIDER1", (res.data ? res.data.catalogs : []));
  //           slider1 += 1;
  //           store.commit("TABS", (res.data ? res.data.tabs : []));
  //           tabs += 1;
  //           store.commit("ALERTINFO", (res.data ? res.data.popUps : []));
  //           alertinfo += 1;
  //           store.commit("BANNERMARKETS", (res.data ? res.data.bannermarkets : []));
  //           bannermarkets += 1;
  //           store.commit("TOPTITLE", (res.data ? res.data.topSysConfigValue : ""));
  //           topTitle += 1;
  //           store.commit("RECOMMENDS", (res.data ? res.data.recommends : []));
  //           recommends += 1;
  //           // console.log("xiao",store.state.alertinfo)
  //           checkUtil(slider, slider1, slider2, next)
  //       }).catch((res) => {
  //           // window.location.reload()
  //       })
  //   }
});
//  // 百度地图成功回调用函数
//  window.LBSBD_1=function(){
//     window.LBSBD(true,()=>{
//     store.commit("LATITUDE", window.LATITUDE+'');
//     store.commit("LONGITUDE", window.LONGITUDE+'');
//     })
//   }
//   // 异步加载百度地图
//   asyncLoaded(
//     "https://api.map.baidu.com/api?v=2.0&ak=wrkfH0yCNoWEHrXm0L9A5KdGaU8To9dR&callback=window.LBSBD_1",
//     () => {
     
//     }
//   );

new Vue({
    router,
    store
}).$mount("#app")
