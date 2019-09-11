// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const tcbRouter = require('tcb-router')

const db = cloud.database()

const blog = db.collection('blog')

const MAX_LIMIT = 20

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

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    // 详情查询
    let detail = await blog.where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    // 评论查询
    const countResult = await blog.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

    }

    ctx.body = {
      commentList,
      detail,
    }

  })



  return app.serve()
}