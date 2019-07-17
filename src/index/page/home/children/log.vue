<template>
  <div class="container">
    <div class="s_1">
      <ul>
        <!-- <router-link tag="li" class="l t" to="/home1"></router-link> -->
        <li class="l">
            <span>账号登录</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>
    <h2 class="logoIcon"></h2>
    <ul class="formCom form-login form-mini">
      <li class="icon-clear">
        <label>
          <img src="/static/img/mobile.png" alt="">
          <input type="number" placeholder="请输入账号" onkeyup="this.value=this.value.replace(/\s+/g,'')" oninput="if(value.length>11)value=value.slice(0,11)" v-model.number='name'>
        </label>
      </li>
      
			<div class="nullHeight"></div>
      <li>
        <label>
          <img src="/static/img/password.png" alt="">
          <input type='password' placeholder="请输入密码" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-model.trim='pwd'>
        </label>
      </li>
      
			<div class="nullHeight"></div>
      <li>
        <canvasCode @codeHasChange='sendCode'></canvasCode>
      </li>
    </ul>
    <div class="forgetWarp">
      <!-- <label>
        <input type="checkbox" v-model='remember'>
        记住密码
      </label> -->
      <!-- <span class="col6"></span> -->
      <!-- <span class="fr col6" @click="$router.push('/reg')">账号注册</span> -->
    </div>
    <div class="btnWarp">
      <span class="subBtn" @click='logIn'>登录</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import canvasCode from '@@/components/common/canvasCode';
import axios from "@@/plugins/rsa/axios";
import CryptoJS from "crypto-js";
import Cookies from 'js-cookie';
import { baseUrl } from "@@/config/env"; // baseUrl
export default {
  data() {
    return {
      name: '',
      pwd: '',
      code: '',
      // remember: false,
      // showPwd: true,  //开关--密码可见
      canvas: {}      //存放canvas DOM节点
    }
  },
  mounted() {
    // this.getListTitle();
  },
  created() {
  },

  components: {
    canvasCode
  },

  computed: {
    ...mapState([
    ])
  },

  methods: {
    logIn() {
      //先做一些简单的判断再提交ajax
      if (/^[1][345678][0-9]{9}$/.test(this.name) === false) this.$dialog('帐号不正确');
      else if (/^[\d\D]{6,12}$/.test(this.pwd) === false) this.$dialog('密码不正确');
      else if (this.code.toUpperCase() !== this.canvasCode.codeNums.toUpperCase()) this.$dialog('验证码不正确');
      else {
        //先跳到首页暂代，后期ajax替换
        axios.post('user/userLogin',{
          "telephone": this.name,
          "password": this.pwd
          }).then(res => {
            if(res.code === "0") {
              let data = res.data.bTelephone
              let totalNumber = res.data.totalNumber
              let userId = res.data.id
              this.userData = data
              this.$weui.toast('登录成功', 500)
              Cookies.set("mblno",data)
              Cookies.set("totalBus",totalNumber)
              Cookies.set("userId",userId)
              this.$router.push({
                path: "/my",
                query: {
                    params: data
                  }
              });
              // setTimeout("javascript:location.href='http://hebao.letshappy.cn:3020/h5/main.html#/mine'", 2000);
              // console.log(this.couponList);
            } else if(res.code === "-1") {
                this.$dialog('用户不存在')
            } else if(res.code === "-2") {
                this.$dialog('密码错误')
            } else if(res.code === "-3") {
                this.$dialog('账号已被锁定')
            }
          });
      }
    },

    goCancel() {
      //根据情景不一样，跳转的页面也会不同，暂定跳到我的借款首页
      //...省略
      this.$router.push('/loan')
    },
    sendCode(val) {
      this.code = val
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  activated(){
  },
  watch:{
}}
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";
.container {
  overflow: hidden;
  min-height: 100%;
  background: #ededed; }
.s_1 {
  @include wh(100%, 3.125rem);
  background: #383d41;
  position: sticky;
  z-index: 100000000;
  top: 0;
  left: 0;
  .l {
    height: 100%;
    line-height: 3.125rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
    color: #fff;
    text-align: center;
  }
  .t {
    color: #6c6c6c;
    font-size: 0.9375rem;
    height: 3.125rem;
    position: relative;
    float: left;
    text-align: left;
    background-image: url(/static/img/back.png);
    background-repeat: no-repeat;
    background-position: 0.375rem 50%;
    background-size: 1.1rem;
    // padding-right: 0.6rem;
    @include space();
  }
}
.logoIcon {
  width: 5rem;
  height: 5rem;
  margin: 1.25rem auto 1.25rem auto;
  background: url("/static/img/logo.png") 0.02rem 0 no-repeat;
  background-size: 100%;
  border-radius: 50%; }
.formCom {
  // padding-left: 0.625rem;
  background: #fff; }
  .formCom li {
    color: #333;
    font-size: 0.9375rem;
    height: 3rem;
    line-height: 3rem;
    // border-bottom: 1px solid #e5e5e5;
    position: relative;
    overflow: hidden;
    cursor: pointer; }
    // .formCom li:last-child {
    //   border-bottom: 1px solid #e5e5e5; }
    .formCom li:after {
      display: block;
      font-family: 'icons';
      color: #ccc;
      font-style: normal;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3; }
  .formCom label {
    display: block; 
    padding-left: 1.5rem;}
  .formCom input, .formCom .input {
    font-size: 0.875rem;
    line-height: 1.6rem;
    margin-top: 0.65rem;
    width: 72%;
    background: transparent;
    position: absolute;
    left: 4rem;
    top: 0;
    z-index: 2; }
  .formCom p {
    position: absolute;
    top: 0;
    width: 100%;
    padding-left: 27.5%; }
  .formCom select {
    font-size: 0.8125rem;
    height: 2.375rem;
    width: 100%;
    padding-left: 27.5%;
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    opacity: 0; }
  .formCom img {
    width: 1.375rem;
    height: 1.375rem;    
    position: absolute;
    top: .75rem;
  }
  .formCom option {
    color: #666; }

.btnWarp {
  margin: 1.625rem 0.625rem 0 0.625rem; 
  .subBtn {
    display: block;
    margin: 0 auto;
    width: 70%;
    color: #fff;
    text-align: center;
    font-size: 0.9375rem;
    line-height: 2.6rem;
    background-color: #5592fa;
    -webkit-border-radius: 0.3125rem;
    border-radius: 0.3125rem;
    // border: .0625rem solid #00c1de;
    cursor: pointer; }
  }
.forgetWarp {
  font-size: 0.8125rem;
  line-height: 2.5rem;
  margin: 0 0.9375rem 0 1.7rem;
  input {
    display: inline-block;
    position: relative;
    top: 0.0625rem;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 0.9375rem;
    height: 0.9375rem;
    background-color: #fff;
    z-index: 10;
  }
  .col6 {
    color: #666;
  }
  .fr {
    float: right; }
  }
.nullHeight {
	  height: .5625rem;
    background: #ededed;
}
</style>
