import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from './environments'
import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'

export const corsOptions = {
    origin: function (origin, callback) {
        if (env.BUILD_MODE === 'dev') {
            return callback(null, true)
        }

        if (WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true)
        }

        return new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our cors POLICY.`)
    },
    optionSuccessStatus: 200,
    Credentials: true
}

