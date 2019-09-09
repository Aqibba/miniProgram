// componments/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modelShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInfo(e) {
      // console.log(e)
      let info = e.detail.userInfo
      // 如果有userInfo的信息就证明用户已经授权
      if (info) {
        // 授权之后隐藏底部弹出层
        this.setData({
          modelShow: false
        })
        // 将用户的信息传递给父组件blog
        this.triggerEvent('agree', info)
        // 如果没有userInfo的信息就是未授权
      } else {
        this.triggerEvent('disagree')
      }
    }
  }
})
