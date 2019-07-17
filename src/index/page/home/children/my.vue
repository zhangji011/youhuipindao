<template>
  <div class="container">
    <div class="s_1">
      <ul>
        <!-- <router-link tag="li" class="l t" to="/home1"></router-link> -->
        <li class="l">
            <span>个人中心</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>
		<div>
			<div class="logoIcon"><span>{{params}}</span></div>
		</div>
    <ul class="formCom">
      <li class="totol" style="height:4rem;">
        <label>
          <img src="/static/img/totol.png" alt="">
					<span>累计巡检商户：{{params2}}家</span>
        </label>
      </li>
      <li @click="$router.push('/home1')">
        <label>
          <img src="/static/img/ed.png" alt="">
					<span>商户巡检</span>
          <img class="special" src="/static/img/link_button.png" alt="">
        </label>
      </li>
			<div class="nullHeight"></div>
      <li @click="goReset()">
        <label>
          <img src="/static/img/ys.png" alt="">
					<span>密码修改</span>
          <img class="special" src="/static/img/link_button.png" alt="">
        </label>
      </li>
			<div class="nullHeight"></div>
      <li @click="clickLogout">
        <label>
          <img src="/static/img/exit.png" alt="">
					<span>退出登录</span>
          <img class="special" src="/static/img/link_button.png" alt="">
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "@@/plugins/rsa/axios";
import { baseUrl } from "@@/config/env"; // baseUrl
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      name: '',
      params: '',
      params2: ''
    }
  },
  mounted() {
    this.getUserinfo();
    this.params = Cookies.get("mblno");
    // this.params2 = Cookies.get("totalBus");
    // console.log(Cookies.get("mblno"));
  },
  created() {
  },

  components: {
    
  },

  computed: {
    ...mapState([
      "mblno"
    ])
  },

  methods: {
    clickLogout() {
      this.$weui.dialog({
        title: '退出',
        content: '是否退出当前账号',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: () => {
            
          }
        }, {
          label: '确定',
          type: 'primary',
          onClick: () => {
            Cookies.remove('mblno');
            Cookies.remove('totalBus');
            Cookies.remove('params');
            Cookies.remove('item');
            this.$router.push('/')
          }
        }]
      })
    },
    getUserinfo() {
      axios.post("user/queryUser",{
        userId: Cookies.get("userId"),
      }).then(res => {
        if(res.code === "0") {
          let data = res.data.totalNumber;
          this.params2 = data;
        }
      })
    },
    goReset() {
      let params = this.$route.query.params;
      sessionStorage.params = params;
      this.$router.push({
        path: "/reset",
        query: {
            params: params
          }
      });
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
	background: #ededed;}
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
	  position: relative;
  	height: 4.5rem;
    background: url(/static/img/user_logo.png) 1.2rem 1rem no-repeat;
    background-size: 3.5rem 3.5rem;
		span {
			position: absolute;
			top: 35px;
    	left: 5.625rem;
		}
}
.formCom {
  // padding-left: 0.625rem;
  background: #fff; }
  .totol {height: 4rem;background: #ededed;}
  .formCom li {
    color: #333;
    font-size: 0.9375rem;
    height: 3rem;
    line-height: 3rem;
    // border-bottom: 1px solid #e5e5e5;
    position: relative;
    overflow: hidden;
    cursor: pointer; 
		span {
			padding-left: 2.5rem;
		}
		.special {
			position: absolute;
			top: 1.125rem;
			right: 1rem;
			width: .9375rem;
			height: .9375rem;
		}
		}
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
    width: 1.625rem;
    height: 1.625rem;    
    position: absolute;
    top: .7rem;
  }
  .formCom option {
    color: #666; }

.nullHeight {
	  height: .5625rem;
    background: #f6f7f8;
}
</style>
