import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController.js'
import ApiError from '~/utils/ApiError.js'

const creatNew = async(req, res, next) => {
  /*
  Quan trọng: Việc validate dữ liệu bắt buộc phải có ở phía backend vì đây là điểm cuối để lưu trữ dữ liệu vào database,
  nếu không có validation ở backend thì dù có validate ở frontend đi chăng nữa thì vẫn có thể bị tấn công bằng cách gửi trực tiếp
  request đến API mà không thông qua frontend, điều này có thể dẫn đến việc lưu trữ dữ liệu không hợp lệ hoặc thậm chí là dữ liệu độc hại vào
  */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (letai)',
      'string.base': 'Title must be a string (letai)',
      'string.empty': 'Title cannot be empty (letai)',
      'string.min': 'Title must be at least 3 characters long (letai)',
      'string.max': 'Title must be at most 50 characters long (letai)'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid('public', 'private').required()
  })
  
  try {

    // chỉ định abortEarly: false để Joi trả về tất cả lỗi validation thay vì dừng lại sau lỗi đầu tiên,
    //  giúp người dùng biết được tất cả các lỗi cần sửa trong một lần (video 52)
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_GATEWAY, error.message))
  }
}

const updateDetails = async(req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (letai)',
      'string.base': 'Title must be a string (letai)',
      'string.empty': 'Title cannot be empty (letai)',
      'string.min': 'Title must be at least 3 characters long (letai)',
      'string.max': 'Title must be at most 50 characters long (letai)'
    }),
    description: Joi.string().min(3).max(256).trim().strict(),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    )
  })
  try {
    // Chỉ định allowUnknown: true để cho phép các trường không xác định mà không gây lỗi server
    // (Vì đôi khi frontend gửi lên những trường chúng ta chưa kịp xử lý ở backend)
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const boardValidation = {
  creatNew,
  updateDetails
}