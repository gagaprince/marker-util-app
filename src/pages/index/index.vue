<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}} </text>
		</view>
	</view>
</template>

<script>
	const MarkerUtilNativeModule = uni.requireNativePlugin('MarkerUtilUniPlugin-MarkerUtilNativeModule');
	export default {
		
		data() {
			return {
				title: 'Hello-gagagaga'
			}
		},
		onLoad() {
			console.log('MarkerUtilNativeModule',MarkerUtilNativeModule); 
			console.log('testSyncFunc:',MarkerUtilNativeModule.testSyncFunc({a:111}));


			MarkerUtilNativeModule.sendRequest({
				url: 'https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=742384287393565993&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333&X-Bogus=DFSzswSLCMxANnEftLw8Mz9WcBjO',
				method: 'GET',
				headers: {
					"Host": "www.douyin.com",
					"Cookie": "msToken=L2bUkYNx9jSB1tBgHWMzEKRM3pwsxfI1n7sKVp83L5xlUExwfmbu2QQa4PUtuxybxNUBfcDwL8399llA2AjUXDlocB4ESx8CT4lYvL5aCKv;ttwid=1%7C7LEKdUqQzAZ7kQqUHAjNB3rk7rIkdqr8otvaLQ_zij0%7C1710245909%7C308e2eb25791fe41a9e0b1a55acdeae21a5703c69d5f0daf0d367532fbca9ae0;odin_tt=324fb4ea4a89c0c05827e18a1ed9cf9bf8a17f7705fcc793fec935b637867e2a5a9b8168c885554d029919117a18ba69; passport_csrf_token=f61602fc63757ae0e4fd9d6bdcee4810;",
					"accept": "*/*",
					"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
					"accept-language": "zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8",
					"referer": "https://www.douyin.com/"
				},
			},(ret)=>{
				console.log('结果是:');
				if(!ret.error){
					try{
						console.log(JSON.parse(ret.data));
					}catch(e){
						console.log(ret.data);
					}
				}else{
					console.error(ret.error);
				}
			})
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
