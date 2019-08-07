<template>
  <div class="content-wrapper">
    <!-- <header class="s_1">
      <ul>
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>唯品会优惠券领取</span>
        </li>
      </ul>
    </header> -->

    <div class="home">
      <scroll>        
        <div class="top"></div>
        <div class="content">
          <div class="idreGional clearfloat">
              <span @click="getCoupon()"><img src="/static/img/button.png"></span>
              <span v-if="isCover" class="btnCover"></span>
          </div>
          <div class="forEign">
            <div class="creditTile">
                <span class="txtTile">活动规则</span>
            </div>
            <div class="bottomInfo">
                <div><label>1. </label><span>该唯品会优惠券的领取时间为：即日起至2019年12月31日。优惠券区分唯品会新老客领取，新客可领取一张满99减20元品类券，老客可领取一张满900减20元服装券；数量有限，领完即止；</span></div>
                <div><label>2. </label><span>唯品会新客户定义：唯品会新客户指此前在唯品会无任何购买记录的客户，新客户资格由唯品会认定；</span></div>
                <div><label>3. </label><span>新客优惠券领取后3天内有效，老客优惠券领取后1天内有效。逾期作废，领取后的优惠券可到唯品会“个人中心-我的资产”查看；</span></div>
                <div><label>4. </label><span>品类券限定使用品类包括唯品会自营女装、男装、女鞋、男鞋、箱包、运动户外、男女内衣，美妆；</span></div>
                <div><label>5. </label><span>服装券限定使用品类包括唯品会自营女装、男装；</span></div> 
                <div><label>6. </label><span>使用优惠券的订单如产生退货均不退券，优惠券金额按照商品价格比例分摊至每件商品中，退款金额按优惠后的小计金额；</span></div>
                <div><label>7. </label><span>若出现用户违反活动规则恶意刷单，唯品会有权取消其优惠资格，取消订单并终止给用户发货。 </span></div>
                <div><label>8. </label><span>如有疑问，可联系唯品会客服4006789888处理。</span></div>
            </div>
        </div>
        </div>
      </scroll>
     </div>
     
    <div v-if="isAlertImg" class="alert_info">
      <p>
        <a @click="goDetail()"><img src="/static/img/toast.png"></a>
        <a @click="alertCloseBtn()" class="alert_close"></a>
      </p>
    </div>
  </div>
</template>

<script>
import {
  fetchPoints
} from "@@/service/util";
import { mapState, mapMutations } from "vuex";
import axios from "@@/plugins/rsa/axios";
import Scroll from "@@/components/scroll/scroll.vue";
import sa from "sa-sdk-javascript";
export default {
  data() {
    return {
      data: [],
      ruleText: "",
      usrTyp: "",
      isShowT: false,
      ruleFlgText: "",
      ruleFlgText2: "",
      mjrTypText: "",
      isAlertImg: false,
      isCover: false
    };
  },
  props: {

  },
  components: {
    Scroll
  },
  computed: {
    ...mapState(["token"])
  },

  mounted() {
  },
  created() {},

  methods: {
    getCoupon() {
      // 神策
      sa.track("buttonClick", {
        buttonName: "领券按钮",
        topCategory: "优惠",
        subCategory: "优惠：唯品会"
      });
      axios.post("getVipCoupon", {
        mblNo: this.token.productNo
      }).then(res => {
          if (res.code === "0") {
            this.isAlertImg = true
          } else if(res.code === "-1") {
            this.$dialog('领取失败，请重试');
          } else if(res.code === "406") {
            this.$dialog('亲爱的，不要太贪心哟');
            this.isCover = true;
          } else {
            this.$dialog('领取失败，请重试');
          }
      });
    },
    goDetail() {
      window.location = "https://dmp-data.vip.com/ndl?tra_from=tra%3Apg32c865%3A%3A%3A%3A"
    },
    alertCloseBtn() {
      // 神策
      sa.track("buttonClick", {
        buttonName: "关闭弹窗",
        topCategory: "优惠",
        subCategory: "优惠：唯品会"
      });
      this.isAlertImg = false
    },
    filterObj(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].PIC_URL_1) {
          obj[i].PIC_URL_1 = this.baseImg + obj[i].PIC_URL_1;
        }
      }
      return obj;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.home {
  position: absolute;
  z-index: 1;
  // top: 3rem;
  left: 0;
  width: 100%;
  // position: relative;
  height: 100%;
  // padding-bottom: 2rem;
  // background: #f0f1f2;
  overflow: hidden;
}
.home1 {
  // margin-top: 4.25rem;
  height: 100%;
  overflow: hidden;
  // z-index: 19;
}

</style>

<style lang="scss" scoped>
@import "~@@/style/mixin";

.s_1 {
  @include wh(100%, 3rem);
  position: sticky;
  z-index: 1000;
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
.top {
    width: 100%;
    height: 13.875rem;
    background: url(/static/img/banner.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
}
.content {
    background: url(/static/img/bg.png) no-repeat;
    margin-top: -0.1rem;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    .idreGional {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 15.625rem;
      margin: 0 auto;
      padding-top: .4rem;
      span {
        display: block;
        text-align: center;
        height: 3.25rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .btnCover {
        position: absolute;
        top: 0.2rem;
        left: -0.2rem;
        width: 16.25rem;
        height: 3.75rem;
        background: rgba(150,150,150,0.85)
      }
  }
}
.forEign {
    margin-top: 1.75rem;
    color: #fff;
}
.creditTile {
    display: flex;
    display: -webkit-flex;
    font-family: PingFangSC-Semibold;
    font-size: 1.125rem;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.2rem;
}
.bottomInfo {
    padding: 0.625rem 1.875rem 2.5rem 1.875rem;
    margin: 0 auto;
    font-family: PingFangSC-Regular;
    font-size: 0.8125rem;
    color: #fff;
    div {
      margin-bottom: 0.5rem;
      display: flex;
      line-height: 1rem;
      label {
        padding-right: 0.5rem;
        padding-top: 0.1rem;
      }
      span {
        line-height: 1.2rem;
      }
  }
}
.alert_info {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 99999;
  p {
    width: 15rem;
    height: 16rem;
    // background: url(/static/img/alert_bg.png) no-repeat;
    background-size: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -7.5rem;
    margin-top: -8rem;
  }
  img {
    width: 15rem;
    height: 16rem;
    border-radius: 0.3125rem;
  }
  .alert_close {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: -0.875rem;
    top: 0;
    right: 0;
    background: url(/static/img/close_icon_1.png) no-repeat;
    color: #000;
    text-align: center;
    background-size: 1.5rem 1.5rem;
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
.list-hr {
  height: 2rem;
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
</style>
