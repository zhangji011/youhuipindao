<template>
  <div>
    <div class="home">
		<!-- 购物车、订单 -->
      <!-- <div class="order" v-if="isandroid"> -->
      <div class="order">
        <p><img src="../../../images/ding.png" alt="" @click="dingClick()"></p>
        <p><img src="../../../images/gou.png" alt="" @click="gouClick()"></p>
      </div>
      <scroll
        :data1 ="data1"
        :data = "groupList"
        :scrollbar='tabScrollbar'
        :pullDownRefresh='pullDownRefresh'
        :refreshNow = 'refreshNow'
        :scrollY = "scrollYOther"
        :pullUpLoad= "pullUpLoad_near"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
        scrollbar=true
        >
        <div class="content">          
          <section class="s_5 s">
            <buying
              :data1 = "data1"
              :titleParm = "titleParm"
              :latitude = 'latitude'
              :longitude = 'longitude'
              :groupList="groupList"
              :data = "groupList"
              @aginEnter = "aginEnter"
              >
            </buying>
          </section>
        <!-- <div class="null" v-if="!groupList || groupList.length>0">————&nbsp;&nbsp;亲，我是有底线的&nbsp;&nbsp;————</div> -->
        </div>
      </scroll>
      </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "@@/plugins/rsa/axios";
