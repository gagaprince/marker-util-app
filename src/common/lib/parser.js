
import { request } from './request';
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
    for(let i = 0; i < randomLength; i++) {
        randomStr += baseStr[Math.floor(Math.random() * length)];
    }
    return randomStr;
}

function getMsToken(){
    return generateRandomStr(107)
}

function sign(url,user_agent){
    console.log(url, user_agent);
    return new Promise((res, rej)=>{
        MarkerUtilNativeModule.sign({
            url, 
            user_agent,
        }, (ret)=>{
            if(ret&&ret.data){
                res(ret.data);
            }else{
                rej('未知错误');
            }
        });
    });
}

export const getttwid = async (force = false)=>{
    if (!ttwidCache || force){
        try {
            const ret = await request({
                url: 'https://ttwid.bytedance.com/ttwid/union/register/',
                method: 'POST',
                data: {"migrate_info":{"ticket":"","source":"node"},"region":"cn","union":true,"service":"www.ixigua.com","aid":1768,"cbUrlProtocol":"https","needFid":false},
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
        }catch(e){
            console.error(e);
        }
    }
    return ttwidCache;
}

export const getRealLink = async (link)=>{
    try{
        const ret = await request({
            url:link,
            responseType: 'text',
            followRedirects:0,
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
    }catch(e){
        console.error(e);
    }
    return '';
}

export const getAwemeId = async (originLink)=>{
    const relink = await getRealLink(originLink);
    if(relink){
        let match = relink.match(/video\/(\d+)\//) || [];
        const awemeId = match[1] || '';
        return awemeId;
    }
    return '';
} 



export const getVideoInfoByAwemeId = async (awemeId)=>{
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

    try{
        
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
    }catch (e){
        console.error(e);
    }
    

}