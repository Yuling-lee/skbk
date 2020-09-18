// pages/zyseach/zyseach.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isShowAuth: false,
    bgcolor:'',
    xueliList: [{
      "id": "3_1",
      "text": "研究生"
    }, {
      "id": "3_2",
      "text": "本科"
    }, {
      "id": "3_3",
      "text": "专科"
    }],
    xuelivalue: '',
    majorvalue: '',
    inputactive:false,
    result:[],
    noresult:true,
    hdlx:'专业查询'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
  },
  zysearchInput(e){
    if(e.detail.value!=''){
      this.setData({
        majorvalue:e.detail.value,
        inputactive:true
      })
    }else{
      this.setData({
        majorvalue:e.detail.value,
        inputactive:false
      })
    }
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              icon:"none",
              title: '所属专业大类已复制'
            })
          }
        })
      }
    })
  },
  async seach_result(){
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    if (this.data.xuelivalue == "") {
      wx.showToast({
        title: '先选择学历',
        icon: 'none'
      })
      return;
    }
    if (this.data.majorvalue == "") {
      wx.showToast({
        title: '先请填写专业',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({ title: '查询中' })
    const clound_result = await wx.cloud.callFunction({
      name: 'zysearch',
      data: {
        data_xueli: this.data.xuelivalue,
        data_major: this.data.majorvalue
      }
    })
    if(clound_result.result.data.length>0){
       wx.hideLoading()
       this.setData({
        result:clound_result.result.data
      })
    }else{
       wx.hideLoading()
       this.setData({
        noresult:false
      })
    }
  },
  m_select_touch(e) {
    let that = this;
    let selectIndex = e.detail.selIndex;
    let stype = e.detail.stype;
    if (stype == "3") {
      let value3 = that.data.xueliList[selectIndex];
      that.setData({
        xuelivalue: value3.text
      })
    } 
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#d32423" })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "" })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  go_zwk: function (event) {
    const url = event.currentTarget.dataset.url
    if (this.data.userInfo.isLoaded) {
      wx.navigateToMiniProgram({
        appId: 'wx63ad0fa9a5b1e3fb',
        path: url,
        envVersion: 'release'
      })
    } else {
      planUrl = event.currentTarget.dataset.url
      planUrltype = 2
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "你的专业能报考哪些重庆公务员考试岗位呢，一键查询！",
      path: "/pages/index/index?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})