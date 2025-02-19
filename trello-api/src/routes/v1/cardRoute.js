import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { CLOUDINARY_FOLDER } from '~/utils/constants'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/')
    .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
    .put(authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('cardCover'), cardValidation.update, cardController.update)
    .delete(authMiddleware.isAuthorized, cardValidation.deleteItem, cardController.deleteItem)


export const cardRoute = Router