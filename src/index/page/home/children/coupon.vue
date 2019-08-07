<template>
  <div v-if="this.tokenstatus == 11">
    <div class="nullHeight"></div>
    <div class="t-2">
        <div class="t-1">
          <!-- <div class="t-3">领券专区</div> -->
        </div>
        <!-- <div class="hr-1"></div> -->
    </div>
    <section class="sw">
      <scroll
        :scrollX = true
        :scrollbar = false
        :data="couponMainList"
      >
        <div class="sw-box">
          <div class="sw-option" v-for="(item,index) in couponMainList" @click="goDetail($event,item,7)" :key="'coupon'+index">
              <img :class="{'p2':couponMainList.length>2}" :src="item.couponIcon" />
          </div>
          <div v-if="couponMainList.length>2" class="sw-option sw-option-end">已经到底啦</div>
        </div>
      </scroll>
      <!-- <div class="hr-1"></div> -->
    </section>

    <ul v-for="(item,index) in dataList" :key="'ul'+index" >
        <li class="left">
          <div class="c1">
            <span>¥ <i class="par">{{item.issBillAmt}}</i></span>
          </div>
        </li>
        <li class="middle">
          <div class="c1">
            <span class="l">{{item.mktNm}}</span>
          </div>
          <div class="c2">
            <span class="m">满50元使用</span>
            <span  class="sl">可叠加</span>
          </div>
          <div class="c3">
            <span class="b" >{{item.receiveRules}}</span>
          </div>
        </li>
        <li class="right">
          <div class="c1">
            <button class="r" v-if="item.show" @click="receiveCoupon(item)" :disabled="isDisable">立即领取</button>
            <button class="r" v-else @click="goShop($event,item,8)">去消费</button>
          </div>
          <div class="c2">
            <div class="l" v-show="item.isLook" @click="goDetail($event,item,6)">查看详情</div>
          </div>
          <div class="c3">
            <div v-show="item.bgIcon" class="bgIcon"></div>
          </div>
        </li>
    </ul>
    <div v-if="showMore = couponList.length>4 ? true : false"
         @click="showAll = !showAll"
         class="more">
      <span v-if="showAll==false" class="down">展开</span>
      <span v-else class="up">收起</span>
    </div>

    <!-- <ul v-if = "!couponList || couponList.length<=0 ">
      <li class="aa">加载中···</li>
    </ul> -->
    <div class="nullHeight2"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { fetchPoints, GetDistance } from "@@/service/util";
