<template>
  <div id="city" class="scroll" >
    <!-- <img src="/logo.png" alt="" height="10px"> -->
    <div class="word" v-show="showWord">
      <span>{{letter}}</span>
    </div>
   
    <!-- <div class="title">  -->
      <!-- <li class="l t" @click="goBack()"></li> -->
      <!-- <router-link tag="li" class="l t" to="/"></router-link> -->
    <!-- <span style="display:inline-block;position:relative;left:-0.7rem;font-size:1.125rem">城市选择</span> -->
    <!-- <div class="searchWrapper" @click="done()"> -->
      <!-- <button class="btn"><span class="icon"><img src="/static/img/1-20.png"></span>城市名/拼音</button> -->
    <!-- </div> -->
    <!-- </div> -->
    <city-search :cities="cities"></city-search>
    <city-list
      :cities="cities"
      :loca="localCitys"
      :hot="hotCities"
      :letter="letter"
    ></city-list>
    <city-alphabet
      :cities="cities"
      @change="handleLetterChange"
    ></city-alphabet>
  </div>
</template>

<script>
import axios from 'axios'
import CityList from '@@/components/city/List'
import CitySearch from '@@/components/city/Search'
import CityAlphabet from '@@/components/city/Alphabet'
import Bus from './gongtong.js'
import Cookies from 'js-cookie'
export default {
  name: 'City',
  components: {
    CityList,
    CitySearch,
    CityAlphabet
  },
  data () {
    return {
      showWord: false,
      keyword: '',
      cities: {},
      hotCities: [],
      localCitys: [],
      letter: ''
    }
  },
  methods: {
    goback(){
      this.$router.go(-1)
    },
    getCityInfo () {
      let params_ = this.$route.query.params.split("市")[0];
      console.log(this.$route.query);
      axios.post("queryCityConfig",{cityName:params_}).then(res => {
        console.log(res);
        if (res.code === "0") {
          this.handleGetCityInfoSucc(res)
          this.localCitys= res.data.localCity;
          this.hotCities= res.data.hotCity;
          this.cities=res.data.city
        }
      });
    },
    handleGetCityInfoSucc (res) {
      console.log(res.data)
      res = res.data
      if (res.ret && res.data) {
        const data = res.data
        this.cities = data.city
        this.localCitys = data.localCity
        this.hotCities = data.hotCity
      }
    },
    handleLetterChange (letter) {
      if(letter=="top"){
        letter="当前城市"
      }
      if(letter=="top1"){
        letter="热门城市"
      }
      this.letter = letter
      this.showWord = true
      setTimeout(() => {
        this.showWord = false
        console.log(this.showWord)
      }, 500)
    }
  },
  mounted () {
    // this.getCityInfo()
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
}
.word {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  font-size:0.75rem;
  align-content: center;
  
}
.word span {
  display: inline-block;
  height: 3.75rem;
  width: 3.75rem;
  font-family: PingFangSC-Regular;
  background:#bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
}



  .icon {
    display: block;
    width: 1rem;
    height: 2rem;
    position: absolute;
    left: 0.625rem;
    // top: 0.9875rem;
    img {
      width: 100%;
      display: block;
      position: relative;
      top: 0.5rem;
    }
  }
  .searchWrapper {
    width: auto;
    height: 3rem;
    // margin-left: 4.1875rem;
    display: block;
    margin-right: 0.9375rem;
    position: relative;
    background: #fff;
    z-index: 99999999;
    .btn {
      display: block;
      height: 1.9375rem;
      width: 100%;
      z-index: 999;
      position: relative;
      top: 0.5rem;
      text-indent: 2em;
      line-height: 1.9375rem;
      text-align: left;
      color: #a7a7a7;
      background: #f0f1f2;
      border-radius: 0.25rem;
      font-size: 0.8125rem;
    }
  }
  .userInfo {
    display: block;
    float: right;
    position: relative;
    top: -2rem;
    font-family: PingFangSC-Regular;
    font-size: 0.6875rem;
    color: #5A6164;
    .avatar {
      position: relative;
      bottom: 0.1rem;
    }
    .avatar_icon {
      display: inline-block;
      width: 1.75rem;
      height: 1.75rem;
      background-image: url(/static/img/avatar_icon.png);
      vertical-align: middle;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  
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
</style>
