<template>
  <div>
    <ul>
      <li class="friends-list" v-for="(item, index) in newFriends">
        <div class="friends-list__name">{{index + 1}}姓名：{{item.name}}
          <button @click="showDetails(item)">查看年龄</button>
        </div>
        <div v-show="item.isShow" class="friends-list__age">年龄：{{item.age}}</div>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  data () {
    return {
      friends:[{
        name: "张三",
        age: 23
      },{
        name: "李四",
        age: 24
      },{
        name: "王朝",
        age: 25
      },{
        name: "马汉",
        age: 26
      }]
    }
  },
  computed: {
    newFriends() {
      return this.friends.map(item =>{
        this.$set(item, "isShow", false)
        return item
      })
    }
  },
  methods: {
    showDetails(e) {
      const nowStatu = e.isShow
      this.friends.forEach(item =>{
        item.isShow = false
      })
      e.isShow = !nowStatu
    }
  },
  mounted () {
  },

}
</script>