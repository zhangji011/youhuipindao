<template>
  <div class="list-wrapper">
    <ul class="list">
      <!-- <li class="item" @click="handleLetterClick"
       :key="top"    
        :ref="top"
        @touchstart.prevent="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
  >定位</li>
      <li class="item" @click="handleLetterClick"
       :key=" top1"
        :ref=" top1"
        @touchstart.prevent="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
  >热门</li> -->
      <li class="item"
        v-for="item of letters"
        :key="item"
        :ref="item"
        @touchstart.prevent="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @click="handleLetterClick"
      >{{item}}</li>
    </ul>
  </div>
</template>

<script>
import cityData from "@@/components/base/city.json";
export default {
  name: 'CityAlphabet',
  props: {
    cities: Object
  },
  data () {
    return {
      touchStatus: false,
      startY: 0,
      timeer: null
    }
  },
  computed: {
    letters () {
      const letters = []
      for (let i in this.cities) {
        letters.push(i)
      }
      return letters
    }
  },
  // 生命周期函数
  updated () {
    this.startY = this.$refs['A'][0].offsetTop // A字母距离滚动条顶部距离
    console.log('updated---> ', this.startY)
  },
  methods: {
    handleLetterClick (e) {
      this.$emit('change', e.target.innerText)
    },
    handleTouchStart () {
      console.log('开始滑动')
      this.touchStatus = true
    },
  
    handleTouchMove (e) {
      if (this.touchStatus) {
        if (this.timeer) {
          clearTimeout(this.timeer)
        }
        this.timeer = setTimeout(() => {
          console.log(e.touches[0])
          const touchY = e.touches[0].clientY - 79 // 手指触摸当前位置距离视口顶部的距离减去40（40指滚动区域最上边和页面顶部之间的距离）
          const index = Math.floor((touchY - this.startY) / 20) // 手指触摸当前位置所在的字母索引（26指单个字母的高度）
          if (index >= 0 && index < this.letters.length) {
            this.$emit('change', this.letters[index])
          }
        }, 16)
      }
      
     
    },
    handleTouchEnd () {
      this.touchStatus = false
    }
  }
}
</script>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 0;
    top: 5rem;
    width: 3rem;
    height: 29rem;
    list-style: none;
    background:rgba(0, 0, 0, 0);
    margin: 0;
    padding: 0;
    z-index: 9;
  }
  .item {
    font-size:0.6875rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#5a6164;
    line-height:0.8125rem;
    margin-bottom: 0.2rem;
    text-align: center;
    width: 100%;
  }

</style>
