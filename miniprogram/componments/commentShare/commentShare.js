// componments/commentShare/commentShare.js

let userInfo = {}

const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 授权登录组件是否显示
    login: false,
    // 底部弹出层是否显示
    modelShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 判断用户时候收授权
    onComment() {
      wx.getSetting({
        success: (res) => {
          // console.log(res)
          // 用户已授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                // console.log(res)
                userInfo: res.userInfo
                // 显示评论框
                this.setData({
                  modelShow: true
                })
              }
            })
            // 用户未授权
          } else {
            this.setData({
              login: true
            })
          }
        }
      })
    },

    // 用户确认授权
    onAgree(e) {
      userInfo = e.detail
      // 授权框消失，显示评论框
      this.setData({
        login: false,
      }, () => {
        this.setData({
          modelShow: true
        })
      })
    },

    // 用户拒绝授权
    onDisagree() {
      wx.showModal({
        title: '未授权用户不可评论...',
        content: '',
      })
    },

    // 获取评论的输入
    onInput(e) {
      this.setData({
        content: e.detail.value
      })
    },

    // 提交评论
    onSend() {
      // 将评论插入到数据库
      let content = this.data.content
      // 判断评论是否为空
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不可为空...',
          content: '',
        })
        return
      }

      wx.showLoading({
        title: '正在评论',
        mask: true,
      })

      // 向数据库中插值
      db.collection('comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatar: userInfo.avatarUrl,
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modelShow: false,
          content: '',
        })
      })


      // 推送模板消息
    },
  }
})
