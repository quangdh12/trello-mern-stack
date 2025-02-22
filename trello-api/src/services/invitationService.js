import StatusCodes from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
    try {
        const inviter = await userModel.findOneById(inviterId)

        const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)

        const board = await boardModel.findOneById(reqBody.boardId)

        if (!invitee || !inviter || !board || inviter.email === invitee.email) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board is invalid!')
        }

        const newInvitationData = {
            inviterId,
            inviteeId: invitee._id.toString(),
            type: INVITATION_TYPES.BOARD_INVITATION,
            boardInvitation: {
                boardId: board._id.toString(),
                status: BOARD_INVITATION_STATUS.PENDING
            }
        }

        const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
        const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

        const resInvitation = {
            ...getInvitation,
            board,
            inviter: pickUser(inviter),
            invitee: pickUser(invitee)
        }

        return resInvitation
    } catch (error) {
        throw error
    }
}

const getInvitations = async (userId) => {
    try {
        const getInvitations = await invitationModel.findByUser(userId)

        const resInvitations = getInvitations.map(item => {
            return {
                ...item,
                inviter: item.inviter[0] || {},
                invitee: item.invitee[0] || {},
                board: item.board[0] || {}
            }
        })
        return resInvitations
    } catch (error) {
        throw error
    }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
    try {
        const getInvitation = await invitationModel.findOneById(invitationId)
        if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found!')

        const boardId = getInvitation.boardInvitation.boardId
        const getBoard = await boardModel.findOneById(boardId)
        if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')

        const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()
        if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You are already a member of this board. ')
        }

        const updateData = {
            boardInvitation: {
                ...getInvitation.boardInvitation,
                status
            }
        }

        const updatedInvitation = await invitationModel.update(invitationId, updateData)

        if (updatedInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
            await boardModel.pushMembersIds(boardId, userId)
        }

        return updatedInvitation
    } catch (error) {
        throw error
    }
}

export const invitationService = {
    createNewBoardInvitation,
    getInvitations,
    updateBoardInvitation
}