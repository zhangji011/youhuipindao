<template>
  <div class="content-wrapper">
    <div class="s_1">
      <ul>
        <li class="l t" @click="goBack()"></li>
        <li class="l">
            <span>商户巡检</span>
        </li>
      </ul>
      <div class="hr-1"></div>
    </div>

    <div class="home">
    <scroll>
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
					<span>商户地址：</span>
          <input type="text" v-model="inputVal">
          <img @click='clickLocation' src="static/img/gps.png">
        </label>
      </li>
			<!-- <div class="hr-2"></div> -->
      <div class="s_2">
        <div class="wrap">
          <div class="wrap_left"> <span>注意：点击商户右侧按钮可将商户地址修改为当前GPS定位地址, 如定位不准可手动调整</span> </div>
          <div>
            <!-- <span class="wrap-text">{{shopData.mBusAddress}}</span> -->
          </div>
        </div>
      </div>
    </ul>

    <div class="weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <div class=weui-uploader__hd>
              <p class=weui-uploader__title><span style="color:red;"> *必传：</span>门头照片 查看上传图片样例</p>
              <div class=weui-uploader__info>
                <span id=uploadCount1></span>
              </div>
            </div>
            </div>
            <div class="weui-uploader__bd">
              <ul class="weui-uploader__files" id="uploaderFiles">
                <li ref="files" class="weui-uploader__file needsclick" v-for="(image,index) in imagesOne" :key="index"
                    :style="'backgroundImage:url(' + image +' )'">
                    <!-- <span @click="deleteimg(index)" class="x">&times;</span> -->
                </li>
              </ul>
              <div v-show="imagesOne.length < maxCount" class="weui-uploader__input-box needsclick">
                <input id="uploaderInput" class="weui-uploader__input" type="file" 
                       @change="changeOne" accept="image/*" multiple=""/>
              </div>
            </div>
              <p>注意：巡检人员头像需在门头照中露出</p>
          </div>
        </div>
      </div>

    <div class="weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <div class=weui-uploader__hd>
              <p class=weui-uploader__title> 选传：</span>和包物料照片</p>
              <div class=weui-uploader__info>
                <span id=uploadCount1></span>
              </div>
            </div>
            </div>
            <div class="weui-uploader__bd">
              <ul class="weui-uploader__files" id="uploaderFiles">
                <li ref="files" class="weui-uploader__file needsclick" v-for="(image,index) in imagesTwo" :key="index"
                    :style="'backgroundImage:url(' + image +' )'">
                    <!-- <span @click="deleteimg2(index)" class="x">&times;</span> -->
                </li>
              </ul>
              <div v-show="imagesTwo.length < maxCount" class="weui-uploader__input-box">
                <input @change="changeTwo" id="uploaderInput" class="weui-uploader__input" type="file"
                        accept="image/*" multiple="">
              </div>
            </div>
              <p>注意：巡检人员头像需在门头照中露出</p>
          </div>
        </div>
      </div>

    <div class="weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <div class=weui-uploader__hd>
              <p class=weui-uploader__title> 选传：</span>订单交易截图（请用和包App现场完成一笔金额随机订单）</p>
              <div class=weui-uploader__info>
                <span id=uploadCount1></span>
              </div>
            </div>
            </div>
            <div class="weui-uploader__bd">
              <ul class="weui-uploader__files" id="uploaderFiles">
                <li ref="files" class="weui-uploader__file needsclick" v-for="(image,index) in imagesTh" :key="index"
                    :style="'backgroundImage:url(' + image +' )'">
                    <!-- <span @click="deleteimg3(index)" class="x">&times;</span> -->
                </li>
              </ul>
              <div v-show="imagesTh.length < maxCount" class="weui-uploader__input-box">
                <input @change="changeTh" id="uploaderInput" class="weui-uploader__input" type="file"
                        accept="image/*" multiple="">
              </div>
            </div>
              <p>注意：查找路径为我的-账单-账单详情</p>
          </div>
        </div>
      </div>

      <input id="images" name="images" type="hidden">
      <div class="btnWarp"></div>
      </scroll>
     </div>

      
    <div class="foot_login fx" id="foot_login fx">
      <ul>
        <li class="login_r">
          <span  @click='goReg()'>提交</span>
        </li>
      </ul>
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

