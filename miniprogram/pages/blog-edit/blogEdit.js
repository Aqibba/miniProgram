// pages/blog-edit/blogEdit.js
// 最大限制字数
const MAX_WORDS = 140

// 最多上传图片张数
const MAX_IMAGE = 9


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    words: 0,
    bottom: 0,
    images: [],
    selectPhoto: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
  },

  // 输入框输入
  onInput(e) {
    // console.log(e)
    let words = e.detail.value.length
    if (words >= MAX_WORDS) {
      words = `最大字数为${MAX_WORDS}`
    }
    this.setData({
      words
    })
  },

  // 获取焦点
  onFocus(e) {
    // console.log("键盘的高度是  " + e.detail.height)
    this.setData({
      bottom: e.detail.height
    })
  },

  // 失去焦点
  onBlur() {
    this.setData({
      bottom: 0
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      // 还可以在选择的图片张数
      count: MAX_IMAGE - this.data.images.length,
      
      // 当前图片的类型（原图，压缩图）
      sizeType: ['original', 'compressed'],
      
      // 选择上传的方式（图库，照相机）
      sourceType: ['album', 'camera'],

      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })

        // 还可以选择几张，够九张之后让添加图片的按钮隐藏
        let max = MAX_IMAGE - this.data.images.length
        this.setData({
          selectPhoto: max <=0 ? false : true
        })
      },
    })
  },

  // 删除当前图片
  onDelete(e) {
    this.data.images.splice(e.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    
    // 如果当前图片数量小于选取的最大张数就显示现价图片按钮
    if (this.data.images.length < MAX_IMAGE) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  // 点击预览
  onPreview(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.imgsrc
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

  }
})