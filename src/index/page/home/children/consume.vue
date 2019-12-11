 <template>
    <div class="consume">
        <div class="s_1">
            <ul>
                <!-- <router-link tag="li" class="l t" to="/home1"></router-link> -->
                <li class="l t" @click="goBack()"></li>
                <li class="l">
                    <span>支持本店消费的和包劵</span>
                </li>
            </ul>
        </div>
        <div class="cardvolume">
            <scroll>
                <ul>
                    <!-- <li v-for="(item,index) in dataList" :key="'ul'+index" v-if="dealIf"> -->
                    <li v-for="(item,index) in dataList" :key="'ul'+index">
                        <div class="volume">
                            <div class="volume_top">
                                <div class="date">有效期至{{item.expDt}}</div>
                            </div>
                            <div class="segmentation"></div>
                            <div class="volume_bottom">
                                <div class="price clearfloat">
                                    <span class="price_span">可叠加</span>
                                    <p>{{item.curAcBal}}<span>元</span></p>
                                </div>
                                <div class="reason">
                                    <p>{{item.bonNm}}<span>(和包劵)</span></p>
                                    <p>面额: {{item.curAcBal}}元</p>
                                    <p>使用门槛: 无门槛</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="bottom" v-if="bottom">已经到底啦</div>
            </scroll>
        </div>
    </div>
</template>
<script>
import axios from "@@/plugins/rsa/axios";
import Scroll from "@@/components/scroll/scroll.vue";
import { mapState, mapMutations } from "vuex";
import { baseUrl } from "@@/config/env"; // baseUrl


export default {
    data() {
        return {
            dataList: [],
            dealIf: true,
            eee: '',
            bottom: false,
        }
    },
    mounted() {
        this.init();
    },
    components: {
        Scroll,
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
        init() {
            let params = this.$route.query.params;
			// alert("手机号码:"+this.token.productNo);
			// alert("qryMercId:"+params)
            axios.post("getPrdinfo", {
                merchantId: 888073118000170,
                // mobileNo: 15111427793,
                mobileNo: this.token.productNo,
                qryMercId: params,
                // qryMercId: 888073115050038,
                qryFlg: 2
                }).then(res => {
                    if(res.data.prdInfo.length >= 1) {
                        this.bottom = true
                    }else{
                        this.bottom = false
                    }
                    // this.bottomm = true
                    this.dataList = res.data.prdInfo;
                    // console.log(this.dataList);
                    // for(let i = 0; i < this.dataList.length;i++) {
                    //     this.eee = this.dataList[i].expDt
                    //     // console.log(this.eee)
                    // }
                    // let nowDate = new Date();
                    // let date = {
                    //     year: nowDate.getFullYear(),
                    //     month: nowDate.getMonth() + 1,
                    //     date: nowDate.getDate(),
                    // }
                    // console.log(date);
                    // let systemDate = date.year + '-' + 0 + date.month + '-' + 0 + date.date;
                    // if(systemDate > this.eee) {
                    //     this.dealIf = !this.dealIf
                    // }


                })
        },
        goBack() {
            this.$router.go(-1);
        },
        // addDate() {
        //     let nowDate = new Date();
        //     let date = {
        //         year: nowDate.getFullYear(),
        //         month: nowDate.getMonth() + 1,
        //         date: nowDate.getDate(),
        //     }
        //     // console.log(date);
        //     let systemDate = date.year + '-' + 0 + date.month + '-' + 0 + date.date;
        //     console.log(systemDate);
        //     console.log(this.eee);
            

        //     // if(systemDate > this.eee) {
        //     //     // alert(this.eee)
        //     //     // console.log(this.eee);
        //     //     this.dealIf = !this.dealIf
        //     // }
        // }

    }

}
</script>
<style lang="scss" scoped>
@import "~@@/style/mixin";
.s_1 {
  @include wh(100%, 3rem);
  background: #ffffff;
  position: sticky;
  z-index: 100000000;
  top: 0;
  left: 0;
  .l {
    height: 100%;
    line-height: 3rem;
    font-size: 1.125rem;
    font-family: PingFangSC-Regular;
    color: #13252e;
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
.cardvolume {
    // min-height: 100vh;
    background-color: #f7f5f8;
    position: absolute;
    z-index: 1;
    top: 3rem;
    left: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 3rem;
    overflow: hidden;
    ul {
        li {
            padding: 0.8rem 1rem 0 1rem;
            background-color: #f7f5f8;
            .volume {
                width: 100%;
                background-color: #fff;
                border-radius: 0.1rem; 
                padding: 0 1.875rem;
                .volume_top {
                    .date {
                        font-size: 0.75rem;
                        color: #7E7E7E  ;
                        padding: 0.53rem 0;
                    }
                }
                .segmentation {
                    display: block;
                    height: 0.0625rem;
                    width: 100%;
                    bottom: 0;
                    background-color: #cccccc;
                    -webkit-transform-origin: 0, 0;
                    transform-origin: 0, 0;
                    -webkit-transform: scaleY(0.5);
                    -ms-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
                .volume_bottom {
                    // padding: 0.7rem 1.875rem;
                    padding: 0.7rem 0;
                    .price {
                        text-align: center;
                        float: left;
                        margin-right: 1.8rem;
                        .price_span {
                            font-size: 0.625rem;
                            background-image: linear-gradient(270deg, #E93357 0%, #F55B97 100%);                            
                            padding: 0 0.2rem;
                            border-radius: 0.25rem; 
                            color: #FFF3F4;
                        }
                        p {
                            font-size: 35px;
                            color: #ED196C; 
                            // margin-top: 0.3rem;
                            span {
                                font-size: 1rem;
                                font-weight: 700;
                                margin-left: 0.2rem;
                            }
                        }
                    }
                    .reason {
                        p {
                            font-size: 0.875rem;
                            color: #5A6164 ;
                            span {
                                font-size: 0.8125rem;
                                color: #7E7E7E;
                                margin-left: 0.5rem;
                            }
                        }
                        p:nth-child(1) {
                            font-size: 0.9375rem;;
                            color: #13252E;
                            margin-bottom: 0.4rem;
                            margin-top: 0.1rem;
                        }
                    }
                }
            }
        }
    }
    .bottom {
        color: #AEAFAF;
        font-size: 0.75rem;
        text-align: center;
        background-color: #f7f5f8;
        padding: 2rem 0;
    }
}
   /*清除浮动代码*/
   .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
   .clearfloat{zoom:1}
   .cardvolume .list-wrapper{
	   background-color: #f7f5f8;
   }
</style>
