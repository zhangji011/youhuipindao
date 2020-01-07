<template>
  <div>
    <div v-for="(item,index) in seckillList" :key="item.id">
		<ul class="clearfix list"  @click="promptly(item,item.url)">
		  <li class="list_left">
		    <img :src="item.imageurl" alt />
		  </li>
		  <li class="list_right">
		    <div class="top">{{item.wname}}</div>
		    <div class="bottom">
		      <div class="bottom_left">
		        <div class="bot_leftbox">
					<p><i>￥</i>{{item.miaoshaprice}}</p>
					<p><i>￥</i>{{item.jdprice}}</p>
				</div>
		      </div>
		      <div class="bottom_right" v-if="kill == true">立即抢购</div>
		      <div class="bottom_right" v-else>即将开抢</div>
		    </div>
		  </li>
		  <li class="hr-1" :class="{height0:index == seckillList.length-1}"></li>
		</ul>
		<div style="width: 100%;height: 0.5rem;background: none;"></div>
	</div>
   <ul v-if="!seckillList || seckillList.length<=0" style="width: 100%;">
      <loading v-if="showLoading"></loading>
    </ul>
    <div class="untitle" v-if="!seckillList || seckillList.length<=0">
      <p>抱歉，暂时没有抢购的商品</p>
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
      },

    }
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
    seckillList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tabScrollbar: {
      type: Boolean,
      default: false
    },
    kill: {
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
				  buttonName: "秒杀",
				  topCategory: "优惠",
				  subCategory: "优惠：京东秒杀"
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
    promptly(obj,url) {
      // 神策
      // if(this.kill == true) {
        sa.track('ZoneClick', {
          contentName: obj.wname,  //取后台返回的字段
          topCategory: '优惠',
          subCategory: '优惠：秒杀商品',
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
			// window.location.href = url
			window.location.href = "https://p.10086.cn/ptw/tohebao.xhtml?TAGPAG=248&MERCSIGN=OCGCfUUSCelCupTUkTKUibWkpz60nful";
		}
      // }
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
  border-bottom: 1px solid #ccc;
	border-radius: 8px;
	// margin-bottom: 0.4rem;
	background-color: #fff;
  .list_left {
    float: left;
    width: 25.5%;
    height: 5.7rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .list_right {
    float: right;
    width: 72%;
    .top {
      margin: 0.3rem 0 1rem 0;
      font-size: 0.875rem;
      color: #13252e;
      overflow:hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2; /*3表示只显示3行*/
      /* autoprefixer: off */ 
      // -webkit-box-orient: vertical;
      /* autoprefixer: on */
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
			 /*! autoprefixer: off */
    -webkit-box-orient:vertical; 
    /* autoprefixer: on */
      word-break: break-all;
      white-space: normal;

    }
    .bottom {
      .bottom_left {
        font-size: 0.75rem;
		height: 2rem;
        float: left;
		.bot_leftbox{
			width: 100%;
			height: 100%;
			display: flex;
			align-items: flex-end;
		}
        p {
            i {
                font-size: 0.6875rem;
            }
        }
        p:nth-child(1) {
          color: red;
          font-size: 1.44rem;
          margin-right: 0.3rem;
		  font-family: "DINAlternate-Bold";
        }
        p:nth-child(2) {
			font-family: "Helvetica";
			font-size: 0.75rem;
          color: #bbb;
          text-decoration: line-through;
		  padding-bottom: 0.1rem;
        }
      }
      .bottom_right {
        float: right;
        font-size: 0.875rem;
        color: #F23877;
        padding: 0.35rem 0.66rem;
        // background: linear-gradient(90deg, #fd477a 0%, #e52824 100%);
        border-radius: 50px;
        margin: 0.2rem 0;
		// border: 0.1rem solid #f23877;
		border: 2px solid #F23877;
		font-weight: bold;
		font-family: "PingFangTC-Semibold"
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
