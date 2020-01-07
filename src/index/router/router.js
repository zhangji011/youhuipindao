import App from '@@/App'
// import axios from "@@/plugins/rsa/axios";

const home1 = r => require.ensure([], () => r(require('../page/home/children/home1')), 'home1')
const shopList = r => require.ensure([], () => r(require('../page/home/children/shopList')), 'shopList')
const shopDetail = r => require.ensure([], () => r(require('../page/home/children/shopDetail')), 'shopDetail')
const hebaoInfo = r => require.ensure([], () => r(require('../page/home/children/hebaoInfo')), 'hebaoInfo')
const city = r => require.ensure([], () => r(require('../page/home/children/city')), 'city')

//20191018增  查看支持本店消费的和包劵
const consume = r => require.ensure([], () => r(require('../page/home/children/consume')), 'consume')

// 拼购
const group = r => require.ensure([], () => r(require('../page/home/children/group')), 'group')

// 秒杀
const seckill = r => require.ensure([], () => r(require('../page/home/children/seckill')), 'seckill')


export default [{
    path: '/',
    component: App, //顶层路由，对应main.html
    children: [ //二级路由。对应App.vue
        // 地址为空时跳转home页面
        {
            path: '',
            component: home1,
            meta:{
                keepAlive: true,
				title:"附近优惠"
            }
        },
        {
            path: 'home1',
            component: home1,
            meta:{
                keepAlive: true,
				title:"附近优惠"
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
		     path: 'consume', 
		     component: consume,
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
                path: 'group', 
                component: group,
                meta:{
                    keepAlive: false,
					title:"拼购"
                }
            },
            {
                path: 'seckill', 
                component: seckill,
                meta:{
                    keepAlive: false,
					title:"秒杀"
                }
            }
        ]
}]