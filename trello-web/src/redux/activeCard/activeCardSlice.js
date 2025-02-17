import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentActiveCard: null
}

export const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,
    reducers: {
        clearCurrentActiveCard: (state) => {
            state.currentActiveCard = null
        },
        updateCurrentActiveCard: (state, action) => {
            state.currentActiveCard = action.payload
        },
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (build) => {

    }
})

export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
    return state.activeCard.currentActiveCard
}

export const activeCardReducer = activeCardSlice.reducer