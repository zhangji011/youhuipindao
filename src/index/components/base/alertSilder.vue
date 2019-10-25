<template>
	<div class="bak" v-if="show && bannerinfo.length>1" @touchend.stop>
		<div class="wrapper-p">
			<div class="wrapper">
				<swiper :options="swiperOption" ref="mySwiper">
					<swiper-slide v-for="item in bannerinfo" :key="item.id">
						<div class="bannerbox">
							<img :src="item.popupIcon" alt="" class="bannerimg">
						</div>
					</swiper-slide>
					<!-- 分页器 -->
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
		</div>
		<div class="alert_close" @click="close_alert"></div>
	</div>
</template>

<script>
	import Bus from '@@/page/home/children/gongtong.js'
	let vm = null;
	import {
		swiper,
		swiperSlide
	} from "vue-awesome-swiper";
	export default {
		data() {
			return {
				show: true,
				swiperOption: {
					setWrapperSize: true,
					direction: 'horizontal', //Slides的滑动方向
					slidesPerView: 1,
					autoHeight: true, //	自动高度
					observeParents: true,
					loop: true, //循环
					initialSlide: 1,
					autoplay: {
						delay: 2000,
						stopOnLastSlide: false, ///当切换到最后一个slide时停止自动切换
						disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。
					},
					normalizeSlideIndex: false,
					// spaceBetween: 6,
					// slidesOffsetBefore: document.body.clientWidth/1.1*0.045,
					// slidesOffsetAfter: 32,	
					pagination: {
						el: ".swiper-pagination",
						clickable: false //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					},
					on: {
					  click: function (e) {  //点击弹窗执行home中的godetail
					  if(e.target.className=="bannerimg"){
						  vm.$emit("bannerclick",'no',vm.bannerinfo[this.realIndex],12,'alert_tip');
					  }
					  }
					},
					preventLinksPropagation: false // 阻止点击事件冒泡
				}
			}
		},
		props:{
			bannerinfo:{
				type:Array,
				default:[]
			}
		},
		created() {
			vm = this;
		},
		components: {
			swiper,
			swiperSlide
		},
		mounted() {
		},
		methods: {
			close_alert() {
				this.show = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.bak {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 9999 !important;
		background-color: rgba(0, 0, 0, 0.8);
	}

	.wrapper-p {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.wrapper {
		position: absolute;
		width: 100%;
		height: 18.125rem;
		overflow: visible;
		top: 45%;
		margin-top: -9.0625rem;
	}

	.bannerbox {
		width: 100%;
		height: 18.125rem;

		img {
			display: block;
			margin: 0 auto;
			width: 18.75rem;
			height: 18.125rem;
			border-radius: 0.3125rem;
		}
	}

	.alert_close {
		position: absolute;
		width: 1.75rem;
		height: 1.75rem;
		margin-left: -0.875rem;
		top: 45%;
		left: 50%;
		margin-top: 10.0625rem;
		background: url(/static/img/close_icon_1.png) no-repeat;
		color: #000;
		text-align: center;
		// background-color: #fff;
		background-size: 1.75rem 1.75rem;
	}
</style>
<style>
	.bak span.swiper-pagination-bullet {
		width: 0.4rem;
		height: 0.4rem;
		background: #70716c !important;
		border: 1px solid #70716c !important;
	}

	.bak span.swiper-pagination-bullet-active {
		background: #fff !important;
		border: 1px solid #fff !important;
	}
	.bak .swiper-container{
		overflow: visible;
	}
	.bak .swiper-container-autoheight .swiper-wrapper{
		overflow: visible;
	}
	.bak .swiper-slide{
		overflow: visible;
	}
	.bak .swiper-pagination{
		bottom: -4.75rem;
	}
</style>
