var zylist = require("./util/util.js")
Component({
  properties: {
    selectText: {
      type: String,
      value: "请选择"
    },
    selectShow: {
      type: Boolean,
      value: false
    },
    icnoname: {
      type: String,
      value: ""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    animationDatax: '',
    selectShow: true,
    textColor: "#999999",
    edDetail: true,
    isActive: false
  },
  lifetimes: {
    ready() {
       this.setData({
         showList: zylist.zhuanye
       })
    }
  },
  methods: {
    //控制下拉显示
    selectToggle: function () {
      if (this.data.selectShow) {
        this.setData({
          selectShow: !this.data.selectShow
        })
        this.hideDetail()
      } else {
        this.setData({
          selectShow: !this.data.selectShow
        })
        this.showDetail()
      }
    },
    showDetail() {
      this.setData({
        edDetail: false
      })
      this.triggerEvent('changez', { isIndexs: false});
    },
    hideDetail() {
      this.setData({
        selectShow: !this.data.selectShow
      })
      setTimeout(function () {
        this.setData({
          edDetail: true
        })
        this.triggerEvent('changez', { isIndexs: true});
      }.bind(this), 100)
    },
    //选择事件
    setText: function (e) {
      var nowData = this.data.showList;
      var nowIdx = e.target.dataset.index;
      var nowText = nowData[nowIdx].name;
      this.setData({
        textColor: "#d32423",
        selectShow: true,
        selectText: nowText
      })
      if (this.selectText != '') {
        this.setData({
          isActive: true
        })
      } else {
        this.setData({
          isActive: false
        })
      }
      this.triggerEvent('m_selectSearch_touch', { selText: nowText });
      this.hideDetail()
    },
    searchList:function (event) {
      let inputValue = (event.detail.value).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
      let matcher = new RegExp(inputValue, "i");
      let nowarr = zylist.zhuanye
      const resultArr = nowarr.filter(val => {
        return matcher.test(val.name);
      })
      if (inputValue!=''){
        resultArr.unshift({
          "id": 0,
          "name": inputValue
        })
      }
      this.setData({
        showList: resultArr
      })
    }
  }
})