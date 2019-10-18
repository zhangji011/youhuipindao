<template>
  <div class="home" >
    <!-- <div > -->
    <!-- <alert-tip :alertTextFirst='alertTextFirst' :alertTextSecond='alertTextSecond' :btnText='btnText'  v-if="isShowAlert" @closeTip='closeAlert'/> -->
    <!-- <nav class="city_nav">
    </nav> -->
    <!-- accountStatus 账户状态(正常:ACTIVE;失效:INACTIVE;过期:EXPIRED;已经逾期：overdue) -->
    <section class="s_1">
      <ul>

        <li class="l i">
        <span class="icon"><img src="/static/img/1-20.png"></span>
          <form @submit="submitF($event)" class="form">
            <input type="search" v-model="searchT" placeholder="搜一搜：请输入商户名称" ref='searchInput'>
          </form>
          <!-- <span v-show="searchT&&isIphone"  @click = "clear()">
            <img src="/static/img/Group6.png">
          </span> -->
        </li>
         <li class="l t" @click="cancel()" style="line-height: 3rem;">
          返回
          <!-- <span></span> -->
        </li>
      </ul>
    </section>
      <div class="home home1" ref="home">
        <scroll
        :data = "shopList"
          :pullUpLoad="pullUpLoad"
          :data1 = "shopListFlag"
          @pullingUp="onPullingUp"
        >
      <div class="content">
        <section class="s_8">

        </section>

        <section class="s_5 s">
          <!-- <h6 class="title">
            <span class="text">附近优惠</span>
          </h6> -->
          <ul v-for="item in shopList" @click="goSeller(item)" :key="item.id">
            <li>
                <div class="c2">
                  <span class="l" :class="{'active':item.ACT_FLG == 1}">{{item.STORES_NM}}</span>
                  <span class="r">{{item.distance}}km</span>
                </div>
                <div class="c2 c3">
                  <span class="l">{{item.BUS_ADDR}}</span>
                  <span class="r r1">立即消费</span>
                </div>
            </li>
            <li class="hr-1"></li>
          </ul>

          <div class="end"></div>
        </section>
        <section class="s_5 s_6 s" v-if="!isFirstIn && shopList.length<=0">
            <div class = "sub2" >
              <img src="/static/img/1-4.png">
              <span class="txt">抱歉，没有找到相关商户</span>
            </div>
        </section>
    </div>
           </scroll>
    </div>
  </div>
</template>

