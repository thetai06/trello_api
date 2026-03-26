import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const creatNew = async(req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)
    // console.log('req.cookies:', req.cookies)
    // console.log('req.jwtDecoded:', req.jwtDecoded)

    const createdBoard = await boardService.creatNew(req.body)

    //Điều hướng dữ liệu sang tầng service để xử lý logic nghiệp vụ, sau đó trả về response cho client
    res.status(StatusCodes.CREATED).json(createdBoard)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Letai error test')
  } catch (error) { next(error) }
}

const getDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error)}
}

const getAll = async(req, res, next) => {
  try {
    const boards = await boardService.getAll()
    res.status(StatusCodes.OK).json(boards)
  } catch (error) { next(error) }
}

const updateDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.updateDetails(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const deleteDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    await boardService.deleteDetails(boardId)
    res.status(StatusCodes.OK).json({ deleteResult: 'Board delete successfully!' })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  creatNew,
  getDetails,
  getAll,
  updateDetails,
  deleteDetails
}
