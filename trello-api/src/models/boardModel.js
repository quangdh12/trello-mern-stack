import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_RULE_MESSAGE } from '~/utils/validator'
import { userModel } from './userModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(150).trim().strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)),
    description: Joi.string().required().min(3).max(255).trim().strict(),
    slug: Joi.string().trim().strict(),

    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)).default([]),
    ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)).default([]),
    memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_RULE_MESSAGE)).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
    try {
        const validData = await validateBeforeCreate(data)

        const newBoardToAdd = {
            ...validData,
            ownerIds: [new ObjectId(userId)]
        }

        return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
    } catch (error) {
        throw new Error(error)
    }
}

const getDetails = async (userId, boardId) => {
    try {
        const queryConditions = [
            { _id: new ObjectId(boardId) },
            { _destroy: false },
            {
                $or: [
                    { ownerIds: { $all: [new ObjectId(userId)] } },
                    { memberIds: { $all: [new ObjectId(userId)] } }
                ]
            }

        ]

        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
            {
                $match: { $and: queryConditions }
            },
            {
                $lookup: {
                    from: columnModel.COLUMN_COLLECTION_NAME,
                    localField: '_id', // primary key
                    foreignField: 'boardId',
                    as: 'columns' // foreign key
                }
            },
            {
                $lookup: {
                    from: cardModel.CARD_COLLECTION_NAME,
                    localField: '_id', // primary key
                    foreignField: 'boardId',
                    as: 'cards' // foreign key
                }
            },
            {
                $lookup: {
                    from: userModel.USER_COLLECTION_NAME,
                    localField: 'ownerIds', // primary key
                    foreignField: '_id',
                    as: 'owners', // foreign key
                    pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
                }
            },
            {
                $lookup: {
                    from: userModel.USER_COLLECTION_NAME,
                    localField: 'memberIds', // primary key
                    foreignField: '_id',
                    as: 'members', // foreign key
                    pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
                }
            }
        ]).toArray()
        return result[0] || null
    } catch (error) {
        throw new Error(error)
    }
}

const pushColumnOrderIds = async (column) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $push: { columnOrderIds: new ObjectId(column._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const pullColumnOrderIds = async (column) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $pull: { columnOrderIds: new ObjectId(column._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (boardId, updateData) => {
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName]
            }
        })

        if (updateData.columnOrderIds) {
            updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new ObjectId(_id))
        }

        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(boardId) },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getBoards = async (userId, page, itemsPerPage) => {

    try {
        const queryConditions = [
            { _destroy: false },
            {
                $or: [
                    { ownerIds: { $all: [new ObjectId(userId)] } },
                    { memberIds: { $all: [new ObjectId(userId)] } }
                ]
            }

        ]

        const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
            { $match: { $and: queryConditions } },
            { $sort: { title: 1 } },
            { $facet: { 'queryBoards': [{ $skip: page > 0 ? (page - 1) * itemsPerPage : 0 }, { $limit: itemsPerPage }], 'queryTotalBoards': [{ $count: 'total' }] } }
        ], {
            collation: { locale: 'en' }
        }).toArray()

        const res = query[0]

        return {
            boards: res.queryBoards || [],
            totalBoards: res.queryTotalBoards[0]?.total || 0
        }
    } catch (error) {
        throw new Error(error)
    }
}

const pushMembersIds = async (boardId, userId) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(boardId) },
            { $push: { memberIds: new ObjectId(userId) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) {
        throw new Error(error)
    }
}


export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    pushColumnOrderIds,
    update,
    pullColumnOrderIds,
    getBoards,
    pushMembersIds
}