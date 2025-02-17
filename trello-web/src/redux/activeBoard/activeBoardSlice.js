import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'lodash'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'

const initialState = {
    currentActiveBoard: null,
}

export const fetchBoardDetailsAPI = createAsyncThunk(
    'activeBoard/fetchBoardDetailsAPI',
    async (boardId) => {
        const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`);

        return response.data
    },

)

export const activeBoardSlice = createSlice({
    name: 'activeBoard',
    initialState,
    reducers: {
        updateCurrentActiveBoard: (state, action) => {
            const fullBoard = action.payload

            state.currentActiveBoard = fullBoard
        },
        updateCardInBoard: (state, action) => {
            const incomingCard = action.payload

            const column = state.currentActiveBoard.columns.find((column) => column._id === incomingCard.columnId)

            if (column) {
                const card = column.cards.find((card) => card._id === incomingCard._id)
                if (card) {
                    card.title = incomingCard.title
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
            let board = action.payload

            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

            board.columns.forEach(column => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)];
                    column.cardOrderIds = [generatePlaceholderCard(column)._id]
                } else {
                    column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
                }
            })
            state.currentActiveBoard = board
        })
    }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer