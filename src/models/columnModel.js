import Joi from 'joi'
import { find, now } from 'lodash'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { cardController } from '~/controllers/cardController'
import { OBJECT_ID_RULE, OBJECT_ID_RULER_MESSAGE } from '~/utils/validators'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)

})

const INVALID_UPDATE_FILEDS = ['_id', 'createdAt']

const validateBeforeCreate = async(data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)

    const newColumnData = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId)
    }

    const createColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnData)

    return {
      ...newColumnData,
      _id: createColumn.insertedId
    }
  } catch (error) {
    console.error
    throw error
  }
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
    
  } catch (error) {
    console.error
    throw error
  }
}

const pushCardOrderIds = async(card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      {
        $push: { cardOrderIds: new ObjectId(card._id) },
        $set: { updatedAt: Date.now() }
      },
      { ReturnDocument: 'after' }
    )
    return result
  } catch (error) {
    console.error
    throw error
  }
}

const updateColumns = async (id, data) => {
  Object.keys(data).forEach(fileName => {
    if (INVALID_UPDATE_FILEDS.includes(fileName)) {
      delete data[fileName]
    }
  })
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: {
        ...data,
        createdAt: Date.now()
      } },
      { ReturnDocument: 'after' }
    )
    return {
      ...result,
      _id: result.insertedId
    }
  } catch (error) {
    console.error
    throw error
  }
}

const deleteColumns = async(columnId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(columnId) })
    return result
  } catch (error) {
    console.error
    throw error
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  updateColumns,
  deleteColumns
}