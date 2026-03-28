/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { cardModel } from '~/models/cardModel'

const creatNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
      columnOrderIds: []
    }
    const createdBoard = await boardModel.creatNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard._id)

    //trả kết quả về cho controller để trả về response cho client
    //trong service luôn phải có return, nếu không sẽ bị lỗi undefined khi controller nhận kết quả từ service
    return getNewBoard
  } catch (error) { throw error }

}

const getDetails = async(boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    //B1: deep clone board ra một cái mới để xử lý, không ảnh hưởng tới board ban đầu, tuỳ mục đích về sau mà
    //có cần clone deep hay không.
    const resBoard = cloneDeep(board)
    //B2: Đưa Card về đúng column của nó
    resBoard.columns.forEach(column => {
      //Cách đơn giản là convert ObjectID về String bằng hàm toString() của javaScript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      if (!column.cardOrderIds) column.cardOrderIds = []
      //Cách khác là dùng equals() được mongoDB support method
      // console.log('error  undefined', column._id)
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })
    //B3: xoa mang cards khoi board ban dau
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

const getAll = async() => {
  try {
    const board = await boardModel.getAll()
    return board
  } catch (error) {
    throw error
  }
}

const updateDetails = async(boardId, reqBody) => {
  try {
    const updatedBoard = await boardModel.updateDetails(boardId, reqBody)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const deleteDetails = async (boardId) => {
  try {
    const deleteBoard = await boardModel.deleteDetails(boardId)
    return deleteBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  creatNew,
  getDetails,
  getAll,
  updateDetails,
  deleteDetails
}