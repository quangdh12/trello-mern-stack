import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body)

        res.status(StatusCodes.CREATED).json(createdCard)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const updatedColumn = await cardService.update(cardId, req.body)

        res.status(StatusCodes.OK).json(updatedColumn)
    } catch (error) {
        next(error)
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const columnId = req.body.columnId
        const result = await cardService.deleteItem(columnId, cardId)

        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

export const cardController = {
    createNew,
    update,
    deleteItem
}