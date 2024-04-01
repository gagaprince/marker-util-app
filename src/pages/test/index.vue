<template>
	<view class="content">
		<view class="control">
			<button @click="test">test</button>
			<div>{{retstr}}</div>
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
	import { getttwid,  getRealLink, getAwemeId, getVideoInfoByAwemeId, getQueryString, getPercenVideos, sign } from '@/common/lib/parser'
	import { request } from '@/common/lib/request';

	export default {
		
		data() {
			return {
				originLink:'',
				ttwid: '',
				realLink: '',
				awemeId: '',
				videoInfo: {},
				retstr: ''
			}
		},
		onLoad() {
			// getttwid();
			
		},
		methods: {
			async test(){
				const url = 'https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id=MS4wLjABAAAAc4K_S6OQcztCicdO_-m0oMpmYHpbxnyayDp_-UdMkzCopGHC5PIKIFNp85hotlTU&max_cursor=1666614265000&locate_item_id=7345043016459029800&locate_query=false&show_live_replay_strategy=1&need_time_list=0&time_list_query=0&whale_cut_token=&cut_version=1&count=18&publish_video_strategy_type=2&pc_client_type=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1728&screen_height=1117&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Chrome&browser_version=121.0.0.0&browser_online=true&engine_name=Blink&engine_version=121.0.0.0&os_name=Mac+OS&os_version=10.15.7&cpu_core_num=12&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50&webid=7346887755987994123&msToken=hLysLB2TUK2oq9HVdft8atgRXJD4YKy6FOmu33m0ADNsUBU2Tv-2nDRSB_TpITGLMOPk3AGt5pbnct1BTi2Zpf2jT3z_BVTa75nS18CNAXT3O-_fYt-USPNfJ1WQrA==';
				// const url = 'https://www.douyin.com/aweme/v1/web/aweme/post/?sec_user_id=MS4wLjABAAAACIPxOuHZjBBRNJVIW-MX17JMnlfMIr_xG5TuVlBtAVnHuWa7iBN1G65VpGYOSyqE&count=21&max_cursor=0&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333';
				const useragent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
				// const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';
				const bogus = await sign(url, useragent);
				console.log('bogus:', bogus);

				// const originLink = 'https://v.douyin.com/iF5t52XT/';
				// const realLink = await getRealLink(originLink);
				// console.log('realLink:', realLink);
				// const secUserId = getQueryString('sec_uid', realLink);
				// const ret = await getPercenVideos(secUserId, 2) || {};

				// console.log('here');
				// // this.retstr = JSON.stringify(ret);
				// // console.log('获取到主页数据', ret);
				// const awemeList = ret.aweme_list;
				// if(awemeList){
				// 	const videoInfoList = awemeList.map(item=>{
				// 		return {
				// 			awemeId: item.aweme_id,
				// 			desc: item.desc,
				// 			videoUrl: item.video?.play_addr?.url_list[0],
				// 			cover: item.video?.cover?.url_list[0],
				// 		}
				// 	})
				// 	console.log('作品长度:',videoInfoList.length);
				// 	const videoDemo = awemeList[0];
				// 	const authorInfo = {
				// 		uid: videoDemo.author.uid,
				// 		nickname: videoDemo.author.nickname,
				// 		cover: videoDemo.author.avatar_thumb.url_list[0],
				// 	}

				// 	const personInfo = {
				// 		authorInfo,
				// 		videoInfoList,
				// 	}
				// 	this.retstr = JSON.stringify(personInfo);
				// }
			},
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
