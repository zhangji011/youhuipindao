import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	latitude: '', // 当前位置纬度31.24916171
	longitude: '', // 当前位置经度121.48789949
	cityname:'上海',//CITYNAME
	token:{}, // 老平台获取到的token
	tokenstatus: '',
	flag: 0, // 是否做过分流判断
	slider:[], //首页轮播图
	slider1:[], //我的轮播图
	slider2:[], //我的轮播图
	tabs:[], //tab
	alertinfo:[], //弹窗
	bannermarkets:[], //异形banner
	topTitle:'', //标题
	recommends:[], // 为你推荐banner
	shopParm:[], // 为你推荐banner
	products:'', // 首页，贷款超市产品列表
	error:0,
	countyParm:'',
	direction:'',
	animation:{},
	historyCount:0,
	alertTextFirst:'',
	alertTextSecond:'',
	isShowAlert:'',
	btnText:'',
	isAdmittance:0,
	showLoading:true,
	sliderScroll:'',
	cityName1:window.CITYNAME || "定位中",
	cityName2:window.CITYNAME2,
	slideIndex:0,
	openAndClose:true,
	middle:[],
	shopLists:[]

}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})