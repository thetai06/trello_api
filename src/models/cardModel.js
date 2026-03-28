import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULER_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FILEDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {abortEarly: false})
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)

    const newCardData = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId),
      columnId: new ObjectId(valiData.columnId)
    }

    const createCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardData)

    return {
      ...newCardData,
      _id: createCard.insertedId
    }
  } catch (error) {
    console.error
    throw error
  }
}

const findOneById = async (id) => {
  const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne(id)
  return result
}

const updateCards = async(id, data) => {
  Object.keys(data).forEach(fileName => {
    if (INVALID_UPDATE_FILEDS.includes(fileName)) {
      delete data[fileName]
    }
  }
  )
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: {
        ...data,
        createdAt: Date.now()
      }},
      { ReturnDocument: ReturnDocument.AFTER }
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

const deleteCards = async (id) => {
  const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  return result
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteCards,
  updateCards
}