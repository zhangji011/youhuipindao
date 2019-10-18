 <template>
    <div class="alet_container" @touchmove.prevent :showAlert="showAlert">
	    <section class="tip_text_container">
            <div class='tip_text_box'>
                <p :class="isAlert"></p>
                <p class="tip_text">{{alertText}}</p>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
                showAlert: false,
                positionY: 0,
                timer: null,
                isAlert: ""
            }
        },
        mounted(){
           this.init();
        },
        props: {
            alertText:{
                type:String
            }
        },
        methods: {
            init() {
                this.isAlert = this.alertText === "领取失败" ? "alertIcon" : "tipIcon";
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	@keyframes tipMove{
       0%   { transform: scale(1) }
       35%  { transform: scale(.8) }
       70%  { transform: scale(1.1) }
       100% { transform: scale(1) }
    }
    .alet_container{
    	position: fixed;
    	top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width:100%;
        z-index: 200;
        background-color: rgba(0,0,0,0.3);
        overflow: hidden;
    }
    .tip_text_container{
        position: absolute;
        //top: 50%;
        //left: 50%;
        //margin-top: -6rem;
        //margin-left: -6rem;
        left:0;
        right:0;
        margin: auto;
        top: 50%;
        width: 9.375rem;
        height: 4.6875rem;
        animation: tipMove .4s;
        background-color: #000;
        opacity: 0.8;
        border: 1px;
        //padding-top: .6rem;
        overflow:auto;
        display: flex;
        //justify-content: center;
        //align-items: center;
        //flex-direction: column;
        border: 1px;
        border-radius: 0.3125rem;
        .tip_text_box{
            // height:6.5rem;
            display: flex;
            justify-content: center;
            width: 100%;
            align-items: center;
            flex-direction:column;
        }
        .alertIcon{
            width: 1.375rem;
            height: 1.375rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: url(/static/img/fail_icon.png) no-repeat 50% 50%;
            background-size: 1.375rem 1.375rem;
        }
        .tipIcon{
            width: 1.375rem;
            height: 1.375rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: url(/static/img/success_icon.png) no-repeat 50% 50%;
            background-size: 1.375rem 1.375rem;
        }
        .tip_text{
            font-family: PingFangSC-Regular;
            font-size: 0.875rem;
            color: #fff;
            line-height: .9rem;
            text-align: center;
            //margin-top: .8rem;
            padding: 0 .4rem;
            margin-top:0.4rem;
        }
        .confrim{
            @include sc(.875rem, #FF4B4B);
            //font-weight: bold;
            //margin-top: .8rem;
            //background-color: #4cd964;
            width: 100%;
            text-align: center;
            line-height: 2.5rem;
            height:2.5rem;
            border: 1px;
            //border-bottom-left-radius: 0.25rem;
            //border-bottom-right-radius: 0.25rem;
            position:absolute;
            bottom:0;
            left:0;
            border-top:1px solid #e9e9e9;
        }
    }
    
</style>
