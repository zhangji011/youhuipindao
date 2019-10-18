 <template>
    <div class="flip_container" @touchmove.prevent>
	    <section>
            <div class="tipdetail">
                <div class="tipsdetail_amount border-bottom">{{alertText}}</div>
                <div class="cancel tipcancel " @click="closeTip">确定</div>
            </div>
       </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
            }
        },
        mounted(){
      
        },
        props: ['alertText'],
        methods: {
            closeTip(){
                this.$emit('closeTip')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../style/common";
    @import '../../style/mixin';
	.flip_container {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 999;
    .tipdetail {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -8.59375rem;
      margin-top: -4.375rem;
      width: 17.1875rem;
      height: 8.75rem;
    }
    .tipsdetail_amount {
      background: #ffffff;
      height: 5.9375rem;
      line-height: 5.9375rem;
      text-align: center;
      font-size: 1rem;
      box-sizing: border-box;
      /* border-bottom: .0625rem solid #e9e9e9; */
      color: #272727;
      border-radius: .625rem .625rem 0 0;
    }
    .tipcancel {
      height: 2.8125rem;
      color: #ff4b4b;
      font-size: 1rem;
      line-height: 2.8125rem;
      border-radius: 0 0 .625rem .625rem;
      text-align: center;
      background: white;
    }
  }

    
    
</style>
