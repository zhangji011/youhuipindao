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
            <p>已拼{{item.inordercount30days}}万件</p>
          </div>
          <div class="bottom_right">立即拼团</div>
        </div>
      </li>
      <li class="hr-1" :class="{height0:index == groupList.length-1}"></li>
    </ul>
    <ul v-if="!groupList || groupList.length<=0">
      <loading v-if="showLoading"></loading>
    </ul>
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
        subCategory: '拼购',
        locationOfZone: '商品'
      }); 
      Cookies.set("groupp",JSON.stringify(2))
      console.log(Cookies.get('groupp'))
      window.location.href = url
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
  .list_left {
    float: left;
    width: 25.5%;
    height: 5.7rem;
    border-radius: 0.3rem; 
    img {
      width: 100%;
      height: 100%;
    }
  }
  .list_right {
    float: right;
    width: 72%;
    .top {
      margin: 0.3rem 0 0.5rem 0;
      font-size: 0.875rem;
      // height: 2.56rem;
      color: #13252E;
      overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2; /*3表示只显示3行*/
      // -webkit-box-orient: vertical;
      /* autoprefixer: off */ 
      /* autoprefixer: on */
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      white-space: normal;
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
          color: #E52824;
          font-weight: 700;
          font-size: 1rem;
          margin-right: 0.3rem;
        }
        span:nth-child(2) {
          color: #7F7F7F;
          text-decoration: line-through;
        }
        p {
          color: #A6A6A6;
        }
      }
      .bottom_right {
        float: right;
        font-size: 0.875rem;
        color: #FFFFFF;
        padding: 0.35rem 0.66rem;
        background: linear-gradient(90deg, #FD477A 0%, #E52824 100%);
        border-radius: 0.25rem;
        margin: 0.2rem 0;
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
