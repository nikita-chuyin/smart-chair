const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    nickName: '未登录',
    avatarUrl: '../../images/account.png',
    tempText: app.globalData.tempText,
    liquidLevel: app.globalData.liquidLevel
  },
  login(){
    let that = this;
    wx.login({
      success: res => {
       wx.showModal({
         content: '是否为护士',
         cancelText:'否',
         confirmText: '是',
         success: res => {
           if(res.confirm){
             wx.navigateTo({
               url: '../nurse/nurse'
             })
           }else{
             wx.getUserInfo({
               success: res => {
                 console.log(res);
                 that.setData({
                   nickName: res.userInfo.nickName,
                   avatarUrl: res.userInfo.avatarUrl
                 });
                 app.globalData.nickName = res.userInfo.nickName;
                 db.collection('userData').add({
                   data: {
                     nickName: that.nickName,
                     tempText: app.globalData.tempText,
                     liquidLevel: app.globalData.liquidLevel
                   },
                   success(res){
                      app.globalData.id = res._id;                   
                   }
                 })
                 wx.showToast({
                   title: res.userInfo.nickName + ' 欢迎回来',
                   icon: 'loading'
                 });
               },
               fail: err => {
                 console.error()
               }
             })
           }
         }
       })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getMsg(){
    db.collection('userData')
    .doc(app.globalData.id)
    .get()
    .then(console.log) 
    .catch(console.error)
  }
})