import Loading from "@@/components/loading/loading.vue";
import { baseUrl } from "@@/config/env"; // baseUrl
import Scroll from "@@/components/scroll/scroll.vue";
import Buying from "./buying.vue";
import Cookies from 'js-cookie'
import Bus from './gongtong.js'
import { isHebaoApp } from "@@/service/util";
export default {
  data() {
    return {
      pullUpLoad: false,
      pullUpLoad_near: true,
      data1: false,
      titleParm: "",
      product: [],
      groupList: [],
      listHeight: [],
      scrollY: true,
      scrollbar: false,
      slider_top_click: true,
      slider_middle_click: true,
      defaultIcon: 'this.src="' + "/static/img/error.png" + '"',
      tabAutoPlay: false,
      tabLoop: false,
      tabScrollbar: false,
      refreshNow:true,
      isError: true,
      loopX: true,
      shopList: [],
      home: "",
      flag: false,
      shopListFlag: false,
      CURRENTPAGE: 0, // 页码
      PAGNUM: 10,
      baseImg: baseUrl.img,
      totalInit: 0,
      endX: 0,
      sliderIndex: 0,
      startX: 0,
      scrollY: true,
      scrollYOther: true,
      startY: 0,
      threshold: 0.2,
      cityName1: "长沙" || "定位中",
      cityName2: window.CITYNAME2,
      pullDownRefresh: {
        threshold: 120,
        stop: 60
      },
			isandroid:false   //安卓显示购物车,ios不显示
    };
  },
  computed: {},

  mounted() {
		if((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android"){
				  this.isandroid = true;
		}
    var vm = this;
    // 用$on事件来接收参数
    Bus.$on('val', (data) => {
      vm.cityName1 = data
    })
    Cookies.set("href",window.location.href)
    // if (!window.LATITUDE) {
      // this.aginEnter();
    // } else {
      this.init();
    // }
  },
  created() {
  },

  components: {
    Loading,
    Scroll,
    Buying
  },

  computed: {
    ...mapState([
      "slider",
      "slider1",
      "slider2",
      "products",
      "showLoading",
      "token",
      "countyParm",
      "tokenstatus",
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
      "CITYNAME2",
      // "CITYCOUNTY",
      "OPENANDCLOSE"
    ]),
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goToPage(index) {
      this.sliderIndex = index;
    },
    aginEnter() {
      // alert(33)
      this.SHOWLOADING(true);
      this.initScroll();
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
              this.SHOWLOADING(true);
            }
          });
        } catch (e) {}
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
    loadMore() {
      if (this.shopListFlag) {
        return;
      }
      this.CURRENTPAGE += 1;
      axios.post("queryJDPGInfo", {
        currentPage: this.CURRENTPAGE,
        pageNum: this.PAGNUM
        }).then(res => {
          this.groupList.push.apply(this.groupList, this.filterObj(res.data));
          // console.log(this.groupList + '111112222')
          if (res.code=="-1" || (res.data && res.data.length<this.PAGNUM)) {
            this.shopListFlag = true;
            this.data1 = true;
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
          this.initScroll();
        })
        .catch(res => {
          this.initScroll();
        });
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    },
    onPullingDown() {},
    onPullingUp() {
      this.loadMore();
    },
    refresh() {
      this.init(true);
    },
    init(flag) {
      this.CURRENTPAGE = 1;
      if (!flag) {
        this.SHOWLOADING(true);
      } else {
        this.SHOWLOADING(false);
      }
      axios.post('queryJDPGInfo',{
        currentPage: this.CURRENTPAGE,
        pageNum: this.PAGNUM || 10
      }).then(res => {
          if (res.data && res.data.length > 0) {
            this.isError = true;
            this.groupList = this.filterObj(res.data);
                      console.log(this.groupList)

            this.initScroll();
            setTimeout(() => {
              this.SHOWLOADING(false);
            }, 300);
          } else {
            this.isError = true;
            this.totalInit++;
            if (this.totalInit <= 5) {
              this.init();
            } else {
              this.groupList = [];
              // setTimeout(() => {
              this.SHOWLOADING(false);
              this.isError = false;
              if (flag) {
                this.initScroll();
              } else {
                this.initScroll();
              }
              // }, 300);
            }
            return;
          }
          if (res.code=="-1" || (res.data && res.data.length<this.PAGNUM)) {
            this.shopListFlag = true;
            this.data1 = true;
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
        })
        .catch(res => {
          this.SHOWLOADING(false);
          this.totalInit++;
          if (this.totalInit <= 5) {
            this.init();
          } else {
            this.initScroll();
          }
        });
    },
    initScroll() {
    },
    dingClick() {
    if(isHebaoApp()){
    	if ((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android") {
    	  window.goActivity.goWeb('https://plogin.m.jd.com/user/login.action?appid=461&returnurl=http%3A%2F%2Fhome.m.jd.com%2Fuser%2FuserAllOrderList.action%3Fcu%3Dtrue%26utm_source%3Dkong%26utm_medium%3Dunionkcps%26utm_campaign%3Dt_1000543739_%26utm_term%3Db12a3bb26c404a24a45ab89eadc4a5b7&ipChanged=false');
    	} else {
    		// window.location.href = 'https://plogin.m.jd.com/user/login.action?appid=461&returnurl=http%3A%2F%2Fhome.m.jd.com%2Fuser%2FuserAllOrderList.action%3Fcu%3Dtrue%26utm_source%3Dkong%26utm_medium%3Dunionkcps%26utm_campaign%3Dt_1000543739_%26utm_term%3Db12a3bb26c404a24a45ab89eadc4a5b7&ipChanged=false'
    		window.location = "activity://goWeb?url=https://plogin.m.jd.com/user/login.action?appid=461&returnurl=http%3A%2F%2Fhome.m.jd.com%2Fuser%2FuserAllOrderList.action%3Fcu%3Dtrue%26utm_source%3Dkong%26utm_medium%3Dunionkcps%26utm_campaign%3Dt_1000543739_%26utm_term%3Db12a3bb26c404a24a45ab89eadc4a5b7&ipChanged=false";
    	}
    }else{
    	window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
    }
    },
    gouClick() {
    if(isHebaoApp()){
    	if ((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android") {
    	  window.goActivity.goWeb('https://click.k.jd.com/union?&mtm_source=kepler-m&mtm_subsource=8e16744f01bad1a2fb1afe919d6f61f5&returl=https%3A%2F%2Fp.m.jd.com%2Fcart%2Fcart.action%3Fsceneval%3D2%26');
    	} else {
    		// window.location.href = 'https://click.k.jd.com/union?&mtm_source=kepler-m&mtm_subsource=8e16744f01bad1a2fb1afe919d6f61f5&returl=https%3A%2F%2Fp.m.jd.com%2Fcart%2Fcart.action%3Fsceneval%3D2%26';
    			window.location = "activity://goWeb?url=https://click.k.jd.com/union?&mtm_source=kepler-m&mtm_subsource=8e16744f01bad1a2fb1afe919d6f61f5&returl=https%3A%2F%2Fp.m.jd.com%2Fcart%2Fcart.action%3Fsceneval%3D2%26";
    	}
    }else{
    	window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
    }
    }
  },
  watch:{
    latitude(curVal,oldVal){
      this.init()
      if(curVal&&curVal!="" && this.groupList.length<=0){
      }
      
    },
    cityName1(curVal,oldVal){
      this.init()
      if(curVal !== oldVal){

      }
    },  
  }
};
</script>
<style lang="scss" scoped>
@import "~@@/style/mixin";
.null {
   padding: 2.5rem;
   height: 5rem;
 }
body {
  position: relative;
  .order {
    position: absolute;
    right: 5%;
    bottom: 15%;
    z-index: 9999;
      img {
        width: 2.625rem;
        height: 2.625rem;
        margin-bottom: 0.5rem;
      }
  }
}
.nullHeight {
  height: 0.5625rem;
  background: #f6f7f8;
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
.home {
  position: absolute;
  z-index: 1;
  // top: 2.8rem;
  left: 0;
  width: 100%;
  // position: relative;
  height: 100%;
  // padding-top: 3rem;
  // padding-bottom: 2rem;
  // background: #f0f1f2;
  overflow: hidden;
  background-color: #f7f5f8;
}
.home1 {
  // margin-top: 4.25rem;
  height: 100%;
  overflow: hidden;
  // z-index: 19;
}
.content {
  // height: auto;
	background-color: #fff;
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
header {
  @include wh(100%, 3.125rem);
  background: #fff;
  position: sticky;
  z-index: 100;
  top: 0;
  left: 0;
  .l {
    height: 100%;
    line-height: 3.125rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
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
  
  .lt {
    height: 100%;
    line-height: 3.125rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
    color: #fff;
    padding-right: 3.5rem;
    text-align: center;
  }
  .ex {
    color: #6c6c6c;
    font-size: 0.9375rem;
    height: 3.125rem;
    position: relative;
    float: left;
    text-align: left;
    background-image: url(/static/img/left_back.png);
    background-repeat: no-repeat;
    background-position: 0.375rem 50%;
    background-size: 1.4rem;
    // padding-right: 0.6rem;
    @include space();
  }
}

.s_5 {
  ul {
    height: 7.5rem;
    padding-top: 1.625rem;
    position: relative;
    margin: 0 0.9375rem;
  }
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
    @include space();
  }
  .c2 {
    font-size: 0.6875rem;
    color: #999999;
    padding-top: 0.5625rem;
    max-width: 90%;
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
    @include space();
    div {
      @include space();
    }
  }
  .r {
    position: absolute;
    right: 0.9375rem;
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
.scroll {
  height: 10.625rem;
}
.slide-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
  height: 56.25rem;
  // margin: 0 .625rem .625rem;
}
.slider-item {
  height: 100% !important;
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
  background: #fff;
  z-index: 10;
  color: #7e7e7e;
  font-size: 0.75rem;
  text-align: center;
  img {
    width: 3.125rem;
    height: 3.125rem;
  }
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
