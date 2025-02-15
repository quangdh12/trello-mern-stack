import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { userModel } from '~/models/userModel'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { CLOUDINARY_FOLDER, WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environments'
import { cloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody) => {
    try {
        const existEmail = await userModel.findOneByEmail(reqBody.email)
        if (existEmail) {
            throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
        }

        const nameFromEmail = reqBody.email.split('@')[0]
        const newUser = {
            email: reqBody.email,
            password: bcryptjs.hashSync(reqBody.password, 10),
            username: nameFromEmail,
            displayName: nameFromEmail,
            verifyToken: uuidv4()
        }

        const createdUser = await userModel.createNew(newUser)

        const getNewUser = await userModel.findOneById(createdUser.insertedId)

        const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
        const customSubject = 'Trello Notification: Please verify your email before using our services!'
        const htmlContent = `
            <h3>Thank you for register account. Here is your verification link:</h3>
            <h3>${verificationLink}</h3>
            <h3>Sincerely, <br />Trello Services</h3>
        `

        await BrevoProvider.sendEmail({ recipientEmail: getNewUser.email, customSubject, htmlContent })

        return pickUser(getNewUser)
    } catch (error) {
        throw error
    }
}

const verifyAccount = async ({ email, token }) => {
    try {
        const existUser = await userModel.findOneByEmail(email)

        if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
        if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
        if (token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

        const updateData = {
            isActive: true,
            verifyToken: null
        }

        const updatedUser = await userModel.update(existUser._id, updateData)

        return pickUser(updatedUser)
    } catch (error) {
        throw error
    }
}

const login = async ({ email, password }) => {
    try {
        const existUser = await userModel.findOneByEmail(email)

        if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
        if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
        if (!bcryptjs.compareSync(password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')

        const userInfo = { _id: existUser._id, email: existUser.email }

        const accessToken = await JwtProvider.generateToken({ userInfo, secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE, tokenLife: env.ACCESS_TOKEN_LIFE })
        const refreshToken = await JwtProvider.generateToken({ userInfo, secretSignature: env.REFRESH_TOKEN_SECRET_SIGNATURE, tokenLife: env.REFRESH_TOKEN_LIFE })

        return { accessToken, refreshToken, ...pickUser(existUser) }

    } catch (error) {
        throw error
    }
}

const refreshToken = async (clientRefreshToken) => {
    try {
        const refreshTokenDecoded = await JwtProvider.verifyToken({ token: clientRefreshToken, secretSignature: env.REFRESH_TOKEN_SECRET_SIGNATURE })

        const userInfo = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email
        }

        const accessToken = await JwtProvider.generateToken({
            userInfo,
            secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE,
            tokenLife: env.ACCESS_TOKEN_LIFE
        }
        )

        return { accessToken }
    } catch (error) {
        throw error
    }
}

const update = async (userId, reqBody, userAvatarFile) => {
    try {
        const existedUser = await userModel.findOneById(userId)
        if (!existedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
        if (!existedUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

        let updatedUser = {}

        const { currentPassword, newPassword } = reqBody

        if (currentPassword && newPassword) {
            if (!bcryptjs.compareSync(currentPassword, existedUser.password)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Your current password is not correct!')
            }

            updatedUser = await userModel.update(existedUser._id, {
                password: bcryptjs.hashSync(newPassword, 10)
            })
        } else if (userAvatarFile) {
            const uploadResult = await cloudinaryProvider.streamUpload(userAvatarFile.buffer, CLOUDINARY_FOLDER.USERS)

            updatedUser = await userModel.update(existedUser._id, {
                avatar: uploadResult.secure_url
            })
        } else {
            updatedUser = await userModel.update(existedUser._id, reqBody)
        }

        return pickUser(updatedUser)
    } catch (error) {
        throw error
    }
}

export const userService = {
    createNew,
    verifyAccount,
    login,
    refreshToken,
    update
}