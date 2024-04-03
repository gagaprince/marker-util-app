<template>
	<view class="main h-c">
        <web-view id="spider" :update-title="false" @message="receiveMsg" src="https://www.tiktok.com/t/ZPRTuroNq/"></web-view>
        <div class="video-fr h-c">
            <video v-if="videoInfo.videoUrl" :src="videoInfo.videoUrl" autoplay="false" :poster="videoInfo.cover" duration="" controls="true"></video>
        </div>
        <div class="download-btn h-c" @click="createDownload">下载</div>
	</view>
</template>

<script>

    function test(){

        // function setCookie(name, value, days) {
        //     let expires = "";
        //     if (days) {
        //         let date = new Date();
        //         date.setTime(date.getTime() + (days*24*60*60*1000));
        //         expires = "; expires=" + date.toUTCString();
        //     }
        //     document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        // }
        // alert(0);

        // setCookie('tt_chain_token', 'vybtx78A+ULxrmxykcJpNQ==', 180);
        // alert(1);

        const p = window.fetch('https://www.tiktok.com/api/item/detail/?aid=1988&app_id=1180&app_language=zh-Hans&app_name=tiktok_web&browser_language=zh-CN&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28iPhone%3B%20CPU%20iPhone%20OS%2016_6%20like%20Mac%20OS%20X%29%20AppleWebKit%2F605.1.15%20%28KHTML%2C%20like%20Gecko%29%20Version%2F16.6%20Mobile%2F15E148%20Safari%2F604.1&channel=tiktok_web&clientABVersions=70508271&clientABVersions=71861571&clientABVersions=71916113&clientABVersions=72040650&clientABVersions=72054588&clientABVersions=72072742&clientABVersions=72080023&clientABVersions=72096078&clientABVersions=72097168&clientABVersions=72098428&client_ab_versions=70508271&client_ab_versions=71861571&client_ab_versions=71916113&client_ab_versions=72040650&client_ab_versions=72054588&client_ab_versions=72072742&client_ab_versions=72080023&client_ab_versions=72096078&client_ab_versions=72097168&client_ab_versions=72098428&cookie_enabled=true&coverFormat=0&device_id=7352857379065218577&device_platform=web_mobile&focus_state=true&from_page=video&history_len=7&is_fullscreen=false&is_page_visible=true&itemId=7352366345708653854&item_id=7352366345708653854&language=zh-Hans&os=ios&priority_region=&referer=&region=KR&screen_height=844&screen_width=390&sourceType=33&traffic_type=0&tz_name=Asia%2FShanghai&uCode=&u_code=&user_info_type=1&verifyFp=verify_lugv2168_n397NtHt_g1S2_4PVV_8s11_kcbiPplXK2tU&web_id=7352857379065218577&webcast_language=zh-Hans');
        p.then((res)=>{
            return res.json().then((jsonData) => {
                // alert(JSON.stringify(jsonData));
                uni.postMessage({
                    data: {
                        type:'video',
                        origin: jsonData,
                    }
                })
                return res;
            });
        });
    }

    function invoke(){
        return `(${test.toString()})()`
    }

	export default {
        data(){
            return {
                videoInfo: {},
            }
        },
        onLoad() {
            setTimeout(()=>{
                this.initwv();
            },0)
            // uni.showLoading({
            //     title: '正在解析',
            //     mask: true,
            // })
        },
        methods: {
            initwv(){
                console.log('initwv------------------------------');
                var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
                const wv = currentWebview.children()[0];
                if(wv){
                    wv.setStyle({height:0})
                    wv.appendJsFile('/static/webview/uni.webview.1.5.2.js');
                    // wv.appendJsFile('/static/webview/test.js');
                    setTimeout(()=>{
                        const url = wv.getURL();
                        console.log(url);
                        wv.evalJS(invoke());
                    },2000)
                    
                }else{
                    setTimeout(()=>{
                        this.initwv();
                    },100)
                }
                
            },
            receiveMsg(e){
                console.log('Received message:', e.detail.data);
                const type = e.detail.data.type;
                if(type==='video'){
                    console.log(e.detail.data.origin);
                }
            },
            createDownload() {
                console.log('createDownload!!!!!!!!!!!!!');

                var dtask = plus.downloader.createDownload("https://v16-webapp-prime.tiktok.com/video/tos/maliva/tos-maliva-ve-0068c799-us/ogVBCT7AYNVDft4nXS4RMnfoEuEFRtEmAQUICJ/?a=1988&bti=NDU3ZjAwOg%3D%3D&ch=0&cr=3&dr=0&lr=unwatermarked&cd=0%7C0%7C0%7C&cv=1&br=1146&bt=573&cs=0&ds=6&ft=-Csk_mH1PD12NJ7LVT-UxutFSY6e3wv25zcAp&mime_type=video_mp4&qs=4&rc=ZzY7ZTdkODVkZzVmNmdnZUBpM3FkaXY5cjxncjMzaTczNEAxMjQtMjZjNTQxYGAzXy40YSMyL2FfMmRzaDFgLS1kMTJzcw%3D%3D&btag=e00088000&expire=1712230429&l=202404021133385A5CA52D4F147608D9EF&ply_type=2&policy=2&signature=d18970ca6ecc7049504fd7dced452ac4&tk=tt_chain_token", {}, function(d, status){
                    // 下载完成
                    if(status == 200){ 
                        console.log("Download success: " + d.filename);
                    } else {
                        console.log("Download failed: " + status); 
                    }  
                });
                //dtask.addEventListener("statechanged", onStateChanged, false);
                dtask.start(); 
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
            position: absolute;
            z-index: 999;
        }
	}
	

</style>
