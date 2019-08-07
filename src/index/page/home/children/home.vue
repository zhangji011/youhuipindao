<template>
  <div class="home">
    <div v-show="isShareBtn" @click="getSharePage()" class="shareBtn"></div>
    <div :class="isShow">
      <span>优惠</span>
    </div>
    <!-- 弹窗 -->
    <div v-if="alertinfo && alertinfo.length>0" :class="isAlertInfo">
      <p v-for="item in alertinfo" :key="item.id">
        <a @click="goDetail($event,item,12,'alert_tip')"><img :src="item.popupIcon" /></a>
      </p>
      <div @click="alertCloseBtn()" class="alert_close"></div>
    </div>

    <!-- <section v-if="tabs && tabs.length>0" class="tabs">
      <span v-for="(item, index) in tabs">
        <a id="indexId2" @click="goToPage($event,item,index)" :class="{'active':selectIndex==index}">{{item.tabTitle}}</a>
      </span>
    </section> -->

    <scroll
      :scrollbar="scrollbar"
      :data1 ="data1"
      :data ="jdList"
      @pullingUp="onPullingUp"
      ref="scroll"
    >
    <div :class="isShow2">
      <!-- <section v-if="slider && slider.length>0" class="s_2 s foods-wrapper">
        <div class="scroll slide-content">
          <div>
            <div class="slider-wrapper">
              <slider :click="slider_top_click" :autoPlay = "slider.length>0" :loop="slider.length>0">
                  <div v-for="item in slider2">
                      <a @click="goDetail($event,item,11,'top')" >
                        <img :src="item.marketingIcon">
                      </a>
                  </div>
              </slider>
            </div>
          </div>
        </div>
      </section> -->
      <section>
        <home-slider @goDetail="goDetail"></home-slider>
      </section>
      <!-- 秒杀 -->
      <section v-if="bannermarkets.length>0" class="s_3 s" @click="goDetail($event,bannermarkets[0],1,'jd')">
        <img :src="bannermarkets[0].marketingIcon" >
      </section>

      <section class="s_5 s" >
        <!-- 优惠券 -->
        <coupon
          :couponMainList="couponMainList"
          :couponList="couponList"
          @goDetail="goDetail"
          >
        </coupon>
        <!-- 附近 -->
        <near
          :latitude = 'latitude'
          :longitude = 'longitude'
          :shopList="shopList"
          @aginEnter = "aginEnter"
          @goDetail="goDetail"
          >
        </near>
        <!-- 专题营销位 -->
        <goods1
          @goDetail="goDetail"
          @backtop="backToTop"
          :middle = "goods1"

        ></goods1>
        <!-- 为你推荐 -->
        <goods2
          @goDetail="goDetail"
        ></goods2>
        <!-- 京东资讯 -->
        <!-- <goods3
          :jdList="jdList"
          @goDetail="goDetail"
        ></goods3> -->

      </section>
      <!-- <div class="null">&nbsp;</div> -->
      <div class="null">————&nbsp;&nbsp;亲，我是有底线的&nbsp;&nbsp;————</div>
    </div>
    </scroll>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HomeSlider from "@@/components/base/slider";
import axios from "@@/plugins/rsa/axios";
import sa from "sa-sdk-javascript";
// import VueLazyload from "vue-lazyload"
import {
  fetchPoints,
  // GetDistance,
  shareNow,
  isHebaoApp,
  setLItem,
  getLItem,
  // getCode,
  formatDate_1
} from "@@/service/util";
import { baseUrl } from "@@/config/env"; // baseUrl
import Near from "./near.vue";
import Coupon from "./coupon.vue";
import Goods1 from "./goods1.vue";
import Goods2 from "./goods2.vue";
// import Goods3 from "./goods3.vue";
// import Recommended from "./recommended.vue";
// import GoodThing from "./goodThing.vue"; // 好物
import Scroll from "@@/components/scroll/scroll.vue";

