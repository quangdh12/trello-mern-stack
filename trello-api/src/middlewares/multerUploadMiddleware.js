import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/config/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validator'

const customFileFilter = (req, file, callback) => {
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
        const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
        return callback(new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, errorMessage), null)
    }

    return callback(null, true)
}

const upload = multer({
    limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
    fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }