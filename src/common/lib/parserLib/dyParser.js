
import { request } from '../request';
const MarkerUtilNativeModule = uni.requireNativePlugin('MarkerUtilUniPlugin-MarkerUtilNativeModule');


let ttwidCache = '';

function parseTtwidFromCookie(cookie) {
    let ttwid = cookie.match(/ttwid=([^;]+)/)[1];
    return ttwid;
}

function generateRandomStr(randomLength = 107) {
    let randomStr = '';
    let baseStr = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789=';
    let length = baseStr.length - 1;
    for (let i = 0; i < randomLength; i++) {
        randomStr += baseStr[Math.floor(Math.random() * length)];
    }
    return randomStr;
}

function getMsToken() {
    return generateRandomStr(107)
}

export const sign = (url, user_agent) => {
    console.log(url, user_agent);
    return new Promise((res, rej) => {
        MarkerUtilNativeModule.sign({
            url,
            user_agent,
        }, (ret) => {
            if (ret && ret.data) {
                res(ret.data);
            } else {
                rej('未知错误');
            }
        });
    });
}

export const getttwid = async (force = false) => {
    if (!ttwidCache || force) {
        try {
            const ret = await request({
                url: 'https://ttwid.bytedance.com/ttwid/union/register/',
                method: 'POST',
                data: { "migrate_info": { "ticket": "", "source": "node" }, "region": "cn", "union": true, "service": "www.ixigua.com", "aid": 1768, "cbUrlProtocol": "https", "needFid": false },
                headers: {
                    "Host": "ttwid.bytedance.com",
                    "accept": "application/json",
                    "content-type": "application/json",
                    "user-agent": "CoolVidCut/1.2.1 (iPhone; iOS 15.4.1; Scale/2.00)",
                    "accept-language": "zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8"
                }
            })
            const headers = ret.headers || {};
            const setCookie = headers['Set-Cookie'] || '';
            ttwidCache = parseTtwidFromCookie(setCookie);
        } catch (e) {
            console.error(e);
        }
    }
    return ttwidCache;
}

export const getRealLink = async (link) => {
    try {
        const ret = await request({
            url: link,
            responseType: 'text',
            followRedirects: 0,
            headers: {
                "Host": "v.douyin.com",
                "pragma": "no-cache",
                "accept": "*/*",
                "upgrade-insecure-requests": "1",
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache"
            },
        })
        const headers = ret.headers || {};
        const location = headers['Location'] || '';
        return location;
    } catch (e) {
        console.error(e);
    }
    return '';
}

export const getAwemeId = async (originLink) => {
    const relink = await getRealLink(originLink);
    if (relink) {
        let match = relink.match(/video\/(\d+)\//) || [];
        const awemeId = match[1] || '';
        return awemeId;
    }
    return '';
}



export const getVideoInfoByAwemeId = async (awemeId) => {
    const ttwid = await getttwid();
    const msToken = getMsToken();
    const headers = {
        "Host": "www.douyin.com",
        "Cookie": `msToken=${msToken};ttwid=${ttwid};`,
        "accept": "*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "accept-language": "zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8",
        "referer": "https://www.douyin.com/"
    };
    const url = `https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=${awemeId}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;

    console.log('url:', url);

    try {

        const bogusObj = await sign(url, headers['user-agent']);

        console.log('bogus:', bogusObj);

        const newUrl = `${url}&X-Bogus=${bogusObj['X-Bogus']}`;

        console.log('newUrl:', newUrl);

        const ret = await request({
            url: newUrl,
            headers,
        });

        console.log(ret);

        return ret && ret.data;
    } catch (e) {
        console.error(e);
    }


}

/**
 * 
 * @param {*} html 
 * {
 *  type: video|token
 *  data: videoInfo | tokenStr
 * }
 * 
 */
function parseRetHtml(html) {
    // 是否拿到了信息
    const str = html;
    const match = str.match(/<source src=\"(.*?)\"/);
    const srcValue = match ? match[1] : null;

    if (srcValue) {
        return {
            type: 'video',
            data: {
                videoUrl: srcValue.indexOf('http') === 0 ? srcValue : `https:${srcValue}`,
            }
        }
    } else {
        // 没有拿到信息返回新token 重新返回token
        const tokenMatch = str.match(/id=\"token\" value=\"(.*?)\"/);
        const tokenVal = tokenMatch ? tokenMatch[1] : '';
        if (tokenVal) {
            return {
                type: 'token',
                data: tokenVal,
            }
        }
    }

    return null;
}

let tokenCache = 'G7eRpMaa'; //tokenCache
// dlpanda 网站解析
export const getVideoInfoFromDLpanda = async (link, token = '') => {
    const spiderLink = `https://dlpanda.com/zh-CN?url=${encodeURIComponent(link)}&token=${token || tokenCache}`;
    try {
        const ret = await request({
            url: spiderLink,
            responseType: 'text',
            headers: {
                "Host": "dlpanda.com",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "accept-language": "zh-CN,zh;q=0.9"
            },
        })
        const html = ret.data;
        // console.log(html);
        const parseRet = parseRetHtml(html);
        if (parseRet) {
            if (parseRet.type === 'token' && parseRet.data !== token) {
                console.log('获取token重新请求:', parseRet.data);
                tokenCache = parseRet.data;
                return getVideoInfoFromDLpanda(link, parseRet.data);
            } else {
                if (parseRet.type === 'token') {
                    console.log('新token解析也失败，应该是链接有问题，停止解析');
                    return null;
                }
                console.log('解析出video信息:', parseRet.data);
                return parseRet.data;
            }
        }
        console.log('解析失败！');
        return null;
    } catch (e) {
        console.error(e);
    }
}

export const getQueryString = (name, url) => {
    let u = url || window.location.search;
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (u.substr(0, 1) === "?") {
        u = u.substr(1);
    }
    let r = u.match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return "";
}

export const getPercenVideos = async (secUserId, count, maxCursor = 0) => {
    const ttwid = await getttwid();
    const msToken = getMsToken();
    const headers = {
        "Host": "www.douyin.com",
        "Cookie": `msToken=${msToken};ttwid=${ttwid};`,
        "accept": "*/*",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "accept-language": "zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8",
        "referer": `https://www.douyin.com/user/${secUserId}`
    };
    // let url = `https://www.douyin.com/aweme/v1/web/aweme/post/?sec_user_id=${secUserId}&count=${count}&max_cursor=${maxCursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;
    let url = `https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id=${secUserId}&max_cursor=${maxCursor}&locate_query=false&show_live_replay_strategy=1&need_time_list=1&time_list_query=0&whale_cut_token=&cut_version=1&count=${count}&publish_video_strategy_type=2&pc_client_type=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1728&screen_height=1117&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Chrome&browser_version=121.0.0.0&browser_online=true&engine_name=Blink&engine_version=121.0.0.0&os_name=Mac+OS&os_version=10.15.7&cpu_core_num=12&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=100&webid=7316775486288938546&msToken=${msToken}`

    console.log('url:', url);

    try {

        const bogusObj = await sign(url, headers['user-agent']);

        console.log('bogus:', bogusObj);

        const newUrl = `${url}&X-Bogus=${bogusObj['X-Bogus']}`;

        console.log('newUrl:', newUrl);

        const ret = await request({
            url: newUrl,
            headers,
            responseType: 'text'
        });
        console.log('获取到结果--------')
        console.log(ret);
        // 太大的数据会打印不出来 所以不要打开
        return ret && ret.data;
    } catch (e) {
        console.error(e);
    }
}