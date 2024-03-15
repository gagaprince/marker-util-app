<template>
	<view class="content">
		<view class="control">
			<textarea v-model="originLink" placeholder="请输入原始链接"/>
			<button @click="testGet">解析</button>
			<view class="lb word-wrap">
				videoUrl: {{videoInfo.videoUrl || ''}}
			</view>
			<video v-if="videoInfo.videoUrl" :src="videoInfo.videoUrl" autoplay="true" duration="" controls="true"></video>
		</view>
	</view>
</template>

<script>
	import { getttwid,  getRealLink, getAwemeId, getVideoInfoByAwemeId } from '@/common/lib/parser'

	export default {
		
		data() {
			return {
				originLink:'',
				ttwid: '',
				realLink: '',
				awemeId: '',
				videoInfo: {},
			}
		},
		onLoad() {
			// getttwid();

		},
		methods: {
			async getTTwid(){
				const ttwid = await getttwid();
				this.ttwid = ttwid;
				uni.showToast({
					title: ttwid,
        			icon: 'none',
				})
			},
			async getRealLinkByOriginLink(){
				const realLink = await getRealLink('https://v.douyin.com/iLd4ecsX/?=');
				console.log(realLink)
				this.realLink = realLink;
			},
			async getAwemeIdByOriginLink(){
				const awemeId = await getAwemeId('https://v.douyin.com/iLd4ecsX/?=');
				this.awemeId = awemeId;
			},
			async testGet(){
				const originLink = this.originLink || '';
				if(!originLink) {
					uni.showToast({
						title: '请输入正确的链接',
						icon: 'none'
					})
					return;
				}
				uni.showLoading({
					title: '解析中'
				});
				try{
					const awemeId = await getAwemeId(originLink);
					console.log('awemeId:', awemeId);
					const videoInfo = await getVideoInfoByAwemeId(awemeId);
					uni.hideLoading();
					const videoUrl = videoInfo.aweme_detail?.video?.play_addr?.url_list[0]||'';
					const cover = videoInfo.aweme_detail?.video?.cover?.url_list[0] || '';
					const user = videoInfo.aweme_detail?.author?.nickname || ''
					const desc = videoInfo.aweme_detail?.desc || ''
					this.videoInfo = {
						videoUrl, cover, user, desc
					}
					console.log('videoInfo:',this.videoInfo);
				}catch(e){
					console.error(e);
				}
				

			}
		}
	}
</script>

<style>
	.content {
		width:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.control{
		margin-top: 30rpx;
		width: 700rpx;
	}

	.lb{
		
	}

	.word-wrap {
		word-wrap: break-word; /* 老版本的浏览器支持 */
		word-break: break-word; /* Chrome和Firefox支持 */
		overflow-wrap: break-word; /* 标准属性，大多数浏览器支持 */
	}

</style>
