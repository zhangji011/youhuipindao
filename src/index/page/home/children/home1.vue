<template>
  <div>
		<!-- 20190106新增白名单入口 -->
		<div class="testlist" v-if="isadmin" @click.prevent="gotesturl">测试</div>
    <!-- <section class="s_1">
      <ul>
        <li class="l t" @click="getClickCity()">
          <span v-show="showCity">{{cityName1.split("市")[0]}}</span>
          <span v-show="showCitys">{{county}}</span>
        </li>
      </ul>
    </section> -->

    <div class="home">
		<div class="nullHeight"></div>
			<section v-show="slider1 && slider1.length>0" class="s_3 s">
			<img class="dw_img" src="../../../../../static/img/address_icon.png" alt="">
			<div class="citybox" @click="getClickCity()">
			  <span v-show="showCity">{{cityName1.split("市")[0]}}</span>
			  <span v-show="showCitys">{{county}}</span>
			</div>
			  <ul>
			    <li v-for="(item, index) in slider1"  @click="goCatalogs(index,item,'classify')">
			      <!-- <img :src="item.marketingIcon" :onerror='defaultIcon' class="icon"> -->
			      <a :class="{'active':selectIndex==index}" class="text">{{item.marketingTitle}}</a>
			    </li>
			  </ul>
			</section>
     <scroll
        :data1 ="data1"
        :data = "shopList"
        :scrollbar='tabScrollbar'
        :pullDownRefresh='pullDownRefresh'
        :refreshNow = 'refreshNow'
        :scrollY = "scrollYOther"
        :pullUpLoad= "pullUpLoad_near"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
        scrollbar=true
				ref="childscroll"
        >
        <div class="content">
          <section class="s_5 s">
            <near1
              :data1 = "data1"
              :titleParm = "titleParm"
              :latitude = 'latitude'
              :longitude = 'longitude'
              :shopList="shopList"
              :data = "shopList"
              @aginEnter = "aginEnter"
              >
            </near1>
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
import Slider from "@@/components/base/slider-BScroll";
import axios from "@@/plugins/rsa/axios";
import Loading from "@@/components/loading/loading.vue";
import sa from "sa-sdk-javascript";
import {
  fetchPoints,
  // GetDistance,
  isHebaoApp,
  setLItem,
  animationProgress,
  getLItem,
  formatDate_1
} from "@@/service/util";
import { baseUrl } from "@@/config/env"; // baseUrl
// import BScroll from "better-scroll";
import Scroll from "@@/components/scroll/scroll.vue";
import Near1 from "./near1.vue";
// import Recommended from "./recommended.vue";
// import Consulting from "./consulting.vue"; // 咨询
// import GoodThing from "./goodThing.vue"; // 好物
import Cookies from 'js-cookie'
import Bus from './gongtong.js'
// console.log(axios);
// import {cityGuess, hotcity, groupcity} from '../../service/getData'
import { asyncLoaded } from "@@/service/util";
export default {
  data() {
    return {
      pullUpLoad: false,
      pullUpLoad_near: true,
      data1: false,
      isShareBtn: false,
      isStatus: false,
      showCity: true,
      showCitys: false,
      titleParm: "",
      selectIndex: 0,
	  selectObj:{},
      loadText: "",
      county: "",
      banner: "/static/mine_banner.png",
      icon: require("@@/images/mine/help_other-pressed.png"),
      product: [],
      listHeight: [],
      scrollY: true,
      topCat: false,
      scrollbar: false,
      slider_top_click: true,
      slider_middle_click: true,
      bounce: false,
      defaultIcon: 'this.src="' + "/static/img/error.png" + '"',
      tabAutoPlay: false,
      tabLoop: false,
      tabScrollbar: false,
      showDot: true,
      refreshNow:true,
      dots: ["附近", "推荐", "世界杯专区"], //['附近','推荐','世界杯专区','咨询'],
      // autoPlay:,
      // defaultIcon: "",

      // slider:[],
      // slider1:[],
      // slider2:[],
      isError: true,
      loopX: true,
      shopList: [],
      limit: "",
      creditResult: "",
      isShowAlert: false,
      alertTextFirst: "",
      alertTextSecond: "",
      btnText: "",
      isAdmittance: false,
      home: "",
      foodsScroll: "",
      residue: 0,
      flag: false,
      shopListFlag: false,
      CURRENTPAGE: 0, // 页码
      PAGNUM: 8,
      refTime: "",
      baseImg: baseUrl.img,
      totalInit: 0,
      endX: 0,
      sliderIndex: 0,
      startX: 0,
      // scrollY: true,
      scrollYOther: true,
      startY: 0,
      threshold: 0.2,
      cityName1: window.CITYNAME || "定位中",
      cityName2: window.CITYNAME2,
      pullDownRefresh: {
        threshold: 120,
        stop: 60
      },
	  shopInfourl:"getShopInfoTest"  ,//	附近优惠请求地址接口，默认请求所有商户
	  slider1:[]  ,//getindexAlldata数据
	  isadmin:false
    };
  },
  computed: {},

  mounted() {
		asyncLoaded(
		  "https://api.map.baidu.com/api?v=2.0&ak=wrkfH0yCNoWEHrXm0L9A5KdGaU8To9dR&callback=window.LBSBD_1",
		  () => {}
		);
		
	this.getTopCart();
    Cookies.remove("item")
    Cookies.remove("l1")
    var vm = this
    // 用$on事件来接收参数
    Bus.$on('val', (data) => {
      vm.cityName1 = data
    })
    Cookies.set("href",window.location.href)
    this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
    this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
    this.cityName1 =((document.cookie.indexOf("item")!=-1)?Cookies.get("item").city_name:"")||window.CITYNAME || "定位中";
    try {
      fetchPoints(
        "home1",
        "event_3",
        this.token.productNo,
        "进入附近商户",
        this.token.session.replace(/\+/g, "%2B")
      );
    } catch (e) {}
    if (!window.LATITUDE) {
      // this.aginEnter();
    } else {
      this.init();
    }
	this.shoplistnone();
	// 20190106加白名单入口
	if(this.token.productNo=="13135288961"){
		this.isadmin=true;
	}
  },
  created() {
    //神策
    let startTime = new Date();
    let endTime = new Date() ;
    sa.track("loadDelay",{
      currentBusinessLine: "优惠频道",
      currentActivity: "优惠更多页面",
      currentURL: window.location.href,
      delayTime: endTime - startTime,
      offsetTime: 0,
      endTime: formatDate_1(endTime.getTime()),
      startTime: formatDate_1(startTime.getTime())
    })
  },

  components: {
    Slider,
    Loading,
    Scroll,
    Near1
    // Recommended,
    // Consulting,
    // GoodThing
    // vueLoading
    // SlideRender
  },

  computed: {
    ...mapState([
      "slider",
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
      "PRODUCTS",
      "SHOWLOADING",
      "CITYNAME1",
      "CITYNAME2",
      // "CITYCOUNTY",
      "OPENANDCLOSE"
    ]),
	gotesturl(){  //20190106增加  白名单
		var url = "http://hbtest.letshappy.cn/test4/main.html#/home1?"+(window.location.href.split("?")[1]||"testurl=none");
		if ((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android") {
		  window.goActivity.goWeb(url);
		} else {
			// window.location.href = url
			window.location = "activity://goWeb?url="+url; 
		}
	},
	shoplistnone(){
		const _that=this;
		setTimeout(function(){
			if(_that.shopList.length<1){
				_that.init();
			}
		},3000)
	},
	getTopCart(){
		this.slider1=[
			{
				"archiveFlag":0,
				"commodityPrice":null,
				"creatTime":1545106849000,
				"effectiveDate":null,
				"expirationDate":null,
				"isShow":0,
				"marketType":"null",
				"marketingDesc":"",
				"marketingEvent":"",
				"marketingEventCotent":"https://www.cmpay.com/mkmweb/query_nearmerc_type.xhtml?CITY_CD=731&MERC_TRD_CLS",
				"marketingIcon":"https://find.cmpay.com:9105/group1/M00/0B/00/rBgEjl3VareANVQfAAAICcoYOYo370.png",
				"marketingId":21,
				"marketingIndex":null,
				"marketingNumber":6,
				"marketingPosition":"CATALOG",
				"marketingRegion":"",
				"marketingStatus":0,
				"marketingTitle":"全部",
				"mercTrdCls":"",
				"middleId":null,
				"originalPrice":null,
				"updateBy":"",
				"updateTime":1574267576000
			},{
				"archiveFlag":0,
				"commodityPrice":null,
				"creatTime":1545106446000,
				"effectiveDate":null,
				"expirationDate":null,
				"isShow":0,
				"marketType":"null",
				"marketingDesc":"",
				"marketingEvent":"",
				"marketingEventCotent":"https://www.cmpay.com/mkmweb/query_nearmerc_type.xhtml?CITY_CD=731&MERC_TRD_CLS=1505",
				"marketingIcon":"https://find.cmpay.com:9105/group1/M00/0B/00/rBgEjl3ValOABhlzAAAIjosvr8Q842.png",
				"marketingId":12,
				"marketingIndex":null,
				"marketingNumber":1,
				"marketingPosition":"CATALOG",
				"marketingRegion":"",
				"marketingStatus":0,
				"marketingTitle":"超市",
				"mercTrdCls":"1505",
				"middleId":null,
				"originalPrice":null,
				"updateBy":"",
				"updateTime":1574267475000
			},
			{
				"archiveFlag":0,
				"commodityPrice":null,
				"creatTime":1545106821000,
				"effectiveDate":null,
				"expirationDate":null,
				"isShow":0,
				"marketType":"null",
				"marketingDesc":"",
				"marketingEvent":"",
				"marketingEventCotent":"https://www.cmpay.com/mkmweb/query_nearmerc_type.xhtml?CITY_CD=731&MERC_TRD_CLS=1300",
				"marketingIcon":"https://find.cmpay.com:9105/group1/M00/0B/00/rBgEjl3Val-AGYniAAAIeps0LdI958.png",
				"marketingId":20,
				"marketingIndex":null,
				"marketingNumber":2,
				"marketingPosition":"CATALOG",
				"marketingRegion":"",
				"marketingStatus":0,
				"marketingTitle":"美食",
				"mercTrdCls":"1300",
				"middleId":null,
				"originalPrice":null,
				"updateBy":"",
				"updateTime":1574267488000
			},
			{
				"archiveFlag":0,
				"commodityPrice":null,
				"creatTime":1545106393000,
				"effectiveDate":null,
				"expirationDate":null,
				"isShow":0,
				"marketType":"null",
				"marketingDesc":"",
				"marketingEvent":"",
				"marketingEventCotent":"https://www.cmpay.com/mkmweb/query_nearmerc_type.xhtml?CITY_CD=731&MERC_TRD_CLS=1505",
				"marketingIcon":"https://find.cmpay.com:9105/group1/M00/0B/00/rBgEjl3VamqAaYURAAAGP59PCdk952.png",
				"marketingId":10,
				"marketingIndex":null,
				"marketingNumber":4,
				"marketingPosition":"CATALOG",
				"marketingRegion":"",
				"marketingStatus":0,
				"marketingTitle":"加油站",
				"mercTrdCls":"1818",
				"middleId":null,
				"originalPrice":null,
				"updateBy":"",
				"updateTime":1574267499000
			},
			{
				"archiveFlag":0,
				"commodityPrice":null,
				"creatTime":1545106272000,
				"effectiveDate":null,
				"expirationDate":null,
				"isShow":0,
				"marketType":"null",
				"marketingDesc":"",
				"marketingEvent":"",
				"marketingEventCotent":"https://www.cmpay.com/mkmweb/query_nearmerc_type.xhtml?CITY_CD=731&MERC_TRD_CLS=1515",
				"marketingIcon":"https://find.cmpay.com:9105/group1/M00/0B/00/rBgEjl3VanOAPnouAAAHIJ7X4zo039.png",
				"marketingId":6,
				"marketingIndex":null,
				"marketingNumber":5,
				"marketingPosition":"CATALOG",
				"marketingRegion":"",
				"marketingStatus":0,
				"marketingTitle":"药店",
				"mercTrdCls":"1515",
				"middleId":null,
				"originalPrice":null,
				"updateBy":"",
				"updateTime":1574267508000
			}];
			this.getListTitle();
	},
    scrollListen(pos) {
      if (Math.abs(pos.y) > 320) {
        this.OPENANDCLOSE(false);
        this.topCat = true;
      } else {
        this.topCat = false;
        this.OPENANDCLOSE(true);
      }
    },
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goToPage(index) {
      this.sliderIndex = index;
    },
    getClickCity(){
      // 神策
      sa.track("buttonClick", {
        buttonName: "进入城市页",
        topCategory: "外放优惠",
        subCategory: "外放优惠：城市页"
      });
      Cookies.set("city2",window.CITYNAME)
      Cookies.set("city1",window.LONGITUDE)
      Cookies.set("city",window.LATITUDE)
      this.$router.push({
        path: "/city",
        query: {
            params: this.cityName1,
            params2: this.cityName2
          }
      });
    },
    aginEnter() {
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
              });
            } else {
              this.SHOWLOADING(true);
            }
          });
        } catch (e) {}
      }
    },
    intervalCity() {
      this.cityName1 = window.CITYNAME || "定位中";
    },
    defaultIconF(i) {
      this.shopList[i].PIC_URL_1 = "/static/img/error.png";
    },
    // GetDistance(a, b, c, d) {
    //   return GetDistance(a, b, c, d);
    // },
    detail(url) {
      window.location = url;
    },
    gotoAddress(path) {
      this.$router.push(path);
    },
    touchStart(e) {
      let touch = e.changedTouches[0];
      this.startX = touch.pageX;
    },
    goCatalogs(index,obj, channel = "default") {
      try {
        if (channel == "classify") {
          // 神策
          sa.track("buttonClick", {
            buttonName: obj.marketingTitle,
            topCategory: "优惠",
            subCategory: "优惠：附近页"
          });
          fetchPoints(
            "020000000000",
            "020000000000K02",
            this.token.productNo,
            "分类-" + obj.marketingTitle,
            this.token.session.replace(/\+/g, "%2B")
          );
        }
      } catch (e) {};
      this.selectIndex = index;
	  this.selectObj=obj;
      this.CURRENTPAGE = 1;
      let mercParm = obj.mercTrdCls;
      Cookies.set("l1",mercParm);
      this.titleParm = obj.marketingTitle;
      // console.log(obj.marketingTitle, mercParm);
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).cityName:"")||window.CITYNAME || "定位中";
      // axios.post("getExternalShopInfo", {  //正式环境调用接口   走接口
      axios.post(this.shopInfourl, {  //测试环境调用接口    走文件
        centre_longitude: this.l,
        centre_latitude: this.s,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 门店简称
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        mblno: this.token.productNo || "", //用户手机号
        pagNum: this.PAGNUM || 8,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: mercParm
        }).then(res => {
			this.$refs.childscroll.betterScrollTo();//滚动条重回到顶部
          if (res.data && res.data.length > 0) {
            this.isError = true;
            this.shopList = this.filterObj(res.data);
            // if (flag) {
            //   this.home.finishPullDown();
            // } else {
            //   this.home.refresh();
            // }
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
              // this.shopList = getLItem("shopList", 600000);
              this.shopList = [];
              // setTimeout(() => {
              this.SHOWLOADING(false);
              this.isError = false;
              // }, 300);
            }
            return;
          }
          // console.log("cccccc",this.shopList);
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            //没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
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
    getListTitle() {
      let parms = this.slider1[0].marketingTitle;
      this.titleParm = parms;   // 分类列表默认标题
      if(isHebaoApp()) {
        this.isShareBtn = true;
      }
      if(this.tokenstatus == 11) {
        this.isStatus = false;
      }
    },
    loadMore() {
      if (this.shopListFlag) {
        return;
      }
      this.numIndex = this.slider1[this.selectIndex].mercTrdCls;
      Cookies.set("l1",this.numIndex);
      // console.log(numIndex);
      this.CURRENTPAGE += 1;
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
      // axios.post("getExternalShopInfo", {  //正式环境调用接口    走接口
      axios.post(this.shopInfourl, {  //测试环境调用接口    走文件
        centre_longitude:this.l,
        centre_latitude:this.s,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 商户简称
        mblno: this.token.productNo || "", //用户手机号
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        pagNum: this.PAGNUM || 8,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: this.numIndex
        }).then(res => {
          // this.shopList = res.STORES_REC;
          // 合并数组
          this.shopList.push.apply(this.shopList, this.filterObj(res.data));
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            // 数组没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
          this.initScroll();
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
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    },
    onPullingDown() {
      // this.init(true);
      // 模拟更新数据
      // setTimeout(() => {
      //   if (Math.random() > 0.5) {
      //     // 如果有新数据
      //     this.items.unshift(this.$i18n.t('normalScrollListPage.newDataTxt') + +new Date())
      //   } else {
      //     // 如果没有新数据
      //     this.$refs.scroll.forceUpdate()
      //   }
      // }, 2000)
    },
    onPullingUp() {
      // 更新数据
      // console.log('pulling up and load data')
      // setTimeout(() => {
      //   if (Math.random() > 0.5) {
      //     // 如果有新数据
      //     let newPage = []
      //     for (let i = 0; i < 10; i++) {
      //       newPage.push(this.$i18n.t('normalScrollListPage.previousTxt') + ++this.itemIndex + this.$i18n.t('normalScrollListPage.followingTxt'))
      //     }

      //     this.items = this.items.concat(newPage)
      //   } else {
      //     // 如果没有新数据
      //     this.$refs.scroll.forceUpdate()
      //   }
      // }, 1500)
      this.loadMore();
    },
    rebuildScroll() {
      this.nextTick(() => {
        this.$refs.scroll.destroy();
        this.$refs.scroll.initScroll();
      });
    },

    refresh() {
      this.init(true);
      // 下拉刷新
      // if (this.refTime) {
      //   // 移除定时器
      //   clearTimeout(this.refTime);
      //   this.init(true);
      //   // window.location = "http://211.138.236.219:9100/main.html?hebaosso=true&showtitle=false"
      // }
    },
    init(flag) {
			//20191117 当前城市无重新请求数据,数据到底后切换城市只能加载一次数据
			var _that=this;
			setTimeout(function(){
				_that.$refs.childscroll.finish();
			},300);
			
      let params_ = this.$route.query.params;
      let params2_ = this.$route.query.params2;
      if(params_ !== undefined) {
        this.county = params_;
        this.showCity = false;
        this.showCitys = true;
      }
      if(params2_ == 5) {
        this.showCity = true;
        this.showCitys = false;
      }
      this.CURRENTPAGE = 1;
      if (!flag) {
        this.SHOWLOADING(true);
      } else {
        this.SHOWLOADING(false);
      }
      // 单点登录
      // 请求banner1
      this.cityName1 = ((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).cityName:"")||window.CITYNAME || "定位中";
      this.l=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_longitude:window.LONGITUDE
      this.s=(document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_latitude:window.LATITUDE
      this.cityName1 =((document.cookie.indexOf("item")!=-1)?JSON.parse(Cookies.get("item")).city_name:"")||window.CITYNAME || "定位中";
      // axios.post("getExternalShopInfo", {  //正式环境调用接口   走接口
      axios.post(this.shopInfourl, {  //测试环境调用接口    走文件
        centre_longitude: this.l || window.LONGITUDE,
        centre_latitude:  this.s || window.LATITUDE,
        longitude: window.LONGITUDE, // 经度
        latitude: window.LATITUDE, // 维度
        stores_nm: "", // 门店名称
        merc_abbr: "", // 门店简称
        // tixn_cnl: "ROYTEL", // 固定值
        currentPage: this.CURRENTPAGE,
        mblno: this.token.productNo || "", //用户手机号
        pagNum: this.PAGNUM || 8,
        // session: this.token.session.replace(/\+/g, "%2B"),
        map_type: window.isUseBaiDuLoc ? 0 : 0,
        // map_type: window.isUseBaiDuLoc,
        merc_trd_cls: (document.cookie.indexOf("l1")!=-1)?Cookies.get("l1"):this.slider1[0].mercTrdCls
        }).then(res => {
          // 神策
          sa.track("pageLoadingCompleted", {
            $title: "优惠",
            $url: window.location.href,
            $url_path: window.location.href,
            currentBusinessLine: "优惠频道"
          });
          if (res.data && res.data.length > 0) {
            this.isError = true;
            this.shopList = this.filterObj(res.data);
            // if (flag) {
            //   this.home.finishPullDown();
            // } else {
            //   this.home.refresh();
            // }
            this.initScroll();
            setTimeout(() => {
              this.SHOWLOADING(false);
            }, 300);
          } else {
            this.isError = true;
            this.totalInit++;
            if (this.totalInit <= 10) {
              this.init();
            } else {
              // this.shopList = getLItem("shopList", 600000);
              this.shopList = [];
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

          // console.log(this.shopList);
          if (res.data.length < this.PAGNUM) {
            this.shopListFlag = true;
            this.data1 = true;
            //没有更多了
          } else {
            this.shopListFlag = false;
            this.data1 = false;
          }
          // setTimeout(() => {
          //   // this.foodsScroll.scrollTo(0, -42, 500);
          //   this.home.refresh();
          //   this._calcHeight();
          // }, 40);
        })
        .catch(res => {
          // setTimeout(()=>{
          this.SHOWLOADING(false);
          this.totalInit++;
          if (this.totalInit <= 5) {
            this.init();
          } else {
            this.initScroll();
          }

          // },300)
        });
    },
    initScroll() {
      // if (!this.home) {
      // this.$nextTick(() => {
      // this.foodsScroll = this.home = new BScroll(this.$refs.home, {
      //   scrollY: true,
      //   // startY: -39,
      //   // scrollX: false,
      //   click: true,
      //   probeType: 1,
      //   bounce: true,
      //   scrollbar: {
      //     fade: true,
      //     interactive: false // 1.8.0 新增
      //   },
      //   //  pullUpLoad:{
      //   //                   threshold: -70, // 当上拉到超过底部 4.375rem 时，
      //   //               }
      //   // pullDownRefresh: {
      //   //   threshold: 70,
      //   //   stop: 50 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
      //   // },
      //   pullUpLoad: {
      //     threshold: 50 // 在上拉到超过底部 1.25rem 时，触发 pullingUp 事件
      //   }
      //   // momentumLimitDistance: 15
      // });
      // // this.foodsScroll.on("pullingDown", () => {
      // //   this.refresh(true);
      // // });
      // this.foodsScroll.on("pullingUp", pos => {
      //   this.loadMore();
      // });
      // });
      // this.foodsScroll.on('scrollEnd',(pos)=>{
      //   console.log("888888888")
      //   console.log(pos)
      // })
      // } else {
      // this.home.finishPullUp();
      // setTimeout(() => {
      // this.$refs.scroll.forceUpdate()
      // this.home.finishPullDown();
      // // }, 300);
      // this.home.finishPullUp();
      // this.home.refresh();
      // }
    },
    _calcHeight() {
      // if (this.residue > 0) {
      //   this.listHeight[this.listHeight.length - 1] += residue;
      // }
      // this.residueHeight = residue > 0 ? residue + "px" : "0rem"; //设置最后菜单的padding
      // 重置滚动区域
      // setTimeout(() => {
      //   this._initScroll();
      // }, 0);
    },
    goToApply() {},
    closeAlert() {},
    goBack() {
      // this.$router.go(-1);
      window.history.go(-1)
    }
  },
  activated(){
    this.refreshNow = !this.refreshNow
  },
  deactivated(){
  },
  watch:{
    latitude(curVal,oldVal){
      this.init()
      // if(curVal&&curVal!="" && this.shopList.length<=0){
      // }

    },
    cityName1(curVal,oldVal){
		this.$refs.childscroll.betterScrollTo();//滚动条重回到顶部
      // this.flagS=false
      this.init()
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
  // transition: all 0.3s;
  // -webkit-transition: all 0.3s;
  // transform: translateZ(0);
  // -webkit-transform: translateZ(0);
  position: absolute;
  z-index: 1;
  // top: 3rem;
  left: 0;
  width: 100%;
  // position: relative;
  height: 100%;
  // padding-top: 3rem;
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
.shareBtn {
    width: 1.05rem;
    height: 1.05rem;
    background: url(/static/img/share_icon.png) top no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 1rem;
    right: 1.2rem;
    z-index: 9999999999;
}
.content {
  // height: auto;
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
.s_1,
.s_5_1 {
  // @include wh(100%, 3rem);
  // // padding-top: 1.25rem;
  // background: #ffffff;
  // position: fixed;
  // z-index: 100000;
  @include wh(100%, 3rem);
  // padding-top: 1.25rem;
  background: #ffffff;
  position: sticky;
  z-index: 100000000;
  top: 3rem;
  left: 0;
  .cat_w {
    height: 3rem !important;
    top: 0rem !important;
    background: white;
    line-height: 3rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .cat {
    width: 33%;
    text-align: center;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 3rem;
    line-height: 3rem;
    background: #fff;
    font-family: PingFangSC-Regular;
    color: #13252e;
    font-size: 0.9375rem;
  }
  .cat.active {
    background: #fff;
    color: #ed1991;
    border-bottom: 0.125rem solid #ed1991;
    border-radius: 0;
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
  ul {
    width: 100%;
    height: 100%;
  }
  .l {
    height: 100%;
    line-height: 3rem;
  }
  .t {
    max-width: 7rem;
    color: #6c6c6c;
    font-size: 0.8125rem;
    position: relative;
    float: left;
    text-align: left;
    padding-left: 0.9375rem;
    padding-right: 1rem;
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
    height: 2rem;
    position: absolute;
    left: 0.25rem;
    // top: 0.9875rem;
    img {
      width: 100%;
      display: block;
      position: relative;
      top: 0.5rem;
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
      z-index: 999;
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
.s_3 {
  @include wh(100%, 3rem);
  text-align: center;
  background-color: #fff;
  position: relative;
  .dw_img{
	  position: absolute;
	  top:50%;
	  right: 2.8rem;
	  width: 1rem;
	  height: 1rem;
	  margin-top: -0.5rem;
  }
  .citybox{
	  position: absolute;
	  width: 2.5rem;
	  height: 3rem;
	  right: 0.3rem;
	  top: 0;
	  text-align: left;
	  line-height: 3rem;
	  color: #13252e;
      font-size: .75rem;
	  @include space();
  }
  .icon {
    height: 1.75rem;
    width: auto;
    display: inline-block;
    padding: 0.84375rem 0 0.25rem 0;
  }
  .text {
    display: block;
    color: #7e7e7e;
    font-size: 0.75rem;
  }
  a.active {
    font-family: PingFangSC-Semibold;
    display: block;
    color: #13252e;
    font-size: 0.75rem;
	border: 1px solid #838383;
	border-radius: 50px;
	padding: 0.1rem 0.3rem;
  }

  ul {
    display: flex;
    height: 100%;
	padding-right: 5rem;
    li {
	  display: flex;
      height: 100%;
      // flex: 1;
	  justify-content: center;
	  align-items: center;
	  padding: 0 0.5rem;
	  margin: 0 0.2rem;
    }
  }
}
.s_4 {
  @include wh(100%, 7.125rem);
  padding-top: 0.25rem;
  padding-bottom: 0.625rem;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    max-height: 6.125rem;
  }
}

.s_5 {
  // padding: 0 0.9375rem;
  // background: #fff;
  // margin-top: 0.5625rem;
  // margin-bottom: 1rem;
  // height: 56.25rem;
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

.s_6 {
  padding: 0 0.9375rem;
  background: #fff;
  margin-top: 0.5625rem;
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
  height: 10.625rem;
  a {
    display: inline-block;
    height: 10.625rem;
  }
  img {
    // height: 100%;
    height: 10.625rem;
    max-height: 10.625rem;
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
  height: 10.625rem;
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
      float: left;
      color: #272727;
      font-size: 1rem;
      line-height: 1.15rem;
    }
    .right {
      float: right;
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
  // &::after {
  //   @include onepx1(#d8d8d8);
  // }
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
.foot_login {
  width: 100%;
  height: 3.1875rem;
  bottom: 0;
  left: 0;
  z-index: 10005;
  color: #fff;
  background: rgba(0,0,0,0.60);
  .login_l {
    float: left;
    padding: 0.5rem 0.625rem 0.5rem 0.9375rem;
    // padding-left: ;

    img {
    width: 2.1875rem;
    height: 2.1875rem;
    }
  }
  .login_m {
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 0.875rem;
    line-height: 3.1875rem;
  }
  .login_r {
    float: right;
    line-height: 3.1875rem;
    span {
      display: inline-block;
      margin: 0.625rem 0.9375rem 0.625rem;
      width: 6.25rem;
      height: 2rem;
      text-align: center;
      font-size: 0.875rem;
      font-family: PingFangSC-Regular;
      line-height: 2rem;
      background-image: linear-gradient(-90deg, #F1238F 0%, #E7175D 100%);
      border-radius: 4px;
    }
  }
}
.fx {
  display: block;
  position: fixed;
}
.testlist{
	position: fixed;
	right: 0;
	top: 20%;
	font-size: 0.75rem;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	background-color: #13252e;
	color: #fff;
	text-align: center;
	line-height: 2rem;
	z-index: 999999;
}
</style>
