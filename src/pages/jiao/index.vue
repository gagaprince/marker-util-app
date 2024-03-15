<template>
	<view class="main h-c">
		<div class="desc">请仔细查看下面使用流程</div>
        <div class="img-fr">
            <image mode="widthFix" src="../../static/jiao/1.jpg" alt="">
            <image mode="widthFix" src="../../static/jiao/2.jpg" alt="">
            <image mode="widthFix" src="../../static/jiao/3.jpg" alt="">
            <image mode="widthFix" src="../../static/jiao/4.jpg" alt="">
            <image mode="widthFix" src="../../static/jiao/5.jpg" alt="">
        </div>
	</view>
</template>

<script>

	export default {
		
		data() {
			return {
				
			}
		},
		onLoad() {
            
		},
        computed: {
            
        },
		methods: {
			
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
		.desc{
            width: 690rpx;
            margin: 20rpx 0;
        }
        .img-fr{
            width:690rpx;
            image{
                margin-bottom: 20rpx;
                width:100%;
                display: block;
            }
        }
	}
</style>
