<template>
  <div>
      <div v-if="banner" class="banner" @click="goDetail($event,banner,2)">
        <img :src="banner.marketingIcon" >
      </div>
      <div class="goods">
        <ul class="u1">
          <li @click="goDetail($event,item,4)" v-for="item in data" :key="item.Special_ID">
            <ul class="u2">
              <li class="icon">
                <img :src="item.pic">
              </li>
              <li class="text">
                {{item.name}}
              </li>
              <li class="sub">
                <span class="price">¥{{(item.price)}}</span>
                <span class="linePrice">¥{{(item.originalPrice)}}</span>
              </li>
            </ul>
          </li>
        </ul>
     </div>
     <div class="nullHeight"></div>
  </div>
</template>
<script>
import { fetchPoints,GetDistance,getUUID,setMd5HY,encodeJson } from "@@/service/util";
import { mapState } from "vuex";
import axios from "@@/plugins/rsa/axios";
import sa from'sa-sdk-javascript';
export default {
  data() {
    return {
      data:{},
      // banner:{}
    };
  },
  props: {
    middle: {
      type: Array,
      default() {
        return [{},{},{}]
      }
    }
  },
  computed: {
    ...mapState(["token"]),
    banner:function(){
      return this.middle.length>=2 ? this.middle[1] : this.middle[0]
    }
  },

  mounted() {
    this.init();
  },
  created() {},


  methods: {
    init(){
      // this.banner = this.middle.length>=2 ? this.middle[1] : this.middle[0]
      // // 获取banner
      // axios.post('queryMarketing',{
      //   "position": "MIDDLE",
      //   "session": this.token.session.replace(/\+/g, "%2B") // 单点登录返回session
      // }).then((res)=>{
      //   this.banner = res.data.length>=2 ? res.data[1] : res.data[0]
      // });

      let param_ = {
        "channel":10197,
        "requestId":getUUID()
      };

      param_.sign = setMd5HY(param_);
      // 唯品会商品接口
      // http://113.108.79.80:3020/rcServer/queryGoodsByMerchant?merchant=31
      axios.get("queryGoodsByMerchant?merchant=31")
      .then(res => {
        // let data = res.Data.sort(() => {
        //   return Math.random() > 0.5 ? -1 : 1;
        // });
        this.data = this.filterObj(res.data.slice(0, 3)); // 每个专题必须至少返回3个商品 
        // console.log(this.data)
      });
      
    },
    filterObj(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].detailUrl) {
          obj[i].url = obj[i].detailUrl
        }
      }
      return obj;
    },
    goDetail(event, obj, flag) {
      if (flag == 2) {
        // 神策
        sa.track('ZoneClick', {
          contentName:'唯品会专题营销',
          subCategory: '唯品会会员福利月',
          topCategory: '优惠',
          locationOfZone: 'banner主图'
        });
        fetchPoints(
          "010000000000", // 页面索引
          "010000000000K02", //事件标记
          this.token.productNo,
          "唯品会专题营销位", // 事件名称
          this.token.session.replace(/\+/g, "%2B")
        );
      }
      if (flag == 4) {
        // 神策
        sa.track('ZoneClick', {
          contentName:'唯品会专题营销',
          subCategory: '唯品会会员福利月',
          topCategory: '优惠',
          locationOfZone: '附图'+obj.Name
        });
        fetchPoints(
          "010000000000", // 页面索引
          "010000000000K02", //事件标记
          this.token.productNo,
          "唯品会专题营销位-" + obj.Name, // 事件名称
          this.token.session.replace(/\+/g, "%2B")
        );
      }
      // alert(JSON.stringify(obj))
      this.$emit("goDetail", event, obj, flag);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.banner {
  width: 100%;
  overflow: hidden;
  margin-bottom: .5rem;
  img {
    width: 100%;
  }
}
.goods {
  padding-left: .6875rem;
  padding-right: .6875rem;
  .u2{
    overflow: hidden;
    
  }
  .u1 {
    padding: 0 !important;
    display: flex;
    padding-top: .6875rem;
    & > li {
      flex: 3;
      flex-direction: row;
      max-width: 34%;
    }

    li.icon {
      max-height: 6.875rem;
      height: 6.875rem;
      position: relative;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
    }
    img {
      display: block;
      max-width: 6.5625rem;
      // min-width: 6.3rem;
      max-height: 6.5625rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      // border: 1px solid #D8D8D8;
    }
    .text {
      text-indent: .3rem;
      font-size: .75rem;
      color: #13252e;
      font-family: PingFangSC-Light;
      text-align: center;
      text-align: left;
      padding-right: .75rem;
      @include space();
    }
    .price {
      font-size: .75rem;
      color: #ed1991;
      font-family: PingFangSC-Medium;
      text-align: left;
    }
    .linePrice {
      display: none;
      font-size: .75rem;
      color: #9b9b9b;
      font-family: PingFangSC-Regular;
      text-decoration: line-through;
      text-align: left;
    }
    .u2 {
      padding-bottom: 1.4375rem;
    }
    .sub {
      text-indent: .3rem;
    }
  }
}
</style>
