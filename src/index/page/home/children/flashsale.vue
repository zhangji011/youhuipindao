<template>
	<div>
		<!-- 头部 -->
		<header>
			<ul>
				<li class="l t" @click="goBack()"></li>
				<li class="l">
					<span style="font-family:PingFangSC-Regular;">特价商品专区</span>
				</li>
			</ul>
			<div class="hr-1"></div>
		</header>
		<!-- 导航栏 -->
		<div class="wrapper2" ref="wrapper2" v-show="goodsinfo.length>1">
		  <div class="content" :style="{width:goodsinfo.length<=3?'100%':goodsinfo.length*33.3333+'%'}">
		    <ul>
		      <li class="salenav" v-if="goodsinfo.length<=3">
		         <div class="navmin" v-for="(item,index) in goodsinfo" @click="navClick(index)" :key="item.id">
		         	<div class="navfont" :class="{navselect:index==selectIde}">{{item.name}}</div>
		         	<div class="line" v-show="index==selectIde"></div>
		         </div>
		      </li>
			  <li class="salenav" v-else>
			    <div class="navmin" v-for="(item,index) in goodsinfo" @click="navClick(index)">
					<div class="navfont" :class="{navselect:index==selectIde}">{{item.name}}</div>
					<div class="line" v-show="index==selectIde"></div>
				</div>
			  </li>
		    </ul>
		  </div>
		</div>
				<!-- 商品列表 -->
				<div class="wrapper" ref="wrapper" v-show="nowgoods.length>=1" :style="{top:goodsinfo.length>1?'6rem':'3rem'}">
				  <div class="content">
				    <ul>
				      <li class="goodsli">
				        <div class="goodsbox" v-for="(item,ide) in nowgoods">
							<div class="goodsimg">
								<img :src="item.picUrl" alt="">
							</div>
							<div class="goodsinfo">
								<div class="goodstitle">{{item.name}}</div>
								<div class="goodsprice">
									<span style="color: #F82168;font-size: 0.6875rem;text-decoration: none;">￥</span>{{item.prePrice}}<span style="padding-left: 0.5rem;text-decoration: none;">￥{{item.originalPrice}}</span>
									<div class="rushtobuy" @click="rushtobuyClick(item)">立即抢购</div>
								</div>
							</div>
						</div>
						<div class="nodata">已经没有更多数据了</div>
				      </li>
				    </ul>
				  </div>
				</div>
				
				<!-- 活动规则弹框 -->
				<div class="activebtn" @click="ruleClick"><span>活动</span><span>规则</span></div>
				<van-dialog v-model="show" style="font-weight: bold;" title="活动规则" className="vandialo" :showConfirmButton="false">
				  <div class="ruleframe">
				    <div class="rulepad">
				      <p>1、本次活动仅限使用和包支付客户端8.4及以上版本的和包支付中国移动绑卡用户参与，未绑卡和包支付中国移动用户可登录和包支付客户端，在“我的-银行卡”中按提示绑定银行卡后参加活动；</p>
				      <p>2、同一手机号码、同一身份证号码均视为同一个用户；</p>
				      <p>3、活动期间同一用户限量秒杀专区活动限参与一次，抢购专区活动参与次数不限；</p>
				      <p>4、本次活动优惠商品数量有限，先到先得，卖完即止；</p>
				      <p>5、活动期间，若享受活动优惠的限量秒杀活动专区订单发生退款，仅原路退回用户实际支付金额，如获得的和包券在有效期内，将退回可再次使用，如和包券已过有效期，该和包券将失效，不再享受获得本活动优惠的资格；</p>
				      <p>6、活动期间，由和包商城线上知名应用商户提供商品，用户商品下单后，商户会在48小时内发货，物流信息可登录和包支付app-我的-商城订单管理查询。自用户签收之日起7天内，如因非质量问题退换货，由用户自行承担退换货的费用，且退换商品要求包装完整，不影响二次销售；签收完7天后，不受理任何非质量问题退换货；如因质量问题产生的退换货，运费由商户承担，退货时需先由用户垫付运费，商户收到货后联系用户退回运费；</p>
				      <p>7、本活动暂不支持170/171/149/162/165/167等虚拟号段及非标物联网卡注册和包支付账户参与；</p>
				      <p>8、如被和包支付系统判定用户存在违规行为（包括但不限于虚假交易、恶意套取活动优惠等），中移电子商务有限公司有权取消用户参与活动资格，收回赠送的和包券，并保留追究用户法律责任的权利；</p>
				      <p>9、用户对本活动内容或活动规则有疑问，可咨询10086；</p>
				      <p>10、本活动与苹果等应用商店无关；</p>
				    </div>
				  </div>
				</van-dialog>
				<!-- 关闭按钮 -->
				<img src="/static/img/jifendabang/close.png" alt="" class="closeimg" v-show="closeImg" @click="closeClick">
	</div>
