
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUserInfo();
              //用户已经授权过
              wx.switchTab({
                url: '../firstPage/firstPage',
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      app.globalData.userInfo = e.detail.userInfo;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: app.globalData.urlPath + '/app/user/addOrUpdateUser',
        data: {
          openId: app.globalData.openid,
          nickName: e.detail.userInfo.nickName,
          headImage: e.detail.userInfo.headImage
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('插入小程序用户信息成功！');
          console.log(e.detail.userInfo.nickName);
        }
      });
      //授权成功后，跳转进入小程序首页
      wx.navigateTo({
        url: '../firstPage/firstPage'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权,将无法进入小程序,请授权之后再进入！',
        showCancel: false,
        confirmText: "返回授权",
        success: function (res) {
          if (res.confirm) {
            console.log("用户点击了'返回授权'")
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUserInfo: function () {
    wx.request({
      url: app.globalData.urlPath + '/app/user/queryUserInfo',
      data: {
        openId: app.globalData.urlPath + '/app/getOpenId',
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(1);
      }
    })
  },
  onShareAppMessage:function(){
    var shares=[
      '../../images/sharePic01.jpg',
      '../../images/sharePic02.jpg'
    ];
    var messages=[
      '发现一个很适合你的求职平台！',
      '发现一个很适合你的工作！'
    ];
    var imgNumber = Math.floor(Math.random() * shares.length)
    var randomImg = shares[imgNumber];
    var randomTitle=messages[imgNumber];
    return{
      title: randomTitle,
      path:'pages/index/index',
      imageUrl: randomImg
    }
  }
})