<script>
// import headTop from "@@/components/header/head";
// import footGuide from '@@/components/footer/footGuide'
// import SlideRender from '@@/components/page-render/slide-render'
import { mapState, mapMutations } from "vuex";
// import Slider from "@@/components/base/slider";
import Scroll from "@@/components/scroll/scroll.vue";
import axios from "@@/plugins/rsa/axios";
import BScroll from "better-scroll";
import sa from'sa-sdk-javascript';
import {fetchPoints } from "@@/service/util";
import Cookies from 'js-cookie'
// console.log(axios);
// import {cityGuess, hotcity, groupcity} from '../../service/getData'
export default {
  data() {
    let os = /iP(ad|hone|od)/.test(navigator.userAgent);
    return {
      searchT: "",
      shopList: [],
      isAdmittance: false,
      home: "",
      // data1:true,
      shopListFlag: false,
      CURRENTPAGE: 1, // 页码
      PAGNUM: 8, // 页数
      isFirstIn: 1,
      isIphone: os,
      pullUpLoad: {
        threshold: -50 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
      }
    };
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        // console.log(el, { value });
        if (value) {
          el.focus();
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      // this.$nextTick(() => {
      this.init();
      this.SHOWLOADING(false);
      // });
    }, 200);
  },
  created() {
    // this.back(this)
    // this.barRight(this)
  },

  components: {
    // Slider,
    Scroll
    // SlideRender
  },

  computed: {
    ...mapState(["slider", "products", "token", "latitude", "longitude"])
  },

  methods: {
    ...mapMutations([
      // "SLIDER1", // 我的页面banner图
      // "PRODUCTS"
      "SHOWLOADING"
    ]),
    GetDistance(a, b, c, d) {
      return GetDistance(a, b, c, d);
    },
    onPullingUp() {
      this.loadMore(true);
    },
    goSeller(obj) {
      let params = {
        latitude: window.LATITUDE,
        longitude: window.LONGITUDE,
        mbl_no: this.token.productNo || "",
        merc_id: obj.TX_JRN,
        merc_latitude: obj.LATITUDE,
        merc_longitude: obj.LONGITUDE,
        // session: this.token.session.replace(/\+/g, "%2B"),
        mercHl: obj.MERC_HOT_LIN
      };
      this.$store.commit("SHOPPARM", params);
      // console.log("xiao",this.$store.state.shopParm)
      console.log("~~~~~~~~~~~~",params);
      this.$router.push({
        path: "/shopDetail",
        query: {
            params: params
           }
      });
      // 神策
      sa.track("buttonClick", {
        topCategory: "优惠",
        subCategory: "优惠：搜索页"
      });
      fetchPoints(
        "010000000000", // 页面索引
        "010000000000K07", //事件标记
        this.token.productNo,
        "搜索商户列表点击", // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );
    },
    goDetail(event, obj, flag) {
      event.stopPropagation();
      event.preventDefault();
      // if (!event._constructed) {
      //   return;
      // }
      sa.track('clickShop', {
        currentPage: '附近商家',
        commodityID:obj.MERC_ID,
        commodityName: obj.STORES_NM,
        commodityType:obj.MERC_TRD_DESC,
        is_FromSearch:true,
        keyword:this.searchT
      });
      fetchPoints(
        "030000000000", // 页面索引
        "030000000000K04", //事件标记
        this.token.productNo,
        "搜索结果列表商户点击-" + obj.STORES_NM, // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );

      let url = !flag ? obj.marketingEventCotent : obj.MERC_URL;
      // if (flag) {
      //   // window.location = url;// .replace(/www/,'uat')
      //   window.location = url.indexOf('?')>0?(url.replace(/\?/,'?showtitle=false&')+"&SOURCE=DISCOVER&"+window.location.href.split('?')[1].split('#')[0]):(url+"?showtitle=false&SOURCE=DISCOVE&"+window.location.href.split('?')[1].split('#')[0]);
      //   //  window.location = url.indexOf('?')>0?(url.replace(/www/,'uat')+"&SOURCE=DISCOVER&showtitle=false&"+window.location.href.split('?')[1].split('#')[0]):(url.replace(/www/,'uat')+"?SOURCE=DISCOVE&showtitle=false&"+window.location.href.split('?')[1].split('#')[0]);
      //   return;
      // }
      if (
        (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
        "android"
      ) {
        //  window.location = url.indexOf('?')>0?(url.replace(/\?/,'?showtitle=false&')+"&SOURCE=DISCOVER&"+window.location.href.split('?')[1].split('#')[0]):(url+"?showtitle=false&SOURCE=DISCOVE&"+window.location.href.split('?')[1].split('#')[0]);
        window.goActivity.goWeb(
          url.replace(/\?/, "?showtitle=false&hebaosso=true&SOURCE=DISCOVER&")
        );
      } else {
        window.location =
          "activity://goWeb?url=" +
          url.replace(/\?/, "?showtitle=false&hebaosso=true&SOURCE=DISCOVER&");
      }
    },
    cancel() {
      // 神策
      this.searchT=""
      sa.track('clickSearch', {
        operationType: '点击取消',
        currentPage: '附近商家',
      });
      fetchPoints(
        "030000000000", // 页面索引
        "030000000000K05", //事件标记
        this.token.productNo,
        "搜索页面取消按钮", // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );
      this.searchT = "";
      this.$router.go(-1);
    },
    detail(url) {
      window.location = url;
    },
    gotoAddress(path) {
      this.$router.push(path);
    },
    loadMore() {
      if (this.shopListFlag) {
        return;
      }
      this.CURRENTPAGE += 1;

      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
      // this.PAGNUM=this.PAGNUM+8
      axios
        .post("getExternalShopInfo", {
          centre_longitude: this.l,
          centre_latitude: this.s,
          longitude: window.LONGITUDE, // 经度
          latitude: window.LATITUDE, // 维度
          stores_nm: this.searchT, // 门店名称
          merc_abbr: this.searchT, //  商户简称
          mblno: this.token.productNo || "", //用户手机号
          // TTXN_CNL: "ROYTEL", // 固定值
          currentPage: this.CURRENTPAGE,
          pagNum: this.PAGNUM,
          // session: this.token.session.replace(/\+/g, "%2B"),
          map_type:0
        })
        .then(res => {
          // this.shopList = res.STORES_REC;
          // 合并数组

          this.shopList.push.apply(this.shopList, res.data);
          if (res.data.length < this.PAGNUM) {
            // this.data1 = true
            this.shopListFlag = true;
            // 数组没有更多了
          } else {
            this.shopListFlag = false;
          }
          // setTimeout(() => {
          //   this.home.refresh();
          //   // this._calcHeight();
          // }, 20);
        })
        .catch(res => {
          // setTimeout(() => {
          //   this.home.refresh();
          // }, 20);
        });
    },
    clear() {
      // sa.track('clickSearch', {
      //   operationType: '删除所有',
      //   currentPage: '附近商家',
      // });c
      fetchPoints(
        "030000000000", // 页面索引
        "030000000000K03", //事件标记
        this.token.productNo,
        "搜索词清除按钮", // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );
      this.searchT = "";
    },
    init() {
      if (!this.home) {
        this.home = new BScroll(this.$refs.home, {
          scrollY: true,
          scrollX: false,
          click: true,
          bounce: false,
          pullDownRefresh: {
            threshold: -100 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
          },
          pullUpLoad: {
            threshold: -100 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
          }
          // momentumLimitDistance: 15
        });
        this.home.on("scrollEnd", pos => {
          if (Math.abs(this.home.y)-20<= Math.abs(this.home.maxScrollY) ) {
            // 加载更多
            this.loadMore();
            this.$emit('scrollToEnd')
          }
         // 下拉动作
          if (pos.y > 1) {
            console.log("touchend")
            self.loadData();
          }
        });
        this.home.on("scrollToEnd", pos => {
          // console.log("scrollToEnd")
        });
      } else {
        this.home.finishPullUp();
        this.home.refresh();
      }
    },
    submitF(e, obj) {

      this.CURRENTPAGE=0
      this.PAGNUM=8
      this.$refs.searchInput.blur();
      this.SHOWLOADING(true);
      e.preventDefault();
      if (!this.searchT) {
        this.SHOWLOADING(false);
        return;
      }

      // 埋点
      try {
        fetchPoints(
          "030000000000", // 页面索引
          "030000000000K02", //事件标记
          this.token.productNo,
          "搜索按钮", // 事件名称
          // this.token.session.replace(/\+/g, "%2B")
        );
      } catch (e) {}
      // 请求banner1
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
      axios.post("getExternalShopInfo", {
          // centre_longitude:(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).longitude:window.LONGITUDE,
          // centre_latitude:(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).latitude:window.LATITUDE,
          centre_longitude: this.l,
          centre_latitude: this.s,
          longitude: window.LONGITUDE, // 经度
          latitude: window.LATITUDE, // 维度
          stores_nm: this.searchT, // 门店名称
          merc_abbr: this.searchT, // 商户名称
          currentPage: this.CURRENTPAGE, // 当前页数
          mblno: this.token.productNo || "", //用户手机号
          pagNum: this.PAGNUM, // 每页条
          // TTXN_CNL: "ROYTEL", // 固定值
          // session: this.token.session.replace(/\+/g, "%2B"),
          map_type: window.isUseBaiDuLoc ? 0 : 1
        })
        .then(res => {

          sa.track('applySearch', {
            keyword:this.searchT,
            hasResult: res.data.length>=1 ? 1 : 0
            // hasResult: this.searchT.length>=1 ? 1 : 0
          });
          this.SHOWLOADING(false);
          this.shopList = res.data;
          this.isFirstIn = 0;
          if (res.data.length == 0) {
            this.isFirstIn = false;
          }
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            // this.data1 = true
            // 数组没有更多了
          } else {
            this.shopListFlag = false;
          }
        })
        .catch(res => {
          this.SHOWLOADING(false);
        });
      return false;
    },
    goToApply() {},
    closeAlert() {}
  },
  watch: {
    searchT() {
      if (!this.searchT) {
        this.shopList = [];
        this.isFirstIn = true;
        this.shopListFlag = true;
        return;
      }
      this.searchT = this.searchT.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "");
      fetchPoints(
        "030000000000", // 页面索引
        "030000000000K01", //事件标记
        this.token.productNo,
        "搜索栏-" + this.searchT, // 事件名称
        // this.token.session.replace(/\+/g, "%2B")
      );
    }
  }
  // props:['activeIcon']
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
// .home{
//   position: relative;
// }
.home {
  // transition: all 0.3s;
  // -webkit-transition: all 0.3s;
  // transform: translateZ(0);
  // -webkit-transform: translateZ(0);
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  // position: relative;
  height: 100%;
  background: #f0f1f2;
  overflow: hidden;
}
.form {
  display: block;
  height: 1.9375rem;
  width: 100%;
  position: absolute;
  top: 0.5rem;
  z-index: 100;
  text-indent: 2em;
  background: #f0f1f2;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
}
.home1 {
  // margin-top: 4.25rem;
  height: 100%;
  overflow: hidden;
  // z-index: 19;
}
.content {
  // height: auto;
}
.s {
  // margin-top: .625rem;
  background: #ffffff;
}
.s_8 {
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
}
.s_1::after {
  @include onepx1(#d8d8d8);
}
// .content::after {
//   @include onepx1(#D8D8D8);
// }
// .active{
//   position: relative;
// }
.active {
  // content: " ";
  // height: 1.75rem;
  // width: 1.75rem;
  background-image: url(/static/img/1-24.png);
  background-repeat: no-repeat;
  background-position: 100%;
  background-size: 1rem 1rem;
  padding-right: 1.875rem;

  // top:0;
  // right: 0;
}
.s_1 {
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
  background: #ffffff;
  position: fixed;
  z-index: 21;
  ul {
    width: 100%;
    height: 100%;
  }
  .l {
    height: 3rem;
    // line-height: 3rem;
  }
  .t {
    color: #c99835;
    font-size: 0.9375rem;
    width: 4.1875rem;
    position: relative;
    float: right;
    text-align: left;
    padding-left: 0.9375rem;
    top: -3rem;
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
    z-index: 101;
    left: 0.25rem;
    top: 0.955rem;
    img {
      display: block;
      width: 100%;
    }
  }
  .icon_after {
    position: absolute;
    display: block;
    height: 1.0625rem;
    width: 1.0625rem;
    right: 0.625rem;
    top: 50%;
    margin-top: -0.5625rem;
    z-index: 101;
    img {
      display: block;
      width: 1.0625rem;
      height: 1.0625rem;
    }
  }
  .i {
    width: auto;
    margin-right: 4.1875rem;
    display: block;
    margin-left: 0.8125rem;
    position: relative;
    // top: -3.125rem;
    input {
      display: block;
      height: 1.9375rem;
	  // height: 3rem;
      width: 100%;
      // position: relative;
      // top: 0.5rem;
      // text-indent: 2em;
      background: #f0f1f2;
      border-radius: 0.25rem;
      font-size: 0.8125rem;
      padding-left: 2em;
      padding-right: 2em;
    }
  }
}

.s_5 {
  padding: 0 0.825rem;
  background: #fff;
  // margin-top: 0.5625rem;
  ul {
    // height: 5.25rem;
    padding-top: 1.1875rem;
    padding-bottom: 1.1875rem;
    position: relative;
  }
  // ul::after {
  //   @include onepx1(#d8d8d8);
  //
  // }
  ul:nth-last-child(1)::after {
    height: 0 !important;
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
  .left {
    width: 5.1875rem;
    height: auto;
    float: left;
    img {
      width: 100%;
    }
  }

  .c2 {
    font-size: 1rem;
    color: #13252e;
    max-width: 100%;
    @include space();
    // padding-top: 0.5625rem;
  }
  .c3 {
    font-size: 0.8125rem;
    color: #888888;
    // padding-top: 0.25rem;
    max-width: 70%;
    @include space();
  }
  .r {
    color: #888888;
    font-size: 0.8125rem;
    position: absolute;
    right: 0.9375rem;
  }
  .r1 {
    width: 3.8125rem;
    height: 1.1875rem;
    background: #e4c06f;
    color: #fff;
    text-align: center;
    font-size: 0.75rem;
    border-radius: 0.25rem;
    right: 0.9rem;
    line-height: 1.1875rem;
  }
  .b {
    background: #fff0f1;
    border: thin solid rgba(224, 24, 45, 0.2);
    border-radius: 0.125rem;
    padding: 0rem 0.125rem;
  }
}

.s_6 {
  padding: 0 0.9375rem;
  background: #fff;
  // margin-top: 0.5625rem;
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
}
.scroll {
  height: 10.625rem;
}
.slide-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
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
      // float: left;
      color: #272727;
      font-size: 1rem;
      line-height: 1.15rem;
    }
    .right {
      // float: right;
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
.sub2 {
  text-align: center;
}
.sub2 img {
  display: block;
  height: 5.25rem;
  width: auto;
  margin: 0 auto;
  margin-bottom: 1.1875rem;
}
.sub2 .txt {
  font-size: 0.8125rem;
  color: #aeafaf;
  // text-align: center;
  // -top: 1.1875rem;
}
.s_6 {
  background: #f0f1f2;
  padding-top: 6.25rem;
  height: 40rem;
}
.s_5.s_6::after {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 0;
  background-image: linear-gradient(0deg, #fff 50%, transparent 50%);
}
.list-wrapper {
  background-color: #f0f1f2;
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
  left: 1.25rem;
  // &::after {
  //   @include onepx1(#d8d8d8);
  // }
}
</style>
