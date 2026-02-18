import { randomBytes } from 'node:crypto';

export function generateRandomString(length = 10) {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export const responseFun = (res, success, code, message, data = null) => {
    return res.status(code).json({
        success,
        code,
        message,
        data
    });
}