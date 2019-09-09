// componments/model/bottom.js
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

  options: {
    // 添加多个插槽
    multipleSlots: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        modelShow: false
      })
    }
  }
})
