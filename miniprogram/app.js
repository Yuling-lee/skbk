//app.js
App({
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cqzgjy-yy1bgwy-135tv',
        traceUser: true
      }) 
    }
    var that = this;
    this.db = wx.cloud.database()
    this.checkUser()
    this.checkAuthSetting()
  },
  fadeInOut: function (that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
  },
  async checkUser() {
    wx.login({
      success: async (res) => {
        try {
          const result = await wx.cloud.callFunction({
            name: 'user-session',
            data: {
              code: res.code
            }
          })
          if (result.result.code == 0) {
            result.result.data.isLoaded = true;
            this.setUserInfo(result.result.data)
          } else if (result.result.code == 1) {
            let userInfo = {
              isLoaded: false
            }
            this.setUserInfo(userInfo)
          }
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  // 检查用户是否登录态还没过期
  checkSession(expireTime = 0) {
    if (Date.now() > expireTime) {
      return false
    }
    return true
  },
  // 设置用户数据
  setUserInfo(userInfo = {}, cb = () => { }) {
    if (Object.prototype.hasOwnProperty.call(userInfo, 'session_key')) {
      delete userInfo.session_key
    }
    wx.setStorageSync('userInfo', userInfo);
  },
  // 检测权限，在旧版小程序若未授权会自己弹起授权
  checkAuthSetting() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          let userTemp = {}
          wx.getUserInfo({
            success: async (res) => {
              if (res.userInfo) {
                userTemp.userInfo = res.userInfo
              }
              userTemp.isAuthorized = true
              wx.setStorageSync('userTemp', userTemp);
            }
          })
        } else {
          let userTemp = {}
          userTemp.userInfo = {}
          userTemp.isAuthorized = false
          wx.setStorageSync('userTemp', userTemp);
        }
      }
    })
  },
})
