const ErrorHandler = require("../errors/errorHandler");
const {
    UserTest,
    Test,
    TestQuestion
} = require("../database");

class UserTestController {
    async createOrUpdateResult(req, res, next) {
        const {
            testResult,
            testId,
            userId
        } = req.body

        try {
            const candidate = await UserTest.findOne({where: {testId, userId}})
            const test = await Test.findByPk(testId, {include: [TestQuestion]})
            const questionsCount = test.test_questions.length

            if (candidate) {
                await candidate.update({
                    isComplete: ((questionsCount - 1) < testResult),
                    testResult,
                    testId,
                    userId
                })

                return res.json({candidate})
            } else {
                const userResult = await UserTest.create({
                    isComplete: ((questionsCount - 3) < testResult),
                    testResult,
                    testId,
                    userId
                })

                return res.json({userResult})
            }
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new UserTestController()