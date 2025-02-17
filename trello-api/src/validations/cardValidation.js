import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { OBJECT_ID_RULE, OBJECT_RULE_MESSAGE } from '~/utils/validator'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
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
        // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().optional()
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

const deleteItem = async (req, res, next) => {

    const correctCondition = Joi.object({
        id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE),
        columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)
    })

    try {
        await correctCondition.validateAsync({ ...req.params, columnId: req.body.columnId })

        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

export const cardValidation = {
    createNew,
    update,
    deleteItem
}