</template>

<script>
	import axios from "@@/plugins/rsa/axios";
	import BScroll from 'better-scroll';
	import {Dialog, Icon} from 'vant';
	import sa from "sa-sdk-javascript";
	export default {
		data() {
			return {
				selectIde:0,
				goodsinfo:[],  //所有信息
				nowgoods:[]   ,//当前需要展示的信息
				show:false,
				closeImg:false
			}
		},
		mounted() {
			this.getgoodsInfo();
		},
		methods: {
			closeClick() {
			  this.show = false;
			  this.closeImg = false;
			},
			ruleClick(){  //活动规则弹框
			sa.track('buttonClick', {
			  		buttonName: "活动规则弹框",
					topCategory: "优惠",
					subCategory: "优惠：限时抢购专区点击活动规则"
			});
				this.show=true;
				this.closeImg=true;
			},
			rushtobuyClick(obj){  //立即抢购
			sa.track('ZoneClick', {
          		contentName: obj.name,  //商品名
          		topCategory: '优惠',
          		subCategory: '优惠：限时抢购专区商品点击立即抢购',
          		locationOfZone: '附图'
        });
				// console.log(obj)
				// window.location.href=obj.jumpUrl;
				  //埋点 parent_title, sub_title,phone,remark, session
				  let url = obj.jumpUrl;
				      if ((/iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android") == "android") {
				        window.goActivity.goWeb(url);
				      } else {
						window.location = "activity://goWeb?url=" + url;
					  }
				
			},
			navClick(ide){  //点击价格专区
			sa.track("buttonClick", {
			  buttonName: this.goodsinfo[ide].name, //点击价格专区
			  topCategory: "优惠",
			  subCategory: "优惠：限时抢购专区tab栏"
			});
				this.selectIde=ide;
				this.nowgoods=this.goodsinfo[ide].limitedCommodities;
				this.scroll.refresh();
				this.scroll2.refresh();
			},
			getgoodsInfo(){
				axios.post("queryLimitedCommodities").then(res => {
					  if(res.code=="0"){
						  this.goodsinfo=res.data;  //获得所有数据
						  this.nowgoods=this.goodsinfo[0].limitedCommodities;  //默认加载第一个区间的数据
					  }
					  this.initscroll(); //初始化scroll滚动插件
				  })
				  .catch(res => {
				  });
			},
			goBack() {
				window.history.go(-1);
			},
			initscroll() {
			  var that = this;
			  setTimeout(function() {
				  // 头部滑动标签
				  // 初始化scroll
				  // that.$nextTick(() => {
				    //$refs绑定元素
				    if (!that.scroll2) {
				      that.scroll2 = new BScroll(that.$refs.wrapper2, {
				        //开启点击事件 默认为false
				        probeType: 2,
						scrollY: false,
						scrollX: true,
						scrollbar: false,
						mouseWheel:false,
						startX: 0,
				        click: true,
				        bounce: false, //回弹效果
				        useTransition: false, //防止iphone微信滑动卡顿
				      });
				    } else if (!that.$refs.wrapper2) {
				      return;
				    } else {
				      that.scroll2.refresh();
				    }
				  // });
			    // 初始化scroll
			    // that.$nextTick(() => {
			      //$refs绑定元素
			      if (!that.scroll) {
			        that.scroll = new BScroll(that.$refs.wrapper, {
			          //开启点击事件 默认为false
			          probeType: 3,
			          click: true,
			          bounce: true, //回弹效果
			          useTransition: false, //防止iphone微信滑动卡顿
			          pullUpLoad: {
			            threshold: 0
			          }
			        });
			      } else if (!that.$refs.wrapper) {
			        return;
			      } else {
			        that.scroll.refresh();
			      }
			    // });
				// that.getgoodsInfo();//获取所有商品信息
			  }, 20);
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@@/style/mixin";

	header {
		@include wh(100%, 3rem);
		background: #fff;
		position: sticky;
		z-index: 888;
		top: 0;
		left: 0;
		box-shadow: inset 0 -1px 0 0 #E6E6E6;
		.l {
			height: 100%;
			line-height: 3rem;
			font-size: 1.125rem;
			font-family: PingFangSC-Regular;
			color: #13252E;
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
	}
	// 滑动容器
	.wrapper {
	  width: 100%;
	  // height: 100%;
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  /*关键*/
	  overflow: hidden;
	  z-index: 1;
	  background-color: #fff;
	}
	// 滑动容器2
	.wrapper2 {
	  width: 100%;
	  height: 3rem;
	  /*关键*/
	  overflow: hidden;
	  background-color: #fff;
	}
	// 导航栏
	.salenav{
		width: 100%;
		height: 3rem;
		display: flex;
		justify-content: space-between;
	}
	.navmin{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		position: relative;
		padding: 0 0.4rem;
	}
	.navfont{
		font-family: "PingFangSC-Medium";
		color: #7F7F7F;
		font-size: 0.875rem;
		@include space();
	}
	.navselect{
		color: #13252E!important;
		font-size: 1rem!important;
		font-weight: bold;
	}
	.line{
		position: absolute;
		left:50%;
		bottom:0.4rem;
		z-index: 1;
		width: 25%;
		height: 0.125rem;
		background: #F82168;
		border-radius: 2px;
		margin-left:-12.5%;
	}
	// 商品列表样式
	.goodsli{
		width: 100%;
		padding: 0 1rem;
		.goodsbox{
			width: 100%;
			height: 8.125rem;
			padding: 0.9375rem 0;
			display: flex;
			box-shadow: inset 0 -1px 0 0 #E6E6E6;
		}
		.goodsimg{
			width: 6.25rem;
			height: 6.25rem;
			img{
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 5px;
			}
		}
		.goodsinfo{
			display: flex;
			flex: 1;
			height: 6.25rem;
			padding-left: 0.5rem;
			flex-direction: column;
			justify-content: space-between;
			.goodstitle{
				width: 100%;
				font-size: 0.875rem;
				color: #13252E;
				line-height: 1rem;
				max-height: 3rem;
			}
			.goodsprice{
				font-size: 1rem;
				color: #F82168;
				font-family: "PingFangSC-Semibold";
				position: relative;
				overflow: visible;
				span{
					font-family: "PingFangSC-Medium";
					color: #7F7F7F;
					font-size: 0.69rem;
					text-decoration: line-through;
				}
				.rushtobuy{
					position: absolute;
					right: 0;
					bottom: 0;
					background-image: linear-gradient(90deg, #F82168 0%, #F82168 100%);
					border-radius: 2rem;
					width: 5.315rem;
					height: 1.875rem;
					z-index: 1;
					text-align: center;
					line-height: 1.875rem;
					color: #fff;
					font-size: 0.875rem;
					font-family: "PingFangSC-Medium";
				}
			}
		}
	}
	.nodata{
		width: 100%;
		height: 3rem;
		font-size: 0.675rem;
		color: #7F7F7F;
		display: flex;
		justify-content: center;
		align-items: center;
		span{
			margin: 0 0.5rem;
		}
	}
	.activebtn{
		position: fixed;
		width: 2.8rem;
		height: 2.8rem;
		// background-color: #000000 ;
		// opacity: 0.4;
		background: rgba(0,0,0,0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9;
		border-radius: 50%;
		right: 0.5rem;
		bottom:20%;
		span{
			color: #fff;
			font-family: "PingFangSC-Regular";
			font-size: 0.625rem;
		}
	}
	.ruleframe ::-webkit-scrollbar { display: none;/*隐藏滚轮*/ }
	.ruleframe {
	  padding: 0.5rem 1.5rem 2.5rem 1.5rem;
	  .rulepad {
	    max-height: 19rem;
	    overflow-y: auto;
		p {
		  line-height: 1.25rem;
		  font-family: "PingFangSC-Regular";
		  color: #13252e;
		  font-size: 0.81rem;
		}
		}
	}
	.closeimg {
    position: absolute;
    z-index: 9999;
    top: 45%;
    margin-top: 13rem;
    left: 50%;
    width: 2rem;
    height: 2rem;
    margin-left: -1rem;
  }
</style>
