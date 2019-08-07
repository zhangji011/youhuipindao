<template>
    <div class="goods-2">
      <div class="t-2">
      <div class="t-1 ">
        <!-- <div class="t-3">为你推荐</div> -->
      </div>
      <!-- <div class="hr-1"></div> -->
      </div>
      <ul class="u1">
        <li v-for="(item,index) in recommends" :key="'good2_1_'+ index" @click="goDetail($event,item,11)" >
          <ul class="u2">
            <li class="icon">
              <img v-lazy="item.marketingIcon"/>
            </li>
            <li class="text" style="-webkit-box-orient: vertical;">
              {{item.marketingTitle}}
            </li>
            <li class="sub">
              <span class="price">¥{{item.commodityPrice.toFixed(2)}}</span>
              <span class="linePrice">¥{{item.originalPrice.toFixed(2)}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>

<script>
import { fetchPoints, GetDistance } from "@@/service/util";
import { mapState } from "vuex";
// import axios from "@@/plugins/rsa/axios";
import sa from'sa-sdk-javascript';
export default {
  data() {
    return {
      data: []
    };
  },
  computed: {
    ...mapState(["token", "recommends"])
  },
  mounted() {
    // this.init();
  },
  created() {},
  components: {},
  methods: {
    init() {
      axios
        .post("queryMarketing", {
          position: "RECOMMEND",
          session: this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
        })
        .then(res => {
          this.data = res.data;
          // console.log(this.data);
        });
    },
    goDetail(event, obj, flag) {
      // 神策
      sa.track('ZoneClick', {
        contentName: obj.marketingTitle,
        topCategory: '优惠',
        subCategory: '为您推荐',
        locationOfZone: '商品'
      })
      this.$emit("goDetail", event, obj, flag);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.goods-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  .t-2 {
  position: relative;
  height: 2.5rem;
  text-align: center;
  position: relative;
  line-height: 2.5rem;
  }
  .t-1 {
    height: 100%;
    line-height: 2.5rem;
    width: 7.5rem;
    margin: 0 auto;
    background-image: url("/static/img/goos2__img.png");
    background-repeat: no-repeat;
    background-size: 9.375rem 2.1875rem;
    background-position: center center;
  }
  .u2 {
    // overflow: hidden;
  }
  .u1 > li {
    height: 14.4rem;
    width: 50%;
    float: left;
    padding: 0 0.5rem 0 0.5rem;
    // margin-bottom: 1.125rem;
    overflow: hidden;
  }
  .text {
    font-size: 0.8125rem;
    color: #13252e;
    font-family: PingFangSC-Regular;
    white-space: normal !important;
    letter-spacing: 0.0625rem;
    line-height: 1rem;
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-top: 0.625rem;
  }
  .linePrice {
    font-size: 0.875rem;
    color: #aeafaf;
    font-family: PingFangSC-Regular;
    text-decoration: line-through;
    text-align: left;
  }
  .u2 {
    // padding-bottom: 1.4375rem;
  }
  .sub {
    text-indent: 0.3rem;
  }
  .price {
    font-size: 0.9375rem;
    color: #ea2845;
    font-family: PingFangSC-Semibold;
    margin-top: 0.3125rem;
  }
  li.icon {
    max-height: 9.75rem;
    min-height: 5.875rem;
    height: 9.75rem;
    display: block;
    overflow: hidden;
    position: relative;
    // border: 1px solid #D8D8D8;
  }
  img {
    width: 100%;
    max-height: 9.75rem;
    display: block;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    // border: 1px solid #D8D8D8;
  }
}
</style>