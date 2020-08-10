// components/ authorization/ authorization.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      default: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户手机号码
    setuserinfo() {
      wx.getUserInfo({
        success: res => {
          let userTemp = {}
          userTemp.userInfo = res.userInfo
          userTemp.isAuthorized = true
          wx.setStorageSync('userTemp', userTemp);
          this.setData({
            isAuthorized: true,
            isShow: false
          })
          this.triggerEvent('user_login_ac', {});
        },
        fail: function (res) {
          console.log(res)
          if (res.errMsg === "getUserInfo:fail scope unauthorized") {
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting["scope.userInfo"]) {
                  console.log("获取权限成功，再次点击图片保存到相册")
                } else {
                  console.log("获取权限失败")
                }
              }
            })
          }
        }
      })
    },
    close_auth() {
      this.setData({
        isShow: false
      })
    }
  },
  
})
