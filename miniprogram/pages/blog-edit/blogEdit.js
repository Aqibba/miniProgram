// pages/blog-edit/blogEdit.js
// 最大限制字数
const MAX_WORDS = 140

// 最多上传图片张数
const MAX_IMAGE = 9

// 输入的内容
let content = ''

// 用户信息
let userInfo = {}

// 初始化数据库
const db = wx.cloud.database()

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
    userInfo = options
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
    // 获取用户输入的内容
    content = e.detail.value
    // console.log(content)
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

  // 将用户发布的文字内容，图片fileId，用户昵称，用户头像，上传时间存储在云数据库中
  send() {
    // 判断用户的如数内容是否为空
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '正在发布...',
      // 当现实showLoading时不允许用户有其他操作
      mask: true
    })

    // 保存每次上传的数据
    let arr = []
    // 上传的图片的fileID
    let fileIds = []
    // 循环遍历要上传的图片，上传全部（小程序商户餐云存储每次只能上传一个）
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((reslove, retect) => {
        // 上传文件的地址
        let item = this.data.images[i]
        // console.log(item)
        // 获取上传的图片文件的扩展名
        let j = /\.\w+$/.exec(item)[0]
        // console.log(j)
        // 图片上传到云存储
        wx.cloud.uploadFile({
          cloudPath: 'blog-Images/' + Date.now() + Math.random() * 1000 + j,
          filePath: item,
          success: (res) => {
            // console.log(res)
            // console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            reslove()
          },
          fail: (err) => {
            console.log(err)
            retect()
          }
        })
      })
      // console.log("定点测试===========================")
      arr.push(p)
      // console.log(arr.push(p))
      // console.log("定点测试===========================")
    }
    // 将数据存储到云数据库中
    Promise.all(arr).then((res) => {
      // 存储的集合和数据
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          // 获取服务端的时间
          createTime: db.serverDate(), 
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        // 返回页面并刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        console.log(pages)
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '发布失败...',
      })
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