/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = {}; // // 环境
let routerMode = 'hash'; // hash history
let imgBaseUrl = '';
console.log(process.env.NODE_ENV)
const debug = 2 // process.env.NODE_ENV !== 'production'


// 配置环境
if (debug == 1) { //生产
    baseUrl.api = 'https://find.cmpay.com:9102/rcServer/';
    // baseUrl.api = 'http://211.138.236.219:9105/rcServer/';
    baseUrl.img = 'https://mca.cmpay.com:28710'
    // baseUrl.img = 'http://211.138.236.210:18480'
} else if (debug == 0) { //准生产

    baseUrl.api = 'http://211.138.236.219:9103/rcServer/'; //生产
    baseUrl.img = 'https://mca.cmpay.com:28710'

} else if (debug == 2) { //综测
    baseUrl.api = 'http://113.108.79.80:3020/rcServer/'; //综测
    baseUrl.img = 'https://mca.cmpay.com:28710'

}else { //客户端模拟
    // baseUrl.api = 'http://localhost:8000/rcServer/';//
    // baseUrl.api = 'http://www.ifruit.org/rcServer/';//
    // baseUrl.api = 'http://192.168.157.198:7300/mock/59cd9c4f55deb8dfcb498e17/mock/'
    baseUrl.api = 'http://www.ifruit.org:7300/mock/59cd9c4f55deb8dfcb498e17/mock/';
    baseUrl.img = 'https://mca.cmpay.com:28710'
    // baseUrl.img = 'https://mca.cmpay.com:28710'

}

export {
    baseUrl,
    routerMode,
    imgBaseUrl
}
