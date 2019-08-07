<template>
<div>
  <div class="home">
    <div class="s_1">
      <ul>
        <!-- <router-link tag="li" class="l t" to="/home1"></router-link> -->
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>商家信息</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>

    <scroll
      :scrollbar="scrollbar"
    >
      <div class="content">
        <section class="s_2">
          <div class="seller">
            <ul>
              <li class="left">
                <div class="seller-name">{{shopData.mercAbbr}}</div>
                <div v-show="shopData.businessHour.length>=1" class="seller-time">营业时间: {{shopData.businessHour}}</div>
              </li>
              <li class="right">
                <button class="go-buy-btn" @click="payKHDs()">去买单</button>
              </li>
              <li class="hr-2"></li>
            </ul>
          </div>
          <div class="address">
            <div class="address-info">
              <div class="left" @click="jumpMap()">
                <img src="/static/img/address_icon.png"/>
                <!-- <a>{{shopData.busAddr}}</a> -->
                <div class="texta" style="padding-left: 1.5rem;">{{shopData.busAddr}}</div>
              </div>
              <!-- <div v-if="showTel"
                   class="right">
                <a :href="'tel:'+shopData.mercHl"><img src="/static/img/seller_phone_button.png"/></a>
              </div> -->
              <a v-if="showTel" style="position: absolute;width: 1.5rem;height: 1.5rem;top: 50%;margin-top: -0.75rem;right: 0.5rem;" :href="'tel:'+shopData.mercHl"><img style="width: 1.5rem;height: 1.5rem;" src="/static/img/seller_phone_button.png"/></a>
              <div class="hr-2"></div>
            </div>

            <!-- <div class="address-info" @click="goDetail($event,shopData,2)">
              <div class="left">
                <img src="/static/img/voucher_icon.png"/>
                <a>支持本店消费的和包券</a>
              </div>
              <div class="right">
                <span class="link">查看详情</span>
                <img class="special" src="/static/img/link_button.png"/>
              </div>
            </div> -->
          </div>
        </section>
        <!-- <div class="nullHeight"></div> -->
        <!-- <section class="s_3" v-show = "couponList.length>=1">
          <div class="title">
            <p>商户优惠券</p>
            <div class="hr-2"></div>
          </div>
          <div class="seller-coupon"> -->
            <!-- <ul v-for="(item,index) in shopData.mktrec"> -->
            <!-- <ul v-for="(item,index) in couponList" :key="'ul'+index">
              <li class="left">
                <div class="c1">
                  <span>¥ <i class="par">{{item.issBillAmt}}</i></span>
                </div>
              </li>
              <li class="middle">
                <div class="c1">
                  <span class="m">{{item.mktNm}}</span>
                  <span  class="sl">可叠加</span>
                </div>
                <div class="c2">
                  <span class="b" >有效期至：{{item.issEffDt}}</span>
                </div>
              </li>
              <li class="right">
                <div class="c1">
                  <button class="r" v-if="item.show" @click="receiveCoupon(item)" :disabled="isDisable">立即领取</button>
                  <button class="r" v-else @click="goDetail($event,item,1)">查看详情</button>
                </div>
                <div class="c3">
                  <div v-show="item.bgIcon" class="bgIcon"></div>
                </div>
              </li>
            </ul>
          </div>
        </section> -->
        <div class="nullHeight"></div>
        <!--  v-if = "this.tokenstatus == 11" -->
        <!--  v-show = "shopData.rec.length>=1" -->
        <section class="s_4" v-show="islogin">
        <!-- <section class="s_4" v-show="true"> -->
          <div class="title" v-show = "shopData.rec.length>=1">
            <p>优惠活动</p>
            <div class="hr-2"></div>
          </div>
          <div class="address" v-for="(item,index) in shopData.rec" @click="jumpInfo(item)">
            <div class="address-info">
              <div class="left_left">
                <span class="list-flg">{{item.DRAW_RULE_TYP == '3' ? '满送' : '满减'}}</span>
                <!-- <span class="activity">{{item.GME_NM}}：{{item.GME_ABBR}}</span> -->
                <span class="activity">{{item.GME_ABBR}}</span>
              </div>
              <div class="right">
                <span class="link">查看规则</span>
                <img class="special" src="/static/img/link_button.png"/>
              </div>
              <div class="hr-2"></div>
            </div>
          </div>
        </section>
        <!-- <div class="nullHeight"></div>
        <section class="s_5" v-show = "shopData.mercBriefDesc.length>=1">
          <div class="title">
              <p>商家简介</p>
              <div class="hr-2"></div>
          </div>
          <div class="seller-info">
            <div>{{shopData.mercBriefDesc}}</div>
          </div>
        </section>
        <div class="null">&nbsp;&nbsp;</div> -->
      </div>
    </scroll>
  </div>
  <transition name="fade">
  <div v-show="isPayWrapper" class="payWrapper" @click="payClose">
    <div class="menuTop"></div>
    <div class="menuWrapper" @click.stop>
      <div class="top" @click="clickScan">扫一扫</div>
      <div class="hr-3"></div>
      <div class="middle" @click="payKHD">付款码</div>
      <div class="nullHeight"></div>
      <div class="bottom" @click="payClose">取消</div>
    </div>
  </div>
  </transition>

