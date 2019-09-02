// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '玩命加载中...',
    })
    // console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        id: options.id,
        $url: 'musiclist'
      }
    }).then((res) => {
      // console.log(res)
      // 简写后面的一大堆
      const list = res.result.playlist
      this.setData({
        musiclist: list.tracks,
        listInfo: {
          coverImgUrl: list.coverImgUrl,
          name: list.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    }).catch((err) => {
      console.log(err)
    })
  },

  // 将获取到的歌单信息存储到本地的storage中

  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
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

  }
})