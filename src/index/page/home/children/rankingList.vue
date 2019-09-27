<template>
  <!-- <div @touchmove.prevent> -->
  <div>
    <!-- 导航栏 -->
    <div @touchmove.prevent style="width:100%;background-image: linear-gradient(141deg, #F87056 0%, #F24984 19%, #BC43BF 100%);">
      <div v-show="isShareBtn" @click="getSharePage()" class="shareBtn"></div>
      <header>
        <ul>
          <li class="l t" @click="goBack()">
            <van-icon name="arrow-left" color="#fff" size="1.25rem" />
          </li>
          <!-- <li class="l" @click="goBack()"> -->
          <span>和包积分排行榜</span>
          <!-- </li> -->
          <!-- <li class="hr-1"></li> -->
        </ul>
      </header>
      <!-- 头部个人信息 -->
      <div class="headbox">
        <div class="rule">
          <div @click="ruleClick">活动规则</div>
        </div>
        <div class="information">
          <div class="informationLf">
            <div>当前总排名</div>
            <div class="sizemax">{{userinfo.rank}}</div>
          </div>
          <div class="headimg">
            <img src="/static/img/jifendabang/people.png" alt="">
            <div class="phone">{{userinfo.mobileNo.substr(0,3)+"****"+(userinfo.mobileNo.substr(userinfo.mobileNo.length-4,userinfo.mobileNo.length))}}</div>
          </div>
          <div class="informationLf">
            <div>累计积分</div>
            <div class="sizemax">{{userinfo.integralNum}}</div>
          </div>
        </div>
        <div class="consumebox">
          <span class="consume" @click.stop="consumeClick">
            <span>消费得积分</span>
            <img src="/static/img/jifendabang/03.png" class="righticon" alt="">
          </span>
        </div>
      </div>
    </div>
    <!-- 排行榜top100 -->

    <div class="top100">
      <div class="toplf"></div>
      <div class="topct">排行榜TOP100</div>
      <div class="toprt"></div>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <ul>
          <li>
            <div class="rankingInfo" v-for="(item,index) in toplist" :key="item.mobileNo">
              <div class="ranking" v-if="index>2">{{index+1}}</div>
              <div class="ranking" v-if="index<3">
                <img v-if="index==0" src="/static/img/jifendabang/top1.png" alt="" class="topimg">
                <img v-if="index==1" src="/static/img/jifendabang/top2.png" alt="" class="topimg">
                <img v-if="index==2" src="/static/img/jifendabang/top3.png" alt="" class="topimg">
              </div>
              <div class="headimg">
                <!-- <img class="peoplehead" :class="{minimg:index>=3}" src="/static/img/jifendabang/people.png" alt=""> -->
                <img class="peoplehead" :class="{minimg:index>=3}" src="/static/img/jifendabang/people.png" alt="">
              </div>
              <div class="rankphone" v-if="item.mobileNo" :class="{coloreee:index>=3}">{{item.mobileNo.substr(0,3)+"****"+item.mobileNo.substr(item.mobileNo.length-4,item.mobileNo.length)}}</div>
              <div class="rankscore">{{item.integralNum}}积分</div>
            </div>
            <div class="uploadmore">
              <div v-show="flag">上滑加载更多</div>
              <div v-show="!flag">已经到底了</div>
              <img v-show="flag" src="/static/img/jifendabang/load.png" alt="" class="loadimg">
            </div>
            <!-- 加载中 -->
            <div v-show="loadshow">
              <loading></loading>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 活动规则弹框 -->
    <van-dialog v-model="show" style="font-weight: bold;" title="活动规则" className="vandialo" :showConfirmButton="false">
      <div class="ruleframe" v-if="show">
        <div class="rulepad">
          <!-- <p class="firstp">活动规则</p> -->
          <p>1、本次活动仅限使用和包支付客户端8.3及以上版本的和包支付指定湖南绑卡用户（含电信、联通用户）参与，未绑卡用户可登录和包支付客户端，在“我的-银行卡”中按提示绑定银行卡后参加活动；</p>
          <p>2、同一手机号码、同一身份证号码均视为同一个用户。<span>当同一身份证用户有多个和包支付账户，有且只能有一个和包支付账户获得的积分可兑换成和包券；</span></p>
          <p>3、本次活动积分兑换和包券时间截止到活动结束，用户兑换的和包券为通用券，领取后于2019年12月30日24点失效，该和包券不支持转赠转让、分享、不可叠加使用，详情见和包支付客户端单张和包券使用细则；</p>
          <p>4、活动期间，若用户使用兑换和包券优惠的当笔交易发生退款，退款金额为用户实际支付金额，支付金额将原路退回。如当张和包券在有效期内，将退回可再次使用，如和包券已过有效期，该和包券将失效；</p>
          <p>5、本活动暂不支持170/171/149等虚拟号段及非标物联网卡注册和包支付账户参与；</p>
          <p>6、如被和包支付系统判定用户存在违规行为（包括但不限于虚假交易、恶意套取优惠等），中移电子商务有限公司有权取消用户参与活动资格，并保留追究用户法律责任的权利；</p>
          <p>7、用户对本活动内容或活动规则有疑问，可咨询10086；</p>
          <p>8、本活动与苹果等应用商店无关；</p>
        </div>
      </div>
    </van-dialog>
    <!-- 活动规则弹框关闭按钮 -->
    <img src="/static/img/jifendabang/close.png" alt="" class="closeimg" v-show="closeImg" @click="closeClick">
    <!-- 我的权益 -->
    <transition name="slide-fade">
      <div class="myequity" v-show="myequityshow" @click="goPage">
        <div class="quitybox">
          我的权益
          <img src="/static/img/jifendabang/01.png" alt="" class="icon">
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    fetchPoints,
    // GetDistance,
    isHebaoApp,
    shareNow,
    setLItem,
    animationProgress,
    getLItem,
    formatDate_1,
    closePage
  } from "@@/service/util";
  import attend from "@@/components/userAttend/attend.vue";
  // let that;
  import {
    Toast
  } from 'vant';
  import {
    mapState,
    mapMutations
  } from "vuex";
  import axios from "@@/plugins/rsa/axios";
  import sa from "sa-sdk-javascript";
  import BScroll from 'better-scroll';
  import Loading from "@@/components/loading/loading.vue";
  import {
    Dialog,
    Icon
  } from 'vant';
  import 'vant/lib/icon/local.css';
  export default {
    data() {
      return {
        show: false, //活动规则弹框  是否显示
        closeImg: false, //活动规则关闭按钮  是否显示
        myequityshow: true, //我的权益  是否显示
        mobileNumber: "", //用户手机号码
        toplist: [], //top100排行榜
        userinfo: {
          mobileNo: ""
        }, //用户个人信息
        page: 1, //页数
        pagenum: 10, //请求10条数据,进入页面会加载第一页数据
        flag: true, //上拉加载  是否还有数据
        loadshow: false, //是否显示加载动画
        isShareBtn: false //是否显示分享
      }
    },
    components: {
      Loading
    },
    computed: {
      ...mapState([
        "token",
        "tokenstatus",
        "latitude",
        "longitude",
        "cityname",
      ])
    },
    methods: {
      goBack() {
        // this.$router.go(-1);
        closePage();
        // window.history.go(-2);
      },
      consumeClick() {
        //神策
        sa.track("ImmediateUse", {
          contentName: "积分打榜点击消费得积分",
          userPhone: this.mobileNumber
        });
        this.$router.push({
          path: '/activityShop'
        });
      },
      ruleClick() {
        //神策
        sa.track("readActiveRule", {
          contentName: "积分打榜点击活动规则",
          userPhone: this.mobileNumber
        });
        this.show = true;
        this.closeImg = true;
      },
      closeClick() {
        this.show = false;
        this.closeImg = false;
      },
      initscroll() {
        var that = this;
        setTimeout(function() {
          // 初始化scroll
          that.$nextTick(() => {
            //$refs绑定元素
            if (!that.scroll) {
              that.scroll = new BScroll(that.$refs.wrapper, {
                //开启点击事件 默认为false
                probeType: 3,
                click: true,
                bounce: false, //回弹效果
                useTransition: false, //防止iphone微信滑动卡顿
                pullUpLoad: {
                  threshold: 0
                }
              });
              that.scroll.on('scrollStart', (pos) => { //滚动开始监听   touchEnd 手指离开
                that.myequityshow = false;
              });
              that.scroll.on('scrollEnd', (pos) => { //scrollEnd滚动结束监听
                that.myequityshow = true;
              });
              that.scroll.on('pullingUp', (pos) => { //scrollEnd上拉加载
                that.loadMore();
              });
            } else if (!that.$refs.wrapper) {
              return;
            } else {
              that.scroll.refresh();
            }
          });
        }, 50);
      },
      getdata() { //进入页面加载
        var that = this;
        that.loadshow = true;
        axios.post("userAttend", {
            mobileNo: that.mobileNumber //用户手机号码
          })
          .then(res => {
            that.loadshow = false;
            if (res.code == "0000") {
              that.toplist = res.data.rankList; //top100排行榜
              that.userinfo = res.data.tbUserRank; //用户个人信息
            } else {
              Toast.fail({
                duration: 2000, // 持续展示 toast
                message: "暂未查询到数据"
              });
            }
          });
      },
      loadMore() { //上拉加载
        var that = this;
        if (that.page == 10) {
          that.flag = false;
        }
        if (!that.flag || that.page == 10) { //没有数据(返回数据小于请求打的页数 || page超过了10页,限制最多只能请求100条数据)
          return;
        }
        that.loadshow = true; //显示加载动画
        that.page++;
        axios.post("integralRank", {
            currentPage: that.page, //页数
            pagNum: that.pagenum //数量
          })
          .then(res => {
            if (res.code == "0000") {
              if (res.data.length < that.pagenum) { //没有数据了
                that.flag = false;
              }
              that.loadshow = false; //关闭加载动画
              that.toplist.push(...res.data);
              this.scroll.finishPullUp(); //可以重新触发上拉加载
              that.scroll.refresh(); //重新计算高度
            } else {
              Toast.fail({
                duration: 2000, // 持续展示 toast
                message: "暂未查询到数据"
              });
              setTimeout(function() {
                that.loadshow = false; //关闭加载动画
                that.scroll.finishPullUp(); //可以重新触发上拉加载
                that.scroll.refresh(); //重新计算高度
              }, 30);
            }
          });
      },
      goPage() { //进入我的权益界面

        //神策
        sa.track("myequity", {
          contentName: "积分打榜进入我的权益页面",
          userPhone: this.mobileNumber
        });
        this.$router.push({
          path: '/myEquity'
        });
      },
      getSharePage(e) {
        let index_urls = {
          // shareUrl: window.location.href,
          shareUrl: "http://dx.10086.cn/_zMeAQ",
          wap_produce_reqData: "/gmeweb/miguhw_merc.xhtml?viewCode=json" // 单点登录
        };
        let shareTxt = "积分打榜火热开启，湖南和包支付指定用户线下消费得积分，积分可兑换和包券，速来参与吧！";
        shareNow(index_urls.shareUrl, shareTxt);
      },
      fun(){
        closePage();
      }
    },
    destroyed() {  //20190909页面销毁时取消监听
      window.removeEventListener('popstate', this.fun, false); //false阻止默认事件
    },
    mounted() {
			// 20190926加是否自动弹框
			if(this.$route.query.showrule=="true" || this.$route.query.showrule==true){
				this.ruleClick(); //弹框
			}
			
      if (window.history && window.history.pushState) { //20190909判断浏览器是否支持popstate
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.fun, false); //false阻止默认事件
      }
      if (isHebaoApp()) {
        this.isShareBtn = true;
      }
      this.mobileNumber = attend.userPhone;
      this.initscroll(); //初始化scroll滚动插件
      this.getdata(); //第一次进入页面得到所有数据
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@@/style/mixin";

  header {
    @include wh(100%, 3rem);
    background: none;
    // position: sticky;
    // z-index: 2000;
    // top: 0;
    // left: 0;

    ul {
      position: relative;
      text-align: center;

      .hr-1 {
        display: block;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        height: 0.1rem;
        -webkit-transform-origin: 0, 0;
        transform-origin: 0, 0;
        -webkit-transform: scaleY(0.5);
        -ms-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }

    .l {
      height: 100%;
      line-height: 3rem;
      font-size: 1.125rem;
      font-family: PingFangSC-Regular;
      color: #13252e;
      width: 3.5rem;
      padding-left: 1.125rem;
      padding-top: 0.2rem;
      text-align: center;
    }

    .t {
      color: #6c6c6c;
      font-size: 0.9375rem;
      height: 3rem;
      position: relative;
      float: left;
      text-align: left;
      // background-image: url(/static/img/back.png);
      // background-repeat: no-repeat;
      // background-position: 0.375rem 50%;
      // background-size: 1.1rem;
      @include space();
    }

    span {
      display: block;
      line-height: 3rem;
      padding-right: 3.5rem;
      font-family: "PingFangSC-Regular";
      color: #fff;
      font-size: 1.06rem;
      @include space();
    }

  }

  .headbox {
    width: 100%;
    padding-bottom: 5rem;
    background-color: none;
    // padding: 0 1rem;
    font-size: 0.8rem;
    padding-bottom: 1rem;

    .rule {
      width: 100%;
      height: 1.94rem;
      position: relative;

      div {
        width: 4.34rem;
        height: 100%;
        position: absolute;
        text-align: center;
        right: 0;
        top: 0;
        background: rgba(247, 226, 244, 0.35);
        border-radius: 31px 0 0 31px;
        font-family: "PingFangSC-Regular";
        line-height: 1.94rem;
        font-size: 0.75rem;
        color: #F3F3F3;
      }
    }

    .information {
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      height: 5rem;

      .informationLf {
        width: 6.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding-top: 1.3rem;
        font-family: "PingFangSC-Regular";
        color: #fff;
        font-size: 0.75rem;
        padding-bottom: 0.5rem;

        .sizemax {
          font-family: "DINAlternate-Bold";
          font-size: 1.19rem;
        }
      }

      .headimg {
        height: 100%;
        width: 6rem;
        text-align: center;
        overflow: visible;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        img {
          display: block;
          height: 3.375rem;
          width: 3.375rem;
          border-radius: 50%;
        }

        .phone {
          width: 100%;
          text-align: center;
          font-size: 0.94rem;
          color: #fff;
          font-family: "PingFangSC-Medium";
        }
      }
    }


    .consumebox {
      width: 100%;
      padding: 0 2rem;
      text-align: right;
      overflow: hidden;

      .consume {
        float: right;
        width: 5.375rem;
        height: 1.7rem;
        display: block;
        text-align: center;
        background-image: url(/static/img/jifendabang/02.png);
        background-repeat: no-repeat;
        background-size: 5.375rem 1.7rem;
        color: #8B572A;
        font-family: "PingFangSC-Regular";
        border-radius: 5px;
        letter-spacing: 1px;
        font-size: 0.7rem;
        position: relative;
        overflow: hidden;

        span {
          -webkit-transform-origin: 0, 0;
          transform-origin: 0, 0;
          -webkit-transform: scale(0.8);
          -ms-transform: scale(0.8);
          transform: scale(0.8);
          margin-right: 0.5rem;
          line-height: 2rem;
        }

        .righticon {
          position: absolute;
          width: 0.5rem;
          height: 0.5rem;
          top: 45%;
          right: 0.3rem;
        }
      }
    }
  }

  // TOP100
  .top100 {
    width: 100%;
    background-color: #fff;
    height: 2.63rem;
    display: flex;
    align-items: center;
    padding: 0 25%;
    justify-content: space-around;

    .toplf {
      width: 1.34rem;
      height: 0.055rem;
      transform: scaleX(-1);
      background-image: linear-gradient(90deg, #D145AA 0%, rgba(216, 216, 216, 0.00) 100%, #D8D8D8 100%);
      border-radius: 2px;
    }

    .topct {
      font-size: "PingFangSC-Semibold";
      font-size: 0.94rem;
      background-image: -webkit-linear-gradient(left, #F86A71, #B944C2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }

    .toprt {
      width: 1.34rem;
      height: 0.055rem;
      background-image: linear-gradient(90deg, #D245A7 0%, rgba(243, 243, 243, 0.00) 100%, #D8D8D8 100%);
      border-radius: 2px;
    }
  }

  // 滑动容器
  .wrapper {
    width: 100%;
    // height: 100%;
    padding: 0 1rem;
    position: absolute;
    top: 15rem;
    bottom: 0;
    left: 0;
    /*关键*/
    overflow: hidden;
    z-index: 1;
    background-color: #fff;
  }

  // 排行列表
  .rankingInfo {
    width: 100%;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ranking {
      width: 2rem;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.6rem;
      color: #DAAC72;
      font-size: 0.875rem;
      font-family: "PingFangSC-Medium";

      img {
        display: block;
        width: 1rem;
        height: 1.125rem;
      }
    }

    .headimg {
      width: 2.25rem;
      height: 2.25rem;
      margin-right: 2.5rem;
      position: relative;
      overflow: visible;
      display: flex;
      justify-content: center;
      align-items: center;

      .peoplehead {
        display: block;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
      }

      .topimg {
        position: absolute;
        top: -0.975rem;
        right: -0.475rem;
        width: 1.875rem;
        height: 1.875rem;
        z-index: 1;
      }
    }

    .rankphone {
      display: flex;
      flex: 1;
      justify-content: center;
      // margin-right: 3.5rem;
      font-family: "PingFangSC-Medium";
      color: #4A4A4A;
      font-size: 0.875rem;
    }

    .rankscore {
      width: 6rem;
      text-align: right;
      font-family: "PingFangSC-Medium";
      color: #5A6164;
      font-size: 0.875rem;
    }
  }

  // 规则弹框样式
  .ruleframe {
    padding: 0.5rem 1.5rem 2.5rem 1.5rem;

    .rulepad {
      max-height: 19rem;
      overflow-y: auto;

      .firstp {
        font-family: "PingFang-SC-Medium";
        color: #13252E;
        font-size: 1rem;
        font-weight: bold;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
      }

      p {
        line-height: 1.25rem;
        font-family: "PingFangSC-Regular";
        color: #13252e;
        font-size: 0.81rem;

        span {
          line-height: 1.25rem;
          font-family: "PingFangSC-Regular";
          font-size: 0.81rem;
          color: #c00;
        }
      }
    }
  }

  .closeimg {
    position: absolute;
    z-index: 9999;
    top: 45%;
    margin-top: 13rem;
    left: 50%;
    width: 2rem;
    height: 2rem;
    margin-left: -1rem;
  }

  // 我的权益
  .myequity {
    position: fixed;
    top: 50%;
    right: 0;
    // width: 1.5rem;
    // width: 5.06rem;  //样式2
    height: 2.125rem; //样式2
    line-height: 2.125rem; //样式2
    // padding-top: 0.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    // border-bottom-left-radius: 5px;
    border-bottom-left-radius: 34px; //样式2
    // border-top-left-radius: 5px;
    border-top-left-radius: 34px; //样式2
    z-index: 999;

    .quitybox {
      width: 100%;
      height: 100%;
      padding: 0 1.7rem 0 0.6rem;
      position: relative;
      color: #fff;
      font-family: "PingFangSC-Medium";
      font-size: 0.81rem;
      text-align: center;
    }

    img {
      position: absolute;
      display: block;
      top: 50%;
      margin-top: -0.4rem;
      right: 0.6rem;
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  .coloreee {
    color: #5A6164 !important;
  }

  .minimg {
    width: 1.815rem !important;
    height: 1.815rem !important;
  }

  // 我的权益动画离开效果
  .slide-fade-enter-active {
    transition: all .2s linear;
  }

  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active 用于 2.1.8 以下版本 */
    {
    // transform: translateX(1.5rem);
    transform: translateX(5rem); //样式2
    opacity: 0;
  }

  .uploadmore {
    line-height: 1.5rem;
    position: relative;

    div {
      width: 10rem;
      font-family: "PingFangSC-Regular";
      color: #AEAFAF;
      font-size: 0.75rem;
      margin: 0 auto;
      text-align: center;
      padding-left: 1rem;
    }

    .loadimg {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -0.3rem;
      margin-left: -3rem;
      width: 0.73rem;
      height: 0.73rem;
    }
  }

  .shareBtn {
    width: 1.05rem;
    height: 1.05rem;
    background: url(/static/img/share_icon1.png) top no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 0.8rem;
    right: 1.2rem;
    z-index: 9999999999;
  }
</style>
