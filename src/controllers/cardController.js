import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async(req, res, next) => {
  try {
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createCard)
    
  } catch (error) {
    next(error)
  }
}

const updateCards = async(req, res, next) => {
  try {
    const cardId = req.params.id
    const updateCard = await cardService.updateCards(cardId, req.body)
    res.status(StatusCodes.OK).json(updateCard)
  } catch (error) {
    next(error)
  }
}

const deleteCards = async(req, res, next) => {
  try {
    const cardId = req.params.id
    await cardService.deleteCards(cardId)
    // console.log(cardId)
    res.status(StatusCodes.OK).json({ deleteResult: 'delete card!' })
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  deleteCards,
  updateCards
}