import axios from "@@/plugins/rsa/axios";
import Scroll from "@@/components/scroll/scroll-v.vue";
import AlertTip from "@@/components/common/alertTip";
import sa from "sa-sdk-javascript";
export default {
  data() {
    return {
      showAlert: false,
      isCoupon: [],
      // alertText: '',
      showAll: false,
      showMore: false,
      changeFoldState: false,
      isDisable: false,
      isLook: false,
      show: true,
      bgIcon: false,
      isCouponDetail: false
    };
  },
  props: {
    couponMainList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    couponList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapState(["token", "tokenstatus"]),
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

  mounted() {},
  created() {
    // this.ISSHOWALERT(true)
  },

  components: {
    Scroll,
    AlertTip
  },
  methods: {
    ...mapMutations([
       'ISSHOWALERT',
       'ALERTTEXTFIRST'
     ]),
    // 领取优惠券
    receiveCoupon(data) {
      // 神策
      sa.track('buttonClick', {
      topCategory: '优惠',
      subCategory: '优惠券副站：立即领取'
      });
      fetchPoints(
        "010000000000", // 页面索引
        "010000000000K04", //事件标记
        this.token.productNo,
        "优惠券副站：立即领取按钮", // 事件名称
        this.token.session.replace(/\+/g, "%2B")
      );
      this.isDisable = true;
      // console.log(data);
      let param_ = {
        mbl_no: this.token.productNo, //用户手机号
        // mbl_no  : "18390957487",
        merc_id: data.mercId, // 商户编号
        mkt_id: data.mktId, // 活动编号
        prd_id: data.prdId, // 券别编号
        mamt: data.issBillAmt, // 发券面额
        session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      };
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

    goShop(event,obj,flag) {
      // 神策
      sa.track('buttonClick', {
      topCategory: '优惠',
      subCategory: '优惠券副站：去消费'
      });
      let params = obj.mercId;
      if(obj.conponType === "1") {
        this.$router.push({
          path: "/shopList",
          query: {
            params: params
          }
        })
      } else {
          this.$emit("goDetail", event, obj, flag);
      }
    },
    goDetail(event, obj, flag) {
      // 神策
      if(flag==7){
        sa.track('ZoneClick', {
          topCategory: '优惠',
          subCategory:  '领券专区',
          locationOfZone: '主站',
          contentName: obj.couponName
        });
        fetchPoints(
          "010000000000", // 页面索引
          "010000000000K03", // 事件标记
          this.token.productNo,
          "优惠券主站-" + obj.couponName, // 事件名称
          this.token.session.replace(/\+/g, "%2B")
        );
      }
      if(flag==6){
        // 神策
        sa.track('buttonClick', {
        topCategory: '优惠',
        subCategory: '优惠券副站：查看详情'
        });
      }
      this.$emit("goDetail", event, obj, flag);
      // cosole.log(event.target);
    },
    filterObj(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].PIC_URL_1) {
          obj[i].PIC_URL_1 = this.baseImg + obj[i].PIC_URL_1;
        }
      }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "~@@/style/mixin";
.nullHeight {
  height: 0.5625rem;
  background: #f6f7f8;
}
.nullHeight2 {
  height: 0.5625rem;
  background: #fff;
}
.sw {
  position: relative;
  // white-space: nowrap;
  // overflow-x: auto;
}
.sw-box {
  // width: 200%;
  height:5.625rem;
  margin: 0.625rem 0 .9375rem 0.625rem;
  // overflow-x:auto;
  // overflow-y: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  // box-flex:2;
}
.sw-option {
  height: 5.625rem;
  flex: 0 1 auto;
  // float: left;
  img {
    display: inline-block;
    height: 5.625rem;
    // padding-left: 15px;
  }
  .p2 {
    // padding-left: .4375rem;
  }
}
div.sw-option-end {
  margin: 0 auto;
  color: #aeafaf;
  font-family: PingFangSC-Regular;
  font-size: 0.75rem;
  width: 1.25rem;
  padding-top: 0.5rem;
  line-height: 0.9375rem;
  margin-right: 0.625rem;
  margin-left: 0.625rem;
}
.t-2 {
  position: relative;
  height: 2.5rem;
  text-align: center;
  position: relative;
  line-height: 2.875rem;
}
.t-1 {
  height: 100%;
  line-height: 2.5rem;
  width: 9.375rem;
  margin: 0 auto;
  background-image: url("/static/img/coupon_img.png");
  background-repeat: no-repeat;
  background-size: 9.375rem 2.1875rem;
  background-position: center center;
}
.t-3 {
  height: 100%;
  line-height: 2.5625rem;
  width: 5rem;
  color: #ed196c;
  font-family: PingFangSC-Regular;
  font-size: 0.9375rem;
  margin: 0 auto;
  background: #fff;
}
ul {
  width: 20.625rem;
  height: 5.625rem;
  position: relative;
  margin: 0.9375rem auto;
  background: #fff;
  box-shadow: 0 0 0.625rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.1875rem;
}
ul:nth-last-child(1)::after {
  height: 0 !important;
}
.left {
  width: 5rem;
  height: 100%;
  float: left;
  // min-width: 60%;
  // width: 72%;
  text-align: left;
  .c1 {
    padding-left: 0.9375rem;
    line-height: 5.625rem;
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
  height: 100%;
  float: left;
  padding-top: 0.5625rem;
  text-align: left;
  color: #13252e;
  font-family: PingFangSC-Regular;
  .c1 {
    .l {
      font-size: 0.875rem;
      font-weight: bold;
      font-family: PingFangSC-Semibold;
    }
  }
  .c2 {
    height: 1.4375rem;
    .m {
      font-size: 0.8125rem;
    }
    .sl {
      font-size: 0.75rem;
      margin-left: 0.4125rem;
      padding: 0 0.2rem;
      color: #e11a2f;
      background-color: #fff0f1;
      border: 0.0063rem solid #e11a2f;
    }
  }
  .c3 {
    padding-top: 0.3125rem;
    .b {
      font-size: 0.6875rem;
      color: #7e7e7e;
    }
  }
}
.right {
  width: 6.4375rem;
  height: 100%;
  // float: left;
  text-align: left;
  position: relative;
  padding-top: 1.875rem;
  padding-left: 1rem;
  padding-right: 0.625rem;
  border-left: 0.0625rem dashed #e6e6e6;
  .c1 {
    // width: 4.5625rem;
    height: 1.875rem;
    border-radius: 0.9375rem;
    color: #fff;
    position: relative;
    z-index: 99;
    .r {
      width: 4.75rem;
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
.hr-1.height0 {
  height: 0 !important;
}
.more {
  float: right;
  height: 100%;
  font-size: 0.75rem;
  padding-bottom: 1rem;
  color: #7E7E7E;
  .down {
    display: inline-block;
    width: 4rem;
    background: url(/static/img/down.png) no-repeat 50% 50%;
    background-size: auto 80%;
  }
  .up {
    display: inline-block;
    width: 4rem;
    background: url(/static/img/up.png) no-repeat 50% 50%;
    background-size: auto 80%;
  }
}
</style>
