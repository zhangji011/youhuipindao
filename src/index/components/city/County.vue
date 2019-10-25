<template>
  <div class="list" ref="wrapper">
    <div class="button-lists">
      <div
        class="button-wrapper"
        v-for="item in cityArea"
        :key="item.indexName"
        @click="handleCityClick(item)"
      >
        <div id="buttonBg" class="button">{{item.area_name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { mapState, mapMutations } from 'vuex'
import axios from "@@/plugins/rsa/axios";
import Bus from '@@/page/home/children/gongtong.js'
import Cookies from 'js-cookie'
import sa from "sa-sdk-javascript";
export default {
  name: 'CityList',
  props: {
    cityArea: Array
  },
  data () {
    return {
      cityName:"",
      county: sessionStorage.county || "全城",
      showList: false,
      cityArea: [],
      isList: false
    }
  },
  computed: {
    ...mapState({
      currentCity: 'city'
    })
  },
  watch: {
    // 监听 Alphabet 中传过来的letter，如有变化，则滚动区域自动滚动到对应元素上
    letter () {
      if (this.letter) {
        if(this.letter=="定位"){
          this.scroll.scrollToElement(document.getElementsByClassName("top")[0])
        }else if(this.letter=="热门"){
          this.scroll.scrollToElement(document.getElementsByClassName("top1")[0])
        }
        else{
        const element = this.$refs[this.letter][0]// 获取对应字母的ref
        this.scroll.scrollToElement(element) // 利用better-scroll插件 滚动到指定元素element
        console.log(document.getElementsByClassName("top")[0])
        console.log("21e213ee")
      }
      }
    }
  },
  methods: {
    goback1(){
      // 神策
      sa.track("buttonClick", {
        buttonName: "已定位城市点击",
        topCategory: "外放优惠城市页",
        subCategory: "外放优惠：城市页"
      });
      var S={
        cityName:"",
        longitude:"",
        latitude:""
      }
      S.cityName=Cookies.get("city2")
      S.longitude=Cookies.get("city1")
      S.latitude=Cookies.get("city")
      sessionStorage.removeItem("county")
      Bus.$emit('val', S.cityName)
      Cookies.set("item",JSON.stringify(S))
      // this.$router.push("/home1")
      this.$router.push({
        path: "/home1",
        query: {
            params2: 5
          }
      })
    },
    gotoList() {
      // 神策
      sa.track("buttonClick", {
        buttonName: "区县选择点击",
        topCategory: "外放优惠城市页",
        subCategory: "外放优惠：城市页"
      });
      this.showList = !this.showList;
      this.isList = !this.isList;
    },
    goback(){
      this.$router.push("/home")
    },
    handleCityClick (city) {
      // 神策
      sa.track("buttonClick", {
        buttonName: "城市切换点击",
        topCategory: "外放优惠城市页",
        subCategory: "外放优惠：城市页"
      });
      sessionStorage.removeItem("county");
      // this.$store.commit('changeCity', city) // 将参数city传给vuex中的mutations中的changeCity函数
      Bus.$emit('val', city.city_name )
      Cookies.set("item",JSON.stringify(city))
      axios.post("queryAreaConfig",{
        cityName: city.city_name,
        cityCode: city.city_code
      }).then(res => {
        if(res.code === "0") {
          let data = res.data;
          this.cityArea = data;
          this.isAreaList = !this.isAreaList;
        }
      })
      // this.$router.push('/home1')
      this.$router.push({
        path: "/home1",
        query: {
            params2: 5
          }
      })
    },
    handleCityList (city) {
      console.log(city);
      // 神策
      sa.track("buttonClick", {
        buttonName: "城市切换点击",
        topCategory: "外放优惠城市页",
        subCategory: "外放优惠：城市页"
      });
      sessionStorage.removeItem("county");
      // this.$store.commit('changeCity', city) // 将参数city传给vuex中的mutations中的changeCity函数
      Bus.$emit('val', city.city_name )
      Cookies.set("item",JSON.stringify(city))
      axios.post("queryAreaConfig",{
        cityName: city.city_name,
        cityCode: city.city_code
      }).then(res => {
        if(res.code === "0") {
          let data = res.data;
          this.cityArea = data;
          this.isAreaList = !this.isAreaList;
        }
      })
      // this.$router.push({
      //   path: "/home1",
      //   query: {
      //       params2: 5
      //     }
      // })
    },
    handleDisClick (city) {
      // 神策
      sa.track("buttonClick", {
        buttonName: "搜索列表城市点击",
        topCategory: "外放优惠城市页",
        subCategory: "外放优惠：城市页"
      });
      this.county = city.area_name;
      sessionStorage.county = city.area_name;
      let params = city.area_name;
      this.$store.commit("COUNTYPARM", params);
      // this.$store.commit('changeCity', city) // 将参数city传给vuex中的mutations中的changeCity函数
      Bus.$emit('val', city.area_name)
      Cookies.set("item",JSON.stringify(city))
      // this.$router.push('/home1')
      this.$router.push({
        path: "/home1",
        query: {
            params: city.area_name
          }
      })
    }
  },
  mounted () {
    this.cityName=window.CITYNAME
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: true
    })
  },

}
</script>

