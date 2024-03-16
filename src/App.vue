<script>
	import { getttwid } from './common/lib/parser'
	import { checkForUpdate } from './common/lib/updatePackage'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 需要调试一下
			// getttwid();
			checkForUpdate();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
