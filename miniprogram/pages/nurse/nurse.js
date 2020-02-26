const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patient: null,
    nickName: 'nikita',
    tempText: [0,1],
    liquidLevel: [],
  },
  onLoad: function (options) {
   let that = this;
    wx.cloud.callFunction({
      name: 'login',
      success(res){
        console.log(res)
        let patientData = res.result.data;
        console.log(patientData)
        //这有问题
        // for(let i = 0;i < patientData.length;i++){
        //   that.setData({
        //     tempText: patientData[i].tempText,
        //     liquidLevel: patientData[i].liquidLevel
        //   })
        // }
       
      },
      fail(err){
        console.error(err);
      }
    })
  },
  toOperate(){
    wx.switchTab({
      url: '../oparate/oparate',
    })
  }
})