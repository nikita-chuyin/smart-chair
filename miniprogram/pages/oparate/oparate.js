const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    array: ['A', 'B', 'C'],
    index: 0,
    topic: {
      temTopic: 'xiafa'
    }
  },
  onLoad(){
    let that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', that.ConnectCallback);
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);
  },
  ConnectCallback(connack) {
    var that = this;
    for (var v in that.data.topic) {
      that.data.client.subscribe(that.data.topic[v], {
        qos: 1
      });
    }
    console.log("connect");
  },

  MessageProcess: function (topic, payload) {
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
        success: function (res) {
          console.log(res);
        }
      })
    }
    console.log('message', topic, payload.toString());
  },
  ConnectError: function (error) {
    console.log(error)
  },

  ClientReconnect: function () {
    console.log("Client Reconnect")
  },

  ClientOffline: function () {
    console.log("Client Offline")
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
  },
  turnLeft() {
    let publish = this.data.array[this.data.index] + ':left';
    this.data.client.publish(this.data.topic.temTopic, publish, {
      qos: 1
    })
  },
  turnRight() {
    let publish = this.data.array[this.data.index] + ':right';
    this.data.client.publish(this.data.topic.temTopic, publish, {
      qos: 1
    })
  },
  off() {
    let publish = this.data.array[this.data.index] + ':off';
    this.data.client.publish(this.data.topic.temTopic, publish, {
      qos: 1
    })
  }
})