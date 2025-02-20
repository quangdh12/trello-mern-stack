import { env } from '~/config/environments'

export const WHITELIST_DOMAINS = [
    // 'http://localhost:5173'
    'https://trello-web-blond.vercel.app'
]

export const BOARD_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private'
}

export const USER_ROLES = {
    CLIENT: 'client',
    ADMIN: 'admin'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRO : env.WEBSITE_DOMAIN_DEV

export const CLOUDINARY_FOLDER = {
    USERS: 'users',
    CARD_COVERS: 'card-covers'
}

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 10

export const INVITATION_TYPES = {
    BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'

}