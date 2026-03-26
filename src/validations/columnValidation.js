import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULER_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().trim().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULER_MESSAGE),
    title: Joi.string().required().strict().trim().min(3).max(255)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateColumns = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().strict().required().trim().min(3).max(255)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const columnValidation = {
  createNew,
  updateColumns
}