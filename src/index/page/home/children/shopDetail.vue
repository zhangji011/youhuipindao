<template>
  <div class="container">
    <div class="s_1">
      <ul>
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>商户详情</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>
    <ul class="formCom">
      <li>
        <label>
					<span>商户名称：</span>
          <span>{{shopData.mName}}</span>
        </label>
      </li>
			<div class="hr-2"></div>
      <li>
        <label>
					<span>商户简称：</span>
          <span>{{shopData.mAbbreviation}}</span>
        </label>
      </li>
			<div class="hr-2"></div>
      <li>
        <label>
					<span>商户编号：</span>
          <span>{{shopData.mNumber}}</span>
        </label>
      </li>
			<div class="hr-2"></div>
      <div class="s_2">
        <div class="wrap">
          <div class="wrap_left">商户地址：</div>
          <div>
            <span class="wrap-text">{{shopData.mBusAddress}}</span>
          </div>
        </div>
      </div>
    </ul>
    
    <div class="btnWarp">
      <span class="subBtn" @click='goReg()'>开始巡检</span>
    </div>
   
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "@@/plugins/rsa/axios";
import {
  animationProgress,
  AppFlag
} from "@@/service/util";
import { baseUrl } from "@@/config/env";
import Scroll from "@@/components/scroll/scroll.vue";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      shopData: {},
      mNumer: '',
      couponList: [],
      isPayWrapper: false,
      scrollbar:false,
      isDisable: false,
      bgIcon: false,
      params: '',
      show: true
    };
  },
  computed: {
    ...mapState([
      "token",
      "shopParm",
      "sliderScroll",
      "latitude",
      "longitude",
      "cityname"
    ]),
    dataList() {
      if (this.showAll == false) {
        var dataList = [];
        if (this.couponList.length > 4) {
          for (var i = 0; i < 4; i++) {
            dataList.push(this.couponList[i])
          }
        } else {
          dataList = this.couponList
        }
        return dataList;
      } else {
        return this.couponList
      }
    }
  },

  mounted() {
    // 隐藏进度条
    // document.getElementById("pg").style.display="none";
  },
  created() {
    this.init();
  },
  components: {
    Scroll
  },
  methods: {
    ...mapMutations([
       'ISSHOWALERT',
        "CITYNAME1",
       'ALERTTEXTFIRST'
     ]),
    init() {
      
      let params =this.shopParm?this.shopParm:JSON.parse(Cookies.get("item"));
      if(!params.hasOwnProperty("longitude")){
        params=JSON.parse(Cookies.get("item"))
      }
      Cookies.set("item",params)
      axios.post("merchants/getMerchantsInfoDetails", params).then(res => {
        if (res.code === "0") {
          this.shopData = res.data;
          this.mNumer = res.data.mNumber;
          console.log(this.mNumer);
        }
      })
    },
    clickToast() {
      this.$dialog('提交成功');
    },
    clickClose() {
      this.isPayWrapper = false;
    },
    goBusinessCheck() {
      this.$router.push("/businessCheck");
    },
    goReg() {
      let shopId = this.shopData.id;
      let that = this;
      this.params = Cookies.get("userId");
      let params_ = "?userId=" + this.params + "&merId=" + this.shopData.id;
      let addParams = "&latitude=" + window.LATITUDE + "&longitude=" + window.LONGITUDE + "&name=" + this.shopData.mName + "&address=" + this.shopData.mBusAddress;
      // this.isPayWrapper = true;
      this.$weui.confirm('<div style="font-size:0.75rem"class="weui-cells weui-cells_radio"><label style="font-size:0.75rem;padding: 0.625rem 0.9375rem;"class="weui-cell weui-check__label"for=r1>商户位置准确且名称与营业执照一致<div class=weui-cell__ft><input required type=radio class=weui-check name=sex value=0 id=r1 tips=请选择><span class=weui-icon-checked></span></div></label><label class="weui-cell weui-check__label"for=r2>该地址无此商户<div class=weui-cell__ft><input type=radio name=sex class=weui-check value=1 id=r2><span class=weui-icon-checked></span></div></label><label class="weui-cell weui-check__label"for=r3>商户地址不详，找不到具体位置<div class=weui-cell__ft><input type=radio name=sex class=weui-check value=2 id=r3><span class=weui-icon-checked></span></div></label><label class="weui-cell weui-check__label"for=r4>商户异常(关门或装修等)<div class=weui-cell__ft><input type=radio name=sex class=weui-check value=3 id=r4><span class=weui-icon-checked></span></div></label></div>', {
        title: '请选择商户状态',
        buttons: [{
            label: '取消',
            type: 'default',
            onClick: function(){ console.log('no') }
        }, {
            label: '确定',
            type: 'primary',
            onClick: function(){
              let item = null,
                  obj = document.getElementsByName("sex");
              for (let i = 0; i < obj.length; i++) { //遍历Radio 
                  if (obj[i].checked) {
                      item = obj[i].value;                   
                  }
              };
              if(item == 0) {
                console.log(params_);
                window.location.href = "https://find.cmpay.com:9102/hebao/csxj/index.html" + params_
                // window.location.href = "https://hbtest.letshappy.cn/h5/index.html" + params_
              } else if(item == 1) {
                  window.location.href = "https://find.cmpay.com:9102/hebao/csxj/upload.html" + params_ + "&statusType=1 "
                  // window.location.href = "https://hbtest.letshappy.cn/h5/upload.html" + params_ + "&statusType=1 "
              } else if(item == 2) {
                  // that.goBusinessCheck(item);
                  window.location.href = "https://find.cmpay.com:9102/hebao/csxj/address.html" + params_ + addParams + "&statusType=2 "
                  // window.location.href = "https://hbtest.letshappy.cn/h5/address.html" + params_ + addParams + "&statusType=2 "
              } else if(item == 3) {
                  window.location.href = "https://find.cmpay.com:9102/hebao/csxj/upload.html" + params_ + "&statusType=3"
                  // window.location.href = "https://hbtest.letshappy.cn/h5/upload.html" + params_ + "&statusType=3"
              }
            }
        }]
      });
    },
    changeIscrollY(flag) {
      this.scrollY = flag;
    },
    goBack() {
      this.$router.go(-1);
      // this.$router.push("/home1");
    }
  }
};
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
  z-index: 100;
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
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-family: PingFangSC-Regular;
    font-size: .875rem;
    color: #13252e;
    // border-bottom: 1px solid #e5e5e5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
		.special {
			position: absolute;
			top: 1.125rem;
			right: 1rem;
			width: .9375rem;
			height: .9375rem;
		}
	}
  .formCom label {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    top: .75rem;
  }
  .formCom option {
    color: #666; }

.nullHeight {
  height: .5625rem;
  background: #f6f7f8;
}
.hr-2 {
  width: 100%;
  display: block;
  position: absolute;
  background: #f4f4f4;
  height: .0625rem;
  float: left;
}

.wrap {
  width: 95%;
  float: left;
  padding-left: 1.5rem;
    font-family: PingFangSC-Regular;
    font-size: .875rem;
  .wrap_left {
    float: left;
    line-height: 3rem;
  }
}
.wrap-text {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 0.875rem;
  color: #13252e;
  padding: 0.8rem 0 0.7rem 0.3rem;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  // line-height: 1.5rem;
}

.btnWarp {
  margin: 2.625rem 0.625rem 0 0.625rem; 
  .subBtn {
    display: block;
    margin: 0 auto;
    width: 40%;
    color: #fff;
    text-align: center;
    font-size: 0.9375rem;
    line-height: 2.6rem;
    background-color: #5592fa;
    -webkit-border-radius: 0.3125rem;
    border-radius: 0.3125rem;
    cursor: pointer; }
  }

.payWrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999999999;
  .menuWrapper {
    position: absolute;
    bottom: 30%;
    left: 8%;
    width: 84%;
    text-align: center;
    line-height: 3rem;
    background-color: #fff;
    color: #3478f6;
    .top {
      background: url(/static/img/sys.png) no-repeat 38% 50%;
      background-size: 1rem;
    }
    .middle {
      background: url(/static/img/ewm.png) no-repeat 37.5% 50%;
      background-size: 1.4rem;
    }
    .bottom {
      color: #555;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
  .menuWrapper {
    transition: all 0.3s;
  }
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  .menuWrapper {
    transform: translate3d(0, 100%, 0)
  }
}
</style>
