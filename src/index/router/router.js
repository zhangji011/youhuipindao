import App from '@@/App'
// import axios from "@@/plugins/rsa/axios";
// tab
// const tab = r => require.ensure([], () => r(require('../page/home/tab')), 'tab')
// 首页
// const home = r => require.ensure([], () => r(require('../page/home/children/home')), 'home')

const home1 = r => require.ensure([], () => r(require('../page/home/children/home1')), 'home1')
// 贷款超市
// const shop = r => require.ensure([], () => r(require('../page/home/children/shop')), 'shop')
// 我的
const mine = r => require.ensure([], () => r(require('../page/home/children/mine')), 'mine')
const log = r => require.ensure([], () => r(require('../page/home/children/log')), 'log')
const my = r => require.ensure([], () => r(require('../page/home/children/my')), 'my')
const reset = r => require.ensure([], () => r(require('../page/home/children/reset')), 'reset')
const shopDetail = r => require.ensure([], () => r(require('../page/home/children/shopDetail')), 'shopDetail')
const businessCheck = r => require.ensure([], () => r(require('../page/home/children/businessCheck')), 'businessCheck')
const city = r => require.ensure([], () => r(require('../page/home/children/city')), 'city')
export default [{
    path: '/',
    component: App, //顶层路由，对应main.html
    children: [ //二级路由。对应App.vue
        // 地址为空时跳转home页面
        {
            path: '',
            component: log,
            meta:{
                keepAlive: true
            }
        },
        {
            path: 'home1',
            component: home1,
            meta:{
                keepAlive: false
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
               path: 'businessCheck', 
               component: businessCheck,
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
                 path: 'log', 
                 component: log,
                 meta:{
                     keepAlive: false
                 }
             },
              {
                   path: 'reset', 
                   component: reset,
                   meta:{
                       keepAlive: false
                   }
               },
               {
                    path: 'my', 
                    component: my,
                    meta:{
                        keepAlive: false
                    }
                }
       
        //常见问题模块
    ]
}]