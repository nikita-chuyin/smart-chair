//index.js
const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    tempText: 35,
    liquidLevel: 35,
    topic: {
      temTopic: 'xiafa'
    }
  }, 

  onLoad: function() {
    let that = this;
    let nickName = app.globalData.nickName;
    if (nickName == null) {
      wx.showModal({
        title: '温馨提示',
        content: '还未登录，请先登录',
        success: function () {
          wx.switchTab({
            url: '../logs/logs',
          })
        }
    })
    }
    that.data.client = app.globalData.client;
    that.data.client.on('connect', that.ConnectCallback);
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);
    for (let i = 0; i < 100; i++) {
      //定时发送1获取温度值
      setTimeout(function() {
        that.data.client.publish('xiafa', "1", {
          qos: 1
        });

        //通过openid找到记录并定时更新数据
        db.collection('userData').doc(app.globalData.id).set({
          data:{
            temperature: tempText,
            liquidLevel: liquidLevel
          }
        }).then(res => {
          console.log(res);
        }).catch(err => {
          console.error(err);
        })
      }, 1000000);
    }
  },
  //连接成功的回调函数
  ConnectCallback(connack) {
    var that = this;
    for (var v in that.data.topic) {
      that.data.client.subscribe(that.data.topic[v], {
        qos: 1
      });
    }
    console.log("connect");
  },

  MessageProcess: function(topic, payload) {
    var that = this;
    console.log(payload.toString());
    var payload_string = payload.toString();
    let flag = payload_string.indexOf('level');
    if (topic == that.data.topic.temTopic && flag) {
      that.setData({
        'liquidLevel': payload_string
      })
    } else {
      that.setData({
        'tempText': payload_string
      })
      //将数据传到数据库中
      db.collection('userData').add({
        data: {
          nickName: app.globalData.nickName,
          temperature: tempText,
          liquidLevel: liquidLevel
        },
        success: function(res) {
          console.log(res);
        }
      })
    }
    console.log('message', topic, payload.toString());
  },
  ConnectError: function(error) {
    console.log(error)
  },

  ClientReconnect: function() {
    console.log("Client Reconnect")
  },

  ClientOffline: function() {
    console.log("Client Offline")
  },

  //温度改变
  bindchange(e) {
    console.log(e.detail.value);
    this.setData({
      temperature: e.detail.value
    });
    //主题xiafa，消息：temperature:37，qos为1表示使用 Best-Effort服务模型
    // this.data.client.publish(this.data.topic.temTopic,"1",{
    //   qos:1
    // })
  }
})