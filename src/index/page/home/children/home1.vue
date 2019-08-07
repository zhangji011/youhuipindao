<template>
  <div>
    <div v-show="isShareBtn" @click="getSharePage()" class="shareBtn"></div>
    <header>
      <ul>
        <router-link tag="li" class="l t" to="/"></router-link>
        <!-- <li class="l t" @click="goBack()"></li> -->
        <li class="l">
          <span>附近优惠</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </header>
    <section class="s_1">
      <ul>
        <li class="l t" @click.stop="getClickCity()">
          <span v-show="showCity">{{cityName1.split("市")[0]}}</span>
          <span v-show="showCitys">{{county}}</span>
          <!-- {{cityName2}} -->
        </li>
        <li class="l i" @click="done()">
          <button><span class="icon"><img src="/static/img/1-20.png"></span>搜一搜：请输入商户名称</button>
        </li>
      </ul>
    </section>

    <div class="home">
     <scroll
        :data1 ="data1"
        :data = "shopList"
        :scrollbar='tabScrollbar'
        :pullDownRefresh='pullDownRefresh'
        :refreshNow = 'refreshNow'
        :scrollY = "scrollYOther"
        :pullUpLoad= "pullUpLoad_near"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
        scrollbar=true
        >
        <div class="content">
          <section v-if="slider && slider.length>0" class="s_2 s foods-wrapper">
            <div class="scroll content slide-content">
              <div>
                  <div class="slider-wrapper">
                      <slider :click="slider_top_click" :autoPlay = "slider.length>1" :loop="slider.length>1">
                          <div v-for="item in slider">
                            <!-- :key="item.marketingId -->
                              <a  @click="goDetail($event,item,2,'top')" >
                                  <img :src="item.marketingIcon">
                              </a>
                          </div>
                      </slider>
                  </div>
              </div>
            </div>
          </section>

          <section v-if="slider1 && slider1.length>0" class="s_3 s">
            <ul>
              <li v-for="(item, index) in slider1"  @click="goCatalogs(index,item,'classify')">
                <img :src="item.marketingIcon" :onerror='defaultIcon' class="icon">
                <a :class="{'active':selectIndex==index}" class="text">{{item.marketingTitle}}</a>
              </li>
            </ul>
          </section>
          <div class="nullHeight"></div>
          <section class="s_5 s">
            <near1
              :data1 = "data1"
              :titleParm = "titleParm"
              :latitude = 'latitude'
              :longitude = 'longitude'
              :shopList="shopList"
              :data = "shopList"
              @aginEnter = "aginEnter"
              @goDetail="goDetail"
              >
            </near1>
            <!-- <ul v-if = "!shopList || shopList.length<=0 ">
              <loading v-if="showLoading"></loading>
              <li @click="aginEnter()" class="aa">
                <img src="/static/img/load fail_2.png"/>
                <div class="loadText">请点击刷新</div>
              </li>
            </ul> -->
          </section>
        </div>
      </scroll>
      </div>
      <div v-show="isStatus" class="foot_login fx" id="foot_login fx">
        <ul>
          <li class="login_l">
            <img src="/static/img/login_logo.png">
          </li>
          <li class="login_m">
            登录查看更多优惠
          </li>
          <li class="login_r">
            <span @click="goLogin()">立即登录</span>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
