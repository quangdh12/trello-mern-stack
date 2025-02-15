import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { env } from '~/config/environments'
import { JwtProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
    const clientAccessToken = req.cookies?.accessToken

    if (!clientAccessToken) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))

        return
    }

    try {
        const accessTokenDecoded = await JwtProvider.verifyToken({ token: clientAccessToken, secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE })

        req.jwtDecoded = accessTokenDecoded

        next()
    } catch (error) {
        if (error?.message?.includes('jwt expired')) {
            next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
            return
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
    }
}

export const authMiddleware = {
    isAuthorized
}