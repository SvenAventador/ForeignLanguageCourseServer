const ErrorHandler = require("../errors/errorHandler");
const {
    Test,
    TestQuestion,
    TestAnswer
} = require("../database");
const {
    Op
} = require("sequelize");
const {validationResult} = require("express-validator");

class TestController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const test = await Test.findOne({
                where: {
                    courseContentId: id
                },
                include: [
                    {
                        model: TestQuestion,
                        include: [TestAnswer]
                    }
                ]
            })

            return res.json({test})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            testName,
            courseContentId,
            questions,
            answers
        } = req.body;

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const test = await Test.create({
                testName,
                courseContentId
            });

            for (let i = 0; i < questions.length; i++) {
                const question = await TestQuestion.create({
                    question: questions[i],
                    testId: test.id
                });

                for (let j = 0; j < answers[i].length; j++) {
                    await TestAnswer.create({
                        answer: answers[i][j].answer,
                        isCorrect: answers[i][j].isCorrect,
                        testQuestionId: question.id
                    });
                }
            }

            res.json({test})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query;

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const questions = await TestQuestion.findAll({
                attributes: ['id'],
                where: {
                    testId: id
                },
            })

            const questionIds = questions.map(question => question.id);
            await TestAnswer.destroy({
                where: {
                    testQuestionId: {
                        [Op.in]: questionIds
                    }
                }
            })

            await TestQuestion.destroy({
                where: {
                    testId: id
                }
            })

            await Test.destroy({
                where: {
                    id: id
                }
            })

            res.status(200).json({message: 'Тест успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`));
        }
    }
}

module.exports = new TestController()