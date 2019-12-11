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
      <scroll>
        <section class="s_4">
          <div class="title">
            <p>{{drawData.drawNm || drawList.gmeNm}}
              <span class="supTitle" v-show="isShowT">（活动日：逢6/周六）</span>
            </p>
            <div class="hr-2"></div>
          </div>
        <div class="content">
          <div class="content-info">
						 <!-- <div class="list-info">活动时间：<span v-show="drawList.grpDt.length>=1" v-for="(item,index) in drawList.grpDt">{{item.attDtStr}}</span>{{drawList.effDt}}到{{drawList.expDt}}</div> -->
						<div class="list-info" v-if="drawList.grpDt && drawList.grpDt.length<1">活动时间：<span>{{drawList.effDt}}</span> 到 <span>{{drawList.expDt}}</span></div>
						<div class="list-info" v-else>活动时间：<span v-for="ite in drawList.grpDt">{{ite.attDtStr}}</span></div>
						<div class="list-info" >参与时间：<span v-show="drawList.grpWek.length>=1" v-for="(item,index) in drawList.grpWek">{{item.attWek}}</span><span>{{drawList.attEffTm}}</span> 到 <span>{{drawList.attExpTm}}</span></div>
            <div class="list-info">
              <span class="left">参与条件：</span>
              <ul class="right">
                <li>1. {{ruleFlgText}}</li>
                <li>2. {{ruleFlgText2}}</li>
                <li v-for="(item,index) in drawList.provRec">3. 活动省份：{{item.provNm}}
                  <span v-show="isShowT">（仅限在归属地市参与）</span>
                </li>
                <li>4. 参与用户范围：{{usrTyp}}</li>
              </ul>
            </div>
            <div class="list-info">活动方式：{{ruleText}}</div>
            <table class="deal-menu">
              <tbody>
                <tr>
                    <th class="name">订单金额区间（元）</th>
                    <th class="price">{{ruleText}}</th>
                    <th class="amount">最高享受</th>
                </tr>
                <tr>
                    <td class="price">{{drawData.ruleAmtMin}}-{{drawData.ruleAmtMax}}</td>
                    <td class="amount">{{mjrTypText}}</td>
                    <td class="subtotal">{{drawData.drawAmtMax}}</td>
                </tr>
              </tbody>
            </table>
            <div class="list-info">活动规则：{{drawList.gmeRule}}</div>
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
      isShowT: false,
      drawList: [],
      drawData: [],
      ruleFlgText: '',
      ruleFlgText2: '',
      usrTyp: '',
      ruleText: '',
      mjrTypText: ''
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
      // axios.post("getRecInfoDetail", {
      //   gmeId: "19080701",
      //   mbl_no: "17674002291",
      //   merc_id: "888073113001851",
      // }).then(res => {
        let params = this.$route.query.params;
      axios.post("getRecInfoDetail", params).then(res => {
        this.drawList = res.data;
        if((this.drawList.gmeRec||1)==1){  //满送
          for(let i = 0; this.drawList.drawRec.length > i; i++) {
            this.drawData = this.drawList.drawRec[i]
          }
        }else{   //满减
          for(let i = 0; this.drawList.gmeRec.length > i; i++) {
            this.drawData = this.drawList.gmeRec[i]
          }
        }
        // 参与条件1
        if(this.drawList.usrFlg2 == '1') {
          this.ruleFlgText = "全网用户"
        }else {
          this.ruleFlgText = "中国移动用户"
        }
        // 参与条件2
        if(this.drawList.usrFlg4 == '1') {
          this.ruleFlgText2 = "用户需为首绑卡用户"
        }else {
          this.ruleFlgText2 = "用户已绑定银行卡"
        }
        // 参与范围
        if(this.drawList.userTyp == '1') {
          this.usrTyp = "客户端新老用户"
        }else if(this.drawList.userTyp == '2'){
          this.usrTyp = "客户端老用户"
        }else {
          this.usrTyp = "客户端新用户"
        }
        // 活动方式
        if(this.drawList.drawRuleTyp == '1') {
          this.ruleText = "满减"
        }else if(this.drawList.drawRuleTyp == '0'){
          this.ruleText = "折扣"
        }else {
          this.ruleText = "直减"
        }

        // 满送方式
        if(this.drawData.drawAmtTyp == "0") {
          this.mjrTypText = "话费"
        } else if(this.drawData.drawAmtTyp == "2"){
          this.mjrTypText = "和包劵"
        } else if(this.drawData.drawAmtTyp == "3"){
          this.mjrTypText = "商户劵"
        } else if(this.drawData.drawAmtTyp == "4"){
          this.mjrTypText = "实物"
        } else if(this.drawData.drawAmtTyp == "5"){
          this.mjrTypText = "话费"
        } else if(this.drawData.drawAmtTyp == "6"){
          this.mjrTypText = "流量"
        } else if(this.drawData.drawAmtTyp == "7"){
          this.mjrTypText = "实物"
        } else if(this.drawData.drawAmtTyp == "8"){
          this.mjrTypText = "话费劵"
        } else if(this.drawData.drawAmtTyp == "9"){
          this.mjrTypText = "流量劵"
        } else if(this.drawData.drawAmtTyp == "10"){
          this.mjrTypText = "现金红包"
        } else if(this.drawData.drawAmtTyp == "11"){
          this.mjrTypText = "累计流量劵"
        };

        //满减方式
        if((this.drawList.gmeRec||1)!=1){  //有gmeRec这个数组=满减
          if(res.data.mjrTyp == "1") {
          this.mjrTypText = "随机立减"
        } else {
          this.mjrTypText = "普通立减"
        }
        }
        // console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
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
.s_4 {
  padding: 0 0.9375rem;
  width: 100%;
  background: #fff;
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

.title {
  position: relative;
  height: 2.5rem;
  font-family: PingFangSC-Regular;
  font-size: 0.9375rem;
  color: #13252e;
  line-height: 2.5rem;
  .supTitle {
    font-size: .7rem;
  }
}
.content {
  .content-info {
    position: relative;
    padding-top: .5rem;
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
      table{
          font-size: 0.8125rem;
          color: #888;
          border: 0.0625rem solid #888;
          margin: 0.3rem auto;
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
  }
}
</style>
