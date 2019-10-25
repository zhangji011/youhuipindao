<template>
<!-- <div> -->
    <van-tabs v-model="active" swipeable  title-active-color="#ee0a24" class="aabb">
        <van-tab v-for="(item,index) in tabList" :key="index" :title="item.title">
            <!-- <div v-if="item.index == 1">
            </div>
            <div v-if="item.index == 2">22</div>
            <div v-if="item.index == 3">33</div> -->
            <seckill v-if="item.index == 0"></seckill>
            <home v-if="item.index == 1"></home>
            <!-- <group v-if="item.index == 2"></group> -->
            <home1 v-if="item.index == 2"></home1>
            
        </van-tab>
    </van-tabs>
                <!-- <seckill v-if="active == 0"></seckill>
            <home v-if="active == 1"></home>
            <group v-if="active == 2"></group>
 -->
    <!-- </div> -->
</template>
<script>
import Home from "./home.vue";
// import Group from "./group.vue"
import Seckill from "./seckill.vue";
import Home1 from "./tabhome1.vue";
import Bus from './gongtong.js';
import Cookies from 'js-cookie';
import sa from "sa-sdk-javascript";

export default {
    components: {
        Home,
        // Group,
        Seckill,
        Home1
    },
    data() {
        return {
            active: 1,
            tabList: [
                { index:0, title: '秒杀'},
                { index:1, title: '首页'},
                { index:2, title: '附近优惠'}
            ],
        }
    },
    mounted() {
		if(Cookies.get('groupp') == '0') {
		    this.active = 0
		}
    },
    watch: {
        active() {
            Bus.$emit('activee')
            // Bus.$emit('scrollsilder');
            if(this.active == 1) {
                Bus.$emit('couponScroll');  //20191010解决领劵卡住
                Bus.$emit('silder')
                Bus.$emit('scrollGoods');
				Bus.$emit('bannerauto',true);  //20191017 修复banner切换后不轮播问题
            }else{
            	 Bus.$emit('bannerauto',false);  //20191017 修复banner切换后不轮播问题
            }
			if(this.active == 0){
				sa.track("buttonClick", {
				  buttonName: "秒杀",
				  topCategory: "优惠",
				  subCategory: "优惠：京东秒杀"
				});
			}else if(this.active == 2){
				sa.track("buttonClick", {
				  buttonName: "附近优惠",
				  topCategory: "优惠",
				  subCategory: "优惠：更多优惠"
				});
			}
        }
        
    }
}
</script>
<style lang="scss" scoped>
.van-tab span {
    font-size: 1rem;
}
</style>
<style>
	.van-tabs__line{
	    z-index: 999!important;	
	}
</style>