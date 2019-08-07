<template>
	<div @touchmove.prevent>
		<!-- 导航栏 -->
		<header>
			<ul>
				<li class="l t" @click="goBack()">
					<van-icon name="arrow-left" size="1.25rem" />
				</li>
				<!-- <li class="l" @click="goBack()"> -->
				<span>活动参与商户</span>
				<!-- </li> -->
				<!-- <li class="hr-1"></li> -->
			</ul>
		</header>
		<!-- 地区选择 -->
		<div class="region">
			<div class="city">长沙</div>
			<div class="choiceCity" @click="pcikerShow">
				<div style="padding-right: 0.2rem;color: #4c4747;">{{adress}}</div>
				<van-icon style="padding-top: 0.2rem;" name="arrow-down" color="#4c4747" size="0.8rem" />
			</div>
		</div>
		<div class="nullHeight"></div>
		<!-- 滑动区域 -->
		<div class="wrapper" ref="wrapper">
			<div class="content">
				<ul>
					<li class="shopli" v-for="item in shopList"  :key="item.merNo">
						<div class="shopbox">
							<div class="title">{{item.merAbbr}}</div>
							<!-- <div class="adress">{{item.storeAddress.substr(1)}}</div> -->
							<div class="adress">{{item.storeAddress}}</div>
						</div>
					</li>
					<!-- 加载中 -->
					<li v-show="!nodata" style="text-align: center;">已经到底了</li>
					<li v-show="loadshow">
						<loading></loading>
					</li>
				</ul>
			</div>
		</div>
		<!-- 市区选择 -->
		<van-popup v-model="show" position="bottom" :overlay="true">
			<van-picker show-toolbar title="" @cancel="onCancel" @confirm="onConfirm" @ :columns="columns"/>
		</van-popup>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	import axios from "@@/plugins/rsa/axios";
	import sa from "sa-sdk-javascript";
	import BScroll from 'better-scroll';
	import Loading from "@@/components/loading/loading.vue";
	import {
		Dialog,
		Toast,
		Icon,
		Picker,
		Popup
	} from 'vant';
	import 'vant/lib/icon/local.css';
	export default {
		data() {
			return {
				columns: ['请选择区','芙蓉区','天心区','岳麓区','开福区','望城区','雨花区','长沙县','浏阳市','宁乡市'],
				show:false,
				adress:"请选择区",  //picker选择内容
				pickerIde:0  ,//picker选择小标
				page: 1, //页数
				pagenum: 10 ,//请求10条数据
				shopList:[]  ,//商户列表
				loadshow:false,
				nodata:true //是否还有数据
			}
		},
		components: {
			Loading
		},
		mounted() {
			this.initscroll(); //初始化scroll滑动
			this.getData(); //初始化加载一次数据
		},
		computed: {
		  ...mapState([
		    "slider",
		    "slider1",
		    "slider2",
		    "products",
		    "showLoading",
		    "token",
		    "countyParm",
		    "tokenstatus",
		    "latitude",
		    "longitude",
		    "cityname",
		    "sliderScroll",
		    "slideIndex",
		    "openAndClose"
		  ])
		},
		methods: {
			goBack() {
				// this.$router.go(-1);
				window.history.go(-1);
			},
			onConfirm(val,ide){
				this.adress=val;
				this.pickerIde=ide;
				this.show=false;
				// if(ide!=0){
					this.nodata=true;
					this.page=1;
					this.getData(2);
				// }
			},
			onCancel(){
				this.show=false;
			},
			pcikerShow(){
				this.show=true;
			},
			getData(num=1){
				var that=this;
				var params={  //加ZJ避免冲突rcServer下同样的接口,在axios中会截取掉
				    currentPage:this.page, //页码
				    pagNum:this.pagenum,//请求页记录数
				    longtiude:this.latitude,   //经度
				    latitude:this.longitude//纬度
				  }
				 if(num==2&&this.pickerIde!=0){
					params={  //加ZJ避免冲突rcServer下同样的接口,在axios中会截取掉
					    currentPage:this.page, //页码
					    pagNum:this.pagenum,//请求页记录数
					    longtiude:this.latitude,   //经度
					    latitude:this.longitude,//纬度
					    areaName:this.adress
					  }
				 }
				if(!that.nodata){  //没有数据
					return;
				}
				that.loadshow=true;
				axios.post("ZJgetShopInfo", params)
				  .then(res => {
					  that.loadshow=false;
					  if(res.code=="0000"){
              this.shopList=[];
						  this.shopList=res.data;
						  if(res.data.length<that.pagenum){ //后面没有数据了
							  that.nodata=false;
						  }
						  // console.log(res.data)
					  }else{
						  Toast.fail({
						  	duration: 2000, // 持续展示 toast
						  	message:"暂未查询到数据"
						  });
					  }
				  });
			},
			loadMore(){
				var that=this;
				  if(!that.nodata){  //没有数据
				  	return;
				  }
				that.loadshow=true;
				this.page++;
				var params={  //加ZJ避免冲突rcServer下同样的接口,在axios中会截取掉
				    currentPage:this.page, //页码
				    pagNum:this.pagenum,//请求页记录数
				    longtiude:this.latitude,   //经度
				    latitude:this.longitude//纬度
				  }
				  if(that.pickerIde!=0){
					  params={  //加ZJ避免冲突rcServer下同样的接口,在axios中会截取掉
					      currentPage:this.page, //页码
					      pagNum:this.pagenum,//请求页记录数
					      longtiude:this.latitude,   //经度
					      latitude:this.longitude,//纬度
					      areaName:this.adress
					    }
				  }
				axios.post("ZJgetShopInfo", params)
				  .then(res => {
					  if(res.code=="0000"){
						  this.shopList= this.shopList.concat(res.data);
						  if(res.data.length<that.pagenum){ //后面没有数据了
						  		that.nodata=false;
						  }
					  }else{
						  Toast.fail({
						  	duration: 2000, // 持续展示 toast
						  	message:"暂未查询到数据"
						  });
					  }
					  that.loadshow=false; //关闭加载动画
					  that.scroll.finishPullUp();  //可以重新触发上拉加载
					  that.scroll.refresh();  //重新计算高度
				  });
			},
			initscroll() {
				var that = this;
				setTimeout(function() {
					// 初始化scroll
					that.$nextTick(() => {
						//$refs绑定元素
						if (!that.scroll) {
							that.scroll = new BScroll(that.$refs.wrapper, {
								//开启点击事件 默认为false
								probeType: 3,
								click: true,
								bounce: true, //回弹效果
								useTransition: false, //防止iphone微信滑动卡顿
								pullUpLoad: {
									threshold: -20
								}
							});
							that.scroll.on('pullingUp', (pos) => { //scrollEnd上拉加载
								that.loadMore();
								console.log("上拉加载");
							});
						} else if (!that.$refs.wrapper) {
							return;
						} else {
							that.scroll.refresh();
						}
					});
				}, 50);

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@@/style/mixin";

	.wrapper {
		width: 100%;
		position: absolute;
		top: 6.6rem;
		bottom: 0;
		left: 0;
		/*关键*/
		overflow: hidden;
		// overflow: auto;
		z-index: 1;
		background-color: #fff;
	}

	header {
		@include wh(100%, 3rem);
		background: none;
		// position: sticky;
		// z-index: 2000;
		// top: 0;
		// left: 0;

		ul {
			position: relative;
			text-align: center;

			.hr-1 {
				display: block;
				position: absolute;
				width: 100%;
				bottom: 0;
				left: 0;
				height: 0.1rem;
				-webkit-transform-origin: 0, 0;
				transform-origin: 0, 0;
				-webkit-transform: scaleY(0.5);
				-ms-transform: scaleY(0.5);
				transform: scaleY(0.5);
			}
		}

		.l {
			height: 100%;
			line-height: 3rem;
			font-size: 1.125rem;
			color: #000;
			width: 3.5rem;
			padding-left: 1.125rem;
			padding-top: 0.2rem;
			text-align: center;
		}

		.t {
			color: #6c6c6c;
			font-size: 0.9375rem;
			height: 3rem;
			position: relative;
			float: left;
			text-align: left;
			// background-image: url(/static/img/back.png);
			// background-repeat: no-repeat;
			// background-position: 0.375rem 50%;
			// background-size: 1.1rem;
			@include space();
		}

		span {
			display: block;
			line-height: 3rem;
			padding-right: 3.5rem;
			font-family: "PingFangSC-Regular";
			color: #000;
			font-size: 1.06rem;
			@include space();
		}

	}

	.region {
		display: flex;
		height: 3rem;
		align-items: center;
		padding-left: 1.3rem;

		.city {
			max-width: 5rem;
			font-size: 0.81rem;
			padding-right: 0.5rem;
			@include space();
		}

		.choiceCity {
			display: flex;
			justify-content: center;
			padding: 0.4rem 0.8rem;
			font-size: 0.8rem;
			border: 1px solid #d6d3d3;
		}
	}

	.nullHeight {
		width: 100%;
		height: 0.5625rem;
		background: #f6f7f8;
	}

	.shopli {
		width: 100%;
		padding: 1rem 1.15rem 0 1.125rem;

		.shopbox {
			width: 100%;
			padding-bottom: 1rem;
			border-bottom: 1px solid #d6d6d6;
			font-size: 0.875rem;

			.title {
				width: 100%;
				color: #13252e;
				padding-bottom: 0.3rem;
				@include space();
			}

			.adress {
				width: 100%;
				color: #999;
				font-size: 0.7rem;
			}
		}
	}
</style>
