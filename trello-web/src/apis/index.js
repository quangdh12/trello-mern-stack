import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/** Board API  */
export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);

    return response.data;
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData);

    return response.data;
}

export const moveCartToDifferentColumnAPI = async (updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

    return response.data;
}

/** Column API */
export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData);
    return response.data;
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData);
    return response.data;
}

export const deleteColumnDetailsAPI = async (columnId) => {
    const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);
    return response.data;
}

/** Card API */
export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
    return response.data;
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
    return response.data
}

export const deleteCardDetailsAPI = async (columnId, cardId) => {
    const response = await axios.delete(`${API_ROOT}/v1/cards/${cardId}`, { data: { columnId } });
    return response.data;
}
/**
 * User
 **/
export const registerUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
    toast.success('Account created successfully! Please check and verify your email before logging in!', {
        theme: 'colored'
    })

    return response.data
}

export const verifyUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
    toast.success('Account verify successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })

    return response.data
}

