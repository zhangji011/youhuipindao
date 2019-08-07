<template>
  <div>
    <section class="s_1">
      <ul>
        <router-link tag="li" class="l t" to="/">
        </router-link>
        <li class="l">
          <span>优惠券适用商户</span>
        </li>
      </ul>
    <div class="nullHeight"></div>
    </section>
    <section class="s_2">
      <ul v-for="(item,index) in shopLists"  @click="goDetail($event,item,1)">
      <!-- :key="item.TX_JRN" -->
        <li class="left">
            <img v-if="item.PIC_URL_1" :src="item.PIC_URL_1" :onerror = 'defaultIcon' alt="">
            <img v-else :src="'/static/img/error.png'" alt="">
        </li>
        <li class="right">
            <div class="c1">{{item.STORES_NM}}</div>
            <div class="c2">
                <span class="l">{{item.BUS_ADDR}}</span>
                <span class="r">{{item.distance}}km</span>
            </div>
            <div class="c3">
                <span  v-for="item1 in item.ACT_INF" class="b" >{{item1.GME_NM}}</span>
            </div>
        </li>
        <li class="hr-1" :class="{height0:index == shopLists.length-1}"></li>
      </ul>
      <div v-show="isList" class="error">
        <li class="aa"></li>
        <li class="tip">您所在的城市暂无该优惠券适用商户</li>
      </div>
    </section>
  </div>
</template>

<script>
import {
  fetchPoints
  // GetDistance
  //   setLItem,
  //   getLItem,
  //   getCode
} from "@@/service/util";
import { mapState, mapMutations } from "vuex";
import Scroll from "@@/components/scroll/scroll.vue";
import axios from "@@/plugins/rsa/axios";
import sa from'sa-sdk-javascript';
export default {
  data() {
    return {
      shopLists: [],
      stopPropagation: false,
      isList: false,
      defaultIcon: 'this.src="' + "/static/img/error.png" + '"',
      pullUpLoad: {
        threshold: -50
      }
    };
  },
  props: {
    latitude: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: Boolean,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: true
    }
    // pullUpLoad: {
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    ...mapState([
      "token"
      ])
  },

  mounted() {
    this.goShopDetail()
  },
  created() {},

  components: {
    Scroll
  },

  methods: {
    goShopDetail() {
      document.getElementById("pg").style.display="block";
      let params = this.$route.query.params;
      // console.log(33333,params);
      axios
        .post("getShopInfo", {  // 正式环境调用接口
        // .post("getShopInfoTest", { // 测试环境调用接口
          longitude: window.LONGITUDE, // 经度
          latitude: window.LATITUDE, // 维度
          stores_nm: "", // 门店名称
          merc_abbr: "", // 门店简称
          mblno: this.token.productNo, //用户手机号
          currentPage: this.CURRENTPAGE,
          pagNum: this.PAGNUM || 4,
          session: this.token.session.replace(/\+/g, "%2B"),
          map_type: window.isUseBaiDuLoc ? 0 : 1,
          merc_id: params // 商户编号
        })
        .then(res => {
          console.log("shoplist.vue打印请求的数据_______");
          console.log(res.data);
          if (res.code === "0") {
            document.getElementById("pg").style.display="none";
            this.shopLists = this.filterObj(res.data);
            // console.log(this.shopLists);
          }else {
               document.getElementById("pg").style.display="none";
               this.isList = true;
           }
        });
    },
    // GetDistance(a, b, c, d) {
    //   // alert(GetDistance(a, b, c, d))
    //   return GetDistance(a, b, c, d);
    // },

    goDetail(event, obj, flag) {
      // 神策
      sa.track('clickShop', {
        currentPage: '优惠券商户页',
        commodityID:obj.MERC_ID,
        commodityName: obj.STORES_NM,
        commodityType:obj.MERC_TRD_DESC,
        is_FromSearch:false,
        keyword:''
      });
      fetchPoints(
        "040000000000", // 页面索引
        "040000000000K01", //事件标记
        this.token.productNo,
        "优惠券商户-" + obj.STORES_NM, // 事件名称
        this.token.session.replace(/\+/g, "%2B")
      );
      let url = flag == 1 ? obj.MERC_URL : url;
       // console.log(url);
       if (
         (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
         "android"
       ) {
         if (flag == 1) {
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
           window.goActivity.goWeb(url2);
         } else {
           window.goActivity.goWeb(
             url.replace(
               /\?/,
               "?hebaosso=true&SOURCE=DISCOVER&account=" +
                 this.token.productNo +
                 "&"
             )
           );
         }
       } else {
         if (flag == 1) {
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
           window.location =
             "activity://goWeb?url=" +
             url.replace(
               /\?/,
               "?hebaosso=true&SOURCE=DISCOVER&account=" +
                 this.token.productNo +
                 "&"
             );
         }
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

    onPullingDown() {
      this.$emit("pullingDown");
    },
    onPullingUp() {
      this.$emit("pullingUp");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
div {
    background: #f6f7f8;
}
.s_1
 {
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
    color: #13252E;
    padding-right: 3.5rem;
    text-align: center;
  }
  .t {
    color: #6c6c6c;
    font-size: 0.9375rem;
    width: 5.1875rem;
    position: relative;
    float: left;
    text-align: left;
    padding-left: 1.9375rem;
    background-image: url(/static/img/back.png);
    background-repeat: no-repeat;
    background-position: 0.375rem 50%;
    background-size: 1.1rem;
    // padding-right: 0.6rem;
    @include space();
  }
}

.nullHeight {
  height: 0.625rem;
  background: red;
}
.s_1 {
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
  background: #fff;
  position: fixed;
  z-index: 21;
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
    margin-top: 3.5rem;
    background: #fff;
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
    background: #fff;
    @include space();
  }
  .c2 {
    font-size: 0.6875rem;
    color: #999999;
    padding-top: 0.5625rem;
    max-width: 90%;
    background: #fff;
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
    background: #fff;
    @include space();
    div {
      @include space();
    }
  }
  .r {
    position: absolute;
    right: 0;
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
.error {
  .aa {
    position: relative;
    padding: 6.3125rem 0.625rem;
    top: 4.6875rem;
    background: url(/static/img/tipIcon.png) no-repeat 50%;
    background-size: 8.5625rem 8.5625rem;
  }
  .tip {
    padding: 3.125rem 0.625rem;
    font-family: PingFangSC-Regular;
    color: #5A6164;
    font-size: 0.875rem;
    text-align: center;
  }
}
.hr-1 {
  display: block;
  position: absolute;
  height: 0.0625rem;
  float: left;
  width: 100%;
  bottom: 0;
  background-color: #e6e6e6;
  -webkit-transform-origin: 0, 0;
  transform-origin: 0, 0;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
  // &::after {
  //   @include onepx1(#d8d8d8);
  // }
}
.hr-1:nth-last-child(-1) {
  height: 0;
}
.null {
  height: 3rem;
  // padding-top: 1.2rem;
  // font-size: 0.6875rem;
  // color: #afadadc4;
}
</style>
