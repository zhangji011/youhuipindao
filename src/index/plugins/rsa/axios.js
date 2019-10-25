/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
// import util from '@@/plugins/rsa/util'
// import store from '@@/store/'
import { objPlan,isShopDetail, getFreeSign, SessionkeyVarify, setMd5 } from '@@/service/util'
// import {geUUID} from '@@/service/util';
import { baseUrl } from '@@/config/env' // baseUrl


// 环境
let urlObj = baseUrl

// 超时时间
axios.defaults.timeout = 60000
// 请求头
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.responseType = 'json'
// axios.defaults.headers.common['Authorization'] = "Basic " + App.getSessionKey();
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
// axios.defaults.dataType = 'JSON'
// axios.defaults.headers['Authorization'] = "Basic " + App.getSessionKey();
// setMd5()
// console.log(222)
// http请求拦截器 --加密等
axios.interceptors.request.use(config => {
    if ((config.data && config.data.baseUrl === 0)||config.url.indexOf('baseUrl')>0) {

    }else{
         //拼接请求参数
         if (config.url == "queryAccount") {
           // alert(window.location.href)
            // config.url = urlObj.api + config.url+"?"+window.location.href.split('?')[1].replace(/SIGN_DATA/g,'sign_data').replace(/CREDTENTIAL/g,'credtential')
            config.url = urlObj.api + config.url + "?" + window.location.href.split('?')[1].replace(/SIGN_DATA/g, 'sign_data').replace(/CREDTENTIAL/g, 'credtential')
        } else if (config.url.indexOf('getContent') > 0) {
            // 更换头部
            axios.defaults.headers.post['Content-Type'] = 'application/json;encoding=utf-8';
        } else if(config.url.indexOf('queryUserAttend')!=-1 || config.url.indexOf('userAttend')!=-1 || config.url.indexOf('integralRank')!=-1 || config.url.indexOf('queryIntegralDetail')!=-1 || config.url.indexOf('queryExchangeDetail')!=-1 || config.url.indexOf('ZJgetShopInfo')!=-1 || config.url.indexOf('ZJqueryCoupon')!=-1 || config.url.indexOf('queryAmount')!=-1 || config.url.indexOf('exchangeCoupon')!=-1 || config.url.indexOf('queryUserAttend')!=-1){  //8.22新增else if专门判断是否是积分打榜接口
			if(config.url.indexOf('ZJgetShopInfo')!=-1 ||config.url.indexOf('ZJqueryCoupon')!=-1){  //积分打榜需要截取的URL,避免重复的shopinfo接口
				config.url = urlObj.jfdbapi + config.url.substr(2) + "?" + objPlan(config.data, 1);  //拼接积分打榜的接口
			}else{
				config.url = urlObj.jfdbapi + config.url + "?" + objPlan(config.data, 1);  //拼接积分打榜的接口
			}
		}else {
            if(config.url == "getExternalShopInfoDetail") {
                if(isShopDetail()) {
                    config.url = urlObj.api + config.url + "?" + window.location.href.split('?')[1];
                } else {
                    config.url = urlObj.api + config.url + "?" + objPlan(config.data, 1)
                }
                // console.log(window.location.href.split('?')[1]);
                // console.log(window.location.href.split('?')[1].split('&')[1]);
            } else {
                config.url = urlObj.api + config.url + "?" + objPlan(config.data, 1)
            }
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
    return data.data
}, error => {
    return Promise.reject(error)
})

export default axios
