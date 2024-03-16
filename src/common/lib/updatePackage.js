import { request } from './request';

/**
 * 返回是否 有新的资源包
 */
export const checkVersion = (platform) => {
  const appid = plus.runtime.appid;
  const channel = plus.runtime.channel;
  const appVersion = plus.runtime.version;
  const appVersionCode = plus.runtime.versionCode;
  return new Promise((resolve) => {
    plus.runtime.getProperty(appid, async (info) => {
      console.log('------------checkVersion-----------');
      console.log('appid:', appid);
      console.log('channel:', channel);
      console.log('appVersion:', appVersion);
      console.log('appVersionCode:', appVersionCode);
      console.log('platform', platform);
      console.log('info:', info);
      console.log('plus.device.uuid:', plus.device.uuid);
      console.log('------------checkVersion-----------');
      try {
        const ret = await request({
          url: `https://gagaprince.top/json/update.json?uuid=${plus.device.uuid}&t=${Date.now()}`
        });
        console.log('更新信息:', ret);
        const { currentVersion } = ret && ret.data || {};
        console.log('currentVersion', currentVersion);
        if(currentVersion){
          const fontVersion = info.versionCode || 1;
          console.log('fontVersion:', fontVersion);
          console.log('type fontVersion:', typeof fontVersion);
          if(+fontVersion < +currentVersion){
            // 需要更新
            console.log('需要更新:', ret.data);
            resolve(ret.data)
          }else{
            console.log('不需要更新');
          }
        }
      } catch (e) {
        console.error(e);
      }finally{
        resolve()
      }
    });
  });
};

export const installPatch = (resUrl) => {
  console.log('即将下载:', resUrl);
  uni.downloadFile({
    url: resUrl,
    timeout: 10000,
    success(ret) {
      console.log('下载资源包结果', ret);
      plus.runtime.install(ret.tempFilePath, {
        force: true,
      }, () => {
        console.log('安装成功');
          plus.runtime.restart();
      }, (e) => {
        console.log('安装失败', e);
        // plus.runtime.restart();
      });
    },
    fail(e) {
      console.log('下载失败', JSON.stringify(e));
    },
  });
};


export const checkForUpdate = async () => {
  const platform = uni.getSystemInfoSync().platform;
  try {
    const checkRet = await checkVersion(platform);
    console.log('检查更新结果:', checkRet);
    if(checkRet){
      const {
        resUrl,
      } = checkRet;
      installPatch(resUrl);
    }
  } catch (e) {
    console.err(e);
  }
};
