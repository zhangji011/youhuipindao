<!--和悦商品接口-->
<template>
<div id="goods">
    <div class="goods_wrapper" v-for="(item, index) of dataList" :key="'good1_1_'+index">
      <div v-if="banner" class="banner" @click="goDetail($event,item,2)">
        <img v-lazy="item.tbConductConfig.marketingIcon"/>
      </div>
      <div class="goods ZJgoods">
      <!-- <div class="goods" @touchmove="noscroll($event)"> -->
        <scroll 
          :scrollX = true
          :scrollbar = true
          :data="item.goodsVO"
        >
		<!-- 20190929 -->
        <!-- <div class="goods_box" @touchend.stop>   -->
        <div class="goods_box ZJgoods">
        <ul class="u1 ZJgoods">
          <v-touch v-for="(itemson, index) of item.goodsVO" @tap="goDetail($event,itemson,3)" :key="'good1_'+index" class="youch ZJgoods">
            <ul class="u2 ZJgoods">
              <li class="icon ZJgoods">
                <img v-lazy="itemson.pic"  class="ZJgoods"/>
              </li>
              <li class="text ZJgoods">
                {{itemson.name}}
              </li>
              <li class="sub ZJgoods">
                <span class="price ZJgoods">¥{{(itemson.price)}}</span>
                <span v-if="itemson.originalPrice.length" class="linePrice ZJgoods">¥{{(itemson.originalPrice)}}</span>
              </li>
            </ul>
          </v-touch>
          <v-touch @tap="goDetail($event,item,2)" class="sw-option sw-option-end ZJgoods">
            <ul class="sw_wrapper ZJgoods">
              <li class="ZJgoods">更多优惠</li>
              <li class="sw_text ZJgoods">MORE</li>
              <li class="sw_button ZJgoods">></li>
            </ul>
          </v-touch>
        </ul>
        </div>
        </scroll>
      </div>
      
    </div>
    <div v-if="showMore = middle.length>4 ? true : false" 
        @click="showAll = !showAll" 
        class="more">
      <div @click="isMore()" v-if="showAll==false" class="down">
        <div>更多特价商品</div>
        <div class="down_img">&nbsp;</div>
      </div>
      <div @click="backToTop()" v-else class="up">收起</div>
    </div>
    <div class="nullHeight"></div>
</div>
   
