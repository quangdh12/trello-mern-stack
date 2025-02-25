import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { toast } from 'react-toastify';

/** Board API  */
export const createNewBoardAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
    toast.success('Created board successfully!')
    return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
    return response.data
}

export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`);

    return response.data;
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData);

    return response.data;
}

export const moveCartToDifferentColumnAPI = async (updateData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

    return response.data;
}

export const inviteUserBoardAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
    toast.success('User invited to board successfully!')
    return response.data
}

/** Column API */
export const createNewColumnAPI = async (newColumnData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData);
    return response.data;
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData);
    return response.data;
}

export const deleteColumnDetailsAPI = async (columnId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`);
    return response.data;
}

/** Card API */
export const createNewCardAPI = async (newCardData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData);
    return response.data;
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
    return response.data
}

export const deleteCardDetailsAPI = async (columnId, cardId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`, { data: { columnId } });
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

export const refreshTokenAPI = async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
    return response.data
}
