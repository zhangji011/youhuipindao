<template>
    <div class="goods-3">
      <div class="nullHeight"></div>
      <div class="title">
        <div class="t-text"></div>
        <!-- <div class="hr-1"></div> -->
      </div>

     <div class="goods">
        <ul class="u1">
          <li>
            <ul class="u2" v-for="(item, index) of jdList" :key="'good3_'+index">
              <li class="text">
                {{item.title}}
              </li>
              <li class="icon" @click="goDetail($event,item,3)">
                <img v-lazy="item.imageUrls[0]"/>
                <img v-lazy="item.imageUrls[1]"/>
                <img v-lazy="item.imageUrls[2]"/>
              </li>
              <div class="hr-2"></div>
            </ul>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import { fetchPoints } from "@@/service/util";
import { mapState } from "vuex";
import sa from'sa-sdk-javascript';
// import axios from "@@/plugins/rsa/axios";
export default {
  data() {
    return {
      // jdList: [],
    };
  },
  computed: {
    ...mapState(["token"])
  },

  mounted() {
    // this.init();
  },
  props: {
    jdList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {},

  components: {
  },

  methods: {
    goDetail(event, obj, flag) {
      // 神策
      sa.track('ZoneClick', {
        topCategory: '优惠',
        subCategory:  '京东资讯',
        locationOfZone: '附图',
        contentName: obj.title
      });
      fetchPoints(
        "010000000000", // 页面索引
        "010000000000K09", //事件标记
        this.token.productNo,
        "京东咨询-" + obj.title, // 事件名称
        this.token.session.replace(/\+/g, "%2B")
      );
      this.$emit("goDetail", event, obj, flag);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
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
}
.hr-2 {
  height: 0.0625rem;
  width: 90%;
  margin: 0 auto;
  background: #f6f7f8;
}
.goods-3 {
  clear: both;
  .title {
    position: relative;
    height: 2.5rem;
    text-align: center;
    position: relative;
    line-height: 2.5rem;
  }
  .t-text {
    height: 100%;
    line-height: 2.5rem;
    width: 7.5rem;
    margin: 0 auto;
    background-image: url("/static/img/goos3_img.png");
    background-repeat: no-repeat;
    background-size: 9.375rem 2.1875rem;
    background-position: center center;
  }
  .u1 {
    padding: 0 !important;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 0.6875rem;
    .u2 {
      position: relative;
    }
    li {
        width: 100%;
    }
    li.icon {
      max-height: 6.75rem;
      height: 6.75rem;
      display: flex;
      margin-bottom: 1rem;
    }
    img {
      flex: 3;
      display: block;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      max-width: 6.75rem;
      max-height: 6.75rem;
      position: relative;
      top: 50%;
      left: 20%;
      transform: translate(-50%, -50%);
      // border: 1px solid #D8D8D8;
    }
    .text {
      width: 80%;
      height: 1rem;
      color: #13252e;
      font-size: 0.9375rem;
      line-height: 1rem;
      font-family: PingFangSC-Regular;
      padding-left: 0.9375rem;
      margin-top: 1.125rem;
      margin-bottom: 0.625rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
    .aa {
      position: relative;
      height: 5rem;
      padding: 0.3125rem 0.625rem;
      top: 0.75rem;
      background: #fff;
      z-index: 10;
      color: #444444;
      font-size: 0.75rem;
      text-align: center;
  }
}
</style>
