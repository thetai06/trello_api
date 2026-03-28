import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULER_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),
    columnId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),
    title: Joi.string().trim().strict().min(3).max(255)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCards = async(req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().strict().required().trim().min(3).max(50)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY))
  }
}

export const cardValidation = {
  createNew,
  updateCards
}