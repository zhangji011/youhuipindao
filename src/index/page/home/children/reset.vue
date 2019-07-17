<template>
  <div class="container">
    <div class="s_1">
      <ul>
        <!-- <router-link tag="li" class="l t" to="/home1"></router-link> -->
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>密码修改</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>
    <ul class="formCom form-login">
      <li :class="showPwd?'icon-eye1':'icon-eye2'">
        <label>
          <input :type="showPwd?'password':'text'" placeholder="当前密码" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-model.trim='phone'/>
          <i @click='showPwd = !showPwd'></i>
        </label>
      </li>
      <li :class="showPwdOne?'icon-eye1':'icon-eye2'">
        <label>
          <input :type="showPwdOne?'password':'text'" placeholder="新密码" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-model.trim='pwdOne'>
          <i @click='showPwdOne = !showPwdOne'></i>
        </label>
      </li>
      <li :class="showPwdTwo?'icon-eye1':'icon-eye2'">
        <label>
          <input :type="showPwdTwo?'password':'text'" placeholder="再次输入新密码" v-model.trim='pwdTwo'>
          <i @click='showPwdTwo = !showPwdTwo'></i>
        </label>
      </li>
    </ul>
    <div class="btnWarp">
      <span class="subBtn" @click='goReg'>确认</span>
    </div>
    <div class="footer">
      <div>密码创建规则：</div>
      <span>1.密码长度至少为6位；<br>
        2.密码需包含字母、数字、符号2个或2个以上的组合；
      </span>
    </div>
  </div>
</template>
<script>
import axios from "@@/plugins/rsa/axios";
import Cookies from 'js-cookie';
  export default {
    data() {
      return {
        phone: '',
        imgCode: '',
        smsCode: '',
        pwdOne: '',
        pwdTwo: '',
        checked: true,      //是否同意协议
        showPwd: true,
        showPwdOne: true,   //开关--明文显示第一个密码
        showPwdTwo: true,   //开关--明文显示第二个密码
        canvas: {}          //存放canvas DOM节点
      }
    },
    methods: {
      goReg() {
        let checkPhone = /^[1][345789][0-9]{9}$/,
          checkName = /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/,
          // checkPwdOne = /^[\d\D]{6,12}$/,
          checkPwdOne = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          checkSMS = /^[0-9]{4,8}$/;
        //先做一些简单的判断再提交ajax
        if (checkPwdOne.test(this.phone) === false) this.$dialog('当前密码不正确');
        else if (checkPwdOne.test(this.pwdOne) === false) this.$dialog('新密码不正确');
        else if (this.phone == this.pwdOne) this.$dialog('不能设置相同密码');
        else if (this.pwdTwo !== this.pwdOne) this.$dialog('确认密码不正确');
        else {
          //先由跳到登录页暂代，后期ajax
          // this.$router.push('/login')
          axios.post('user/updatePassword',{
            "password": this.phone,
            "newPassword": this.pwdOne,
            "telephone": Cookies.get("mblno")
            }).then(res => {
              if(res.code === "0") {
                let data = res.data
                this.userData = data
                this.$dialog('修改成功')
                this.$router.go(-1)
                // setTimeout("javascript:location.href='https://hbtest.letshappy.cn/h5/csxunjian/main.html'", 1500);
              } else {
                this.$dialog('密码不对请重试')
              }
            });
        }
      },
      smsAjax() {
        console.log('在此发送短信ajax--组件中已$emit该函数')
      },
      sendCode(val) {
        this.imgCode = val
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~@@/style/mixin";

.container {
  overflow: hidden;
  min-height: 100%;
  background: #f6f7f8; }
  
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
    padding-right: 3.5rem;
    text-align: center;
  }
  .t {
    color: #6c6c6c;
    font-size: 0.9375rem;
    height: 3.125rem;
    position: relative;
    float: left;
    text-align: left;
    background-image: url(/static/img/left_back.png);
    background-repeat: no-repeat;
    background-position: 0.375rem 50%;
    background-size: 1.4rem;
    // padding-right: 0.6rem;
    @include space();
  }
}

.formCom {
  // padding-left: 0.625rem;
  background: #fff; }
  .formCom li {
    color: #333;
    font-size: 0.9375rem;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    overflow: hidden;
    cursor: pointer; }
    .formCom li:last-child {
      border-bottom: 1px solid #e5e5e5; }
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

i {
  margin-top: 0.65rem;
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 2;
  background: url(/static/img/icon-eye1.png) no-repeat 42% 50%;
  background-size: auto 70%;
}
.btnWarp {
  margin: 2.625rem 0.625rem 0 0.625rem; 
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
    cursor: pointer; }
  }
.footer {
  font-size: 0.8rem;
  font-family: PingFangSC-Regular;
  padding-left: 1.5rem;
  padding-top: 2rem;
  div {
    padding-bottom: 0.375rem;
  }
  span {
    color: #c7c7c7;
    line-height: 1.2rem;
  }
}  
</style>