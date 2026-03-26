
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// khởi tạo đối tượng trelloDataBaseInstance để lưu trữ kết nối đến MongoDB
let trelloDataBaseInstance = null
// khoi tạo đối tượng MongoClientInstance để kết nối đến MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  //kết nối thành công đến MongoDB, gán đối tượng database vào biến trelloDataBaseInstance để sử dụng trong các module khác
  trelloDataBaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
//Funtion GET_DB (không async) này có nhiệm vụ export đối tượng database đã được kết nối đến MongoDB để sử dụng trong các module khác
//lưu ý chỉ gọi GET_DB sau khi đã gọi CONNECT_DB để đảm bảo rằng kết nối đến MongoDB đã được thiết lập thành công và biến trelloDataBaseInstance đã được gán giá trị database
export const GET_DB = () =>{
  if (!trelloDataBaseInstance) {
    throw new Error('Database instance is not initialized')
  }
  return trelloDataBaseInstance
}
//đóng kết nối với database khi cần thiết, ví dụ như khi dừng server hoặc khi không còn cần truy cập đến database nữa
export const CLOSE_DB = async () => {
  console.log('code chay vao CLOSE_DB')
  await mongoClientInstance.close()
}