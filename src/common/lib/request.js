const MarkerUtilNativeModule = uni.requireNativePlugin('MarkerUtilUniPlugin-MarkerUtilNativeModule');

export const request = ({
    url, data = {}, method='GET', headers={}, responseType='json', debug=false, followRedirects=1
})=>{
    return new Promise((res,rej)=>{
        MarkerUtilNativeModule.sendRequest({
            url,
            data: JSON.stringify(data),
            method,
            headers,
            followRedirects,
        },(ret)=>{
            if(!ret.error){
                try{
                    if(debug){
                        console.log('------------------response data------------------')
                        console.log(ret.data);
                        console.log('------------------response header------------------')
                        console.log(ret.headers);
                    }
                    res({
                        data: responseType === 'json' ? JSON.parse(ret.data): ret.data,
                        headers: ret.headers,
                    })

                }catch(e){
                    if(debug){
                        console.error(e);
                    }
                    rej(e);
                }
            }else{
                if(debug){
                    console.error(ret.error);
                }
                rej(ret.error);
            }
        })
    })
}