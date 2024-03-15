<template>
	<view class="main h-c">
		<div class="video-fr h-c">
            <video v-if="videoInfo.videoUrl" :src="videoInfo.videoUrl" autoplay="false" :poster="videoInfo.cover" duration="" controls="true"></video>
        </div>
        <div class="download-btn h-c" @click="download">下载</div>
	</view>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		
		data() {
			return {
				
			}
		},
		onLoad() {
            
		},
        computed: {
            ...mapState(['videoInfo'])
        },
		methods: {
			download(){
                const { videoUrl } = this.videoInfo || {};
                if(videoUrl){
                    uni.showLoading({
                        title: '正在下载',
                        mask: true,
                    });
                      
                    uni.downloadFile({
                        url: videoUrl,
                        success: (res) => {
                            if (res.statusCode === 200) {
                                console.log('下载成功', res);
                                // 下载成功，保存文件到系统相册
                                uni.saveVideoToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success: () => {
                                        uni.showToast({
                                            title: '视频保存成功'
                                        });
                                    },
                                    fail: (e) => {
                                        uni.showToast({
                                            title: '视频保存失败'
                                        });
                                        console.error(e);
                                    },
                                    complete(){
                                        uni.hideLoading(); 
                                    }
                                });
                            }
                        },
                        fail: (e) => {
                            uni.hideLoading(); 
                            uni.showToast({
                                title: '视频下载失败'
                            });
                            console.error(e);
                        }
                    });
                }
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
		.video-fr{
            margin-top:20rpx;
            width:670rpx;
            height: 1120rpx;
            border: 2rpx solid #dfdfdf;;
			border-radius: 10rpx;
            overflow: hidden;
            video{
                width:100%;
                height: 100%;
            }
        }
        .download-btn{
            width:670rpx;
            height:90rpx;
            border-radius: 45rpx;
            background: #7861d4;
            margin-top:20rpx;
            color: #fff;
            font-weight: bolder;
        }
	}
	

</style>
