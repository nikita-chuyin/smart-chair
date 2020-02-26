//app.js
import mqtt from './utils/mqtt.js'
wx.cloud.init({
  env: 'smart-tmbs8'
});
const host = 'wxs://qxd5b1c.mqtt.iot.gz.baidubce.com/mqtt';
const options = {
  protocolVersion: 4, //MQTT连接协议版本
  clientId: randomString(10),
  clean: true,
  username: 'qxd5b1c/nodemcu',
  password: 'hxLlO6BtzTojAdno',
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  resubscribe: true
};

App({
  globalData: {
    client_ID: randomString(10),
    client: mqtt.connect(host, options),
    nickName: null,
    openId: '',
    id: '',
    tempText: 35,
    liquidLevel: 35
  }
})

//生成随机字符串
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}