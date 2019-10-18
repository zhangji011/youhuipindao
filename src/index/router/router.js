import App from '@@/App'
// import axios from "@@/plugins/rsa/axios";
// tab
// const tab = r => require.ensure([], () => r(require('../page/home/tab')), 'tab')
// 首页
// const home = r => require.ensure([], () => r(require('../page/home/children/home')), 'home')
const home = require('../page/home/children/home')

const home1 = r => require.ensure([], () => r(require('../page/home/children/home1')), 'home1')
// 贷款超市
// const shop = r => require.ensure([], () => r(require('../page/home/children/shop')), 'shop')
// 我的
const mine = r => require.ensure([], () => r(require('../page/home/children/mine')), 'mine')
const shopList = r => require.ensure([], () => r(require('../page/home/children/shopList')), 'shopList')
const shopDetail = r => require.ensure([], () => r(require('../page/home/children/shopDetail')), 'shopDetail')
const hebaoInfo = r => require.ensure([], () => r(require('../page/home/children/hebaoInfo')), 'hebaoInfo')
const city = r => require.ensure([], () => r(require('../page/home/children/city')), 'city')
const vipCoupon = r => require.ensure([], () => r(require('../page/home/children/vipCoupon')), 'vipCoupon')
//积分打榜活动介绍页
const scoringActive = r => require.ensure([], () => r(require('../page/home/children/scoringActive')), 'scoringActive')
//积分打榜排行榜
const rankingList = r => require.ensure([], () => r(require('../page/home/children/rankingList')), 'rankingList')
//积分打榜我的权益
const myEquity = r => require.ensure([], () => r(require('../page/home/children/myEquity')), 'myEquity')
//积分打榜活动参与商户页
const activityShop = r => require.ensure([], () => r(require('../page/home/children/activityShop')), 'activityShop')
export default [{
    path: '/',
    component: App, //顶层路由，对应main.html
    children: [ //二级路由。对应App.vue
        // 地址为空时跳转home页面
        {
            path: '',
            // component: scoringActive,
            component: home,
            meta:{
                keepAlive: true
            }
        },
        {
            path: 'home',
            component: home,
            meta:{
                keepAlive: true
            }
            // beforeEnter: (to, from, next) => {
            //     // 请求banner1
            //     axios.post('queryMarketing',{
            //         "position":"TOP",
            //         "session":"" // 单点登录返回session
            //     }).then((res)=>{
            //         console.log(res)
            //         next()
            //         // this.bannerTop = res.data
            //     }).catch((res)=>{

            //     })
            // },
        },
        {
            path: 'home1',
            component: home1,
            meta:{
                keepAlive: true
            }
            // beforeEnter: (to, from, next) => {
            //     // 请求banner1
            //     axios.post('queryMarketing',{
            //         "position":"TOP",
            //         "session":"" // 单点登录返回session
            //     }).then((res)=>{
            //         console.log(res)
            //         next()
            //         // this.bannerTop = res.data
            //     }).catch((res)=>{

            //     })
            // },
        },
       {
            path: 'mine',
            component: mine,
            meta:{
                keepAlive: true
            }
        },
        {
            path: 'scoringActive',
            component: scoringActive,
            meta:{
                keepAlive: false
            }
        },
        {
            path: 'rankingList',
            component: rankingList,
            meta:{
                keepAlive: false
            }
        },
        {
            path: 'activityShop',
            component: activityShop,
            meta:{
                keepAlive: false
            }
        },
        {
            path: 'myEquity',
            component: myEquity,
            meta:{
                keepAlive: false
            }
        },
        {
             path: 'shopList',
             component: shopList,
             meta:{
                 keepAlive: false
             }
         },
         {
              path: 'shopDetail',
              component: shopDetail,
              meta:{
                  keepAlive: false
              }
          },
          {
               path: 'hebaoInfo',
               component: hebaoInfo,
               meta:{
                   keepAlive: false
               }
           },
           {
                path: 'city',
                component: city,
                meta:{
                    keepAlive: false
                }
            },
            {
                 path: 'vipCoupon',
                 component: vipCoupon,
                 meta:{
                     keepAlive: false
                 }
             }

        //常见问题模块
    ]
}]
