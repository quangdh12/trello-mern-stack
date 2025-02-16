import ApiError from '~/config/ApiError'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { slugify } from '~/utils/formatters'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(userId, newBoard)
        return await boardModel.findOneById(createdBoard.insertedId)
    } catch (error) {
        throw error
    }
}

const getDetails = async (userId, boardId) => {
    try {
        const board = await boardModel.getDetails(userId, boardId)
        if (!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
        }

        const resBoard = cloneDeep(board)
        resBoard.columns.forEach(column =>
            column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
        )
        delete resBoard.cards

        return resBoard
    } catch (error) {
        throw error
    }
}

const update = async (boardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }

        const updatedBoard = await boardModel.update(boardId, updateData)
        return updatedBoard
    } catch (error) {
        throw error
    }
}

const moveCardToDifferentColumn = async (reqBody) => {
    try {
        await columnModel.update(reqBody.prevColumnId, {
            cardOrderIds: reqBody.prevCardOrderIds,
            updatedAt: Date.now()
        })

        await columnModel.update(reqBody.nextColumnId, {
            cardOrderIds: reqBody.nextCardOrderIds,
            updatedAt: Date.now()
        })

        await cardModel.update(reqBody.currentCardId, {
            columnId: reqBody.nextColumnId
        })

        return { updateResult: 'Successfully!' }
    } catch (error) {
        throw error
    }
}

const getBoards = async (userId, page = DEFAULT_PAGE, itemsPerPage = DEFAULT_ITEMS_PER_PAGE) => {
    try {
        const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))

        return results
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
    getBoards
}