// import headTop from "@@/components/header/head";
// import footGuide from '@@/components/footer/footGuide'
// import SlideRender from '@@/components/page-render/slide-render'
import { mapState, mapMutations } from "vuex";
import Slider from "@@/components/base/slider-BScroll";
import axios from "@@/plugins/rsa/axios";
import Loading from "@@/components/loading/loading.vue";
import sa from "sa-sdk-javascript";
import {
  fetchPoints,
  // GetDistance,
  isHebaoApp,
  shareNow,
  setLItem,
  animationProgress,
  getLItem,
  formatDate_1
} from "@@/service/util";
import { baseUrl } from "@@/config/env"; // baseUrl
// import BScroll from "better-scroll";
import Scroll from "@@/components/scroll/scroll.vue";
import Near1 from "./near1.vue";
// import Recommended from "./recommended.vue";
// import Consulting from "./consulting.vue"; // 咨询
// import GoodThing from "./goodThing.vue"; // 好物
import Cookies from 'js-cookie'
import Bus from './gongtong.js'
// console.log(axios);
// import {cityGuess, hotcity, groupcity} from '../../service/getData'
export default {
  data() {
    return {
      pullUpLoad: false,
      pullUpLoad_near: true,
      data1: false,
      isShareBtn: false,
      isStatus: false,
      showCity: true,
      showCitys: false,
      titleParm: "",
      selectIndex: 0,
      loadText: "",
      county: "",
      banner: "/static/mine_banner.png",
      icon: require("@@/images/mine/help_other-pressed.png"),
      product: [],
      listHeight: [],
      scrollY: true,
      topCat: false,
      scrollbar: false,
      slider_top_click: true,
      slider_middle_click: true,
      bounce: false,
      defaultIcon: 'this.src="' + "/static/img/error.png" + '"',
      tabAutoPlay: false,
      tabLoop: false,
      tabScrollbar: false,
      showDot: true,
      refreshNow:true,
      dots: ["附近", "推荐", "世界杯专区"], //['附近','推荐','世界杯专区','咨询'],
      // autoPlay:,
      // defaultIcon: "",

      // slider:[],
      // slider1:[],
      // slider2:[],
      isError: true,
      loopX: true,
      shopList: [],
      limit: "",
      creditResult: "",
      isShowAlert: false,
      alertTextFirst: "",
      alertTextSecond: "",
      btnText: "",
      isAdmittance: false,
      home: "",
      foodsScroll: "",
      residue: 0,
      flag: false,
      shopListFlag: false,
      CURRENTPAGE: 0, // 页码
      PAGNUM: 4,
      refTime: "",
      baseImg: baseUrl.img,
      totalInit: 0,
      endX: 0,
      sliderIndex: 0,
      startX: 0,
      scrollY: true,
      scrollYOther: true,
      startY: 0,
      threshold: 0.2,
      cityName1: window.CITYNAME || "定位中",
      cityName2: window.CITYNAME2,
      pullDownRefresh: {
        threshold: 120,
        stop: 60
      }
    };
  },
  computed: {},

  mounted() {
    Cookies.remove("item")
    Cookies.remove("l1")
    var vm = this
    // 用$on事件来接收参数
    Bus.$on('val', (data) => {
      vm.cityName1 = data
    })
    Cookies.set("href",window.location.href)
    this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
    this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
    this.cityName1 =((document.cookie.indexOf("item")!=-1)?Cookies.get("item").city_name:"")||window.CITYNAME || "定位中";
    // axios.post("getShopInfo", {
    //   centre_longitude: this.l,
    //   centre_latitude: this.s,
    //   longitude: window.LONGITUDE, // 经度
    //   latitude: window.LATITUDE, // 维度
    //   stores_nm: "", // 门店名称
    //   merc_abbr: "", // 商户简称
    //   mblno: this.token.productNo, //用户手机号
    //   // tixn_cnl: "ROYTEL", // 固定值
    //   currentPage: this.CURRENTPAGE,
    //   pagNum: this.PAGNUM || 4,
    //   // session: this.token.session.replace(/\+/g, "%2B"),
    //   map_type: window.isUseBaiDuLoc ? 0 : 0,
    //   // map_type: window.isUseBaiDuLoc,
    //   merc_trd_cls: this.numIndex
    //   }).then(res => {
    //     // this.shopList = res.STORES_REC;
    //     // 合并数组
    //     this.shopList.push.apply(this.shopList, this.filterObj(res.data));
    //     if (res.data.length < this.PAGNUM) {
    //       this.shopListFlag = true;
    //       this.data1 = true;
    //       // 数组没有更多了
    //     } else {
    //       this.shopListFlag = false;
    //       this.data1 = false;
    //     }
    //     this.initScroll();
    //   })
    //   .catch(res => {
    //     this.initScroll();
    //   });

    this.getListTitle();
    try {
      console.log("okokok",this.countyParm);
      fetchPoints(
        "home1",
        "event_3",
        this.token.productNo,
        "进入附近商户",
        this.token.session.replace(/\+/g, "%2B")
      );
    } catch (e) {}
    if (!window.LATITUDE) {
      // this.aginEnter();
    } else {
      this.init();
    }
  },
  created() {
    //神策
    let startTime = new Date();
    let endTime = new Date() ;
    sa.track("loadDelay",{
      currentBusinessLine: "优惠频道",
      currentActivity: "优惠更多页面",
      currentURL: window.location.href,
      delayTime: endTime - startTime,
      offsetTime: 0,
      endTime: formatDate_1(endTime.getTime()),
      startTime: formatDate_1(startTime.getTime())
    })
  },

  components: {
    Slider,
    Loading,
    Scroll,
    Near1
    // Recommended,
    // Consulting,
    // GoodThing
    // vueLoading
    // SlideRender
  },

  computed: {
    ...mapState([
      "slider",
      "slider1",
      "slider2",
      "products",
      "showLoading",
      "token",
      "countyParm",
      "tokenstatus",
      "latitude",
      "longitude",
      "cityname",
      "sliderScroll",
      "slideIndex",
      "openAndClose"
    ])
  },

  methods: {
    ...mapMutations([
      "SLIDER1", // 我的页面banner图
      "PRODUCTS",
      "SHOWLOADING",
      "CITYNAME1",
      "CITYNAME2",
      // "CITYCOUNTY",
      "OPENANDCLOSE"
    ]),
    scrollListen(pos) {
      console.log("home");
      console.log(pos);
      // setTimeout(()=>{

      // })
      // 处理滑动
      // if(Math.abs(pos.y)>280){
      //   this.scrollYOther = true;
      //   this.scrollY = false
      //   // this.startY = pos.y
      // }else if(Math.abs(pos.y)>0){
      //   console.log(99999)
      //   this.scrollYOther = false;
      //   // this.scrollY = true
      // }
      if (Math.abs(pos.y) > 320) {
        // this.scrollY = false
        // this.scrollYOther = true;
        // this.startY = -321
        this.OPENANDCLOSE(false);
        this.topCat = true;
      } else {
        this.topCat = false;
        this.OPENANDCLOSE(true);
      }
    },
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goToPage(index) {
      this.sliderIndex = index;
    },
    getSharePage(e) {
      let index_urls = {
        shareUrl: window.location.href,
        wap_produce_reqData: "/gmeweb/miguhw_merc.xhtml?viewCode=json"// 单点登录
      };
      let shareTxt = "附近优惠——刷和包享立减，附近商户 首绑卡消费满20减10";
      shareNow(index_urls.shareUrl, shareTxt);
    },
    getClickCity(){
      // 神策
      sa.track("buttonClick", {
        buttonName: "进入城市页",
        topCategory: "外放优惠",
        subCategory: "外放优惠：城市页"
      });
      Cookies.set("city2",window.CITYNAME)
      Cookies.set("city1",window.LONGITUDE)
      Cookies.set("city",window.LATITUDE)
      this.$router.push({
        path: "/city",
        query: {
            params: this.cityName1,
            params2: this.cityName2
          }
      });
    },
    aginEnter() {
      // alert(33)
      this.SHOWLOADING(true);
      this.initScroll();
      let that = this;
      if (this.cityName1 && this.cityName1 != "定位中" && window.LATITUDE) {
        this.init();
      } else {
        try {
          new BMap.Geolocation().getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              // 判断状态
              let pt = r.point;
              console.log(r);

              new BMap.Geocoder().getLocation(pt, function(rs) {
                // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                if (rs.point) {
                  let addComp = rs.addressComponents;
                  window.LATITUDE = rs.point.lat;
                  window.LONGITUDE = rs.point.lng;
                  window.CITYNAME = addComp.city;
                  that.cityName1 = addComp.city;
                } else {
                  window.LATITUDE = r.point.lat;
                  window.LONGITUDE = r.point.lng;
                  window.CITYNAME = r.address.city;
                  that.cityName1 = r.address.city;
                }
                that.init();
                // alert(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
              });
            } else {
              this.SHOWLOADING(true);
            }
          });
        } catch (e) {}
      }
    },
    intervalCity() {
      this.cityName1 = window.CITYNAME || "定位中";
    },
    defaultIconF(i) {
      this.shopList[i].PIC_URL_1 = "/static/img/error.png";
    },
    // GetDistance(a, b, c, d) {
    //   // alert(GetDistance(a, b, c, d))
    //   return GetDistance(a, b, c, d);
    // },
    detail(url) {
      window.location = url;
    },
    gotoAddress(path) {
      this.$router.push(path);
    },
    goLogin(e) {
      // 神策
      sa.track("buttonClick", {
        buttonName: "登录查看更多优惠",
        topCategory: "外放优惠",
        subCategory: "外放优惠：登录"
      });
      let urls = "https://find.cmpay.com:9102/rcServer/hbopenreceive?state=" + window.location.href;
      console.log(urls);
      window.location = urls;
    },
    done() {
      // 跳转到下一个页面
      this.$router.push("/mine");
      // 神策
      sa.track("clickSearch", {
        operationType: "点击搜索框",
        currentPage: "优惠更多"
      });
    },
    touchStart(e) {
      let touch = e.changedTouches[0];
      this.startX = touch.pageX;
      // console.log(touch)
      // startY = touch.pageY;
      // startX = touch.pageX;
    },
    goCatalogs(index,obj, channel = "default") {
      try {
        if (channel == "classify") {
          // 神策
          sa.track("buttonClick", {
            buttonName: obj.marketingTitle,
            topCategory: "优惠",
            subCategory: "优惠：附近页"
          });
          fetchPoints(
            "020000000000",
            "020000000000K02",
            this.token.productNo,
            "分类-" + obj.marketingTitle,
            this.token.session.replace(/\+/g, "%2B")
          );
        }
      } catch (e) {};
      this.selectIndex = index;
      this.CURRENTPAGE = 1;
      let mercParm = obj.mercTrdCls;
      Cookies.set("l1",mercParm);
      this.titleParm = obj.marketingTitle;
      // console.log(obj.marketingTitle, mercParm);
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).cityName:"")||window.CITYNAME || "定位中";
      // axios.post("getExternalShopInfo", {  //正式环境调用接口
      axios.post("getShopInfoTest", {  //测试环境调用接口
        centre_longitude: this.l,
        centre_latitude: this.s,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 门店简称
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        mblno: this.token.productNo || "", //用户手机号
        pagNum: this.PAGNUM || 4,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: mercParm
        }).then(res => {
          if (res.data && res.data.length > 0) {
            this.isError = true;
            this.shopList = this.filterObj(res.data);
            // if (flag) {
            //   this.home.finishPullDown();
            // } else {
            //   this.home.refresh();
            // }
            this.initScroll();
            setTimeout(() => {
              this.SHOWLOADING(false);
            }, 300);
          } else {
            this.isError = true;
            this.totalInit++;
            if (this.totalInit <= 5) {
              this.init();
            } else {
              // this.shopList = getLItem("shopList", 600000);
              this.shopList = [];
              // setTimeout(() => {
              this.SHOWLOADING(false);
              this.isError = false;
              if (flag) {
                // this.initScroll();
              } else {
                // this.initScroll();
              }
              // }, 300);
            }
            return;
          }
          // console.log("cccccc",this.shopList);
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            //没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
        })
    },
    goDetail(event, obj, flag, channel = "default") {
      // alert(33)
      // if (flag == 2) {
      //   let touch = event.changedTouches[0];
      //   console.log(touch);
      //   this.endX = touch.pageX;
      //   // 点击影响滑动
      //   if (Math.abs(this.endX - this.startX) > 50) {
      //     return;
      //   }
      // }

      // let touch = event.touches[0];
      // event.stopPropagation();
      // event.preventDefault();
      // if(this.stopClick){
      //   return
      // }
      // 防止pc端触发两次点击
      // if (!event._constructed) {
      //   return;
      // }
      //埋点 parent_title, sub_title,phone,remark, session
      try {
        if (channel == "top") {
          // 神策
          sa.track("bannerClick", {
            contentName: obj.marketingTitle,
            bannerNumber: String(obj.marketingNumber),
            topCategory: "优惠更多"
          });
          fetchPoints(
            "020000000000",
            "020000000000K01",
            this.token.productNo,
            "轮播banner-" + obj.marketingTitle,
            this.token.session.replace(/\+/g, "%2B")
          );
        } else if (channel == "classify") {
          // 神策
          sa.track("buttonClick", {
            buttonName: obj.marketingTitle,
            topCategory: "优惠",
            subCategory: "优惠：更多优惠"
          });
          fetchPoints(
            "020000000000",
            "020000000000K02",
            this.token.productNo,
            "分类-" + obj.marketingTitle,
            this.token.session.replace(/\+/g, "%2B")
          );
        }
      } catch (e) {}

      let url = flag == 1 ? obj.MERC_URL : obj.marketingEventCotent;
      // if (flag == 1) {
      //   setLItem("shopList", JSON.stringify(this.shopList));
      //   // localStorage.setItem("shopList", JSON.stringify(this.shopList));
      //   //.replace(/www/, "uat")
      //   this.SHOWLOADING(true);
      //   // setTimeout(()=>{

      //   // },5000)
      //   // this.stopClick = 1
      //   window.location =
      //     url.indexOf("?") > 0
      //       ? url.replace(/\?/, "?showtitle=false&") +
      //         "&SOURCE=DISCOVER&" +
      //         window.location.href.split("?")[1].split("#")[0]
      //       : url +
      //         "?showtitle=false&SOURCE=DISCOVE&" +
      //         window.location.href.split("?")[1].split("#")[0];
      //   return;
      // }
      // alert(33)
      if(isHebaoApp()) {
        if (
          (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
          "android"
        ) {
          // window.location =
          //   url.indexOf("?") > 0
          //     ? url.replace(/\?/, "?showtitle=false&") +
          //       "&SOURCE=DISCOVER&" +
          //       window.location.href.split("?")[1].split("#")[0]
          //     : url +
          //       "?showtitle=false&SOURCE=DISCOVE&" +
          //       window.location.href.split("?")[1].split("#")[0];
          // window.location = url.replace(/\?/, "?showtitle=false&");
          if (flag == 2) {
            let url2 =
              url.indexOf("?") > 0
                ? url.replace(
                    /\?/,
                    "?hebaosso=true&SOURCE=DISCOVER&account=" +
                      this.token.productNo +
                      "&"
                  )
                : url +
                  "?hebaosso=true&SOURCE=DISCOVER&account=" +
                  this.token.productNo;
            // console.log(url2);
            window.goActivity.goWeb(url2);
          } else {
            window.goActivity.goWeb(
              url.replace(
                /\?/,
                "?showtitle=false&hebaosso=true&SOURCE=DISCOVER&account=" +
                  this.token.productNo +
                  "&"
              )
            );
          }
        } else {
          // console.log(
          //   "activity://goWeb?url=" + url.replace(/\?/, "?showtitle=false&")
          // );
          if (flag == 2) {
            let url_2 =
              url.indexOf("?") > 0
                ? url.replace(
                    /\?/,
                    "?hebaosso=true&SOURCE=DISCOVER&account=" +
                      this.token.productNo +
                      "&"
                  )
                : url +
                  "?hebaosso=true&SOURCE=DISCOVER&account=" +
                  this.token.productNo;
            // console.log(url_2);
            window.location = "activity://goWeb?url=" + url_2;
          } else {
            // console.log(
            //   url.replace(/\?/, "?showtitle=false&hebaosso=true&SOURCE=DISCOVER&")
            // );
            window.location =
              "activity://goWeb?url=" +
              url.replace(
                /\?/,
                "?showtitle=false&hebaosso=true&SOURCE=DISCOVER&account=" +
                  this.token.productNo +
                  "&"
              );
          }
        }
      } else {
          window.location.href="" + obj.marketingEventCotent
      }
    },
    filterObj(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].PIC_URL_1) {
          obj[i].PIC_URL_1 = this.baseImg + obj[i].PIC_URL_1;
        }
      }
      return obj;
    },
    getListTitle() {
      let parms = this.slider1[0].marketingTitle;
      this.titleParm = parms;   // 分类列表默认标题
      if(isHebaoApp()) {
        this.isShareBtn = true;
      }
      console.log("打印数据status:"+this.tokenstatus);
      if(this.tokenstatus == 11) {
        this.isStatus = false;
      }
    },
    loadMore() {
      if (this.shopListFlag) {
        return;
      }
      this.numIndex = this.slider1[this.selectIndex].mercTrdCls;
      Cookies.set("l1",this.numIndex);
      // console.log(numIndex);
      this.CURRENTPAGE += 1;
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
         // console.log("735行开始打印数据——————————");
         // console.log(JSON.parse(Cookies.get("item")))
         // console.log(window.CITYNAME)
         // console.log(document.cookie.indexOf("item"));   //734
         // console.log(JSON.parse(Cookies.get("item")).city_longitude);
         // console.log(this.l)   //112.979353   北京113.23442278
         // console.log(this.s)   //28.213478    北京23.093666204
      // axios.post("getExternalShopInfo", {  //正式环境调用接口
      axios.post("getShopInfoTest", {  //测试环境调用接口
        centre_longitude:this.l,
        centre_latitude:this.s,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 商户简称
        mblno: this.token.productNo || "", //用户手机号
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        pagNum: this.PAGNUM || 4,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: this.numIndex
        }).then(res => {
          // this.shopList = res.STORES_REC;
          // 合并数组
          this.shopList.push.apply(this.shopList, this.filterObj(res.data));
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            // 数组没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
          this.initScroll();
        })
        .catch(res => {
          this.initScroll();
        });
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    },
    onPullingDown() {
      // this.init(true);
      // 模拟更新数据
      // setTimeout(() => {
      //   if (Math.random() > 0.5) {
      //     // 如果有新数据
      //     this.items.unshift(this.$i18n.t('normalScrollListPage.newDataTxt') + +new Date())
      //   } else {
      //     // 如果没有新数据
      //     this.$refs.scroll.forceUpdate()
      //   }
      // }, 2000)
    },
    onPullingUp() {
      // 更新数据
      // console.log('pulling up and load data')
      // setTimeout(() => {
      //   if (Math.random() > 0.5) {
      //     // 如果有新数据
      //     let newPage = []
      //     for (let i = 0; i < 10; i++) {
      //       newPage.push(this.$i18n.t('normalScrollListPage.previousTxt') + ++this.itemIndex + this.$i18n.t('normalScrollListPage.followingTxt'))
      //     }

      //     this.items = this.items.concat(newPage)
      //   } else {
      //     // 如果没有新数据
      //     this.$refs.scroll.forceUpdate()
      //   }
      // }, 1500)
      this.loadMore();
    },
    rebuildScroll() {
      this.nextTick(() => {
        this.$refs.scroll.destroy();
        this.$refs.scroll.initScroll();
      });
    },

    refresh() {
      this.init(true);
      // 下拉刷新
      // if (this.refTime) {
      //   // 移除定时器
      //   clearTimeout(this.refTime);
      //   this.init(true);
      //   // window.location = "http://211.138.236.219:9100/main.html?hebaosso=true&showtitle=false"
      // }
    },
    init(flag) {
      let params_ = this.$route.query.params;
      let params2_ = this.$route.query.params2;
      if(params_ !== undefined) {
        this.county = params_;
        this.showCity = false;
        this.showCitys = true;
      }
      if(params2_ == 5) {
        this.showCity = true;
        this.showCitys = false;
      }
      // this.CURRENTPAGE = 1;
      // this.SHOWLOADING(true);
      // if (history.length >= 3 && localStorage && getLItem("shopList", 60000)) {
      //   // if (history.length >= 3 && localStorage && localStorage.getItem("shopList")) {
      //   this.CURRENTPAGE = 1;
      //   this.SHOWLOADING(true);
      //   // this.shopList = JSON.parse(localStorage.getItem("shopList"));
      //   this.shopList = getLItem("shopList", 60000);
      //   this.initScroll();
      //   setTimeout(() => {
      //     this.SHOWLOADING(false);
      //   }, 300);
      //   // if (res.data.length < this.PAGNUM) {
      //   this.shopListFlag = true;
      //   return;
      // }

      this.CURRENTPAGE = 1;
      if (!flag) {
        this.SHOWLOADING(true);
      } else {
        this.SHOWLOADING(false);
      }
      // 单点登录
      // 请求banner1
      this.cityName1 = ((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).cityName:"")||window.CITYNAME || "定位中";
      // this.cityName1 =
      //   window.CITYNAME ||
      //   (/iP(ad|hone|od)/.test(navigator.userAgent)
      //     ? window.LBSINFO.CityName || "定位中"
      //     : getCode(window.LBSINFO.CityName));

      // if (!window.LONGITUDE) {
      //   this.SHOWLOADING(false);
      //   return;
      // }
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
      // axios.post("getExternalShopInfo", {  //正式环境调用接口
      axios.post("getShopInfoTest", {  //测试环境调用接口
        centre_longitude: this.l || window.LONGITUDE,
        centre_latitude:  this.s || window.LATITUDE,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 门店简称
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        mblno: this.token.productNo || "", //用户手机号
        pagNum: this.PAGNUM || 4,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: (document.cookie.indexOf("l1")!=-1)?Cookies.get("l1"):this.slider1[0].mercTrdCls
        }).then(res => {
          // 神策
          sa.track("pageLoadingCompleted", {
            $title: "优惠",
            $url: window.location.href,
            $url_path: window.location.href,
            currentBusinessLine: "优惠频道"
          });
          if (res.data && res.data.length > 0) {
            this.isError = true;
            this.shopList = this.filterObj(res.data);
            // if (flag) {
            //   this.home.finishPullDown();
            // } else {
            //   this.home.refresh();
            // }
            this.initScroll();
            setTimeout(() => {
              this.SHOWLOADING(false);
            }, 300);
          } else {
            this.isError = true;
            this.totalInit++;
            if (this.totalInit <= 5) {
              this.init();
            } else {
              // this.shopList = getLItem("shopList", 600000);
              this.shopList = [];
              // setTimeout(() => {
              this.SHOWLOADING(false);
              this.isError = false;
              if (flag) {
                this.initScroll();
              } else {
                this.initScroll();
              }
              // }, 300);
            }
            return;
          }

          // console.log(this.shopList);
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            //没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
          // setTimeout(() => {
          //   // this.foodsScroll.scrollTo(0, -42, 500);
          //   this.home.refresh();
          //   this._calcHeight();
          // }, 40);
          // alert(33)
        })
        .catch(res => {
          // alert(11)
          // setTimeout(()=>{
          this.SHOWLOADING(false);
          this.totalInit++;
          if (this.totalInit <= 5) {
            this.init();
          } else {
            this.initScroll();
          }

          // },300)
        });
    },
    initScroll() {
      // if (!this.home) {
      // this.$nextTick(() => {
      // this.foodsScroll = this.home = new BScroll(this.$refs.home, {
      //   scrollY: true,
      //   // startY: -39,
      //   // scrollX: false,
      //   click: true,
      //   probeType: 1,
      //   bounce: true,
      //   scrollbar: {
      //     fade: true,
      //     interactive: false // 1.8.0 新增
      //   },
      //   //  pullUpLoad:{
      //   //                   threshold: -70, // 当上拉到超过底部 4.375rem 时，
      //   //               }
      //   // pullDownRefresh: {
      //   //   threshold: 70,
      //   //   stop: 50 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
      //   // },
      //   pullUpLoad: {
      //     threshold: 50 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
      //   }
      //   // momentumLimitDistance: 15
      // });
      // // this.foodsScroll.on("pullingDown", () => {
      // //   this.refresh(true);
      // // });
      // this.foodsScroll.on("pullingUp", pos => {
      //   this.loadMore();
      // });
      // });
      // this.foodsScroll.on('scrollEnd',(pos)=>{
      //   console.log("888888888")
      //   console.log(pos)
      // })
      // } else {
      // this.home.finishPullUp();
      // setTimeout(() => {
      // this.$refs.scroll.forceUpdate()
      // this.home.finishPullDown();
      // // }, 300);
      // this.home.finishPullUp();
      // this.home.refresh();
      // }
    },
    _calcHeight() {
      // if (this.residue > 0) {
      //   this.listHeight[this.listHeight.length - 1] += residue;
      // }
      // this.residueHeight = residue > 0 ? residue + "px" : "0rem"; //设置最后菜单的padding
      // 重置滚动区域
      // setTimeout(() => {
      //   this._initScroll();
      // }, 0);
    },
    goToApply() {},
    closeAlert() {},
    goBack() {
      // this.$router.go(-1);
      window.history.go(-1)
    }
  },
  activated(){
    console.log(2323)
    // alert()
    this.refreshNow = !this.refreshNow
  },
  watch:{
    latitude(curVal,oldVal){
      this.init()
      if(curVal&&curVal!="" && this.shopList.length<=0){
      }

    },
    cityName1(curVal,oldVal){
      this.flagS=false
      this.init()
      if(curVal&&curVal!="" && this.shopList.length<=0){

      } }
  }
  // props:['activeIcon']
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
// .home{
//   position: relative;
// }
.nullHeight {
  height: 0.5625rem;
  background: #f6f7f8;
}
.refresh {
  text-align: center;
  padding: 1.25rem 0;
  color: #999999;
  background-image: url("/static/img/refresh.gif");
  background-size: 40%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  padding-top: 6.875rem;
  position: absolute;
  top: 3.125rem;
  width: 100%;
  height: 3.125rem;
}
.home {
  // transition: all 0.3s;
  // -webkit-transition: all 0.3s;
  // transform: translateZ(0);
  // -webkit-transform: translateZ(0);
  position: absolute;
  z-index: 1;
  top: 3rem;
  left: 0;
  width: 100%;
  // position: relative;
  height: 100%;
  padding-top: 3rem;
  padding-bottom: 2rem;
  // background: #f0f1f2;
  overflow: hidden;
}
.home1 {
  // margin-top: 4.25rem;
  height: 100%;
  overflow: hidden;
  // z-index: 19;
}
.shareBtn {
    width: 1.05rem;
    height: 1.05rem;
    background: url(/static/img/share_icon.png) top no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 1rem;
    right: 1.2rem;
    z-index: 9999999999;
}
.content {
  // height: auto;
}
.s {
  position: relative;
  // margin-top: .625rem;
  // background: #ffffff;
}
.s_8 {
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
}
header {
  @include wh(100%, 3rem);
  background: #ffffff;
  position: sticky;
  z-index: 100000000;
  top: 0;
  left: 0;
  .l {
    height: 100%;
    line-height: 3rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
    color: #13252e;
    padding-right: 3.5rem;
    text-align: center;
  }
  .t {
    color: #6c6c6c;
    font-size: 0.9375rem;
    height: 3rem;
    position: relative;
    float: left;
    text-align: left;
    background-image: url(/static/img/back.png);
    background-repeat: no-repeat;
    background-position: 0.375rem 50%;
    background-size: 1.1rem;
    // padding-right: 0.6rem;
    @include space();
  }
}
.s_1,
.s_5_1 {
  // @include wh(100%, 3rem);
  // // padding-top: 1.25rem;
  // background: #ffffff;
  // position: fixed;
  // z-index: 100000;
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
  background: #ffffff;
  position: sticky;
  z-index: 100000000;
  top: 3rem;
  left: 0;
  .cat_w {
    height: 3rem !important;
    top: 0rem !important;
    background: white;
    line-height: 3rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .cat {
    width: 33%;
    text-align: center;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 3rem;
    line-height: 3rem;
    background: #fff;
    font-family: PingFangSC-Regular;
    color: #13252e;
    font-size: 0.9375rem;
  }
  .cat.active {
    background: #fff;
    color: #ed1991;
    border-bottom: 0.125rem solid #ed1991;
    border-radius: 0;
  }
  .title {
    position: relative;
    height: 1.5625rem;
    text-align: center;
  }
  .title:after {
    @include onepx1(#d8d8d8);
  }
  .text {
    position: relative;
    width: 4rem;
    padding: 0.3125rem 0.625rem;
    top: 0.75rem;
    background: #fff;
    z-index: 10;
    color: #444444;
    font-size: 0.875rem;
  }
  ul {
    width: 100%;
    height: 100%;
  }
  .l {
    height: 100%;
    line-height: 3rem;
  }
  .t {
    max-width: 7rem;
    color: #6c6c6c;
    font-size: 0.8125rem;
    position: relative;
    float: left;
    text-align: left;
    padding-left: 0.9375rem;
    padding-right: 1rem;
    background: url(/static/img/down.png) no-repeat 100% 50%;
    background-size: .8125rem;
    // padding-right: 0.6rem;
    @include space();
  }
  // .t::after {
  //   content: " ";
  //   width: 0.625rem;
  //   height: 0.625rem;
  //   display: block;
  //   position: absolute;
  //   background-image: url(/static/img/1-13.png);
  //   background-repeat: no-repeat;
  //   background-position: 50%;
  //   background-size: 0.625rem auto;
  //   top: 1.05rem;
  //   right: 0.4375rem;
  // }
  .icon {
    display: block;
    width: 1rem;
    height: 2rem;
    position: absolute;
    left: 0.25rem;
    // top: 0.9875rem;
    img {
      width: 100%;
      display: block;
      position: relative;
      top: 0.5rem;
    }
  }
  .i {
    width: auto;
    margin-left: 4.1875rem;
    display: block;
    margin-right: 1.25rem;
    position: relative;
    button {
      display: block;
      height: 1.9375rem;
      width: 100%;
      z-index: 999;
      position: relative;
      top: 0.5rem;
      text-indent: 2em;
      line-height: 1.9375rem;
      text-align: left;
      color: #a7a7a7;
      background: #f0f1f2;
      border-radius: 0.25rem;
      font-size: 0.8125rem;
    }
  }
}
.s_2 {
  @include wh(100%, 10.625rem);
  overflow: hidden;
  background-color: #fff;
  ul,
  li {
    height: 100%;
    width: 100%;
  }
  img {
    width: 100%;
  }
  // background-image:url('/static/img/banner.jpg');
  // background-repeat: no-repeat;
  // background-position: 50%;
  // background-size: 100% auto;
}

.s_3 {
  @include wh(100%, 4.875rem);
  text-align: center;
  background-color: #fff;
  .icon {
    height: 1.75rem;
    width: auto;
    display: inline-block;
    padding: 0.84375rem 0 0.25rem 0;
  }
  .text {
    display: block;
    color: #7e7e7e;
    font-size: 0.75rem;
  }
  a.active {
    font-family: PingFangSC-Semibold;
    display: block;
    color: #13252e;
    font-size: 0.75rem;
  }

  ul {
    display: flex;
    height: 100%;
    li {
      height: 100%;
      flex: 1;
    }
  }
}
.s_4 {
  @include wh(100%, 7.125rem);
  padding-top: 0.25rem;
  padding-bottom: 0.625rem;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    max-height: 6.125rem;
  }
}

.s_5 {
  // padding: 0 0.9375rem;
  // background: #fff;
  // margin-top: 0.5625rem;
  // margin-bottom: 1rem;
  // height: 56.25rem;
  ul {
    height: 7.5rem;
    padding-top: 1.625rem;
    position: relative;
    margin: 0 0.9375rem;
  }
  // ul::after {
  //   @include onepx1(#d8d8d8);
  // }
  ul:nth-last-child(1)::after {
    height: 0 !important;
  }
  .title {
    position: relative;
    height: 1.5625rem;
    text-align: center;
    background-color: #fff;
  }
  .title:after {
    @include onepx1(#d8d8d8);
  }
  .text {
    position: relative;
    width: 4rem;
    padding: 0.3125rem 0.625rem;
    top: 0.75rem;
    background: #fff;
    z-index: 10;
    color: #444444;
    font-size: 0.875rem;
  }
  .left {
    width: 5.1875rem;
    height: auto;
    float: left;
    max-height: 5rem;
    overflow: hidden;
    img {
      width: 100%;
      max-height: 5rem;
      min-height: 4.5625rem;
    }
  }
  .right {
    float: left;
    padding-left: 0.5625rem;
    min-width: 60%;
    width: 75%;
    text-align: left;
  }
  .c1 {
    font-size: 0.8125rem;
    color: #13252e;
    max-width: 100%;
    @include space();
  }
  .c2 {
    font-size: 0.6875rem;
    color: #999999;
    padding-top: 0.5625rem;
    max-width: 90%;
    @include space();
    .l {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      max-width: 70%;
    }
  }
  .c3 {
    font-size: 0.75rem;
    color: #e11a2f;
    padding-top: 0.5625rem;
    letter-spacing: -0.00375rem;
    max-width: 70%;
    @include space();
    div {
      @include space();
    }
  }
  .r {
    position: absolute;
    right: 0.9375rem;
  }
  .b {
    display: inline-block;
    background: #fff0f1;
    border: thin solid rgba(224, 24, 45, 0.2);
    border-radius: 0.125rem;
    padding: 0.05rem 0.225rem;
    margin-right: 0.1875rem;
  }
}

.s_6 {
  padding: 0 0.9375rem;
  background: #fff;
  margin-top: 0.5625rem;
  ul {
    // height: 7.5rem;
    // padding-top: 1.625rem;
  }
  ul:nth-of-type(1) {
    padding-top: 1.625rem;
  }
  .title {
    position: relative;
    height: 1.5625rem;
    text-align: center;
  }
  .title:after {
    @include onepx1(#d8d8d8);
  }
  .text {
    position: relative;
    width: 4rem;
    padding: 0.3125rem 0.5rem;
    top: 0.75rem;
    background: #fff;
    z-index: 10;
    color: #444444;
    font-size: 0.875rem;
  }
  img {
    width: 100%;
    height: auto;
  }
  .c-t {
    color: #13252e;
    font-size: 0.9375rem;
    padding-bottom: 0.9375rem;
  }
}
.slider-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 10.625rem;
  a {
    display: inline-block;
    height: 10.625rem;
  }
  img {
    // height: 100%;
    height: 10.625rem;
    max-height: 10.625rem;
  }
}
.scroll {
  height: 10.625rem;
}
.slide-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
  height: 56.25rem;
  // margin: 0 .625rem .625rem;
}
.slider-item {
  height: 100% !important;
}
.food-wrapper-banner {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 2.75rem);
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}
.foods-wrapper {
  width: 100%;
  height: 10.625rem;
  // padding-left: 0.9375rem;
  // padding-right: 0.9375rem;
  .title {
    height: 2.8125rem;
    font-size: 0.9375rem;
    color: #929292;
    position: relative;
    line-height: 2.8125rem;
    padding-left: 0.95rem;
    padding-right: 0.16rem;
  }
  .icon {
    height: 1.0625rem;
    width: 1.0625rem;
    vertical-align: middle;
    position: absolute;
    //left: -.3125rem;
    left: 0;
    top: 0.9375rem;
  }
  .content {
    // padding-top:.875rem;
    // padding-left: .625rem;
  }
  .title:before {
    content: " ";
    position: absolute;
    left: 0.125rem;
    top: 50%;
    transform: translateY(-51%);
    width: 0.25rem;
    height: 0.9375rem;
    background: #ff4b4b;
  }
  .foods-item {
    height: 4.625rem;
    padding-top: 0.875rem;
    padding-left: 0.625rem;
    position: relative;
  }
  .food-top {
    height: 1.0625rem;
    // margin-top: .9375rem;
    padding-left: 1.5rem;
    //padding-right: 0.5rem;
    //position: relative;
    .left {
      float: left;
      color: #272727;
      font-size: 1rem;
      line-height: 1.15rem;
    }
    .right {
      float: right;
      color: #ff4b4b;
      font-size: 0.625rem;
    }
  }
  .flag {
    height: 1.2rem;
    display: inline-block;
    padding: 0rem 0.4rem;
    color: #ff4b4b;
    font-size: 0.625rem;
    background: rgba(255, 75, 75, 0.1);
    border-radius: 1rem;
    border: 0.125rem solid #fff;
    vertical-align: middle;
    line-height: 1.2rem;
    // margin-left: .375rem;
  }
  .food-bottom {
    height: 0.8125rem;
    font-size: 0.8125rem;
    color: #929292;
    margin-top: 0.5rem;
    padding-left: 1.5rem;
    padding-right: 0.5rem;
  }
  .foods-item:after {
    @include onepx_top(#e9e9e9);
  }
}
.end {
  text-align: center;
  font-size: 0.6875rem;
  color: #999999;
  padding-top: 0.3125rem;
}
.aa {
  position: relative;
  // width: 4rem;
  padding: 0.3125rem 0.625rem;
  background: #fff;
  z-index: 10;
  color: #7e7e7e;
  font-size: 0.75rem;
  text-align: center;
  img {
    width: 3.125rem;
    height: 3.125rem;
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
.animation_2::after,
.animation_1::after {
  content: "  ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 120%;
  height: 0.0625rem;
  background-color: #d8d8d8;
  /* 如果不用 background-color, 使用 border-top:.0625rem solid #f00; 效果是一样的*/
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.foot_login {
  width: 100%;
  height: 3.1875rem;
  bottom: 0;
  left: 0;
  z-index: 10005;
  color: #fff;
  background: rgba(0,0,0,0.60);
  .login_l {
    float: left;
    padding: 0.5rem 0.625rem 0.5rem 0.9375rem;
    // padding-left: ;

    img {
    width: 2.1875rem;
    height: 2.1875rem;
    }
  }
  .login_m {
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 0.875rem;
    line-height: 3.1875rem;
  }
  .login_r {
    float: right;
    line-height: 3.1875rem;
    span {
      display: inline-block;
      margin: 0.625rem 0.9375rem 0.625rem;
      width: 6.25rem;
      height: 2rem;
      text-align: center;
      font-size: 0.875rem;
      font-family: PingFangSC-Regular;
      line-height: 2rem;
      background-image: linear-gradient(-90deg, #F1238F 0%, #E7175D 100%);
      border-radius: 4px;
    }
  }
}
.fx {
  display: block;
  position: fixed;
}
</style>
