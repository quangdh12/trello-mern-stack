import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/')
    .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
    .put(authMiddleware.isAuthorized, cardValidation.update, cardController.update)
    .delete(authMiddleware.isAuthorized, cardValidation.deleteItem, cardController.deleteItem)


export const cardRoute = Router