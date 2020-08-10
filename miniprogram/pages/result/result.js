const app = getApp()
let fav_json={}
Page({
  data: {
    showIcon: true,
    bgcolor:'',
    result:[],
    showId:-1,
    isShowAuth: false,
    showTip:false,
    isFirst:true,
    hdlx:'分数查询',
    navArr:[],
    lastIndex:0,
    navInex:0,
    detailText:{},
    detailShow:false,
    detailIndex:0
  },
  onLoad:function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    if(!this.data.userInfo.isLoaded){
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      });
      return;
    }
    this.init_result()
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
  },
  init_result(){
    const db = wx.cloud.database()
    db.collection('zw_avor').where({
      phoneNumber: this.data.userInfo.phoneNumber
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length == 0) {
          let now_list = wx.getStorageSync('zw_list')
          this.setData({
            result: now_list,
            isFirst:true
          })
          fav_json = {
            zw_list:[]
          }
        } else {
          if (res.data[0].zw_list.length > 0) {
            fav_json = res.data[0]
            let now_list = wx.getStorageSync('zw_list')
            let fav_list = fav_json.zw_list
            for (var i = 0; i < now_list.length; i++) {
              let isSwitch=true;
              for (var k = 0; k < fav_list.length; k++) {
                if (now_list[i]._id == fav_list[k]._id) {
                  now_list[i].isFav = true
                  isSwitch=false
                  break;
                }
              }
              if (isSwitch){
                now_list[i].isFav = false
              }
            }
            this.setData({
              result: now_list,
              isFirst: false
            })
          } else {
            fav_json = res.data[0]
            fav_json.zw_list=[]
            let now_list = wx.getStorageSync('zw_list')
            this.setData({
              result: now_list,
              isFirst: false
            })
          }
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
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
  showDetail(event){
    this.setData({
      detailShow:true,
      detailIndex:event.currentTarget.dataset.index,
      detailText:this.data.result[event.currentTarget.dataset.index]
    })
  },
  hideDetail(){
    this.setData({
      detailShow:false
    })
  },
  go_search(){
    wx.navigateTo({
      url: '/pages/zwseach/zwseach'
    })
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor:"#d32423"})
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "" })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  addAavorites: function (event) {
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    const now_json = this.data.result[this.data.detailIndex]
    const db       = wx.cloud.database()
    wx.showLoading({
      mask: true,
      title: '添加中.....'
    });
    var that=this;
     if (fav_json.zw_list.length>=20){
       wx.showToast({
         icon: 'none',
         title: '最多可添加20条收藏，快去看看吧'
       })
       that.setData({
         showTip: true
       })
       return;
     }
     if (!this.data.isFirst) {
          const updatearr = fav_json
          if (updatearr.zw_list) {
            for (var i = 0; i < updatearr.zw_list.length; i++) {
              if (updatearr.zw_list[i]._id == now_json._id) {
                wx.showToast({
                  icon: 'none',
                  title: '已收藏'
                })
                return
              }
            }
            updatearr.zw_list.unshift(now_json)
          } else {
            updatearr.zw_list = []
            updatearr.zw_list.push(now_json)
          }
          db.collection('zw_avor').doc(updatearr._id).update({
            data: {
              zw_list: updatearr.zw_list
            },
            success: res => {
              let now_list = this.data.result
              let fav_list = fav_json.zw_list
              for (var i = 0; i < now_list.length; i++) {
                let isSwitch = true;
                for (var k = 0; k < fav_list.length; k++) {
                  if (now_list[i]._id == fav_list[k]._id) {
                    now_list[i].isFav = true
                    isSwitch = false
                    break;
                  }
                }
                if (isSwitch) {
                  now_list[i].isFav = false
                }
              }
              const s='detailText.isFav'
              this.setData({
                result: now_list,
                showTip: true,
                [s]:true
              })
              wx.showToast({
                title: '已收藏'
              })
            },
            fail: err => {
              icon: 'none',
                console.error('[数据库] [更新记录] 失败：', err)
            }
          })
          wx.hideLoading();
        } else {
          const updatearr = {}
          updatearr.zw_list = []
          updatearr.zw_list.push(now_json)
          updatearr.phoneNumber = this.data.userInfo.phoneNumber
          db.collection('zw_avor').add({
            data: {
              zw_list: updatearr.zw_list,
              phoneNumber: updatearr.phoneNumber
            },
            success: res => {
              this.init_result()
              this.setData({
                showTip: true
              })
              wx.showToast({
                title: '已收藏'
              })
              wx.hideLoading();
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '添加书架失败，退出重新添加吧!'
              })
              wx.hideLoading();
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if(this.data.result.length<=0){
      wx.navigateTo({
        url: '/pages/zwseach/zwseach',
      })
    }
  },
  close_tip(){
    this.setData({
      showTip:false
    })
  },
  go_target(){
    this.setData({
      showTip:false
    })
    wx.navigateTo({
      url: '/pages/myposition/myposition',
    })
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