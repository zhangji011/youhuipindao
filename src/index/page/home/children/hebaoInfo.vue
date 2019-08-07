<template>
  <div class="content-wrapper">
    <header class="s_1">
      <ul>
        <!-- <router-link tag="li" class="l t" to="/shopDetail"></router-link> -->
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>活动规则详情</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </header>

    <div class="home">
      <scroll
        >
      <section class="s_4">
        
        <div class="title">
          <p>{{data.gmeNm}}
            <span class="supTitle" v-show="isShowT">（活动日：逢6/周六）</span>
          </p>
          <div class="hr-2"></div>
        </div>
        <div class="content">
          <div class="content-info">
            <div class="list-info">活动时间：<span v-show="data.grpDt.length>=1" v-for="(item,index) in data.grpDt">{{item.attDtStr}}</span>{{data.effDt}}到{{data.expDt}}</div>
            <div class="list-info">参与时间：<span v-show="data.grpWek.length>=1" v-for="(item,index) in data.grpWek">{{item.attWek}}</span>{{data.attEffTm}}到{{data.attExpTm}}</div>
            <!-- <div class="list-info" v-for="(item,index) in data.provRec">活动省份：{{item.provNm}}</div>
            <div class="list-info">参与用户范围：{{usrTyp}}</div> -->
            <div class="list-info">
              <span class="left">参与条件：</span>
              <ul class="right">
                <li>1. {{ruleFlgText}}</li>
                <li>2. {{ruleFlgText2}}</li>
                <li v-for="(item,index) in data.provRec">3. 活动省份：{{item.provNm}}
                  <span v-show="isShowT">（仅限在归属地市参与）</span>
                </li>
                <li>4. 参与用户范围：{{usrTyp}}</li>
              </ul>
            </div>
            <div class="list-info">活动方式：{{ruleText}}</div>
            <table class="deal-menu" v-for="(item,index) in data.gmeRec">
              <tbody>
                <tr>
                    <th class="name">订单金额区间（元）</th>
                    <th class="price">满减</th>
                    <th class="amount">最高享受</th>
                </tr>
                <tr>
                    <td class="price">{{item.ruleAmtMin}}-{{item.ruleAmtMax}}</td>
                    <td class="amount"> {{mjrTypText}}</td>
                    <td class="subtotal">{{item.drawAmtMax}}</td>
                </tr>
              </tbody>
            </table>
            <div class="list-info">活动规则：{{data.gmeRule}}
              <!-- <span v-show="isShowT">（满减活动是逢6和节假日（周六，6日、16日、26日，元旦3天、春节7天）上午7点-22点）。</span> -->
            </div>
            <div class="list-info">注：活动具体规则请咨询10086及查看店内海报，参与方式详情咨询门店店员。</div>
              <div class="list-hr"></div>
          </div>
        </div>
      </section>
    
      </scroll>
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
export default {
  data() {
    return {
      data: [],
      ruleText: "",
      usrTyp: "",
      isShowT: false,
      ruleFlgText: "",
      ruleFlgText2: "",
      mjrTypText: ""
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
    this.init();
    // this.scroll = new Bscroll(this.$refs.wrapper);
    // 隐藏进度条
    // document.getElementById("pg").style.display="none";
  },
  created() {},

  methods: {
    init() {
      let params = this.$route.query.params;
      // console.log(参数接收,params);
      axios.post("getRecInfoDetail", params).then(res => {
          if (res.code === "0") {
            this.data = res.data;
            this.rule = res.data.gmeRec[0].drawRuleTyp;
            this.userTyp = res.data.userTyp;
            this.usrFlg = res.data.usrFlg2;
            this.usrFlg2 = res.data.usrFlg4;
            this.mjrTyp = res.data.mjrTyp;
            this.gmeId = res.data.gmeId;
            // console.log(this.data);
            if(this.gmeId == "18122802") {
              this.isShowT = true;
            } else if (this.gmeId == "18122810") {
              this.isShowT = true;
            } else if (this.gmeId == "18122805") {
              this.isShowT = true;
            } else if (this.gmeId == "18122803") {
              this.isShowT = true;
            } else if (this.gmeId == "18122720") {
              this.isShowT = true;
            } else if (this.gmeId == "18122719") {
              this.isShowT = true;
            } else if (this.gmeId == "18122715") {
              this.isShowT = true;
            } else if (this.gmeId == "18122417") {
              this.isShowT = true;
            } else if (this.gmeId == "18122717") {
              this.isShowT = true;
            } else if (this.gmeId == "18122714") {
              this.isShowT = true;
            } else if (this.gmeId == "18122718") {
              this.isShowT = true;
            };
            if(this.rule == "1") {
              this.ruleText = "满减"
            } else if(this.rule == "0") {
              this.ruleText = "折扣"
            } else {
              this.ruleText = "直减"
            };
            if(this.userTyp == "1") {
              this.usrTyp = "客户端新老用户"
            } else if(this.userTyp == "2") {
              this.usrTyp = "客户端老用户"
            } else {
              this.usrTyp = "客户端新用户"
            };
            if(this.usrFlg == "1") {
              this.ruleFlgText = "全网用户"
            } else {
              this.ruleFlgText = "中国移动用户"
            };
            if(this.usrFlg2 == "1") {
              this.ruleFlgText2 = "用户需为首绑卡用户"
            } else {
              this.ruleFlgText2 = "用户已绑定银行卡"
            };
            if(this.mjrTyp == "1") {
              this.mjrTypText = "随机立减"
            } else {
              this.mjrTypText = "普通立减"
            };
          }
      });
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

</style>

<style lang="scss" scoped>
@import "~@@/style/mixin";

.s_1 {
  @include wh(100%, 3rem);
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
.s_2,.s_3,.s_4 {
  padding: 0 0.9375rem;
  width: 100%;
  background: #fff;
}
ul {
  height: 100%;
  position: relative;
}
.content {
  .content-info {
    position: relative;
    padding-top: .5rem;
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
        line-height: 2.8125rem;
      }
      .list-info {
        font-family: PingFangSC-Regular;
        font-size: 0.8125rem;
        color: #7e7e7e;
        line-height: 1.75rem;
        .left {
          float: left;
        }
        .right {
          float: left;
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
      line-height: 4.5rem;
      color: #ed196c;
      font-weight: bold;
      font-size: 1rem;
      .par {
        font-size: 1.875rem;
        font-family: PingFangSC-Semibold;
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
.title {
  position: relative;
  height: 2.5rem;
  font-family: PingFangSC-Regular;
  font-size: 0.9375rem;
  color: #13252e;
  line-height: 2.5rem;
}
.supTitle {
  font-size: .7rem;
}
table{
    font-size: 0.8125rem;
    color: #888;
    border: 0.0625rem solid #888;
    margin: 0.3rem 0 0.3rem 0;
    text-align: center;
    border-collapse:collapse;
}
th, td{
    padding:0 0.5rem;
    border: 0.0625rem solid #888;
}
.deal-menu th{
    line-height: 2rem;
    font-weight: 400;
}
.deal-menu td{
    line-height: 2rem;
    font-weight: 400;
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