let imagesIds = "";
export default {
  data() {
    return {
      shopData: {},
      inputVal: '',
      locationValue: '',
      couponList: [],
      isPayWrapper: false,
      scrollbar:false,
      isDisable: false,
      bgIcon: false,
      params: '',
      show: true,
      maxSize: 10240000,
      maxCount: 3,
      filesArr: [],
      imagesOne: [],
      imagesTwo: [],
      imagesTh: [],
      imagesIds: ''
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
    deleteimg(index) {
      this.filesArr.splice(index, 1);
      this.imagesOne.splice(index, 1);
    },
    deleteimg2(index) {
      this.filesArr.splice(index, 1);
      this.imagesTwo.splice(index, 1);
    },
    deleteimg3(index) {
      this.filesArr.splice(index, 1);
      this.imagesTh.splice(index, 1);
    },
    clickLocation() {
      axios.post("merchantXj/getRealAddress",{
        longitude: window.LONGITUDE,
        latitude: window.LATITUDE,
      }).then(res => {
        if(res.code == "0") {
          this.locationValue = res.data;
          this.inputVal = res.data;
        }
      })
    },
    changeOne(e) {
      let files = e.target.files;
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      if (this.imagesOne.length + files.length > this.maxCount) {
        // Toast('最多只能上传' + this.maxCount + '张图片！');
        return;
      }
      let reader;
      let file;
      let imagesOne = this.imagesOne;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        reader = new FileReader();
        if (file.size > self.maxSize) {
          // Toast('图片太大，不允许上传！');
          continue;
        }
        reader.onload = (e) => {
          let img = new Image();
          img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let w = img.width;
            let h = img.height;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL('image/png');
            imagesOne.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      };

      // 上传图片
      let file2 = e.target.files[0]; 
      let param = new FormData(); //创建form对象
      param.append('file',file2,file2.name);//通过append向form对象添加数据
      param.append('flag','0');//添加form表单中其他数据
      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      axios.post('merchantXj/uploadPictures',param,config)
      .then(res=>{
        if (res.code === "0") {
          let dataId = res.data;
          // imgStatus1 = 1;
          var images = document.getElementById("images");
          imagesIds = imagesIds + "," + JSON.stringify(dataId);
          // console.log(imagesIds);
        }
      })
    },
    changeTwo(e) {
      let files = e.target.files;
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      if (this.imagesTwo.length + files.length > this.maxCount) {
        // Toast('最多只能上传' + this.maxCount + '张图片！');
        return;
      }
      let reader;
      let file;
      let imagesTwo = this.imagesTwo;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        reader = new FileReader();
        if (file.size > self.maxSize) {
          // Toast('图片太大，不允许上传！');
          continue;
        }
        reader.onload = (e) => {
          let img = new Image();
          img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let w = img.width;
            let h = img.height;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL('image/png');
            imagesTwo.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      };

      // 上传图片
      let file2 = e.target.files[0]; 
      let param = new FormData(); //创建form对象
      param.append('file',file2,file2.name);//通过append向form对象添加数据
      param.append('flag','1');//添加form表单中其他数据
      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      axios.post('merchantXj/uploadPictures',param,config)
      .then(res=>{
        if (res.code === "0") {
          let dataId = res.data;
          // imgStatus1 = 1;
          var images = document.getElementById("images");
          imagesIds = imagesIds + "," + JSON.stringify(dataId);
          // console.log(imagesIds);
        }
      })
    },
    changeTh(e) {
      let files = e.target.files;
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      if (this.imagesTh.length + files.length > this.maxCount) {
        // Toast('最多只能上传' + this.maxCount + '张图片！');
        return;
      }
      let reader;
      let file;
      let imagesTh = this.imagesTh;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        reader = new FileReader();
        if (file.size > self.maxSize) {
          // Toast('图片太大，不允许上传！');
          continue;
        }
        reader.onload = (e) => {
          let img = new Image();
          img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let w = img.width;
            let h = img.height;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL('image/png');
            imagesTh.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      };

      // 上传图片
      let file2 = e.target.files[0]; 
      let param = new FormData(); //创建form对象
      param.append('file',file2,file2.name);//通过append向form对象添加数据
      param.append('flag','2');//添加form表单中其他数据
      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      axios.post('merchantXj/uploadPictures',param,config)
      .then(res=>{
        if (res.code === "0") {
          let dataId = res.data;
          // imgStatus1 = 1;
          var images = document.getElementById("images");
          imagesIds = imagesIds + "," + JSON.stringify(dataId);
          // console.log(imagesIds);
        }
      })
    },
    init() {
      let params =this.shopParm?this.shopParm:JSON.parse(Cookies.get("item"));
      if(!params.hasOwnProperty("longitude")){
        params=JSON.parse(Cookies.get("item"))
      }
      Cookies.set("item",params)
      axios.post("merchants/getMerchantsInfoDetails", params).then(res => {
        if (res.code === "0") {
          this.shopData = res.data;
          this.inputVal = res.data.mBusAddress;
        }
      })
    },
    clickToast() {
      this.$dialog('提交成功');
    },
    clickClose() {
      this.isPayWrapper = false;
    },
    goMy() {
      this.$router.push("/my");
    },
    goReg() {
      console.log(this.inputVal);
      // console.log(imagesIds);
      // console.log(Cookies.get("userId"));
      // console.log(this.shopData.id);
      if (!this.imagesOne.length){
        this.$dialog('请上传门店图片')
        return;
      }
      let self = this;
      axios.post("merchantXj/uploadInfo", {
        userId: Cookies.get("userId"),
        merId: this.shopData.id,
        realAddress: this.inputVal,
        statusType: "2",
        imagesId: imagesIds
      }).then(res => {
        if(res.code === "0") {
          this.$weui.toast('提交成功', 500)
          // this.$router.go(-2);
          imagesIds = '';
          console.log(imagesIds);
          this.$router.push("/home1");
          // setTimeout("javascript:location.href='http://hebao.letshappy.cn:3020/h5/main.html#/mine'", 2000);
          // console.log(this.couponList);
        } else if(res.code === "-1") {
            this.$dialog('该商户已巡检')
        } else if(res.code === "-2") {
            this.$dialog('该终端数据已录入，是否覆盖')
        }
      })
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
	// background: #ededed;
  }
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
    width: 60%;
    background: transparent;
    border: 0.0625rem solid #ededed;
    position: absolute;
    left: 6rem;
    top: 0.65rem;
    z-index: 2; 
    border-radius: 0.125rem;
    padding-left: 0.5rem;
    outline:none;
  }
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
    opacity: 0;
  }
  .formCom img {
    width: 1.625rem;
    height: 1.625rem;
    position: absolute;
    top: 0.6rem;
    right: 0.8rem;
  }
  .formCom option {
    color: #666;
  }
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
  padding: 0 1.5rem 0.5rem 1.5rem;
    font-family: PingFangSC-Regular;
    font-size: .875rem;
  .wrap_left {
    float: left;
    font-size: 0.75rem;
    line-height: 1.5rem;
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
  margin: 2.625rem 0.625rem 2rem 0.625rem; 
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

p {font-size: .875rem;}
.weui-cells {
  margin-top: 0;
}
.weui-uploader__file {
  position: relative;
  margin-top: 6px;
  .x {
    text-align: center;
    background-color: black;
    font-size: 20px;
    line-height: 23px;
    color: white;
    position: absolute;
    right: -0.3rem;
    top: -0.3rem;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    opacity: 0.8;
  }
}
.weui-uploader__input-box {
  margin-top: 6px;
}
.p-tip {
  margin: 20px 0 10px 0;
  .p-tipimg {
    width: 100%;
    padding-bottom: 20px;
  }
  .text {
    color: grey;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
  }
}

.home {
  position: absolute;
  z-index: 1;
  top: 3rem;
  left: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 3rem;
  overflow: hidden;
}

.foot_login {
  width: 100%;
  height: 3.1875rem;
  bottom: 0;
  left: 0;
  z-index: 10005;
  color: #fff;
  background: rgba(0,0,0,0);
  .login_l {
    float: left;
    padding: 0.5rem 0.625rem 0.5rem 0.9375rem;
    // padding-left: ;

    img {
    width: 2.1875rem;
    height: 2.1875rem;
    }
  }
  .login_m {
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 0.875rem;
    line-height: 3.1875rem;
  }
  .login_r {
    text-align: center;
    line-height: 3.1875rem;
    span {
      display: inline-block;
      margin: 0.625rem 0.9375rem 0.625rem;
      width: 8.25rem;
      height: 2rem;
      text-align: center;
      font-size: 1rem;
      font-family: PingFangSC-Regular;
      line-height: 2rem;
      background-color: #5592fa;
      border-radius: 0.25rem;
    }
  }
}
.fx {
  display: block;
  position: fixed;
}
</style>

