import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createColumn = await columnModel.createNew(newColumn)

    const getColumn = await columnModel.findOneById(createColumn._id)

    if (getColumn) {
      getColumn.cards = []
      await boardModel.pushColumnOrderIds(getColumn)
    }

    return getColumn
  } catch (error) {
    console.error
    throw error
  }
}

const updateColumns = async(id, reqBody) => {
  try {
    const updateColumn = await columnModel.updateColumns(id, reqBody)
    return updateColumn
  } catch (error) {
    console.error
    throw error
  }
}

const deleteColumns = async (columnId) => {
  try {
    const deleteColumn = await columnModel.deleteColumns(columnId)
    return deleteColumn
  } catch (error) {
    console.error
    throw error
  }
}

export const columnService = {
  createNew,
  updateColumns,
  deleteColumns
}