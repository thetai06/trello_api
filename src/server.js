
import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment'
import { API_v1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors.js'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))
  
  // Enabla req.body json data
  app.use(express.json())

  // use API v1
  app.use('/v1', API_v1)

  // Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
  // Lưu ý: Middleware xử lý lỗi tập trung phải được đặt ở cuối cùng sau tất cả các route và middleware khác để đảm bảo rằng
  // nó có thể bắt được tất cả các lỗi phát sinh trong quá trình xử lý request
  app.use(errorHandlingMiddleware)

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hi ${env.AUTHOR}, Back-end server is running successfully at host: ${env.APP_HOST} and port: ${env.APP_PORT}/`)
  })
  //thực hiện các tác vụ clean up trước khi dừng server, ví dụ như đóng kết nối đến MongoDB
  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas successfully! Server is shutting down...')
  })
}
//cach 1: sử dụng Promise chaining để kết nối đến MongoDB và sau đó khởi động server
// console.log('1. connecting to MONGODB clound Atlas...')

// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0) // Exit the process with an error code
//   })

//cach 2: sử dụng async/await để kết nối đến MongoDB và sau đó khởi động server
(async ()=> {
  try {
    console.log('1. connecting to MONGODB clound Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