<style scoped>
.currArea {
  height: 2.5rem;
  line-height: 2.5rem;
}
.area {
  margin-top: .5rem;
}
.d1{
  padding-top: 0.625rem;
  margin-left: 0.9375rem;
  position: relative;
  right: 0;
}
.list {
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.title {
  line-height: 1.5rem;
  background: #fff;
  padding-left: 1rem;
  color: #7e7e7e;
  font-size: 0.875rem;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.currT {
  font-family: PingFangSC-Regular;
  font-size: 0.8125rem;
  color: #7e7e7e;
}
.currTs {
  font-family: PingFangSC-Regular;
  font-size: 0.8125rem;
  padding-left: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  color: #7e7e7e;
}
.curR {
  display: inline-block;
  float: right;
  font-family: PingFangSC-Regular;
  font-size: 0.8125rem;
  color: #7E7E7E;
  margin-right: 0.2rem;
  line-height: 1.5rem;
  padding: 0 1.5rem 0 0.5rem;
  line-height: 2.5rem;
}
.down_img {
  background: url(/static/img/arrow_1.png) no-repeat 42% 50%;
  background-size: auto 80%;
  padding-left: .8rem;
}
.top_img {
  background: url(/static/img/arrow_2.png) no-repeat 42% 50%;
  background-size: auto 80%;
  padding-left: .8rem;
}
.cityT {
  font-family: PingFangSC-Regular;
  font-size: 0.8125rem;
  color: #13252E;
}
.button-list {
  overflow: hidden;
  /* padding: 0.125rem 1.875rem 0.125rem 0.625rem; */
  padding: 0;
  padding-bottom: 0.625rem;
  margin-left: 0.9375rem;
}
.button-lists {
  padding-bottom: 0.625rem;
  padding-left: 0.9375rem;
}
.button-wrapper {
  float: left;
}
.button {
  /* margin: 4px;
  padding: 4px 0; */
  width:5.375rem;
  height:2rem;
  line-height:2rem;
  margin: 0.25rem 0;
  padding: 0 .2rem;
  margin-right: 0.625rem;
  /* background:rgba(240,240,240,1); */
  border: 1px solid #E6E6E6;
  border-radius:0.1rem;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #13252E;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item {
  position: relative;
  line-height: 2.5rem;
  padding-left: 0.9375rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-family: PingFangSC-Regular;
  font-size: 0.875rem;
  color: #13252E;
}
.link_icon {
    position: absolute;
    top: .8rem;
    right: 3.5rem;
    width: 1.125rem;
    height: 1.125rem;
  }
.nullHeight {
  height: .5625rem;
  background: #f6f7f8;
}
</style>