export default {
  data() {
    return {
      isShow: "",
      isShow2: "",
      isAlertInfo: "alert_info",
      isShareBtn: false,
      pullUpLoad: false,
      pullUpLoad_near: true,
      data1: false,
      flag: false,
      banner: "/static/mine_banner.png",
      icon: require("@@/images/mine/help_other-pressed.png"),
      // defaultIcon: 'this.src="' + "/static/img/error.png" + '"',
      couponMainList: [],
      couponList: [],
      shopList: [],
      jdList: [],
      jdTotal: 0,
      isLoad: true,
      CURRENTPAGE: 0, // 商户页码
      PAGNUM: 2,
      cityName1: window.CITYNAME || "定位中",
      slider_top_click: true,
      baseImg: baseUrl.img,
      jdBanner: {},
      goods1: [],
      PAGENUM: 0, // jd页码
      PAGESIZE: 4, // jd页码数量
      selectIndex: 1,
      jdFlag: false,
      scrollbar: false
    };
  },

  mounted() {
    try {
      // 获取优惠券
      this.getMainCoupon();
      fetchPoints(
        "010000000000", // 页面索引
        "010000000000K13", //事件标记
        this.token.productNo,
        "进入优惠频道", // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );
    } catch (e) {}
    // 获取运营banner
    this.getMiddle();
    // this.getJD();
    console.log("170行打印数据——————————"+!window.LATITUDE)
    if (!window.LATITUDE) {
      // this.aginEnter();
    } else {
      this.init();
    }
    // 隐藏进度条
    // document.getElementById("pg").style.display="none";
  },
  created() {
    this.initShow(); //控制标题头
    // this.jdSKill(); // 请求广告位
    // this.getCoupon();
    //神策
    let startTime = new Date();
    let endTime = new Date() ;
    sa.track("loadDelay", {
      currentBusinessLine: "优惠频道",
      currentActivity: "优惠页面",
      currentURL: window.location.href,
      delayTime: endTime - startTime,
      offsetTime: 0,
      endTime: formatDate_1(endTime.getTime()),
      startTime: formatDate_1(startTime.getTime())
    });
  },
  components: {
    Near,
    Coupon,
    HomeSlider,
    Goods1,
    Goods2,
    // Goods3,
    Scroll
  },

  computed: {
    ...mapState([
      "slider2",
      "slider",
      "tabs",
      "tokenstatus",
      "alertinfo",
      "bannermarkets",
      "topTitle",
      "products",
      "token",
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
      "OPENANDCLOSE",
      "SETMIDDLE"
    ]),
    initShow() {
       // 首页标题头 0 隐藏  1显示
       this.isShow = this.topTitle === "1" ? "header" : "headerHidden";
       this.isShow2 = this.topTitle === "1" ? "content" : "contentMove";
     },
    jdSKill() {
      // 异形banner
      axios
        .post("queryMarketing", {
          position: "MARKET",
          session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
        })
        .then(res => {
          this.jdBanner = res.data && res.data.length > 0 ? res.data[0] : {};
        });
    },
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goToPage(event, obj, index){
      this.selectIndex = index;
      let url = obj.tabEventCotent;
      // console.log(url);
      if(url !== "http://INDEX.INDEX") {
        // url.replace("http://INDEX.INDEX", "");
        // console.log(url.replace("http://INDEX.INDEX", ""));
        if (
          (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
          "android"
        ) {
            let url2 =
              url.indexOf("?") > 0
                ? url.replace(
                    /\?/,
                    "?SOURCE=DISCOVER&account=" +
                      this.token.productNo +
                      "&"
                  )
                : url +
                  "?SOURCE=DISCOVER&account=" +
                  this.token.productNo;
            window.goActivity.goWeb(url2);
            setTimeout(() => {
              this.selectIndex = 1;
            }, 1000);
        } else {
            let url_2 =
              url.indexOf("?") > 0
                ? url.replace(
                    /\?/,
                    "?SOURCE=DISCOVER&account=" +
                      this.token.productNo +
                      "&"
                  )
                : url +
                  "?SOURCE=DISCOVER&account=" +
                  this.token.productNo;
            // console.log(url_2);
            window.location = "activity://goWeb?url=" + url_2;
            setTimeout(() => {
              this.selectIndex = 1;
            }, 1000);
        }
      }
    },
    onPullingUp() {
      // this.jdloadMore();
    },
    jdloadMore() {
      if (this.jdFlag) {
        return;
      }
      this.PAGENUM += 1;
      // console.log("*************", this.CURRENTPAGE);
      let params_ = {
        pageNum: this.PAGENUM,
        pageSize: this.PAGESIZE || 4,
        session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      };
      axios.post("queryPageJdInformation", params_).then(res => {
          this.jdList.push.apply(this.jdList, this.dealData(res.data));
          // console.log(this.jdList);
          if (res.data.length < this.PAGESIZE) {
            this.jdFlag = true;
            this.data1 = true;
            // console.log("xxxxxxxxxx",this.jdFlag);
            // 数组没有更多了
          } else {
            this.jdFlag = false;
            this.data1 = false;
            // console.log("yyyyyyyyyy",this.jdFlag);
          }
        });
    },
    dealData(data) {
      let res = [];
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        obj = data[i];
        obj.imageUrls = obj.imageUrls.replace(/,$/, "").split(",");
        res.push(obj);
      }
      // console.log(res);
      return res;
    },
    getJD(flag) {
      this.PAGENUM = 1;
      let params_ = {
        pageNum: this.PAGENUM,
        pageSize: this.PAGESIZE || 4,
        session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      };
      // 京东
      axios
        .post("queryPageJdInformation", params_)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.isLoad = true;
            this.jdList = this.dealData(res.data);
          } else {
            this.isLoad = true;
            this.jdTotal++;
            if (this.jdTotal <= 5) {
              this.getJD();
            } else {
              this.jdList = [];
              this.isLoad = false;
              if (flag) {
                this.initScroll();
              } else {
                this.initScroll();
              }
            }
            return;
          }
          if (res.data.length < this.PAGESIZE) {
            this.jdFlag = true;
            this.data1 = true;
            //没有更多了
          } else {
            this.jdFlag = false;
            this.data1 = false;
          }

        });
    },

    // LBS_BD(){
    //   let that = this
    //   // 百度定位
    //   new BMap.Geolocation().getCurrentPosition(function(r) {
    //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //       // 判断状态
    //       let pt = r.point;
    //       new BMap.Geocoder().getLocation(pt, function(rs) {
    //         if (rs.point) {
    //           let addComp = rs.addressComponents;
    //           window.LATITUDE = rs.point.lat;
    //           window.LONGITUDE = rs.point.lng;
    //           window.CITYNAME = addComp.city;
    //           that.cityName1 = addComp.city;
    //         } else {
    //           window.LATITUDE = r.point.lat;
    //           window.LONGITUDE = r.point.lng;
    //           window.CITYNAME = r.address.city;
    //           that.cityName1 = r.address.city;
    //         }
    //         that.init();
    //         // alert(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
    //       });

    //     } else {
    //       this.SHOWLOADING(true);
    //     }
    //   });
    // },
    aginEnter() {
      // alert(33)
      this.SHOWLOADING(true);
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
              this.SHOWLOADING(false);
            }
          });
        } catch (e) {}
      }
    },
    intervalCity() {
      this.cityName1 = window.CITYNAME || "定位中";
    },
    defaultIcon(i) {
      this.shopList[i].PIC_URL_1 = "/static/img/error.png";
    },
    // GetDistance(a, b, c, d) {
    //   return GetDistance(a, b, c, d);
    // },
    detail(url) {
      window.location = url;
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollTo(0,-1650);
    },
    goDetail(event, obj, flag, channel = "default") {
      //埋点 parent_title, sub_title,phone,remark, session
      try {
        if (channel == "jd") {
          // 神策
          sa.track("bannerClick", {
            contentName: "异形banner活动",
            bannerNumber: String(obj.marketingNumber),
            topCategory: "优惠",
          })
        } else if (channel == "top") {
          // 神策
          sa.track("bannerClick", {
            contentName: obj.marketingTitle,
            bannerNumber: String(obj.marketingNumber),
            topCategory: "优惠",
          })
        } else if (channel == "alert_tip") {
          // 神策
          sa.track("bannerClick", {
            contentName: obj.popupTitle,
            topCategory: "优惠",
          })
        }
      } catch (e) {}

      let url = flag == 2 ? obj.tbConductConfig.marketingEventCotent : obj.MERC_URL;
      url = flag == 11 ? obj.marketingEventCotent : url;
      url = flag == 12 ? obj.popupEventCotent : url;
      url = flag == 13 ? obj.tabs.tabEventCotent : url;
      url = flag == 14 ? obj.tabEventCotent : url;
      url = flag == 1 ? obj.marketingEventCotent : url;
      url = flag == 3 ? obj.detailUrl : url;
      url = flag == 4 ? obj.url : url;
      url = flag == 5 ? obj.couponEventContent : url;
      url = flag == 6 ? obj.couponDetailsContent : url;
      url = flag == 7 ? obj.couponEventCotent : url;
      url = flag == 8 ? obj.couponEventContent  : url;
      url = flag == 99 ? obj.couponDetailsContent : url;

      if(isHebaoApp()) {
        if(this.tokenstatus)  {
          if (
            (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
            "android"
          ) {
            if (flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 5 || flag == 6 || flag == 7 || flag == 8 || flag == 11 || flag == 12 || flag == 13 || flag == 14 || flag == 99) {
              let url2 =
                url.indexOf("?") > 0
                  ? url.replace(
                      /\?/,
                      "?SOURCE=DISCOVER&account=" +
                        this.token.productNo +
                        "&"
                    )
                  : url +
                    "?SOURCE=DISCOVER&account=" +
                    this.token.productNo;
              window.goActivity.goWeb(url2);
            } else {
              window.goActivity.goWeb(
                url.replace(
                  /\?/,
                  "?SOURCE=DISCOVER&account=" +
                    this.token.productNo +
                    "&"
                )
              );
            }
          } else {
            if (flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 5 || flag == 6 || flag == 7 || flag == 8 || flag == 11 || flag == 12 || flag == 13 || flag == 14 || flag == 99) {
              let url_2 =
                url.indexOf("?") > 0
                  ? url.replace(
                      /\?/,
                      "?SOURCE=DISCOVER&account=" +
                        this.token.productNo +
                        "&"
                    )
                  : url +
                    "?SOURCE=DISCOVER&account=" +
                    this.token.productNo;
              // console.log(url_2);
              window.location = "activity://goWeb?url=" + url_2;
            } else {
              window.location =
                "activity://goWeb?url=" +
                url.replace(
                  /\?/,
                  "?SOURCE=DISCOVER&account=" +
                    this.token.productNo +
                    "&"
                );
            }
          }
        } else {
          // 神策
          sa.track("buttonClick", {
            buttonName: "登录查看更多优惠",
            topCategory: "外放优惠",
            subCategory: "外放优惠：登录"
          });
          let urls = "https://find.cmpay.com:9102/rcServer/hbopenreceive?state=" + window.location.href;
          let loginUrl = 'https://find.cmpay.com:9102/main.html';
          // let urls = window.location.href;
          // window.location = urls;
          if (
            (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
            "ios"
          ) {
            touristLogin(loginUrl)
            // try {
            //     return User.getLocation();
            // } catch (e) {

            // }
          } else {
            window.goActivity.startLoginModule('javascript:loginSuccess(%b)', loginUrl)
          }
        }
      } else {
        window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
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

    init(flag) {
      this.CURRENTPAGE = 1;
      if (!flag) {
        this.SHOWLOADING(true);
      } else {
        this.SHOWLOADING(false);
      }
      // 单点登录
      // 请求banner1
      this.cityName1 = window.CITYNAME || "定位中";
      if (!window.LONGITUDE) {
        this.SHOWLOADING(false);
        return;
      }
      setTimeout(() => {
        this.SHOWLOADING(false);
      }, 2000);
      let startTime = new Date();
      if(isHebaoApp()) {
        this.isShareBtn = true;
      };
      // axios.post("getExternalShopInfo", {  //正式地址
      axios.post("getShopInfoTest", {    //测试地址
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 门店简称
        mblno: this.token.productNo || "", //用户手机号
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        pagNum: this.PAGNUM || 2,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 1
        }).then(res => {
          //神策
          let endTime = new Date() ;
          console.log("商品列表数据花费的时间————————");
          alert(endTime - startTime)
          sa.track("loadDelay",{
            currentBusinessLine: "优惠频道",
            currentActivity: "调用优惠页附近商户getShopInfo接口",
            currentURL: window.location.href,
            delayTime: endTime - startTime,
            offsetTime: 0,
            endTime: formatDate_1(endTime.getTime()),
            startTime: formatDate_1(startTime.getTime())
          });
          sa.track("pageLoadingCompleted", {
            $title: "优惠",
            $url: window.location.href,
            $url_path: window.location.href,
            currentBusinessLine: "优惠频道"
          });

          if (res.data && res.data.length > 0) {
            this.isError = true;
            // console.log("开始打印数————————");
            // console.log(this.filterObj(res.data));
            this.shopList = this.filterObj(res.data);
            // console.log(this.shopList);
            // console.log("ye",this.shopList);
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
              // }, 300);
            }
            return;
          }
        })
        .catch(res => {
          this.SHOWLOADING(false);
          this.totalInit++;
          if (this.totalInit <= 5) {
            this.init();
          } else {
          }
        });
    },
    // 获取优惠券
    getMainCoupon() {
      axios.post("queryCouponMainStation",{
        "session": this.token.session.replace(/\+/g, "%2B")   // 单点登录返回session
      }).then(res => {
        if(res.code === "0") {
          let data = res.data;
          this.couponMainList = data;
          // console.log(88888,this.couponMainList);
        }
      })
    },
    getCoupon() {
      axios.post('queryCoupon',{
        "session": this.token.session.replace(/\+/g, "%2B")
      }).then(res => {
          if(res.code === "0") {
            let data = res.data.map((item)=>{
              item.show = true;
              return item;
            })
            this.couponList = data;
            // console.log(this.couponList);
          }
        });
    },
    // 获取运营banner位
    getMiddle() {
      axios.get("market/queryMerchantInfo").then(res => {
        if (res.code && res.data) {
          const data = res.data;
          this.goods1 = data;
          // console.log(this.goods1)
          // this.banner = res.data.length >= 1 ? res.data[0] : res.data[0];
          // this.banner = res.data[0];
        }
      });
    },
    getSharePage(e) {
      let index_urls = {
        shareUrl: window.location.href,
        wap_produce_reqData: "/gmeweb/miguhw_merc.xhtml?viewCode=json"// 单点登录
      };
      let shareTxt = "优惠频道—省钱就用和包支付，刷和包、得流量、返红包，首绑卡满20减10";
      shareNow(index_urls.shareUrl, shareTxt);
    },
    alertCloseBtn() {
      // 神策
      sa.track("buttonClick", {
        buttonName: "关闭弹窗",
        topCategory: "优惠",
        subCategory: "优惠：首页"
      });
      this.isAlertInfo = "alert_info_hide";
    },
    // initScroll() {},
    // _calcHeight() {
    // },
    goToApply() {},
    closeAlert() {}
  },

  watch:{
    latitude(curVal,oldVal){
      if(curVal&&curVal!="" && this.shopList.length<=0){
        this.init()
      }

    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.content {
  // overflow: auto;
  height: 95%;
  position: relative;
  top: 3rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.contentMove {
   // overflow: auto;
   height: 95%;
   position: relative;
  //  top: 3rem;
   overflow-y: auto;
   -webkit-overflow-scrolling: touch;
 }
div.container::-webkit-scrollbar {
  display: none;
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
.shareBtn {
  width: 2.5rem;
  height: 2.6rem;
  background: url("/static/img/share_button.png") top no-repeat;
  background-size: 100% 100%;
  position: fixed;
  top: 20rem;
  right: 0.2rem;
  z-index: 9999999;
}
.header {
  // height: 3rem;
  // width: 100%;
  // line-height: 3rem;
  // text-align: center;
  width: 100%;
  height: 3rem;
  font-size: 1.125rem !important;
  color: #13252e;
  font-family: PingFangSC-Regular !important;
  background: #ffffff;
  // position: -webkit-sticky;
  position: fixed;
  z-index: 100000000;
  top: 0;
  left: 0;
  // font-weight: 200;
  text-align: center;
  line-height: 3rem;
}
.headerHidden {
  display: none;
 }
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.alert_info {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  p {
    width: 18.75rem;
    height: 18.125rem;
    // background: url(/static/img/alert_bg.png) no-repeat;
    background-size: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -9.375rem;
    margin-top: -9.0625rem;
  }
  img {
    width: 18.75rem;
    height: 18.125rem;
    border-radius: 0.3125rem;
  }
  .alert_close {
    position: absolute;
    width: 1.75rem;
    height: 1.75rem;
    margin-left: -0.875rem;
    top: 76%;
    left: 50%;
    background: url(/static/img/close_icon_1.png) no-repeat;
    color: #000;
    text-align: center;
    // background-color: #fff;
    background-size: 1.75rem 1.75rem;
  }
}
.alert_info_hide {
  display: none;
}
.tabs {
  width: 100%;
  height: 3rem;
  display: flex;
  background-color: #fff;
  // background-image: linear-gradient(90deg, #E91B39 0%, #F7405B 100%);
  // position: -webkit-sticky;
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  // font-weight: 200;
  text-align: center;
  line-height: 3rem;
  span {
    flex: 3;
    display: block;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    max-width: 6.75rem;
    max-height: 6.75rem;
    position: relative;
    top: 50%;
    left: 20%;
    transform: translate(-50%, -50%);
    a {
      font-family: PingFangSC-Regular;
      font-size: 0.9375rem;
      color: #13252e;
      line-height: 3rem;
      padding: 0 0.1875rem 0.3125rem;
    }
    // a.activeIndex {
    //   font-family: PingFangSC-Semibold;
    //   font-size: 0.9375rem;
    //   border-bottom: 0.125rem solid #ed196c;
    // }
     a.active {
      // display: block;
      color: #ea2845;
      font-family: PingFangSC-Semibold;
      font-size: 0.9375rem;
      border-bottom: 0.125rem solid #ed196c;
    }
  }
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
  top: 0;
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
    color: #6c6c6c;
    font-size: 0.9375rem;
    width: 4.1875rem;
    position: relative;
    float: left;
    text-align: left;
    padding-left: 0.9375rem;
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
    height: 1rem;
    position: absolute;
    z-index: 2;
    left: 0.25rem;
    top: 0.125rem;
    img {
      width: 100%;
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
  height: auto;
  max-height: 10.625rem;
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
  // @include wh(100%, 4.875rem);
  text-align: center;
  background-color: #fff;
  // height: 6.25rem;
  width: 100%;
  height: 6.25rem;
  img {
    width: 100%;
    // height: 5.625rem;
    margin-top: 0.2rem;
    position: relative;
    top: -1.2rem;
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

// .s_5 {
//   // padding: 0 0.9375rem;
//   // background: #fff;
//   // margin-top: 0.5625rem;
//   margin-bottom: 1rem;
//   // height: 56.25rem;
//   ul {
//     height: 7.5rem;
//     padding-top: 1.625rem;
//     position: relative;
//     margin: 0 0.9375rem;
//   }
//   // ul::after {
//   //   @include onepx1(#d8d8d8);
//   // }
//   ul:nth-last-child(1)::after {
//     height: 0 !important;
//   }
//   .title {
//     position: relative;
//     height: 1.5625rem;
//     text-align: center;
//     background-color: #fff;
//   }
//   .title:after {
//     @include onepx1(#d8d8d8);
//   }
//   .text {
//     position: relative;
//     width: 4rem;
//     padding: 0.3125rem 0.625rem;
//     top: 0.75rem;
//     background: #fff;
//     z-index: 10;
//     color: #444444;
//     font-size: 0.875rem;
//   }
//   .left {
//     width: 5.1875rem;
//     height: auto;
//     float: left;
//     max-height: 5rem;
//     overflow: hidden;
//     img {
//       width: 100%;
//       max-height: 5rem;
//       min-height: 4.5625rem;
//     }
//   }
//   .right {
//     float: left;
//     padding-left: 0.5625rem;
//     min-width: 60%;
//     width: 75%;
//     text-align: left;
//   }
//   .c1 {
//     font-size: 0.8125rem;
//     color: #13252e;
//     max-width: 100%;
//     @include space();
//   }
//   .c2 {
//     font-size: 0.6875rem;
//     color: #999999;
//     padding-top: 0.5625rem;
//     max-width: 90%;
//     @include space();
//     .l {
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       display: inline-block;
//       max-width: 70%;
//     }
//   }
//   .c3 {
//     font-size: 0.75rem;
//     color: #e11a2f;
//     padding-top: 0.5625rem;
//     letter-spacing: -0.00375rem;
//     max-width: 70%;
//     @include space();
//     div {
//       @include space();
//     }
//   }
//   .r {
//     position: absolute;
//     right: 0.9375rem;
//   }
//   .b {
//     display: inline-block;
//     background: #fff0f1;
//     border: thin solid rgba(224, 24, 45, 0.2);
//     border-radius: 0.125rem;
//     padding: 0.05rem 0.225rem;
//     margin-right: 0.1875rem;
//   }

// }

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
  a {
    display: inline-block;
    height: 100%;
  }
  img {
    max-height: 10.625rem;
    // height:10.625rem;
  }
}
.scroll {
  // height: 10.625rem;
}
.slide-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
  // height: 56.25rem;
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
  top: 0.75rem;
  background: #fff;
  z-index: 10;
  color: #444444;
  font-size: 0.75rem;
  text-align: center;
}
.null {
   padding-bottom: 4.5rem;
   height: 2rem;
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
</style>
