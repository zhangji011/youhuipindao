<template>
	<div style="height:100%;">
		<transition >
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    	</transition>
    	<transition>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
        <foot-guide activeIcon = 'home'></foot-guide>
    </div>
</template>

<script>
  import footGuide from '@@/components/footer/footGuide'
  	export default {
    	components:{
            footGuide
        },
		mounted() {
			// App.overrideBackPressed(true);
			// App.setKeyEventListener(function(event){
			// 	if (event == 'backpress') {
			// 		App.exitApp();
			// 	}
			// });
		},
  	}

</script>

<style lang="scss">
  	@import '~@@/style/common';
	// .router-fade-enter-active, .router-fade-leave-active {
	//   	transition: opacity .3s;
	// }
	// .router-fade-enter, .router-fade-leave-active {
	//   	opacity: 0;
	// }
</style>
