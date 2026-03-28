import Joi from 'joi'
import { slugify } from '~/utils/formatters'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULER_MESSAGE } from '~/utils/validators'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

// Define collection (Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_TYPE = {
  PRIVATE : 'private',
  PUBLIC : 'public'
}
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).default(BOARD_TYPE.PUBLIC),
  //lưu ý các item trong mảng columnOderIds là Object nên cần thêm pattern để validate đúng định dạng ObjectId
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
// các trường không cho phép cập nhật thủ công nhằm bảo vệ dữ liệu
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const creatNew = async (data) => {
  try {
    const dataWithSlug = {
      ...data,
      slug: slugify(data.title)
    }
    const valiData = await validateBeforeCreate(dataWithSlug)
    console.log('valiData:', valiData)

    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(valiData)

    return {
      ...valiData,
      _id: createdBoard.insertedId
    }
  } catch (error) {throw new Error(error)}
}

const findOneById = async (id) => {
  console.log(id)
  console.log(new ObjectId(id))
  console.log(typeof id)
  const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  return result
}

const getDetails = async(id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {$match: {
        _id: new ObjectId(id),
        _destroy: false
      }},
      {$lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      }},
      {$lookup:{
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async() => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find({_destroy: false}).toArray()
    return result
  } catch (error) { throw new Error(error) }
}

const updateDetails = async (id, data) => {
  try {
    //Lọc các trường không cho phép cập nhật thủ công
    Object.keys(data).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete data[fieldName]
      }
    })
    //nếu có title mới thì phải tính toán lại slug mới
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true })
    }

    // const valiData = await validateBeforeCreate(data)
    // không cần gọi validateBeforeCreate ở đây nuwacs vì dữ liệu đã được validate ở tầng Validation của route rồi
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDetails = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pushColumnOrderIds = async(column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      {
        $push: { columnOrderIds: new ObjectId(column._id) },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    console.error
    throw error
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  creatNew,
  findOneById,
  getDetails,
  getAll,
  updateDetails,
  deleteDetails,
  pushColumnOrderIds
}