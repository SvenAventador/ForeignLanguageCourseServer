const jwt = require('jsonwebtoken')

class Secondary {
    static generate_jwt(
        id,
        userNickname,
        userEmail,
        userRole,
        userSurname = null,
        userName = null,
        userPatronymic = null
    ) {
        const payload = {
            id,
            userNickname,
            userEmail,
            userRole,
            userSurname,
            userName,
            userPatronymic
        }

        return jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY, {
                expiresIn: '24h'
            })
    }
}

module.exports = Secondary
