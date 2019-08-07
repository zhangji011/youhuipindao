<template>
  <div @touchmove.prevent>
    <div style="width: 100%;height: 12.4rem;background-image: linear-gradient(141deg, #F87056 0%, #F24984 19%, #BC43BF 100%);">
      <div v-show="isShareBtn" @click="getSharePage()" class="shareBtn"></div>
      <header>
        <ul>
          <li class="l t" @click="goBack()">
            <van-icon name="arrow-left" color="#fff" size="1.25rem" />
          </li>
          <!-- <li class="l" @click="goBack()"> -->
          <span>我的权益</span>
          <!-- </li> -->
          <!-- <li class="hr-1"></li> -->
        </ul>
      </header>
      <!-- 用户头、号码 -->
      <div class="peopleinfo">
        <img class="headimg" src="/static/img/jifendabang/people.png" alt="">
        <div class="phone" v-if="userinfo">{{userinfo.mobileNo.substr(0,3)+"****"+userinfo.mobileNo.substr(userinfo.mobileNo.length-4,userinfo.mobileNo.length)}}</div>
        <div class="exchange" @click="exchangeClick" v-if="userinfo.remainNum>0">
          <div class="exchangeson">
            <img src="/static/img/jifendabang/integral.png" alt="">
            积分兑和包卷
          </div>
        </div>
        <div class="exchange" v-if="userinfo.remainNum<1">
          <div class="exchangeson">
            <img src="/static/img/jifendabang/integral1.png" alt="">
            积分兑和包卷
          </div>
        </div>
      </div>
      <!-- 积分展示 -->
      <div class="integral">
        <div class="integrallf">
          <div class="score">{{userinfo.integralNum}}</div>
          <div class="describe">累计积分</div>
        </div>
        <div class="integralct">
          <div></div>
        </div>
        <div class="integrallf">
          <div class="score">{{userinfo.remainNum}}</div>
          <div class="describe">可兑劵积分</div>
        </div>
      </div>
    </div>
    <!-- tab栏 -->
    <van-tabs v-model="active" animated @click="activeIndex">
      <van-tab v-for="(item,ide) in tablist" :title="item">
      </van-tab>
    </van-tabs>
    <!-- <div class="tabhead">
			<div v-for="(item,ide) in tablist" @click="activeIndex(ide)" :class="{activetext:ide==showide}">
				{{item}}
				<div class="hr-tab" :class="{activeide:ide==showide}"></div>
			</div>
		</div> -->
    <!-- 滑动区域 -->
    <div class="wrapper" ref="wrapper">
      <div class="content" @touchstart="tabulstart" @touchend="tabulend">
        <ul class="tabul">
          <!-- 内容1 -->
          <li class="tabli1" v-show="0==showide && tabLi1.length==0 && nodata">
            <div class="nodata">
              <img src="/static/img/jifendabang/001.png" alt="">
              <div>暂无和包券，快去线下商户消费吧～</div>
            </div>
          </li>
          <li class="tabli1" v-if="0==showide && tabLi1.length>0">
            <div class="available" v-for="item in tabLi1">
              <div class="lilf">
                <div class="fixedlf"></div>
                <div class="fixedrt">
                  <div v-for="item in 15"></div>
                </div>
                <div class="textct">
                  <div class="span1">¥</div>{{item.curAcBal}}
                </div>
              </div>
              <div class="lirt">
                <div class="discount">积分打榜活动优惠券
                  <div class="count">
                    <div class="countsmall">可叠加</div>
                  </div>
                </div>
                <div class="describe">
                  <div class="time">有效期至{{item.expDt.substr(0,4)+"-"+item.expDt.substr(4,2)+"-"+item.expDt.substr(6,2)}}</div>
                  <div class="threshold">无门槛使用</div>
                  <div class="use" @click="goPage">立即使用</div>
                </div>
              </div>
            </div>
          </li>
          <!-- 内容2 -->
          <li class="tabli1" v-show="1==showide && tabLi2.length==0 && nodata">
            <div class="nodata">
              <img src="/static/img/jifendabang/001.png" alt="">
              <div>暂无已用/过期和包券</div>
            </div>
          </li>
          <li class="tabli1" v-if="1==showide && tabLi2.length>0">
            <div class="available" v-for="item in tabLi2">
              <div class="lilf" style="background:#D8D8D8;">
                <div class="fixedlf"></div>
                <div class="fixedrt">
                  <div v-for="item in 15"></div>
                </div>
                <div class="textct">
                  <div class="span1">¥</div>{{item.curAcBal}}
                </div>
              </div>
              <div class="lirt">
                <div class="discount" style="color: #888888;">积分打榜活动优惠券
                  <div class="count" style="background: #DBDBDB;">
                    <div class="countsmall" style="color: #fff;">可叠加</div>
                  </div>
                </div>
                <div class="describe">
                  <div class="time">有效期至{{item.expDt.substr(0,4)+"-"+item.expDt.substr(4,2)+"-"+item.expDt.substr(6,2)}}</div>
                  <div class="threshold">无门槛使用</div>
                  <div class="use" style="color: #AEAFAF;border: 1px solid #AEAFAF;">立即使用</div>
                </div>
              </div>
            </div>
          </li>
          <!-- 内容3 -->
          <li class="tabli1" v-show="2==showide && tabLi3.length==0 && nodata">
            <div class="nodata">
              <img src="/static/img/jifendabang/002.png" alt="">
              <div>暂无消费明细</div>
            </div>
          </li>
          <li class="tabli" v-if="2==showide && tabLi3.length>0">
            <div class="list" v-for="item in tabLi3">
              <div class="listlfs">{{item.mercName}}</div>
              <div class="listcts">{{formatDate(item.tradeTime)}}</div>
            </div>
          </li>
          <!-- 内容4 -->
          <li class="tabli1" v-show="3==showide && tabLi4.length==0 && nodata">
            <div class="nodata">
              <img src="/static/img/jifendabang/003.png" alt="">
              <div>暂无兑券明细</div>
            </div>
          </li>
          <li class="tabli" v-if="3==showide && tabLi4.length>0">
            <div class="list" v-for="item in tabLi4">
              <div class="listlf">{{item.expendNum}}积分</div>
              <div class="listct">{{formatDate(item.exchangeCouponTime)}}</div>
              <div class="listrt">{{item.issAmt}}元和包劵</div>
            </div>
          </li>
          <!-- 底部显示内容 -->
          <li class="uploadmore">
            <div v-show="flag">上滑加载更多</div>
            <div style="padding-bottom: 1rem;" v-show="!flag && (tabLi1.length!=0 || tabLi2.length!=0 || tabLi3.length!=0 || tabLi4.length!=0)">已经到底了</div>
            <img v-show="flag" src="/static/img/jifendabang/load.png" alt="" class="loadimg">
          </li>
          <!-- 加载中 -->
          <li v-show="loadshow">
            <loading></loading>
          </li>
        </ul>
      </div>
    </div>
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
    formatDate_1
  } from "@@/service/util";
  import attend from "@@/components/userAttend/attend.vue";
  import {
    mapState,
    mapMutations
  } from "vuex";
  import axios from "@@/plugins/rsa/axios";
  import sa from "sa-sdk-javascript";
  import BScroll from 'better-scroll';
  import Loading from "@@/components/loading/loading.vue";
  import {
    Toast,
    Dialog,
    Icon,
    Tab,
    Tabs
  } from 'vant';
  import 'vant/lib/icon/local.css';
  export default {
    data() {
      return {
        userinfo: {
          mobileNo: ""
        }, //用户个人信息
        tablist: ["可用和包劵", "已用和包劵", "消费明细", "兑劵明细"],
        showide: 0, //默认显示第一个
        moveStart: 0, //滑动开始位置
        moveEnd: 0, //滑动结束位置
        flag: true, //是否还有数据
        loadshow: false, //加载动画
        active: 0, //展示内容下标
        tabLi1: [], //选项卡1数据
        tabLi2: [], //选项卡2数据
        tabLi3: [], //选项卡3数据
        tabLi4: [], //选项卡4数据
        page: 1, //页数
        pagenum: 10, //请求10条数据
        nodata: false, //页面第一次请求有没有数据
        morenodata: false, //上拉加载时候还有数据
        amount: 0, //可兑换成的金额
        mobileNumber: "" ,//手机号码
        isShareBtn:false  //分享按钮
      }
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
    components: {
      Loading
    },
    mounted() {
      if(isHebaoApp()) {
        this.isShareBtn = true;
      }
      // alert("手机号"+this.token.productNo);
      this.mobileNumber = attend.userPhone;
      this.initscroll();
      this.getUserinfo(); //获取个人信息
      this.getData(); //tab栏数据
    },
    watch: {
      'active': function(newVal) {
        this.scroll.finishPullUp(); //可以重新触发上拉加载
        this.scroll.refresh();
      }
    },
    methods: {
      goBack() {
        // this.$router.go(-1);
        window.history.go(-1);
      },
      activeIndex(name, title) { //点击切换tab栏
        if (name != this.showide) { //点击了其他的tab选项
          this.tabLi1 = [];
          this.tabLi2 = [];
          this.tabLi3 = [];
          this.tabLi4 = [];
        }
        this.showide = name;
        this.getData();
      },
      tabulstart(e) {
        this.moveStart = e.changedTouches[0].clientX; //滑动起始位置
      },
      tabulend(e) { //滑动切换tab栏
        var that = this;
        this.moveEnd = e.changedTouches[0].clientX; //滑动结束距离
        if (this.moveEnd - this.moveStart > 80 && this.showide > 0) {
          this.showide--;
          that.active = that.showide;
          that.tabLi1 = [];
          that.tabLi2 = [];
          that.tabLi3 = [];
          that.tabLi4 = [];
          that.getData();
        }
        if (this.moveEnd - this.moveStart < -80 && this.showide < 3) {
          this.showide++;
          that.active = that.showide;
          that.tabLi1 = [];
          that.tabLi2 = [];
          that.tabLi3 = [];
          that.tabLi4 = [];
          that.getData();
        }
      },
      getUserinfo() { //进入页面加载
        var that = this;
        axios.post("userAttend", {
            mobileNo: that.mobileNumber //用户手机号码
          })
          .then(res => {
            if (res.code == "0000") {
              that.userinfo = res.data.tbUserRank; //用户个人信息
            } else {
              Toast.fail({
                duration: 2000, // 持续展示 toast
                message: "暂未查询到数据"
              });
            }
          });
      },
      exchangeClick() {
        var that = this;
        axios.post("queryAmount", {
            mobileNo: that.mobileNumber //用户手机号码
          })
          .then(res => {
            if (res.code == "0000") {
              that.amount = res.amount;
              Dialog.confirm({
                title: '提示',
                message: '是否将当前所有可兑劵积分兑换成' + that.amount.substr(0, that.amount.length - 3) + '元和包劵?',
                cancelButtonText: "否",
                confirmButtonText: "是",
                confirmButtonColor: "#C99835",
                closeOnPopstate: "true"
              }).then(() => {
                //神策
                sa.track("exchangeCoupon", {
                  contentName: "积分兑换和包劵",
                  userPhone: that.mobileNumber,
                  "money":that.amount.substr(0, that.amount.length - 3)+"元"
                });
                axios.post("exchangeCoupon", { //点击确定兑换和包劵
                  mobileNo: that.mobileNumber
                }).then(res => {
                  if (res.code == "0000") {
                    Toast.success({
                      duration: 2000, // 持续展示 toast
                      message: "积分兑换和包劵成功",
                    });
                    //更新可用和包劵,用户信息
                    that.active = 0;
                    that.tabLi1 = [];
                    that.tabLi2 = [];
                    that.tabLi3 = [];
                    that.tabLi4 = [];
                    that.getData();
                    that.getUserinfo();
                  } else if (res.code == "8003") {
                    Toast.fail({
                      duration: 2000, // 持续展示 toast
                      message: "本月可兑换积分已达到上限,请下月再试"
                    });
                  } else if (res.code == "MKM51404") {
                    Toast.fail({
                      duration: 2000, // 持续展示 toast
                      message: "同一身份证下已有其他账号参与活动噢~"
                    });
                  } else if (res.code == "MKM41248" || res.code == "URM20019" || res.code == "URM80009" ||
                    res.code == "8009" || res.code == "999999" || res.code == "999998" || res.code ==
                    "999997") {
                    Toast.fail({
                      duration: 2000, // 持续展示 toast
                      message: "积分兑换和包劵失败~"
                    });
                  } else {
                    Toast.fail({
                      duration: 2000, // 持续展示 toast
                      message: "积分兑换和包劵失败"
                    });
                  }
                });
              }).catch(() => {
                // on cancel
              });
            }
          });
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
                bounce: true, //回弹效果
                // scrollX:true,  //X轴滑动
                useTransition: false, //防止iphone微信滑动卡顿
                pullUpLoad: {
                  threshold: -30
                }
              });
              that.scroll.on('pullingUp', (pos) => { //scrollEnd上拉加载
                if (that.active == 2 || that.active == 3) { //消费明细，兑劵明细有分页
                  that.loadMore();
                }
              });
            } else if (!that.$refs.wrapper) {
              return;
            } else {
              that.scroll.refresh();
            }
          });
        }, 50);
      },
      getData() { //点击tab栏头部请求一次   滑动tab栏调用
        var that = this;
        // that.scroll.finishPullUp();  //可以重新触发上拉加载
        // active 下标,这里当做区分请求数据的类型
        let url; //请求地址
        let params = {}; //请求地址
        that.page = 1;
        if (that.active == 1) {
          url = "ZJqueryCoupon"; //查劵接口 查询状态（A:未使用;U:已用）
          params = {
            mobileNo: that.mobileNumber,
            bonSts: "U"
          }
          if (that.tabLi2.length != 0) { //有数据就不重复发送
            return;
          }
          sa.track("alreadyCoupon", {
          contentName: "查看已用和包券",
          userPhone: that.mobileNumber
        });
        } else if (that.active == 2) {
          url = "queryIntegralDetail"; //消费明细
          params = {
            mobileNo: that.mobileNumber,
            currentPage: 1,
            pagNum: that.pagenum
          }
          if (that.tabLi3.length != 0) { //有数据就不重复发送
            return;
          }
          sa.track("consumptionDetails", {
          contentName: "查户消费明细",
          userPhone: that.mobileNumber
        });
        } else if (that.active == 3) {
          url = "queryExchangeDetail"; //兑换明细
          params = {
            mobileNo: that.mobileNumber,
            currentPage: 1,
            pagNum: that.pagenum
          }
          if (that.tabLi4.length != 0) { //有数据就不重复发送
            return;
          }
          sa.track("exchangeDetails", {
          contentName: "查看兑劵明细",
          userPhone: that.mobileNumber
        });
        } else { //默认请求选项卡1的数据
          url = "ZJqueryCoupon"; //查劵接口 查询状态（A:未使用;U:已用）
          params = {
            mobileNo: that.mobileNumber,
            bonSts: "A"
          }
          if (that.tabLi1.length != 0) { //有数据就不重复发送
            return;
          }
          sa.track("availableCoupon", {
          contentName: "查看可用和包劵",
          userPhone: that.mobileNumber
          });
        }
        that.morenodata = true; //重置上拉加载状态  有数据
        that.flag = false;
        that.nodata = false;
        that.loadshow = true;
        axios.post(url, params).then(res => {
          if (res.code == "0000") {
            that.loadshow = false;
            setTimeout(function() {
              that.scroll.scrollTo(0, 0, 0); //回到顶部
              that.scroll.refresh(); //重新计算高度
            }, 50);
            if (that.active == 2 || that.active == 3) {
              if (!res.data || res.data.length == 0) { //没有数据
                that.nodata = true;
                return;
              }
            }
            if (that.active == 0 || that.active == 1) {
              if (!res.data || res.data.bonRec == null || res.data.bonRec.length == 0) {
                that.nodata = true;
                return;
              }
            }
            if (that.active == 0) {
              that.tabLi1 = res.data.bonRec || [];
              this.flag = false;
            } else if (that.active == 1) {
              that.tabLi2 = res.data.bonRec || [];
              this.flag = false;
            } else if (that.active == 2) {
              that.tabLi3 = res.data || [];
              if (res.data.length < that.pagenum) {
                this.flag = false;
              } else {
                this.flag = true;
              }
            } else if (that.active == 3) {
              that.tabLi4 = res.data || [];
              if (res.data.length < that.pagenum) {
                this.flag = false;
              } else {
                this.flag = true;
              }
            }

          } else {
            that.loadshow = false;
            that.nodata = true;
            Toast.fail({
              duration: 2000, // 持续展示 toast
              message: "暂未查询到数据"
            });
          }
        });
      },
      loadMore() {
        var that = this;
        if (!that.morenodata) {
          return;
        }
        that.page++;
        var url;
        var params;
        if (that.active == 2) {
          url = "queryIntegralDetail"; //消费明细
          params = {
            mobileNo: that.mobileNumber,
            currentPage: that.page,
            pagNum: that.pagenum
          }
        } else if (that.active == 3) {
          url = "queryExchangeDetail"; //兑换明细
          params = {
            mobileNo: that.mobileNumber,
            currentPage: that.page,
            pagNum: that.pagenum
          }
        }
        that.loadshow = true;
        axios.post(url, params).then(res => {
          if (res.code == "0000") {
            if (that.pagenum > res.data) {
              that.morenodata = false; //加载更多没有数据了
              that.flag = false;
            }
            if (that.active == 2) {
              that.tabLi3 = that.tabLi3.concat(res.data);
            } else if (that.active == 3) {
              that.tabLi4 = that.tabLi4.concat(res.data);
            }
            // console.log(res.data);
          } else {
            Toast.fail({
              duration: 2000, // 持续展示 toast
              message: "暂未查询到数据"
            });
          }
          that.loadshow = false;
          this.scroll.finishPullUp(); //可以重新触发上拉加载
          this.scroll.refresh(); //重新计算高度
        });
      },
      formatDate(now) {
        var date = new Date(now) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日 '
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return M + D + h + m
      },
      goPage() {
        sa.track("ImmediateUse", {
          contentName: "积分打榜点击立即使用和包劵",
          userPhone: this.mobileNumber
        });
        this.$router.push({
          path: '/activityShop'
        });
      },
      getSharePage(e) {
        let index_urls = {
          // shareUrl: window.location.href,
          shareUrl: "http://dx.10086.cn/_zMeAQ",
          wap_produce_reqData: "/gmeweb/miguhw_merc.xhtml?viewCode=json"// 单点登录
        };
        let shareTxt = "积分打榜火热开启，湖南和包支付指定用户线下消费得积分，积分可兑换和包券，速来参与吧！";
        shareNow(index_urls.shareUrl, shareTxt);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@@/style/mixin";

  .wrapper {
    width: 100%;
    position: absolute;
    top: 15.34rem;
    bottom: 0;
    left: 0;
    /*关键*/
    overflow: hidden;
    // overflow: auto;
    z-index: 1;
    background-color: #fff;
  }

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

  .peopleinfo {
    width: 100%;
    height: 3.5rem;
    padding-top: 0.5rem;
    position: relative;
    padding-left: 1.125rem;

    .headimg {
      display: block;
      width: 3rem;
      height: 3rem;
      float: left;
    }

    .phone {
      line-height: 3rem;
      padding-left: 1rem;
      font-family: "PingFangSC-Medium";
      font-size: 0.94rem;
      color: #fff;
      float: left;
    }

    .exchange {
      position: absolute;
      width: 7rem;
      height: 1.94rem;
      right: 0;
      top: 50%;
      margin-top: -0.97rem;
      background: rgba(247, 226, 244, 0.35);
      border-radius: 31px 0 0 31px;
      line-height: 1.94rem;
      font-family: "PingFangSC-Regular";

      .exchangeson {
        position: relative;
        padding-left: 1.2rem;
        text-align: center;
        line-height: 1.94rem;
        font-size: 0.75rem;
        color: #f3f3f3;

        img {
          position: absolute;
          display: block;
          width: 1.15rem;
          height: 1.15rem;
          left: 0.4rem;
          top: 50%;
          margin-top: -0.58rem;
        }
      }
    }
  }

  .integral {
    width: 100%;
    height: 6rem;
    padding: 0 1.125rem;
    padding-top: 2rem;

    .integrallf {
      float: left;
      width: 49%;
      height: 4rem;
      text-align: center;
    }

    .integralct {
      float: left;
      width: 1%;
      height: 4rem;
      padding-top: 0.8rem;

      div {
        margin: 0 auto;
        width: 1px;
        height: 0.94rem;
        background-color: #fff;
      }
    }

    .score {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
      font-family: "DINAlternate-Bold";
      color: #fff;
      font-weight: bold;
    }

    .describe {
      font-size: 0.7rem;
      font-family: "PingFangSC-Regular";
      color: #fff
    }
  }

  // tab栏
  .tabhead {
    padding: 0.5rem 1.125rem 0 1.125rem;
    background-color: #fff;
    position: relative;

    div {
      width: 25%;
      float: left;
      text-align: center;
      line-height: 2.44rem;
      height: 2.44rem;
      position: relative;
      font-size: "PingFangSC-Regular";
      color: #b5b5b5;
      font-size: 0.81rem;

      .hr-tab {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 1.56rem;
        height: 0.19rem;
        background-color: #ED488A;
        margin-left: -0.78rem;
        display: none;
      }
    }
  }

  .activeide {
    display: block !important;
  }

  .content {
    min-height: 100%;
  }

  .tabli {
    width: 100%;
    // display: none;
    padding: 0.5rem 1.5rem;

    .list {
      display: flex;
      justify-content: space-between;
      font-size: 0.81rem;
      font-family: "PingFangSC-Regular";
      height: 2.5rem;
      align-items: center;

      .listlf {
        color: #13252E;
      }

      .listct {
        color: #5A6164;
      }

      .listlfs {
        @include space();
        width: 50%;
        padding: 0 1rem;
        color: #13252E;
      }

      .listcts {
        padding-right: 10%;
        color: #5A6164;
      }

      .listrt {
        color: #5A6164;
      }
    }
  }

  // 选项卡样式1
  .tabli1 {
    width: 100%;
    padding: 0 1.125rem;
    padding-top: 1.5rem;

    .available {
      width: 100%;
      height: 6.06rem;
      background: #FFFFFF;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.09);
      margin-bottom: 1.5rem;

      .lilf {
        float: left;
        width: 30%;
        background-image: linear-gradient(158deg, #FA95BD 4%, #FF7474 95%);
        height: 6.06rem;
        position: relative;

        .fixedlf {
          position: absolute;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: #fff;
          top: 50%;
          left: -0.25rem;
          margin-top: -0.25rem;
          z-index: 1;
        }

        .fixedrt {
          position: absolute;
          right: -0.15rem;
          top: 0;

          div {
            width: 0.3rem;
            height: 0.3em;
            background-color: #fff;
            border-radius: 50%;
            margin-top: 0.15rem;
          }
        }

        .textct {
          height: 6.06rem;
          display: flex;
          align-items: center;
          justify-content: center;

          .span1 {
            font-family: "PingFangSC-Semibold";
            color: #fff;
            font-size: 1rem;
            font-weight: bold;
            padding-top: 0.7rem;
            padding-right: 0.1rem;
          }

          font-family: "DINAlternate-Bold";
          font-size: 2.37rem;
          color: #fff;
          font-weight: bold;
        }
      }

      .lirt {
        float: left;
        width: 70%;
        background-color: #fff;
        padding-left: 0.5rem;

        .discount {
          width: 100%;
          height: 3.03rem;
          position: relative;
          line-height: 3.03rem;
          font-size: 0.88rem;
          font-family: "PingFangSC-Medium";
          color: #13252E;
          font-weight: bold;

          .count {
            position: absolute;
            width: 2.5rem;
            height: 0.94rem;
            background: #FFE8E8;
            right: 3rem;
            top: 50%;
            margin-top: -0.47rem;

            .countsmall {
              width: 2.5rem;
              height: 0.94rem;
              text-align: center;
              line-height: 0.94rem;
              font-family: "PingFangSC-Regular";
              color: #FF5B4E;
              font-size: 0.57rem;
              -webkit-transform-origin: 0, 0;
              transform-origin: 0, 0;
              -webkit-transform: scale(0.9);
              -ms-transform: scale(0.9);
              transform: scale(0.9);
            }
          }
        }

        .describe {
          width: 100%;
          height: 3.03rem;
          position: relative;

          .time {
            font-family: "PingFangSC-Regular";
            font-size: 0.7rem;
            color: #9B9B9B;
          }

          .threshold {
            font-family: "PingFangSC-Regular";
            font-size: 0.7rem;
            color: #9B9B9B;
            margin-top: 0.3rem;
          }

          .use {
            position: absolute;
            right: 1rem;
            top: 5%;
            font-size: 0.75rem;
            font-family: "PingFangSC-Regular";
            width: 4.5rem;
            height: 1.5rem;
            border: 1px solid #FF5B4E;
            border-radius: 24.5px;
            color: #FF5B4E;
            text-align: center;
            line-height: 1.5rem;
          }
        }
      }
    }

    .nodata {
      width: 100%;
      padding-top: 3rem;

      img {
        display: block;
        width: 4.31rem;
        height: 4.31rem;
        margin: 0 auto;
      }

      div {
        width: 100%;
        height: 1.53rem;
        font-family: "PingFangSC-Regular";
        color: #AEAFAF;
        font-size: 0.75rem;
        padding-top: 0.5rem;
        text-align: center;
      }
    }
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

  .activetext {
    font-family: "PingFangSC-Semibold" !important;
    color: #13252E !important;
    font-weight: bold;
  }
  .shareBtn {
      width: 1.05rem;
      height: 1.05rem;
      background: url(/static/img/share_icon1.png) top no-repeat;
      background-size: 100% 100%;
      position: fixed;
      top: 1rem;
      right: 1.2rem;
      z-index: 9999999999;
  }
</style>
