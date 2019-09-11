// pages/blog-details/blog-details.js
import formatTime from '../../utils/formatTime.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.blogId)
    this.setData({
      blogId: options.blogId
    })
    this._getDetails()
  },


  // 获取详情
  _getDetails() {
    wx.showLoading({
      title: '玩命加载中...',
      mask: true
    })
    // console.log(blogId)
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      }

    }).then((res) => {
      console.log(res)
      let commentList = res.result.commentList.data
      for (let i = 0; i < commentList.length; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
      this.setData({
        commentList,
        blog: res.result.detail[0],
      })
      wx.hideLoading()
    }).catch(err => {
      console.error(err)
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
    let blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/blog-details/blog-details?blogId=${blog._id}`,
    }
  }
})