import { StatusCodes } from 'http-status-codes'
import { update } from 'lodash'
import { columnService } from '~/services/columnService'

const createNew = async(req, res, next) =>{
  try {
    const createColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) {
    next(error)
  }
}

const updateColumns = async (req, res, next) => {
  try {
    const columnId = req.params.id
    await columnService.updateColumns(columnId, req.body)
    res.status(StatusCodes.OK).json({ message: 'column update new!' })
  } catch (error) {
    next(error)
  }
}

const deleteColumns = async( req, res, next ) => {
  try {
    const columnId = req.params.id
    await columnService.deleteColumns(columnId)
    res.status(StatusCodes.OK).json({ deleteResult: 'Column delete successfully' })
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  updateColumns,
  deleteColumns
}