// components/ authorization/ authorization.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      default: false
    },
    source:{
      type: String,
      default: 'default'
    },
    hdlx:{
      type: String,
      default: '首页'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready: function (){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async bindGetPhoneNumber(e) {
      wx.showLoading({
        title: '正在获取',
      })
      if (e.detail.errMsg == 'getPhoneNumber:ok') {      
          try {
            const result = await wx.cloud.callFunction({
              name: 'login',
              data: {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                sourse: this.data.source,
                hdlx:this.data.hdlx
              }
            })
            if (result.result.code == 0) {
              this.setData({
                isShow: false
              })
              result.result.data.isLoaded = true
              this.setUserInfo(result.result.data)
            }
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '登录成功',
                  icon: 'none'
                })
              }
            })
          } catch (err) {
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '获取手机号码失败，请重试',
                  icon: 'none'
                })
              }
            })
          }
      } else {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '获取手机号码失败，请重试',
              icon: 'none'
            })
          }
        })
      }
    },
    // 设置用户数据
    setUserInfo(userInfo = {}, cb = () => { }) {
      wx.setStorageSync('userInfo', userInfo);
      this.triggerEvent('user_login', {});
    },
    close_auth(){
      this.setData({
        isShow: false
      })
    }
  }
})
