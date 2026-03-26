import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.route('/')
  .post( cardValidation.createNew, cardController.createNew )

Router.route('/:id')
  .put( cardValidation.updateCards, cardController.updateCards )
  .delete( cardController.deleteCards )

export const cardRoute = Router
