import express from 'express'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'

const Router = express.Router()

Router.route('/')
  .get( boardController.getAll )
  .post(boardValidation.creatNew, boardController.creatNew)

Router.route('/all')
  .get( boardController.getAll )
  .put() //update

Router.route('/:id')
  .get( boardController.getDetails )
  .put( boardValidation.updateDetails, boardController.updateDetails )
  .delete( boardController.deleteDetails)

export const boardRoute = Router