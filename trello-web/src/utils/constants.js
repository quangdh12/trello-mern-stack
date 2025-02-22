let apiRoot = ''

if (import.meta.env.MODE === 'development') {
    apiRoot = 'http://localhost:8017'
}
if (import.meta.env.MODE === 'production') {
    apiRoot = 'https://trello-api-tgma.onrender.com'
}


export const API_ROOT = apiRoot

export const TABS = {
    ACCOUNT: 'account',
    SECURITY: 'security'
}

export const BOARDS_TYPE = {
    PUBLIC: 'public',
    PRIVATE: 'private'
}

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 10
export const LIMIT_USER_GROUP = 5

export const INVITATION_TYPES = {
    BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTIONS = {
    REMOVE: 'REMOVE',
    ADD: 'ADD',
}