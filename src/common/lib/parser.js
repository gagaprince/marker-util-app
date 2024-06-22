import { getAwemeId, getVideoInfoByAwemeId } from './parserLib/dyParser';
import { getRealLink, getCookieObj, getVideoIdFromRealLink, getVideoInfoByVideoIdAndCookie, getVideoInfoFromDLpanda } from './parserLib/ttParser';


// 获取短视频内容
async function getVideoInfoByDYLink(originLink) {
    // const awemeId = await getAwemeId(originLink);
    // console.log('awemeId:', awemeId);
    // const videoInfo = await getVideoInfoByAwemeId(awemeId);
    // uni.hideLoading();
    // const videoUrl = videoInfo.aweme_detail?.video?.play_addr?.url_list[0]||'';
    // const cover = videoInfo.aweme_detail?.video?.cover?.url_list[0] || '';
    // const user = videoInfo.aweme_detail?.author?.nickname || ''
    // const desc = videoInfo.aweme_detail?.desc || ''
    // const videoInfoMy = {
    //     videoUrl, cover, user, desc
    // }
    // return videoInfoMy;
    const ret = await getVideoInfoFromDLpanda(originLink);
    console.log(ret);
    return ret;
}
async function getVideoInfoByTTLink(originLink) {

    const ret = await getVideoInfoFromDLpanda(originLink);
    console.log(ret);
    return ret;

    // console.log(originLink);
    // const realLink = await getRealLink(originLink);
    // console.log('realLink:', realLink);
    // const cookieObj = await getCookieObj(realLink);
    // console.log(cookieObj);
    // const videoId = getVideoIdFromRealLink(realLink);
    // console.log('videoId:', videoId);

    // const videoInfo = await getVideoInfoByVideoIdAndCookie(videoId, cookieObj);
}
// 获取短视频内容




// 检测是什么平台
// https://v.douyin.com/iFCvgktY/ 
// https://www.tiktok.com/t/ZPRTuroNq/
function checkPL(link = '') {
    if (link.indexOf('douyin') !== -1) {
        return 'dy';
    } else if (link.indexOf('tiktok') !== -1) {
        return 'tt';
    }

    return 'none';
}

/**
 * 
 * @param {*} link 
 * videoInfo {
 *  videoUrl, cover, user, desc
 * }
 */
export const getVideoInfoByLink = async (link) => {
    let videoInfo;
    switch (checkPL(link)) {
        case 'dy':
            videoInfo = await getVideoInfoByDYLink(link);
            break;
        case 'tt':
            videoInfo = await getVideoInfoByTTLink(link);
            break;
        default:
            break;
    }
    return videoInfo;
}

export const getSteamInfoByLink = (link) => {

}