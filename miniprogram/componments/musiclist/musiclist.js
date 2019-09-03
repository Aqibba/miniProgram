// componments/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      // 事件源 事件处理函数 事件对象 事件类型
      const musicId = e.currentTarget.dataset.musicid
      const index = e.currentTarget.dataset.index
      // console.log(musicId)
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&index=${index}`,
      })
		}
  }
})
