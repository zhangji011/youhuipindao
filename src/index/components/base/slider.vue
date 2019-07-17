<template>
  <div class="swiper">
    <swiper :options="swiperOption" ref='mySwiper'>
      <swiper-slide v-for="item in slider2">
				<!-- <a @click="goDetail($event,item,11,'top')" > -->
				<a>
					<img :src="item.marketingIcon">
				</a>
			</swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import sa from "sa-sdk-javascript";
import { setTimeout } from 'timers';
let vm = null;
export default {
  data() {
    return {
      swiperOption: {
        setWrapperSize: true,
        direction: 'horizontal',
        slidesPerView: 1.09,
        autoHeight: true,
        observeParents: true,
        //循环
        loop: true,
        initialSlide: 1,
        autoplay: {
          delay: 4000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        normalizeSlideIndex: false,
        spaceBetween: 6,
        slidesOffsetBefore: document.body.clientWidth/1.1*0.045,
        slidesOffsetAfter: 32,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        on: {
          click: function () {
            const realIndex = this.realIndex;
            vm.goDetail(realIndex);
          }
        },
        preventLinksPropagation: false   // 阻止点击事件冒泡
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
	methods: {
    goDetail(obj) {
      let url = this.slider2[obj].marketingEventCotent;
      let objs = this.slider2[obj];
      console.log(this.slider2[obj].marketingTitle);
      if(this.tokenstatus == 11) {
        if (
          (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
          "android"
        ) {
          let url2 =
            url.indexOf("?") > 0
              ? url.replace(
                  /\?/,
                  "?SOURCE=DISCOVER&account=" +
                    this.token.productNo +
                    "&"
                )
              : url +
                "?SOURCE=DISCOVER&account=" +
                this.token.productNo;
          window.goActivity.goWeb(url2);
        } else {
            let url_2 =
                url.indexOf("?") > 0
                  ? url.replace(
                      /\?/,
                      "?SOURCE=DISCOVER&account=" +
                        this.token.productNo +
                        "&"
                    )
                  : url +
                    "?SOURCE=DISCOVER&account=" +
                    this.token.productNo;
              // console.log(url_2);
              window.location = "activity://goWeb?url=" + url_2;
        };
      } else {
        // 神策
        sa.track("buttonClick", {
          buttonName: "登录查看更多优惠",
          topCategory: "外放优惠",
          subCategory: "外放优惠：登录"
        });
        let urls = "https://find.cmpay.com:9102/rcServer/hbopenreceive?state=" + window.location.href;
        if (
          (/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") ==
          "ios"
        ) {
          touristLogin(urls)
        } else {
          window.goActivity.startLoginModule('javascript:loginSuccess(%b)', urls)
        }
      }
      // this.$emit("goDetail", event, obj, flag);
      // 神策
      sa.track("bannerClick", {
        contentName: objs.marketingTitle,
        bannerNumber: String(objs.marketingNumber),
        topCategory: "优惠",
      });
    }
	},
	computed: {
    ...mapState([
      "slider2",
      "tokenstatus",
      "token"
    ]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  created() {
    vm = this;
  },
  mounted() {
    // setTimeout(()=>{
    //   console.log(this.$refs.swiper.swiper)
    //   this.$refs.swiper.swiper.init()
    // },2000)
  }
};
</script>

<style lang="scss" scoped>
.swiper {
   height: 9rem;
	 margin-bottom: 0.5rem;
}
.swiper-slide-prev img {
  // scale: 0.8;
  transform: scaleY(0.9)
}
.swiper-slide-next img{
  transform: scaleY(0.9);
}
.swiper-slide {
 
}
.swiper-slide-active img{
  // height: 10.5rem;
}
.swiper-container {
 
}
img {
  display: block;
  height: 8.9rem;
  width: 100%;
  border-radius: 2px;
	transition: all 0.6s ease 0s;
}
.swiper .swiper-pagination-bullets {
  bottom: 0px;
}
</style>
<style>
span.swiper-pagination-bullet {
  width: 0.25rem;
  height: 0.25rem;
  margin: 0 0.2rem !important;
  border: 1px solid #fff !important;
  box-sizing: content-box;
  background: none !important;
  opacity: 1 !important;
  /* background: rgba(255,255,255,1); */
}
span.swiper-pagination-bullet-active {
    width: 0.25rem;
    height: 0.25rem;
    /* background: #fff !important; */
    background: #fff !important;
  border: 1px solid #fff !important;
  opacity: none !important;
}
</style>
