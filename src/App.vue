<script>
	import { checkForUpdate } from './common/lib/updatePackage'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 需要调试一下
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
