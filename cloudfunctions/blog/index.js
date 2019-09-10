// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const tcbRouter = require('tcb-router')

const db = cloud.database()

const blog = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    let blogList = await blog.skip(event.start).limit(event.count)
    .orderBy('createTime', 'desc').get()
    .then((res) => {
      return res.data
    }).catch(err => {
      console.log(err)
    })
    ctx.body = blogList
  })

  return app.serve()
}