export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_RULE_MESSAGE = 'Your string fails to match the Object ID pattern'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match with password above.'

export const LIMIT_COMMON_FILE_SIZE = 10485760
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
    if (!file || !file.name || !file.size || !file.type) {
        return 'File cannot be blank'
    }

    if (file.size > LIMIT_COMMON_FILE_SIZE) {
        return 'Maximum file size exceeded. (10MB)'
    }

    if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
        return 'File type is invalid. Only accept jpg, jpeg and png'
    }

    return null
}