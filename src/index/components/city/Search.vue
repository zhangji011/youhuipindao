<template>
  <div>
    <div class="title"> 
      <!-- <li class="l t" @click="goBack()"></li> -->
      <router-link tag="li" class="l t" to="/home1"></router-link>
      <div class="search">
        <!-- <input @click="goClickSearch()" v-model="keyword" type="text" class="search-input" :placeholder="placeholder"/> -->
        <span>定位城市切换</span>
      </div>
    </div>
    <div
      class="search-content"
      ref="search"
      v-show="keyword"
    >
      <ul>
        <li
          @click="goCityClick(item)"
          class="search-item border-bottom"
          v-for="item of list"
          :key="item.id"
        >
          {{item.city_name}}
        </li>
        <li class="search-item border-bottom" v-show="hasNoData">
          没有找到匹配数据
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import Bus from '@@/page/home/children/gongtong.js'
import { mapMutations } from 'vuex'
import Cookies from 'js-cookie'
import sa from "sa-sdk-javascript";
export default {
  name: 'CitySearch',
  props: {
    cities: Object,
    placeholder: {
      type: String,
      default: '城市名/拼音'
    }
  },
  data () {
    return {
      keyword: '',
      list: [],
      timer: null
    }
  },
  computed: {
    hasNoData () {
      return !this.list.length
    }
  },
  watch: {
    keyword () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        this.list = []
        return
      }
      this.timer = setTimeout(() => {
        const result = []
        for (let i in this.cities) {
          this.cities[i].forEach((value) => {
            if (value.cityNamePY.indexOf(this.keyword) > -1 || value.city_name.indexOf(this.keyword) > -1) {
              result.push(value)
            }
          })
        }
        this.list = result
      }, 100)
    }
  },
  methods: {
    goback(){
      this.$router.push('/home1')
    },
    goClickSearch () {
      // 神策
      sa.track("clickSearch", {
        operationType: "点击搜索框",
        currentPage: "外放优惠城市页"
      });
    },
    goCityClick (city) {
      sessionStorage.removeItem("county")
      sessionStorage.removeItem("indexPrev")
      Bus.$emit('val', city.city_name)
      Cookies.set("item",JSON.stringify(city))
      // console.log(city.city_name);
      // this.$router.push('/home1')
      this.$router.push({
        path: "/home1",
        query: {
            params2: 5
          }
      })
    },
    ...mapMutations(['changeCity'])
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.search, {click: true})
  }
}
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
  .title {
    align-content: center;
    line-height: 2.5rem;
    background: #FFFFFF;
    color:black;
    text-align: center;
    border-bottom: .5px solid #e6e6e6;
    .l {
    height: 100%;
    line-height: 3rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
    color: #13252e;
    padding-right: 2.5rem;
    text-align: center;
  }
  .t {
    color: #6c6c6c;
    font-size: 0.9375rem;
    height: 3rem;
    position: relative;
    float: left;
    text-align: left;
    background-image: url(/static/img/back.png);
    background-repeat: no-repeat;
    background-position: 0.7rem 50%;
    background-size: 1.1rem;
    // padding-right: 0.6rem;
    @include space();
  }
  }
  .search {
    width: auto;
    height: 3.125rem;
    line-height: 3.125rem;
    padding-right: 3rem;
    display: block;
    position: relative;
    .search-input {
      display: block;
      box-sizing: border-box;
      padding: .2rem 0;
      height: 1.9375rem;
      width: 96%;
      z-index: 999;
      background: url(/static/img/1-20.png) no-repeat 2% 50%;
      background-size: auto 50%;
      position: relative;
      top: 0.5rem;
      text-indent: 2em;
      line-height: 1.9375rem;
      text-align: left;
      color: #a7a7a7;
      background-color: #f0f1f2;
      border-radius: 0.25rem;
      font-size: 0.8125rem;
    }
  }
  .search-content {
    overflow: hidden;
    position: fixed;
    top: 3rem;
    left: 0;
    right: 0;
    bottom: 0;
    background: #eee;
    z-index: 99;
    .search-item {
      line-height: 2.5rem;
      // z-index: 999999999999;
      padding-left: 0.9375rem;
      background: #fff;
      color: #666;
    }
  }
</style>
