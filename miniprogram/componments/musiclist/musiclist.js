// componments/musiclist/musiclist.js
const app = getApp()

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

  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      const musicId = e.currentTarget.dataset.musicid
      const index = e.currentTarget.dataset.index
      console.log("被选中的歌曲的id    " + musicId)
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&index=${index}`,
      })
		}
  }
})
