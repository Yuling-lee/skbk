// pages/search/search.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    showIcon: true,
    isShowAuth: false,
    yearList: [{
      "id": "1_1",
      "text": "2019"
    },{
      "id": "1_2",
      "text": "2018"
    }],
    addressList: [
      {
        "id": "2_1",
        "text": "市直"
      },
      {
        "id": "2_2",
        "text": "万盛"
      },
      {
        "id": "2_3",
        "text": "万州"
      },
      {
        "id": "2_4",
        "text": "黔江"
      },
      {
        "id": "2_5",
        "text": "涪陵"
      },
      {
        "id": "2_6",
        "text": "渝中"
      },
      {
        "id": "2_7",
        "text": "沙坪坝"
      },
      {
        "id": "2_8",
        "text": "北碚"
      },
      {
        "id": "2_9",
        "text": "渝北"
      },
      {
        "id": "2_10",
        "text": "长寿"
      },
      {
        "id": "2_11",
        "text": "江津"
      },
      {
        "id": "2_12",
        "text": "合川"
      },
      {
        "id": "2_13",
        "text": "永川"
      },
      {
        "id": "2_14",
        "text": "南川"
      },
      {
        "id": "2_15",
        "text": "綦江"
      },
      {
        "id": "2_16",
        "text": "璧山"
      },
      {
        "id": "2_17",
        "text": "铜梁"
      },
      {
        "id": "2_18",
        "text": "潼南"
      },
      {
        "id": "2_19",
        "text": "开州"
      },
      {
        "id": "2_20",
        "text": "梁平"
      },
      {
        "id": "2_21",
        "text": "武隆"
      },
      {
        "id": "2_22",
        "text": "城口"
      },
      {
        "id": "2_23",
        "text": "丰都"
      },
      {
        "id": "2_24",
        "text": "忠县"
      },
      {
        "id": "2_25",
        "text": "云阳"
      },
      {
        "id": "2_26",
        "text": "奉节"
      },
      {
        "id": "2_27",
        "text": "巫山"
      },
      {
        "id": "2_28",
        "text": "巫溪"
      },
      {
        "id": "2_29",
        "text": "石柱"
      },
      {
        "id": "2_30",
        "text": "秀山"
      },
      {
        "id": "2_31",
        "text": "酉阳"
      },
      {
        "id": "2_32",
        "text": "彭水"
      },
      {
        "id": "2_33",
        "text": "大渡口"
      },
      {
        "id": "2_34",
        "text": "江北"
      },
      {
        "id": "2_35",
        "text": "九龙坡"
      },
      {
        "id": "2_36",
        "text": "南岸"
      },
      {
        "id": "2_37",
        "text": "大足"
      },
      {
        "id": "2_38",
        "text": "荣昌"
      },
      {
        "id": "2_39",
        "text": "垫江"
      },
      {
        "id": "2_40",
        "text": "巴南"
      },
      {
        "id": "2_41",
        "text": "两江新区"
      }
    ],
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
    zzmmList: [
      {
        "id": "4_1",
        "text": "中共党员"
      },
      {
        "id": "4_2",
        "text": "群众"
      }],
      yearvalue:'',
      addressvalue: '',
      xuelivalue: '',
      zzmmvalue: '',
      majorvalue: '',
      changeindex:false,
      hdlx:'职位查询'
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  changez(e){
    this.setData({
      changeindex: !e.detail.isIndexs
    })
  },
  m_select_touch(e) {
    let that = this;
    let selectIndex = e.detail.selIndex;
    let stype = e.detail.stype;
    if (stype == "1") {
      let value1 = that.data.yearList[selectIndex];
      that.setData({
        yearvalue: value1.text
      })
    }
    else if (stype == "2") {
      let value2 = that.data.addressList[selectIndex];
      that.setData({
        addressvalue: value2.text
      })
    } 
    else if (stype == "3") {
      let value3 = that.data.xueliList[selectIndex];
      that.setData({
        xuelivalue: value3.text
      })
    } 
    else if (stype == "4") {
      let value4 = that.data.zzmmList[selectIndex];
      that.setData({
        zzmmvalue: value4.text
      })
    }
  },
  m_selectSearch_touch(e) {
    let that = this;
    let selectText = e.detail.selText;
    that.setData({
      majorvalue: selectText
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
    if (this.data.yearvalue==""){
      wx.showToast({
        title: '先选择年份',
        icon:'none'
      })
      return;
    }
    if (this.data.addressvalue == "") {
      wx.showToast({
        title: '先选择地市',
        icon: 'none'
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
    if (this.data.zzmmvalue == "") {
      wx.showToast({
        title: '先选择政治面貌',
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
      name: 'dosearch',
      data: {
        data_year: this.data.yearvalue,
        data_address: this.data.addressvalue,
        data_xueli: this.data.xuelivalue,
        data_zzmm: this.data.zzmmvalue,
        data_major: this.data.majorvalue
      }
    })
    if (clound_result.result.data==''){
      wx.setStorageSync('zw_list',[]);
      wx.hideLoading()
      wx.showToast({
        title: '无匹配职位，请重新填写条件后查询',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      wx.hideLoading()
      wx.setStorageSync('zw_list', clound_result.result);
      wx.navigateTo({
        url: '/pages/result/result'
      })
    }   
  },
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
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  go_target(){
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/myposition/myposition'
    })
  },
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () {
    app.fadeInOut(this, 'fadeAni', 0)
  },

	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {
    app.fadeInOut(this, 'fadeAni', 0)
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= 180) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  }
})
