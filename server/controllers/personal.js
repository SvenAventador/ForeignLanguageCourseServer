const {
    User,
    UserTest,
    UserCourse,
    Course,
    CourseContent,
    Test,
    Language
} = require("../database");
const {
    hashSync,
    genSaltSync
} = require("bcrypt");
const {validationResult} = require("express-validator");
const ErrorHandler = require("../errors/errorHandler");
const Secondary = require("../func/secondary");

class PersonalController {
    async getStatistic(req, res, next) {
        const {id} = req.params

        try {
            const user = await User.findByPk(id)
            const userCourse = await UserCourse.findAll({where: {userId: user.id}})

            let courseIds = []
            userCourse.map((item) => {
                courseIds.push(item.dataValues.courseId)
            })

            const courses = await Course.findAll({
                where: {
                    id: courseIds
                },
                include: [
                    {
                        model: CourseContent
                    },
                    {
                        model: Language
                    }
                ]
            })

            const userTest = await UserTest.findAll({where: {userId: user.id}})
            let testIds = []
            userTest.map((item) => {
                testIds.push(item.dataValues.testId)
            })

            const test = await Test.findAll({
                where: {
                    id: testIds
                },
                include: CourseContent
            })
            return res.json({
                courses,
                test,
                userTest
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.params
        const {
            userNickname,
            userEmail,
            userPassword,
            userSurname,
            userName,
            userPatronymic,
            userPhone
        } = req.body

        try {
            const user = await User.findByPk(id)
            if (userNickname && userNickname !== user.userNickname && (await User.findOne({where: {userNickname}})))
                return next(ErrorHandler.conflict("Пользователь с таким ником уже существует в системе!"))
            if (userEmail && userEmail !== user.userEmail && (await User.findOne({where: {userEmail}})))
                return next(ErrorHandler.conflict("Пользователь с такой почтой уже существует в системе!"))
            if (userPhone && userPhone !== user.userPhone && (await User.findOne({where: {userPhone}})))
                return next(ErrorHandler.conflict("Пользователь с таким телефоном уже существует в системе!"))

            await user.update({
                userNickname: userNickname || user.userNickname,
                userEmail: userEmail || user.userEmail,
                userPassword: userPassword ? hashSync(userPassword, genSaltSync(5)) : user.userPassword,
                userSurname: userSurname || user.userSurname,
                userName: userName || user.userName,
                userPatronymic: userPatronymic || user.userPatronymic,
                userPhone: userPhone || user.userPhone
            })

            const token = Secondary.generate_jwt(
                user.id,
                user.userNickname,
                user.userEmail,
                user.userRole,
                user.userSurname,
                user.userName,
                user.userPatronymic,
                user.userPhone
            )
            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new PersonalController()