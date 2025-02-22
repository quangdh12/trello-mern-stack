import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { cloudinaryProvider } from '~/providers/CloudinaryProvider'
import { CLOUDINARY_FOLDER } from '~/utils/constants'

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

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }

        let updatedCard = {}

        if (cardCoverFile) {
            const uploadResult = await cloudinaryProvider.streamUpload(cardCoverFile.buffer, CLOUDINARY_FOLDER.CARD_COVERS)

            updatedCard = await cardModel.update(cardId, {
                cover: uploadResult.secure_url
            })
        } else if (updateData.commentToAdd) {
            const commentData = {
                ...updateData.commentToAdd,
                commentedAt: Date.now(),
                userId: userInfo._id,
                userEmail: userInfo.email
            }

            updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
        } else if (updateData.incomingMemberInfo) {
            updatedCard = await cardModel.updateMembers(cardId, reqBody.incomingMemberInfo)
        } else {
            updatedCard = await cardModel.update(cardId, updateData)

        }

        return updatedCard
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