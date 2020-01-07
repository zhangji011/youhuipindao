<template>
  <div>
    <ul v-for="(item,index) in groupList" :key="item.id" class="clearfix list"  @click="groupp(item,item.url)">
      <li class="list_left">
        <img :src="item.imageurl" alt />
      </li>
      <li class="list_right">
        <div class="top">{{item.skuname}}</div>
        <div class="bottom">
          <div class="bottom_left">
            <span><i>￥</i>{{item.pgprice}}</span>
            <span><i>￥</i>{{item.pcprice}}</span>
            <p>已拼{{item.inordercount30days}}件</p>
          </div>
          <div class="bottom_right">立即拼团</div>
        </div>
      </li>
      <li class="hr-1" :class="{height0:index == groupList.length-1}"></li>
    </ul>
    <!-- <ul v-if="!groupList || groupList.length<=0">
      <loading v-if="showLoading"></loading>
    </ul> -->
    <div class="untitle" v-if="!groupList || groupList.length<=0">
      <p>抱歉，暂时没有可以拼购的商品</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Scroll from "@@/components/scroll/scroll.vue";
import Loading from "@@/components/loading/loading.vue";
import sa from "sa-sdk-javascript";
import Cookies from 'js-cookie'
import { isHebaoApp } from "@@/service/util";


export default {
  data() {
    return {
      stopPropagation: false,
      isShowInfo: false,
      totalInit: 0,
      pullUpLoad: {
        threshold: -50
      }
    };
  },
  props: {
    latitude: {
      type: String,
      default: false
    },
    data1: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: String,
      default: false
    },
    titleParm: {
      type: String,
      default: false
    },
    groupList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tabScrollbar: {
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
    ...mapState(["token", "tokenstatus", "showLoading", "slider1"])
  },

  mounted() {
		
		sa.track("buttonClick", {
				  buttonName: "拼购",
				  topCategory: "优惠",
				  subCategory: "优惠：京东拼购"
				});
		
    if (this.tokenstatus == 11) {
      this.isShowInfo = true;
    } else {
      this.isShowInfo = false;
    }
    if (!window.LATITUDE) {
      // this.aginEnter();
    } else {
      // this.init();
    }
  },
  created() {},

  components: {
    Scroll,
    Loading
  },

  methods: {
    ...mapMutations(["CITYNAME1", "SHOWLOADING"]),
    aginEnter() {
      this.$emit("aginEnter");
    },
    // goSeller() {
      // let params = {
      //   ordNo: JSON.stringify(obj.ordNo),
      //   creDt: JSON.stringify(obj.creDt),
      //   mblNo: this.token.productNo,
      //   reqTyp: JSON.stringify(obj.reqTyp),
      //   ypsFlg: 1
      //   // ordNo: "CPS190710001015553",
      //   // creDt:  20490209,
      //   // mblNo: 15034025723,
      //   // reqTyp: JSON.stringify(obj.reqTyp),
      //   // ypsFlg: 1

      // };
      // console.log(params);
      // this.$router.push({
      //   path: item.translationUrl,
      //   query: {
      //     params: params
      //   }
      // });
    // },
    goDetail(event, obj, flag) {
      this.$emit("goDetail", event, obj, flag);
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
    },
    groupp(obj,url) {
      sa.track('ZoneClick', {
        contentName: obj.skuname,  //取后台返回的字段
        topCategory: '优惠',
        subCategory: '优惠：拼购商品',
        locationOfZone: '附图'
      }); 
	  if(isHebaoApp()){
	  	if ((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android") {
	  	  window.goActivity.goWeb(url);
	  	} else {
	  		// window.location.href = url
	  		window.location = "activity://goWeb?url="+url; 
	  	}
	  }else{
	  	window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
	  }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.untitle {
  text-align: center;
  margin: 3rem 0;
  p {
    color: #bbb;
  }
}
.list {
  padding: 0.8rem;
  border-bottom: 1px solid #e6e6e6;
  .list_left {
    float: left;
    width: 25.5%;
    height: 5.7rem;
    border-radius: 0.2rem; 
    img {
      width: 100%;
      height: 100%;
    }
  }
  .list_right {
    float: right;
    width: 72%;
    .top {
      margin: 0 0 0.5rem 0;
      font-size: 0.975rem;
      // height: 2.56rem;
      color: #13252E;
      overflow: hidden;
	  font-family: "Helvetica";
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2; /*3表示只显示3行*/
      // -webkit-box-orient: vertical;
      /* autoprefixer: off */ 
      /* autoprefixer: on */
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
			 /*! autoprefixer: off */
    -webkit-box-orient:vertical; 
    /* autoprefixer: on */
      word-break: break-all;
      white-space: normal;
			// font-weight: bold;
    }
    .bottom {
      .bottom_left {
        font-size: 0.6875rem;
        float: left;
        span {
            i {
                font-size: 0.6875rem;
            }
        }
        span:nth-child(1) {
          color: #F2270D ;
          // font-weight: 700;
          font-size: 1.14rem;
          margin-right: 0.3rem;
		  font-family: "DINAlternate-Bold";
        }
        span:nth-child(2) {
			font-family: "Helvetica";
          color: #B0B1B1;
          text-decoration: line-through;
        }
        p {
          color: #A6A6A6;
		  padding-top: 0.2rem;
		  color: #BFBFBF;
		  font-family: "PingFangHK-Regular";
		  font-size: 0.81rem;
        }
      }
      .bottom_right {
        float: right;
        font-size: 0.875rem;
        color: #FFFFFF;
        padding: 0.35rem 0.66rem;
		font-family: "PingFangHK-Regular";
        // background: linear-gradient(90deg, #FD477A 0%, #E52824 100%);
        border-radius: 50px;
        margin: 0.2rem 0;
		background-image: linear-gradient(270deg, #FF3D7D 17%, #F66BA1 100%);
      }
    }
  }
}

// 清除浮动代码
.clearfix:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfix {
  zoom: 1;
}
</style>
