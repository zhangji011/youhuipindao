<template>
  <div style="position: absolue;height:56.25rem;">
    <!-- style="position: absolue;width:100%; height:31.25rem;top:0;" -->
    <scroll
        :data = "shopList" :stopPropagation="stopPropagation" :scrollY="scrollY" @scroll="scrollListen">
         <ul class="scr">
            <li class="good" v-for="item in shopList" @click="goDetail(item.url)">
              <div class="good-i">
                <div class="t-0"><img :src="item.imgUrl"></div>
                <div class="t-1" style="-webkit-box-orient: vertical;">{{item.name}}</div>
                <div class="t-2">¥{{item.price}}</div>
              </div>
            </li>
            
            
        </ul>
         <!-- <ul class="scr">
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
        </ul>
         <ul class="scr">
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
            <li class="good">
              <div class="good-i">
                <div class="t-0"><img src="/static/img/1-17.png"></div>
                <div class="t-1">上班经常饿</div>
                <div class="t-2">¥1.1</div>
              </div>
            </li>
        </ul> -->
         <div class="null">————&nbsp;&nbsp;亲，我是有底线的&nbsp;&nbsp;————</div>
    </scroll>
</div>
</template>

<script>
import { GetDistance } from "@@/service/util";
import Scroll from "@@/components/scroll/scroll.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      stopPropagation: false,
      shopList: [
        {
          name: "精武卤味零食礼盒675g",
          price: "69.00 ",
          url:
            "https://mall.joypay.cn/cm-mall/goods/explosionTwentySeven.do?1=1",
          imgUrl: "/static/img/heyue1/1.jpg"
        },
        {
          name: "宜红羽露 经典盒装袋泡茶*25包 口味可选",
          price: "18.00 ",
          url: "https://mall.joypay.cn/cm-mall/goods/explosionThirty.do?1=1",
          imgUrl: "/static/img/heyue1/2.jpg"
        },
        {
          name: "吉利火星罐装爆米花150克*4罐 口味随机 ",
          price: "31.00 ",
          url:
            "https://mall.joypay.cn/cm-mall/goods/explosionTwentyEight.do?1=1",
          imgUrl: "/static/img/heyue1/3.jpg"
        },
        {
          name: " 希尔顿酒店同款加大加厚柔软面巾2条装",
          price: "48.00 ",
          url: "http://www.ylife.cn/mobile/item/12381.html?storeId=215",
          imgUrl: "/static/img/huazhu1/1.jpg"
        },
        {
          name: "乐扣乐扣  创意便捷运动水杯",
          price: "50.00 ",
          url: "http://www.ylife.cn/mobile/item/11993.html?storeId=215",
          imgUrl: "/static/img/huazhu1/2.jpg"
        },
        {
          name: "全球通用旅行插座转换器",
          price: "70.00 ",
          url: "http://www.ylife.cn/mobile/item/12369.html?storeId=215",
          imgUrl: "/static/img/huazhu1/3.jpg"
        },
        {
          name:
            "乐事（Lay’s）无限薯片 休闲零食 104g*3组合装（原味+烤肉+番茄）百事食品",
          price: "18.90 ",
          url:
            "https://cmpay.jdcloud.com/jd/product/sku_view.jsp?skuId=963181&",
          imgUrl: "/static/img/jingdong1/1.jpg"
        },
        {
          name: "【京东超市】雪花啤酒（Snowbeer） 8度清爽330ml*24听整箱装",
          price: "49.90 ",
          url:
            "https://cmpay.jdcloud.com/jd/product/sku_view.jsp?skuId=3532366&",
          imgUrl: "/static/img/jingdong1/2.jpg"
        },
        {
          name:
            "三只松鼠零食特产每日坚果送礼礼盒夏威夷果碧根果坚果大礼包火红A1493g/盒",
          price: "108.00 ",
          url:
            "https://cmpay.jdcloud.com/jd/product/sku_view.jsp?skuId=3995878&",
          imgUrl: "/static/img/jingdong1/3.jpg"
        },
        {
          name: "百乐可碎巧克力饼干 350g*3袋组合装",
          price: "35.00 ",
          url: "https://h.umfintech.com/mallweb/h5hb/goodsdetail/028/8008.htm?",
          imgUrl: "/static/img/juu1/1.jpg"
        },
        {
          name: "中粮时怡麻辣牛肉条",
          price: "30.00 ",
          url: "https://h.umfintech.com/mallweb/h5hb/goodsdetail/946/8001.htm?",
          imgUrl: "/static/img/juu1/2.jpg"
        },
        {
          name: "圣卡罗传统番茄风味薯片 2袋*150g组合装",
          price: "33.00 ",
          url: "https://h.umfintech.com/mallweb/h5hb/goodsdetail/030/8008.htm?",
          imgUrl: "/static/img/juu1/3.jpg"
        },
        {
          name: "户外运动足球袜长筒袜",
          price: "12.90 ",
          url:
            "https://union.juanpi.com/cpsfollow/call_url?utm=2176175&target=https://muser.juanpi.com/hebao/auth_web?go=45195458",
          imgUrl: "/static/img/juanpi1/1.jpg"
        },
        {
          name: "亿动5号专用足球",
          price: "29.00 ",
          url:
            "https://union.juanpi.com/cpsfollow/call_url?utm=2176176&target=https://muser.juanpi.com/hebao/auth_web?go=52695234",
          imgUrl: "/static/img/juanpi1/2.jpg"
        },
        {
          name: "乔丹格兰男运动足球鞋",
          price: "89.00 ",
          url:
            "https://union.juanpi.com/cpsfollow/call_url?utm=2176177&target=https://muser.juanpi.com/hebao/auth_web?go=47775535",
          imgUrl: "/static/img/juanpi1/3.jpg"
        },
        {
          name: "雪花啤酒冰酷拉罐330ml*24听",
          price: "44.90 ",
          url:
            "https://sn.51hive.com:7787/Repeater/GoodsDetail/160000000000000131257768?state=1",
          imgUrl: "/static/img/suning1/1.jpg"
        },
        {
          name:
            "百草味（BE&CHEERY）牛肉粒(五香味)100g/包*5包 牛肉粒 五香味 百草味出品",
          price: "88.00 ",
          url:
            "https://sn.51hive.com:7787/Repeater/GoodsDetail/160000000000000780000894?state=1",
          imgUrl: "/static/img/suning1/2.jpg"
        },
        {
          name:
            "百草味（BE&CHEERY）仁仁果缤纷果仁175g/盒 坚果 混合果仁 百草味出品",
          price: "34.50 ",
          url:
            "https://sn.51hive.com:7787/Repeater/GoodsDetail/160000000000000780000866?state=1",
          imgUrl: "/static/img/suning1/3.jpg"
        }
      ]
      //   defaultIcon: 'this.src="' + "/static/img/error.png" + '"'
    };
  },
  props: {
    scrollY: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["token"])
  },

  mounted() {},
  created() {
    this.shopList = this.shopList.sort(() => {
      return Math.random() > 0.5 ? -1 : 1;
    });
  },

  components: {
    Scroll
  },

  // computed: {},

  methods: {
    scrollListen(pos) {
      console.log("goodThing");
      console.log(pos);
      // if(Math.abs(pos.y)<5){
      //   this.$emit('changeIscrollY',true)
      // }else{
      //   this.$emit('changeIscrollY',false)
      // }
      // if(Math.abs(pos.y)>320){
      //   this.OPENANDCLOSE(false)
      //   this.topCat = true;
      // }else{
      //   this.topCat = false;
      //   this.OPENANDCLOSE(true)
      // }
    },
    goDetail(url) {
      // alert(url)
      if (
        (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
        "android"
      ) {
        let url2 =
          url.indexOf("?") > 0
            ? url.replace(
                /\?/,
                "?hebaosso=true&SOURCE=DISCOVER&HEADER_FLG=1&account=" +
                  this.token.productNo +
                  "&"
              )
            : url +
              "?hebaosso=true&SOURCE=DISCOVER&HEADER_FLG=1&account=" +
              this.token.productNo;
        console.log(url2);
        window.goActivity.goWeb(url2);
      } else {
        let url_2 =
          url.indexOf("?") > 0
            ? url.replace(
                /\?/,
                "?hebaosso=true&SOURCE=DISCOVER&HEADER_FLG=1&account=" +
                  this.token.productNo +
                  "&"
              )
            : url +
              "?hebaosso=true&SOURCE=DISCOVER&HEADER_FLG=1&account=" +
              this.token.productNo;
        window.location = "activity://goWeb?url=" + url_2;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";

.scr {
  display: -webkit-flex;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap; /* Safari 6.1+ */
  width: 100%;
}
.good {
  // margin: 0 1.25rem;
  // flex: 1;
  padding-top: 0.5625rem;
  width: 33%;
  align-content: space-around;
}
.good-i {
  // width: 90%;
  margin-left: 0.4375rem;
  padding: 0.9375rem;
  border: 0.0625rem solid #e6e6e6;
  border-radius: 0.3125rem;
}
div.good-i {
  // margin-right:.4375rem;
}

.good:nth-of-type(3n + 3) .good-i {
  margin-right: 0.4375rem;
}
.t-0 {
  width: 100%;
  img {
    display: block;
    width: 100%;
    border-radius: 0.125rem;
    height: 5.4375rem;
    overflow: hidden;
    // padding: .625rem;
  }
}
.t-1 {
  
  font-family: "PingFangSC-Regular";
  font-size: .75rem;
  margin: .5rem 0;
  overflow: hidden;
  white-space: normal!important;
  display: -webkit-box;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  color: #333;
  
  line-height: 1.3;
}
.t-2 {
  font-family: "PingFangSC-Medium";
  font-size: 0.75rem;
  color: #e31b30;
  letter-spacing: -0.00625rem;
  line-height: 0.75rem;
  padding: 0.5rem 0rem;
}
.null {
  height: 12rem;
  padding-top: 1.2rem;
  font-size: 0.6875rem;
  color: #afadadc4;
}

// .list-wrapper{
//   margin-right: .4375rem;
// }
</style>
