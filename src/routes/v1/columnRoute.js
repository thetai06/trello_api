import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/')
  .post( columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put( columnValidation.updateColumns, columnController.updateColumns )
  .delete( columnController.deleteColumns )

export const columnRoute = Router

