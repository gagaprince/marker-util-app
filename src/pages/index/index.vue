<template>
	<view class="main h-c">
		<view class="header">
			<image src="../../static/index/header_bg.png" alt="">
			<view class="header-title">嘎嘎剪辑工具箱</view>
			<view class="header-desc">完全免费</view>
			<view class="header-desc-2">第一次使用请点下方教程</view>
		</view>
		<view class="line"></view>
		<view class="content">
			<view class="tools">
				<textarea v-model="originText" placeholder="请输入链接" maxlength="1000">
					
				</textarea>
				<view class="paste h-c" @click="pasteText">粘贴</view>
				<view class="clear h-c" @click="clearText">清空</view>
				<view class="submit h-c" @click="invokeTask">开始剪辑</view>
			</view>
			<view class="item-frame" @click="goJiao">
				<view class="item-fn">使用教程</view>
				<view class="arrow"><image src="https://p0.meituan.net/travelcube/54acfc734c4ee6728f5347dbb82f1dc3781.png"/></view>
			</view>
			<!-- <view class="item-frame">
				<view class="item-fn">批量作业</view>
				<view class="arrow"><image src="https://p0.meituan.net/travelcube/54acfc734c4ee6728f5347dbb82f1dc3781.png"/></view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';
	import { getVideoInfoByLink } from '@/common/lib/parser'

	export default {
		
		data() {
			return {
				originText: '',
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['setVideoInfo']),
			async invokeTask(){
				const originLink = this.parseLinkFromOriginText();
				if(originLink){
					console.log('解析出来的链接:', originLink);
					uni.showLoading({
						title: '解析中'
					});
					try{
						const videoInfo = await getVideoInfoByLink(originLink);
						if(videoInfo){
							this.setVideoInfo(videoInfo)
							uni.hideLoading();
							console.log('videoInfo:',videoInfo);
							uni.navigateTo({
								url: '/pages/detail/index',
							});
						}else{
							uni.showToast({
								title: '解析失败，请稍后重试',
								icon: 'none'
							})
						}
						
					}catch(e){
						console.error(e);
						uni.hideLoading();
						uni.showToast({
							title: '解析失败，请稍后重试',
							icon: 'none'
						})
					}
				}
			},
			parseLinkFromOriginText(){
				let str = this.originText;
				let regex = /(https?:\/\/[^\s]+)/;
				let match = str.match(regex);
				if (match) {
					return match[1];  
				}else{
					uni.showToast({
						title: '解析出错,请检查~',
						icon: 'none'
					});
				}
				return '';
			},
			clearText(){
				this.originText = '';
			},
			pasteText(){
				uni.getClipboardData({
					success: (ret) => {
						this.originText = ret.data;
						console.log(this.originText);
					},
					fail: (e) => {
						uni.showToast({
							title: '访问剪切板失败，请确认剪切板有内容'
						});
					},
					complete: () => {}
				});
				  
			},
			goJiao(){
				uni.navigateTo({
					url: '/pages/jiao/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.h-c{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.main {
		width:100%;
		.header{
			width: 100%;
			height: 410rpx;
			overflow: hidden;
			position: relative;
			image{
				width:100%;
				display: block;
				position: absolute;
				z-index: -1;
			}
			.header-title{
				position: absolute;
				font-size: 60rpx;
				color: #fff;
				font-weight: bolder;
				top: 200rpx;
				left: 60rpx;
			}
			.header-desc{
				position: absolute;
				font-size: 40rpx;
				color: #fff;
				font-weight: bolder;
				top: 280rpx;
				left: 60rpx;
			}
			.header-desc-2{
				position: absolute;
				font-size: 36rpx;
				color: #fff;
				font-weight: bolder;
				top: 350rpx;
				left: 60rpx;
			}
		}
		.line{
			width:100%;
			height: 20rpx;
			background: #f1f1f1;
		}
		.content{
			width:690rpx;
			.tools{
				position: relative;
				width: 100%;
				textarea{
					width: 650rpx;
					height: 300rpx;
					margin-top:30rpx;
					padding: 20rpx;
					border: 2rpx solid #dfdfdf;;
					border-radius: 20rpx;
				}
				.paste, .clear{
					position: absolute;
					width:150rpx;
					height: 70rpx;
					border-radius: 50rpx;
					background: #7861d4;
					top:260rpx;
					right:10rpx;
					color: #fff;
					font-weight: bolder;
				}
				.clear{
					right: 170rpx;
				}
				.submit{
					width:100%;
					height:90rpx;
					border-radius: 45rpx;
					background: #7861d4;
					margin-top:20rpx;
					color: #fff;
					font-weight: bolder;
				}

			}
			.item-frame{
				margin-top:30rpx;
				display: flex;
				width:100%;
				height:90rpx;
				border-radius: 20rpx;
				background: #fff;
				border: 1rpx solid #dfdfdf;
				align-items: center;
				.item-fn{
					flex:1;
					margin-left: 20rpx;
				}
				.arrow{
					margin-right: 20rpx;
					width:40rpx;
					height: 40rpx;
					transform: rotate(180deg);
					image{
						width:100%;
						height: 100%;
						display: block;
					}
				}
			}
		}
	}
	

</style>
