import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_RULE_MESSAGE } from '~/utils/validator'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(150).trim().strict(),
        description: Joi.string().required().min(3).max(255).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })

        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(150).trim().strict(),
        description: Joi.string().min(3).max(255).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })

        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

const moveCardToDifferentColumn = async (req, res, next) => {
    const correctCondition = Joi.object({
        currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        prevCardOrderIds: Joi.array().required().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)
        ),
        nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        nextCardOrderIds: Joi.array().required().items(
            Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)
        )
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })

        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

export const boardValidation = {
    createNew,
    update,
    moveCardToDifferentColumn
}