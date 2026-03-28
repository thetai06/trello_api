import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'


const createNew = async (reqBody) => {
  try {

    const createCard = await cardModel.createNew(reqBody)

    const getCard = await cardModel.findOneById(createCard._id)

    if (getCard) {
      await columnModel.pushCardOrderIds(getCard)
    }

    return getCard
  } catch (error) {
    console.error
    throw error
  }
}

const updateCards = async(cardId, reqBody) => {
  try {
    const updateCard = await cardModel.updateCards(cardId, reqBody)
    return updateCard
  } catch (error) {
    console.error
    throw error
  }
}

const deleteCards = async (cardId) => {
  try {
    const deleteCard = await cardModel.deleteCards(cardId)
    return deleteCard
  } catch (error) {
    console.error
    throw error
  }
}

export const cardService = {
  createNew,
  deleteCards,
  updateCards
}