</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "@@/plugins/rsa/axios";
import {
  isHebaoApp,
  animationProgress,
  AppFlag
} from "@@/service/util";
import { baseUrl } from "@@/config/env"; // baseUrl
import Scroll from "@@/components/scroll/scroll.vue";
import sa from "sa-sdk-javascript";

export default {
  data() {
    return {
      shopData: {},
      couponList: [],
      isPayWrapper: false,
      showTel: false,
      scrollbar:false,
      isDisable: false,
      bgIcon: false,
      show: true,
      GME_ID: '',
      islogin:false
    };
  },
  computed: {
    ...mapState([
      "token",
      "shopParm",
      "tokenstatus",
      "sliderScroll",
      "latitude",
      "longitude",
      "cityname"
    ]),
    dataList() {
      if (this.showAll == false) {
        var dataList = [];
        if (this.couponList.length > 4) {
          for (var i = 0; i < 4; i++) {
            dataList.push(this.couponList[i])
          }
        } else {
          dataList = this.couponList
        }
        return dataList;
      } else {
        return this.couponList
      }
    }
  },

  mounted() {
    // 隐藏进度条
    // document.getElementById("pg").style.display="none";
  },
  created() {
    this.init();
    this.getCoupon();
    if(this.tokenstatus==11){
      this.islogin=true;//登录状态
    }
  },
  components: {
    Scroll
  },
  methods: {
    ...mapMutations([
       'ISSHOWALERT',
        "CITYNAME1",
       'ALERTTEXTFIRST'
     ]),
    init() {
      // let params = this.$route.query.params;
      let params = this.shopParm;
      // alert(this.token.productNo)
      // alert(this.token.session)
      if(isHebaoApp()) {
        // axios.post("getShopInfoDetail", params).then(res => {  // 正式环境调用接口   走接口
        //         gmeId: "19080701",
        // mbl_no: "15111427793",
        // merc_id: "888073113001851",

        // axios.post("getShopInfoDetailTest", params).then(res => {   //测试环境调用接口   走文件
        axios.post("getShopInfoDetail", {
          mbl_no: this.token.productNo || '15111427793',
          merc_id: this.shopParm.merc_id,
        }).then(res => {  // 正式环境调用接口   走接口
            if (res.code==="0") {
              this.shopData = res.data;
              // console.log("shop",this.shopData);
              this.showTel = this.shopData.mercHl.length>2 ? true : false
            }
        });
      } else {
          // axios.post("getExternalShopInfoDetail", params).then(res => {
          // axios.post("getShopInfoDetail", params).then(res => {
          axios.post("getShopInfoDetail", {
            mbl_no: this.token.productNo || '15111427793',
            merc_id: this.shopParm.merc_id,
          }).then(res => {
            if (res.code === "0") {
              this.shopData = res.data;
              this.showTel = this.shopData.mercHl.length>2 ? true : false
            }
          });
      }
      // http://113.108.79.80:3020/rcServer/getRecInfoDetail?gmeId=19080701&merc_id=888073113001851%20&mbl_no=15111427793
      // axios.post("getShopInfoDetail", {
      //   gmeId: "19080701",
      //   mbl_no: "15111427793",
      //   merc_id: "888073113001851",
      // }).then(res => {
      //   console.log(res.data)
      // })
    },
    payKHDs() {
      // 神策
      sa.track('buttonClick', {
        topCategory: '优惠',
        subCategory: '商家详情页'
      });
      event.stopPropagation();
      if(isHebaoApp()) {
        this.isPayWrapper = true;
      } else {
        window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
      }
    },
    payClose() {
      this.isPayWrapper = false;
    },
    clickScan() {
      if (
          (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
          "ios"
        ) {
          scanCodeByApp()
        } else {
          window.goActivity.ScannerByAppForJsBack()
        }
        this.isPayWrapper = false;
    },
    payKHD() {
      // 神策
      sa.track('buttonClick', {
        topCategory: '优惠',
        subCategory: '商家详情页'
      });
      event.stopPropagation();
      // 客户端 跳转链接
      if (AppFlag() === '1') {
          window.location.href = "activity://GTF";
      } else if (AppFlag() === '0' && typeof(goActivity) !== 'undefined' && typeof(goActivity.goTopSpeed) === 'function') {
          window.goActivity.goTopSpeed();
      }
      this.isPayWrapper = false;
    },
    jumpMap(){
      let params = this.shopParm;
      let sName = '', // 出发地名
          dName = '', // 目的地名
          city = window.CITYNAME,  // 城市
          longitude = window.LONGITUDE, // 出发地经度
          latitude = window.LATITUDE, // 出发地纬度
          MERC_LONGITUDE = this.shopParm.merc_longitude, // 目的地经度
          MERC_LATITUDE = this.shopParm.merc_latitude, // 目的地纬度
          BUS_ADDR = this.shopData.busAddr;
      // 客户端 跳转链接  安卓 0  苹果 1
      console.log(city,longitude,latitude,MERC_LONGITUDE,MERC_LATITUDE,BUS_ADDR);
      if (AppFlag() === '1' && typeof(CmpOpenMapLocation) !== 'undefined' && typeof(CmpOpenMapLocation) === 'function') {
          CmpOpenMapLocation(sName, dName, LATITUDE, LONGITUDE, MERC_LATITUDE, MERC_LONGITUDE);
      } else if (AppFlag() === '0' && typeof(goActivity) !== 'undefined' && typeof(goActivity.openNavigation) === 'function') {
          window.goActivity.openNavigation('', LATITUDE, LONGITUDE, BUS_ADDR, MERC_LATITUDE, MERC_LONGITUDE, city);
      } else {
          // 非客户端
      }
    },
    // http://113.108.79.80:3020/rcServer/getRecInfoDetail?gmeId=19080701&merc_id=888073113001851%20&mbl_no=15111427793
    jumpInfo(obj) {
      let params = {
        gmeId: obj.GME_ID,
        latitude: this.latitude,
        longitude: this.longitude,
        mbl_no: this.token.productNo,   //正式
        // mbl_no: 15111427793,  //测试11111
        // merc_id: this.shopData.mercId || '888073113001851',
        merc_id: '888073113001851',
        merc_latitude: obj.LATITUDE,
        merc_longitude: obj.LONGITUDE
        // gmeId: "19080701",
        // mbl_no: "15111427793",
        // merc_id: "888073113001851",
      };
      // alert(JSON.stringify(obj));
      // console.log(obj);
      this.$router.push({
        path: "/hebaoInfo",
        query: {
            params: params
          }
      });
      // 神策
      sa.track('buttonClick', {
        topCategory: '优惠',
        subCategory: '商户优惠活动页'
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
    receiveCoupon(data) {
      // 神策
      sa.track('buttonClick', {
      topCategory: '优惠',
      subCategory: '线下商户优惠券：立即领取'
      });
      this.isDisable = true;
      // console.log(data);
      let param_ = {
        mbl_no: this.token.productNo, //用户手机号
        merc_id: data.mercId, // 商户编号
        mkt_id: data.mktId, // 活动编号
        prd_id: data.prdId, // 券别编号
        mamt: data.issBillAmt, // 发券面额
        session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      };
      // console.log("XXXXXXXXXXXXXXXXXXXXXXX");
      // console.log(param_);
      axios.post("receiveCoupon", param_).then(res => {
        if (res.code === "0") {
          let data = res.data;
          this.isCoupon = data;
          this.ALERTTEXTFIRST("领取成功");
          this.ISSHOWALERT(true);
          data.bgIcon = true;
          data.show = false;
          setTimeout(() => {
            this.ISSHOWALERT(false);
            this.isDisable = false;
          }, 1500);
          // console.log(this.isCoupon)
        } else if (res.code === "900001") {
          this.ALERTTEXTFIRST("领取数量已达上限");
          this.ISSHOWALERT(true);
          data.bgIcon = true;
          data.isLook = true;
          data.show = false;
          setTimeout(() => {
            this.ISSHOWALERT(false);
            this.isDisable = false;
          }, 1500);
        } else {
          this.ALERTTEXTFIRST("领取失败");
          this.ISSHOWALERT(true);
          data.isLook = true;
          data.bgIcon = true;
          data.show = false;
          setTimeout(() => {
            this.ISSHOWALERT(false);
            this.isDisable = false;
          }, 1500);
        }
      });
    },
    goDetail(event, obj, flag) {
      let url = flag == 1 ? obj.couponDetailsContent : url;
      url = flag == 2 ? obj.recUrl : url;
      console.log(url);
       if (
         (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
         "android"
       ) {
         if (flag == 1 || flag == 2) {
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
         if (flag == 1 || flag == 2) {
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
          //  console.log(url_2);
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
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goBack() {
      this.$router.go(-1);
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
  top: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.home {
  width: 100%;
  height: 100%;
  // overflow: hidden;
}
.s {
  position: relative;
  // margin-top: .625rem;
  // background: #ffffff;
}

.content-wrapper {
  background: #F6F7F8;
  z-index: 99999;
}
.s_1 {
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
.s_2,.s_3,.s_4,.s_5 {
  padding: 0 0.9375rem;
  background: #fff;
}
ul {
  height: 100%;
  position: relative;
}
.seller {
  height: 5.3125rem;
  .left {
    float: left;
    height: 100%;
    padding: 1.25rem 0 1.25rem 0;
    .seller-name {
      font-family: PingFangSC-Semibold;
      font-size: 1rem;
      font-weight: bold;
      color: #13252e;
      line-height: 1.25rem;
      padding-bottom: 0.625rem;
    }
    .seller-time {
      font-family: PingFangSC-Regular;
      font-size: 0.8125rem;
      color: #7e7e7e;
      line-height: 0.9375rem;
    }
  }
  .right {
    float: left;
    width: 4.5625rem;
    height: 1.875rem;
  }
  button {
    position: absolute;
    top: 1.5625rem;
    right: 0;
    width: 4.5625rem;
    height: 1.875rem;
    background-image: linear-gradient(90deg, #E93357 0%, #F55B97 100%);
    border-radius: 0.9375rem;
    font-family: PingFangSC-Regular;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
    line-height: 0.75rem;
  }
}
.address {
  .address-info {
    position: relative;
    // height: 2.8125rem;
    .left {
      width: 80%;
      height: 100%;
      position: relative;
      overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      padding: 0.7rem 0;
      img {
        width: 1.375rem;
        height: 1.375rem;
        position: absolute;
        top: .7rem;
      }
      a {
        font-family: PingFangSC-Regular;
        font-size: 0.875rem;
        padding-left: 2rem;
        color: #13252e;
        // line-height: 2.8125rem;
      }
      .texta{
        font-family: PingFangSC-Regular;
        font-size: 0.875rem;
        color: #13252e;
      }
      .activity {
        font-family: PingFangSC-Regular;
        font-size: 0.875rem;
        padding-left: 0.25rem;
        color: #13252e;
        line-height: 2.8125rem;
      }
      .list-flg {
        font-family: PingFangSC-Regular;
        font-size: 0.75rem;
        margin-left: 0.3125rem;
        padding: 0 0.2rem;
        color: #e11a2f;
        background-color: #fff0f1;
        border: 0.0063rem solid #e11a2f;
        border-radius: 0.125rem;
      }
    }
    .left_left {
      width: 80%;
      height: 100%;
      position: relative;
      overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      padding: 0rem 0;
      float: left;
      img {
        width: 1.375rem;
        height: 1.375rem;
        position: absolute;
        top: .7rem;
      }
      a {
        font-family: PingFangSC-Regular;
        font-size: 0.875rem;
        padding-left: 2rem;
        color: #13252e;
        // line-height: 2.8125rem;
      }
      .activity {
        font-family: PingFangSC-Regular;
        font-size: 0.875rem;
        padding-left: 0.25rem;
        color: #13252e;
        line-height: 2.8125rem;
      }
      .list-flg {
        font-family: PingFangSC-Regular;
        font-size: 0.75rem;
        margin-left: 0.3125rem;
        padding: 0 0.2rem;
        color: #e11a2f;
        background-color: #fff0f1;
        border: 0.0063rem solid #e11a2f;
        border-radius: 0.125rem;
      }
    }
    .right {
      // display: block;
      width: 4.3rem;
      height: 2.5rem;
      // width: 20%;
      // float: none;
      // height: 100%;
      position: relative;
      .link {
        font-family: PingFangSC-Regular;
        font-size: 0.75rem;
        color: #5a6164;
        text-align: right;
        line-height: 2.8125rem;
      }
      img {
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: .6rem;
        right: 0;
      }
      .special {
        position: absolute;
        top: .9375rem;
        right: 0;
        width: 0.9375rem;
        height: 0.9375rem;
      }
    }
  }
}
.seller-coupon {
  margin: 0.9375rem auto;
  ul {
    height: 5rem;
    position: relative;
    background: #fff3F4;
    border: 0.0625rem solid #f992bb;
    box-shadow: 0 0 0.625rem 0 rgba(0, 0, 0, 0.1);
    border-radius: 0.1875rem;
    margin-bottom: 0.625rem;
  }
  ul:nth-last-child(1)::after {
    height: 0 !important;
  }
  .left {
    width: 5rem;
    height: 100%;
    float: left;
    text-align: left;
    .c1 {
      padding-left: 0.625rem;
      line-height: 4.8rem;
      color: #ed196c;
      font-weight: bold;
      font-size: 1rem;
      .par {
        font-size: 1.875rem;
        font-family: PingFangSC-Semibold;
      }
    }
  }
  .middle {
    width: 9.375rem;
    height: 100%;
    float: left;
    padding-top: 0.9375rem;
    text-align: left;
    color: #13252e;
    font-family: PingFangSC-Regular;
    .c1 {
      height: 1.4375rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .m {
        font-size: 0.875rem;
      }
      .sl {
        font-size: 0.75rem;
        margin-left: 0.3125rem;
        padding: 0 0.2rem;
        color: #e11a2f;
        background-color: #fff0f1;
      }
    }
    .c2 {
      .b {
        font-size: 0.6875rem;
        color: #7e7e7e;
      }
    }
  }
  .right {
    width: 6.4375rem;
    height: 100%;
    text-align: left;
    position: relative;
    padding-top: 1.5625rem;
    padding-left: 1rem;
    padding-right: 0.625rem;
    .c1 {
      width: 4.5625rem;
      height: 1.875rem;
      border-radius: 0.9375rem;
      color: #fff;
      position: relative;
      z-index: 99;
      .r {
        width: 4.5625rem;
        height: 1.875rem;
        background-image: linear-gradient(90deg, #e93357 0%, #f55b97 100%);
        font-size: 0.75rem;
        font-family: PingFangSC-Regular;
        color: #fff;
        text-align: center;
        line-height: 1.875rem;
      }
    }
    .c2 {
      .l {
        padding-top: 0.375rem;
        padding-left: 1rem;
        font-size: 0.625rem;
        font-family: PingFangSC-Regular;
        color: #7e7e7e;
      }
    }
    .c3 {
      width: 3.75rem;
      height: 3.4375rem;
      position: absolute;
      top: 0;
      right: 0;
      .bgIcon {
        width: 100%;
        height: 100%;
        background: url(/static/img/receive.png) no-repeat 100% 0;
        background-size: 3.75rem 3.4375rem;
        z-index: 9;
      }
    }
  }
}
.payWrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999999999;
  .menuWrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 3rem;
    background-color: #fff;
    color: #3478f6;
    .top {
      background: url(/static/img/sys.png) no-repeat 38% 50%;
      background-size: 1rem;
    }
    .middle {
      background: url(/static/img/ewm.png) no-repeat 37.5% 50%;
      background-size: 1.4rem;
    }
    .bottom {
      color: #ea4e3d;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
  .menuWrapper {
    transition: all 0.3s;
  }
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  .menuWrapper {
    transform: translate3d(0, 100%, 0)
  }
}
.title {
  position: relative;
  height: 2.5rem;
  font-family: PingFangSC-Regular;
  font-size: 0.875rem;
  color: #13252e;
  line-height: 2.5rem;
}
.seller-info {
  font-family: PingFangSC-Regular;
  font-size: 0.875rem;
  color: #13252e;
  padding: 1.0625rem 0 1.0625rem 0;
}
.null {
  // height: 35.5625rem;
  // background: #F6F7F8;
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
.hr-2 {
  display: block;
  position: absolute;
  height: 0.0625rem;
  float: left;
  width: 100%;
  bottom: 0;
  background-color: #e6e6e6;
  -webkit-transform-origin: 0, 0;
  -ms-transform-origin: 0, 0;
  transform-origin: 0, 0;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.hr-3 {
  position: relative;
  height: 0.08rem;
  width: 100%;
  bottom: 0;
  background-color: #e6e6e6;
  -webkit-transform-origin: 0, 0;
  -ms-transform-origin: 0, 0;
  transform-origin: 0, 0;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

</style>