</template>
<script>
import {
  fetchPoints,
  GetDistance,
  fenToyuan,
  getUUID,
  setMd5HY
} from "@@/service/util";
import { mapState } from "vuex";
import axios from "@@/plugins/rsa/axios";
import Scroll from "@@/components/scroll/scroll-goods.vue";
import sa from'sa-sdk-javascript';
import Bus from './gongtong.js';
export default {
  data() {
    return {
      data: {},
      showAll: false,
      showMore: false,
	  startX:0,
	  startY:0,
	  moveEndX:0,
	  moveEndY:0
      // banner: {}
    };
  },
  props: {
    middle: Array
  },
  computed: {
    ...mapState(["token"]),
    banner:function(){
      return this.middle && this.middle.length>=1 ? this.middle[0] : this.middle[0]
    },
    dataList() {
      if (this.showAll == false) {
        var dataList = [];
        if (this.middle.length > 4) {
          for (var i = 0; i < 4; i++) {
            dataList.push(this.middle[i])
          }
        } else {
          dataList = this.middle
        }
        return dataList;
      } else {
        return this.middle
      }
    }
  },

  mounted() {
    // alert(this.middle)
    // alert(this.banner)
    // this.init();
  },
  created() {},

  components: {
    Scroll
  },

  methods: {
      // Vue.directives
    init() {
      // this.banner = this.middle.length>=1 ? this.middle[0] : this.middle[0]
      // 获取banner
      // axios
      //   .post("queryMarketing", {
      //     position: "MIDDLE",
      //     session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      //   })
      //   .then(res => {
      //     this.banner = res.data.length >= 1 ? res.data[0] : res.data[0];
      //     // this.banner = res.data[0];
      //   });
      let param_ = {
        channel: 10197,
        requestId: getUUID()
      };
      param_.sign = setMd5HY(param_);
      // 和悦商品接口
      // 生产：https://mall.joypay.cn/cm-mall/outservice/hy/topiclist.do
      axios.post("topiclist.do", param_).then(res => {
        let data = res.topiclist[0].goodslist.sort(() => {
          return Math.random() > 0.5 ? -1 : 1;
        });
        this.data = data.slice(0, 3); // 每个专题必须至少返回3个商品
      });
    },
    backToTop() {
      this.$emit('backtop');
      // 神策
      sa.track('buttonClick', {
      topCategory: '优惠',
      subCategory: '收起更多特价商品'
      });
      // document.documentElement.scrollTop;
      // document.getElementById("goods").scrollIntoView();
      // console.log(document.getElementsByClassName("goods"));
    },
    isMore(){
      // 神策
      sa.track('buttonClick', {
      topCategory: '优惠',
      subCategory: '点击下拉更多特价商品'
      });
    },
    goDetail(event, obj, flag) {
      if (flag == 2) {
        // 神策
        sa.track('ZoneClick', {
          contentName: '专题位-banner',
          topCategory: '优惠',
          subCategory: obj.tbConductConfig.marketingTitle,
          locationOfZone: '主图'
        })
      }
      if(flag==3){
         // 神策
        sa.track('ZoneClick', {
          contentName: obj.name,
          topCategory: '优惠',
          subCategory:  '专题位商品',
          locationOfZone: '附图'
        })
      }
      // alert(JSON.stringify(obj))
      this.$emit("goDetail", event, obj, flag);
    },
    fenToyuan: fenToyuan
  },
  //   directives: {'tap': {
  //   bind:function(el) {
  //     el.tap()
  //   }
  // }},
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";

.goods_wrapper {
  height: 20rem;
}
.banner {
  width: 100%;
  // height: 100%;
  overflow: hidden;
  position: relative;
  // margin-bottom: 0.5rem;
  img {
    width: 100%;
    
    // height: 100%;
  }
}
.goods {
  transform: translateY(-1.5rem);
}
.goods_box {
  // height: 11.3125rem;
  // padding: 0.5rem 0.5rem 3.5rem 0.5rem;
  // margin: 0.625rem 0.6875rem 0.125rem 1.5rem;
  position: relative;
  // left: 0.625rem;
  // bottom: 1.5rem;
  // background: #fff;
  
  // box-shadow: 0 0.3125rem 1.25rem 0 rgba(0,0,0,0.16);
  border-radius: 0.3125rem;
  padding: 0 1.5rem 1rem 0.9375rem;
  // border-top-right-radius: 0.3125rem;
  // border-bottom-right-radius: 0.3125rem;
  .u2 {
    overflow: hidden;
  }
  .u1 {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    // margin: 0.625rem 0.6875rem 0.125rem 1.5rem;
    position: relative;
    // left: 0.625rem;
    // bottom: 1.5rem;
    background: #fff;
    box-shadow: 0 0.3125rem 0.625rem 0 rgba(0,0,0,0.16);
    border-radius: 0.3125rem;
    padding: 0 !important;
    display: flex;
    padding-top: 0.6875rem;
    & > .youch {
      flex: 4;
      flex-direction: row;
      max-width: 24%;
      margin: 0.3rem 0.3rem 0.3rem 0;
      padding-left: 0.3125rem;
      padding-bottom: 0.3125rem;
    }

    li.icon {
      max-height: 6.25rem;
      height: 6.25rem;
      position: relative;
      margin: 0 auto;
      // margin-top: 1.375rem;
      // margin-bottom: 1.375rem;
      text-align: center;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .text {
      // text-indent: .3rem;
      font-size: 0.75rem;
      color: #13252e;
      font-family: PingFangSC-Light;
      text-align: center;
      // overflow: hidden;
      // display: -webkit-box;
      /* autoprefixer: ignore next */
      // -webkit-box-orient: vertical;
      // text-overflow: ellipsis;
      text-align: left;
      // padding-right: 0.75rem;
      @include space();
    }
    .price {
      font-size: 0.75rem;
      color: #ea2845;
      font-family: PingFangSC-Medium;
      text-align: left;
      // padding-left: .625rem;
    }
    .linePrice {
      font-size: 0.75rem;
      color: #9b9b9b;
      font-family: PingFangSC-Regular;
      text-decoration: line-through;
      text-align: left;
    }
    .u2 {
      // padding-bottom: 1.4375rem;
    }
    .sub {
      text-indent: 0.3rem;
      // width: 6.75rem;
      white-space: nowrap;
    }
  }
  .sw-option {
    margin: 0.2rem 1rem .8rem 0.3125rem;
    font-size: 0.9375rem;
    text-align: center;
    background: #f6f7f8;
    // border-radius: 0.5rem;
    // flex: 0 1 auto;
    // float: left;
    color: #8b8b8b;
    .sw_wrapper {
      padding-top: 2.2rem;
      font-size: 0.875rem;
      .sw_text {
        font-family: PingFangSC-Semibold;
        padding-top: .25rem;
        font-size: 0.75rem;
        color: #d2d2d3;
      }
      .sw_button {
        margin: 0.45rem auto;
        width: 3.5rem;
        height: 1.4rem;
        line-height: 1.4rem;
        color: #fff;
        background-color: #e1e1e1;
        border-radius: 1.2rem;
      }
    }
  }
  div.sw-option-end {
    margin: auto;
    color: #aeafaf;
    font-family: PingFangSC-Regular;
    font-size: 0.75rem;
    width: 5.25rem;
    line-height: 0.9375rem;
    margin-right: 0.625rem;
    margin-left: 0.625rem;
  }
}
.more {
  // float: right;
  margin-left: 42%;
  margin-top: 1rem;
  width: 5rem;
  height: 100%;
  font-family: PingFangSC-Regular;
  font-size: 0.75rem;
  padding-bottom: .5rem;
  color: #7e7e7e;
  .down_img {
    background: url(/static/img/more_arrow_3.png) no-repeat 42% 50%;
    background-size: auto 80%;
  }
  .up {
    display: inline-block;
    text-align: center;
    width: 4rem;
    background: url(/static/img/up.png) no-repeat 85% 50%;
    background-size: 18%;
  }
}
.nullHeight {
    width: 100%;
    height: 0.5625rem;
    background: #F6F7F8;
}
</style>
