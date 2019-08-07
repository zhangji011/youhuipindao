<template>
	<div>
    <div @touchmove.prevent v-if="isAttend=='N'">
      <div v-show="isShareBtn" @click="getSharePage()" class="shareBtn"></div>
    	<header>
    		<ul>
    			<li class="l t" @click="goBack()"></li>
    			<!-- <li class="l" @click="goBack()"> -->
    			<span>和包积分排行榜</span>
    			</li>
    			<li class="hr-1"></li>
    		</ul>
    	</header>
    	<!-- 滑动容器 -->
    	<div class="wrapper" ref="wrapper">
    		<div class="content backcolor">
    			<ul class="bakimg">
    				<li>
    					<!-- 活动头图 -->
    					<!-- <div class="activebox">
    						<img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1616472533,1649170474&fm=26&gp=0.jpg" alt=""
    						 class="activeimg">
    					</div> -->
    					<!-- 活动介绍 -->
    					<div class="activeIntroduce">
    						<div>
    							<p class="introduceP2">活动期间，和包支付指定湖南绑卡用户（含电信、联通用户）在活动页进行报名即可参与积分打榜活动，参与成功的用户在长沙线下商户使用和包支付扫码付消费，每前往1个线下商户消费成功即可获得1个积分，且单个商户仅限获得1次积分，已参与商户积分不重复累积（含连锁商户）。全员积分排名页面实时更新，用户参与活动获得的积分可在活动页面我的权益兑换成和包券消费使用（首月1积分=2元和包券，次月1积分=1元和包券，同一用户每月兑换额度500积分封顶）。</p>
    						</div>
    					</div>
    					<!-- 点我打榜赢好卷 -->
    					<div class="btnbox">
    						<div class="signupBtn" @click="goPage">点我报名</div>
    					</div>
    					<!-- 活动规则 -->
    					<div class="rule">
    						<div class="rulehead">
    							<div class="boxlf"></div>
    							<div class="boxct">活动规则</div>
    							<div class="boxrt"></div>
    						</div>
    						<p>1、本次活动仅限使用和包支付客户端8.3及以上版本的和包支付指定湖南绑卡用户（含电信、联通用户）参与，未绑卡用户可登录和包支付客户端，在“我的-银行卡”中按提示绑定银行卡后参加活动；</p>
    						<p>2、同一手机号码、同一身份证号码均视为同一个用户。当同一身份证用户有多个和包支付账户，有且只能有一个和包支付账户获得的积分可兑换成和包券；</p>
    						<p>3、本次活动积分兑换和包券时间截止到活动结束，用户兑换的和包券为通用券，领取后于2019年12月30日24点失效，该和包券不支持转赠转让、分享、不可叠加使用，详情见和包支付客户端单张和包券使用细则；</p>
    						<p>4、活动期间，若用户使用兑换和包券优惠的当笔交易发生退款，退款金额为用户实际支付金额，支付金额将原路退回。如当张和包券在有效期内，将退回可再次使用，如和包券已过有效期，该和包券将失效；</p>
    						<p>5、本活动暂不支持170/171/149等虚拟号段及非标物联网卡注册和包支付账户参与；</p>
    						<p>6、如被和包支付系统判定用户存在违规行为（包括但不限于虚假交易、恶意套取优惠等），中移电子商务有限公司有权取消用户参与活动资格，并保留追究用户法律责任的权利；</p>
    						<p>7、用户对本活动内容或活动规则有疑问，可咨询10086；</p>
    						<p>8、本活动与苹果等应用商店无关；</p>
    					</div>
    					<div class="padbom"></div>
    				</li>
    			</ul>
    		</div>
    	</div>
    </div>
    <div v-if="isshow">
      <header>
      	<ul>
      		<li class="l t" @click="goBack()"></li>
      		<!-- <li class="l" @click="goBack()"> -->
      		<span>和包积分排行榜</span>
      		</li>
      		<li class="hr-1"></li>
      	</ul>
      </header>
      <div  class="gobackpage">
        <div>请关闭当前页面</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    fetchPoints,
    // GetDistance,
    isHebaoApp,
    shareNow,
    setLItem,
    animationProgress,
    getLItem,
    formatDate_1,
    closePage
  } from "@@/service/util";
	import attend from "@@/components/userAttend/attend.vue";
	import {
		Toast
	} from 'vant';
	import {
		mapState,
		mapMutations
	} from "vuex";
	import axios from "@@/plugins/rsa/axios"; //积分打榜活动接口地址
	import sa from "sa-sdk-javascript";
	import BScroll from 'better-scroll';
	export default {
		data() {
			return {
				mobileNumber:"",
				flag:true  ,//是否可以点击报名
        isAttend:"Y",
        isShareBtn:false  ,//分享按钮
        isshow:false  //默认不展示
			}
		},
		 computed: {
		  ...mapState([
		    "token",
		    "tokenstatus",
		    "latitude",
		    "longitude",
		    "cityname",
		  ])
		},
		methods: {
			goBack() {
				// this.$router.go(-1);
        closePage();
				// window.history.go(-1);
			},
			goPage() {
				const that = this;
				if(!that.flag){  //true可以发送axios
					return;
				}
        if(!that.mobileNumber || (that.mobileNumber+"").length!==11){  //必须有号码且长度为11位
          Toast.fail({
          	duration: 2000, // 持续展示 toast
          	message:"报名失败"
          });
          return;
        }
				that.flag=false;  //锁定
        // alert("userAttend报名号码"+that.mobileNumber);
        // 神策
        sa.track("signupClick", {
          contentName: "积分打榜活动点击报名",
          userPhone: that.mobileNumber
        });
				axios.post("userAttend", {
				    mobileNo: that.mobileNumber  //用户手机号码
				  }).then(res => {
				    if(res.code=="0000"){  //报名成功
						Toast.success({
							duration: 2000, // 持续展示 toast
							message:"参与成功"
						});
						setTimeout(function(){
							that.$router.push({
								path: '/rankingList'
							});
						},300);
					}else{  //报名失败
					that.flag=true;  //解锁
						Toast.fail({
							duration: 2000, // 持续展示 toast
							message:"报名失败,请重试"
						});
					}
				  });
			},
      getUrlKey(name){
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },
      initscroll(){
        this.$nextTick(() => {
        	//$refs绑定元素
        	if (!this.scroll) {
        		this.scroll = new BScroll(this.$refs.wrapper, {
        			//开启点击事件 默认为false
        			probeType: 3,
        			click: true,
        			bounce: false //回弹效果
        		})
        		// console.log(this.scroll)
        	} else if (!this.$refs.wrapper) {
        		return
        	} else {
        		this.scroll.refresh()
        	}
        })
      },
      getSharePage(e) {
        let index_urls = {
          // shareUrl: window.location.href,
          shareUrl: "http://dx.10086.cn/_zMeAQ",
          wap_produce_reqData: "/gmeweb/miguhw_merc.xhtml?viewCode=json"// 单点登录
        };
        let shareTxt = "积分打榜火热开启，湖南和包支付指定用户线下消费得积分，积分可兑换和包券，速来参与吧！";
        shareNow(index_urls.shareUrl, shareTxt);
      }
		},
		mounted() {
      // this.isAttend="N";
      // attend.isAttend=13975107240;
      // this.mobileNumber=attend.isAttend;
      // this.initscroll();
      // return;
      if(isHebaoApp()) {
        this.isShareBtn = true;
      }
      // alert("当前页面地址"+window.location.href);
      // this.isAttend="Y"
      // this.isshow=true;
      // return;
      axios.post("queryAccount", {
        credtential:this.getUrlKey("CREDTENTIAL"),
        sign_data:this.getUrlKey("SIGN_DATA")
      }).then(res => {
        // alert("queryAccount查询出用户号码"+res.data.productNo)
            this.mobileNumber=res.data.productNo; //客户端返回的号码
            // this.mobileNumber=15111427793;    //测试用的号码
            attend.userPhone=this.mobileNumber; //重新赋值进attend.vue
            axios.post("queryUserAttend", {
                mobileNo: this.mobileNumber  //用户手机号码
              })
              .then(res => {    //status 0:已报名,1:未报名,2:限制用户
            			attend.isAttend=res.data.isAttend;   //返回用户状态
                  // alert("手机号码"+this.mobileNumber)
                  // alert("queryUserAttend报名状态"+this.isAttend)
                  if(res.data.status==1){  //未报名
                    this.isAttend=attend.isAttend;   //展示页面1
                  }
                  if(res.data.status==2 || res.data.status==3){  //限制用户
                    this.isAttend="Y";  //不展示页面1
                    this.isshow=true;  //展示页面2
                    Toast.fail({
                    	duration: 2000, // 持续展示 toast
                    	message:"因不满足条件,你无法参与该活动"
                    });
                  }
                  if(attend.isAttend=="Y" && this.mobileNumber!="" && this.mobileNumber!=null && this.mobileNumber!=undefined && (this.mobileNumber+"").length==11){  //已经报名 跳转首页
                  	this.$router.push({
                  		path: '/rankingList'
                  	});
                    return;
                  }
                  this.initscroll();
              });
              //返回的数据格式
            // "productNo":"13135288961",
            // "session":"emAyqsEDpsN6wSFcJGbvJvzdYXtTanwdwfiJQz5RJXc=",
            // "usrNo":"400030576398"
        });
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@@/style/mixin";
	.bakimg{
		 width: 100%;
		 height: 100%;
		 // background: url(/static/img/jifendabang/head.png);
		 background-image:url(/static/img/jifendabang/head.png);
		 background-repeat: no-repeat;
		 background-size: 100% auto;
		 // background-color:red;
	}
	.backcolor{
		background-image:linear-gradient(141deg, #F83B49 0%, #F83B50 19%, #D64A97 49%, #AE41D4 86%, #B241CD 100%);
	}
	.wrapper {
		width: 100%;
		position: absolute;
		top: 3rem;
		left: 0;
		bottom: 0;
		/*关键*/
		overflow: hidden;
		z-index: 1;
	}

	header {
		@include wh(100%, 3rem);
		background: #ffffff;
		position: sticky;
		z-index: 100000000;
		top: 0;
		left: 0;

		ul {
			position: relative;
			text-align: center;

			.hr-1 {
				display: block;
				position: absolute;
				width: 100%;
				bottom: 0;
				left: 0;
				height: 0;
				-webkit-transform-origin: 0, 0;
				transform-origin: 0, 0;
				-webkit-transform: scaleY(0.5);
				-ms-transform: scaleY(0.5);
				transform: scaleY(0.5);
				background-color: #555;
			}
		}

		.l {
			height: 100%;
			line-height: 3rem;
			font-size: 1.125rem;
			font-family: PingFangSC-Regular;
			color: #13252e;
			padding-right: 3.5rem;
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
			background-position: 0.375rem 50%;
			background-size: 1.1rem;
			// padding-right: 0.6rem;
			@include space();
		}

		span {
			display: block;
			line-height: 3rem;
			// margin-right: 1.75rem;
			padding-right: 3.5rem;
			@include space();
		}
	}

	// 活动头图
	.activebox {
		width: 100%;
		height: 10rem;
		overflow: hidden;

		.activeimg {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	// 活动介绍
	.activeIntroduce {
		width: 100%;
		height: auto;
		padding: 22rem 1.2rem 0 1.2rem;
		div{
			border:0.75rem solid #FF9C60;
			border-radius: 14px;
			padding: 1rem;
			font-size: 0.81rem;
			background-color: #fff;
			line-height: 1.25rem;
			.introduceP2 {
				color: #001300;
				text-indent: 2em;
				font-family: "PingFangSC-Regular";
				span{
					font-family: "PingFangSC-Regular";
					color: #ff5722;
				}
			}
		}
	}

	// 点我打榜赢好劵
	.btnbox {
		width: 100%;
		padding: 1.2rem;
		.signupBtn {
			width:100%;
			height: 3.06rem;
			background-image: linear-gradient(180deg, #FFECC2 0%, #FFDD95 26%, #FFCB7D 63%, #FFAC31 100%);
			border-radius: 3.1rem;
			color: #D00000;
			font-family: "PingFangSC-Medium";
			margin: 0 auto;
			text-align: center;
			line-height: 3rem;
			font-size:1rem;
			letter-spacing: 1px;
			font-weight: bold;
		}
	}
	.rule{
		width: 100%;
		padding:1rem 1.2rem 3rem 1.2rem;
		.rulehead{
			width: 100%;
			height: 0.94rem;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: space-around;
			div{
				font-family: "PingFang-SC-Medium";
				font-size: 0.9rem;
				color: #fff;
			}
			.boxlf{
				width: 26.7%;
				border: 0.095rem dashed #fff;
				opacity: 0.5;
				-webkit-transform-origin: 0, 0;
				transform-origin: 0, 0;
				-webkit-transform: scaleY(0.3);
				-ms-transform: scaleY(0.3);
				transform: scaleY(0.3);
			}
			.boxct{
				text-align: center;
				line-height: 0.94rem;
			}
			.boxrt{
				width:26.7%;
				border: 0.1rem dashed #fff;
				opacity: 0.5;
				-webkit-transform-origin: 0, 0;
				transform-origin: 0, 0;
				-webkit-transform: scaleY(0.3);
				-ms-transform: scaleY(0.3);
				transform: scaleY(0.3);
			}
		}
		p{
			font-family: "PingFangSC-Regular";
			color: #fff;
			font-size: 0.81rem;
			line-height: 1.25rem;
			padding-top: 0.81rem;
		}
	}
  .shareBtn {
      width: 1.05rem;
      height: 1.05rem;
      background: url(/static/img/share_icon1.png) top no-repeat;
      background-size: 100% 100%;
      position: fixed;
      top: 1rem;
      right: 1.2rem;
      z-index: 9999999999;
  }
  .gobackpage{
    position: absolute;
    top: 35%;
    width: 100%;
    text-align: center;
    font-size: 1rem;
    color: #292727;
    line-height: 1.5rem;
    div{
      font-family: "PingFangSC-Regular";
    }
  }
</style>
