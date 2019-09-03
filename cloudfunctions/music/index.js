// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入 tcb-router
const tcbRouter = require('tcb-router')
// 引入 request-promise
const rp = require('request-promise')
// 请求地址
const BASE_URL = 'http://musicapi.xiecheng.live'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 
  const app = new tcbRouter({event})
  // 设置 playlist 中间件路由
  app.router('playlist', async(ctx, next) => {
    // 获取当前数据库并找到playlist集合
    ctx.body = await cloud.database().collection('playlist')
      // 分页查询
      .skip(event.start)
      .limit(event.count)
      // 按照逆序排序，日期最新的排在最上面
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      }).catch(err => {
        console.log(err)
      })
  })
	// 设置 musiclist 中间件路由
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.id))
    .then((res) => {
      return JSON.parse(res)
    })
  })
  // 设置歌曲播放的中间件路由
	app.router('musicUrl', async(ctx, next) => {
		ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`)
		.then((res) => {
			return res
		}).catch(err => {
			console.log(err)
		})
	})
	
  return app.serve()
}