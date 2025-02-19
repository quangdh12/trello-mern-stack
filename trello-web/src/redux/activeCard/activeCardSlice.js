import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentActiveCard: null,
    isShowModalActiveCard: false
}

export const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,
    reducers: {
        showModalActiveCard: (state) => {
            state.isShowModalActiveCard = true
        },
        clearAndHideCurrentActiveCard: (state) => {
            state.currentActiveCard = null
            state.isShowModalActiveCard = false
        },
        updateCurrentActiveCard: (state, action) => {
            state.currentActiveCard = action.payload
        },
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (build) => {

    }
})

export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
    return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
    return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer