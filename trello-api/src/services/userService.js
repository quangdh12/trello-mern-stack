import { StatusCodes } from 'http-status-codes'
import ApiError from '~/config/ApiError'
import { userModel } from '~/models/userModel'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'

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

export const userService = {
    createNew
}