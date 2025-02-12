import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
    try {
        const newCard = {
            ...reqBody
        }
        const createdCard = await cardModel.createNew(newCard)
        const getNewCard = await cardModel.findOneById(createdCard.insertedId)

        if (getNewCard) {
            await columnModel.pushCardOrderIds(getNewCard)
        }

        return getNewCard
    } catch (error) {
        throw error
    }
}

const update = async (cardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }

        const updatedColumn = await cardModel.update(cardId, updateData)
        return updatedColumn
    } catch (error) {
        throw error
    }
}

const deleteItem = async (columnId, cardId) => {
    try {
        const targetColumn = await columnModel.findOneById(columnId)
        if (!targetColumn) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
        }
        const targetCard = await cardModel.findOneById(cardId)
        if (!targetCard) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
        }

        await cardModel.deleteOneById(cardId)

        await columnModel.pullCardOrderIds(columnId, cardId)

        return { deleteResult: 'Card is deleted successfully' }
    } catch (error) {
        throw error
    }
}

export const cardService = {
    createNew,
    update,
    deleteItem
}