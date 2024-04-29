const {
    User,
    Course,
    Language,
    Duration,
    Certificate,
    UserCourse,
    CourseContent,
    Test,
    UserTest
} = require("../database");
const ErrorHandler = require("../errors/errorHandler");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');
const uuid = require("uuid");
const {join} = require("path");
const {Op} = require("sequelize");

class CertificateController {
    async getAll(req, res, next) {
        const {id} = req.params
        try {
            const certificates = await Certificate.findAll({where: {userId: id}})
            return res.json({certificates})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`));
        }
    }

    async create(req, res, next) {
        const {
            courseId,
            userId
        } = req.query

        try {
            const user = await User.findByPk(userId)
            const course = await Course.findByPk(courseId)
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            })

            function jumpLine(doc, lines) {
                for (let index = 0; index < lines; index++) {
                    doc.moveDown();
                }
            }

            const documentName = uuid.v4() + '.pdf';
            const outputFilePath = join(__dirname, '..', 'static', 'docx', documentName);

            doc.pipe(fs.createWriteStream(outputFilePath));
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff')
            doc.fontSize(10)
            const distanceMargin = 18;

            doc.fillAndStroke('#0e8cc3')
                .lineWidth(20)
                .lineJoin('round')
                .rect(
                    distanceMargin,
                    distanceMargin,
                    doc.page.width - distanceMargin * 2,
                    doc.page.height - distanceMargin * 2,
                )
                .stroke();

            const maxWidth = 140
            const maxHeight = 70

            doc.image('./public/assets/winners.png', doc.page.width / 2 - maxWidth / 2, 60, {
                fit: [maxWidth, maxHeight],
                align: 'center',
            })

            jumpLine(doc, 5)

            doc.font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Онлайн платформа Foreign Language. С нами, ты заговоришь со всеми обо всем', {
                    align: 'center',
                })

            jumpLine(doc, 2)

            doc.font('./public/fonts/NotoSansJP-Regular.otf')
                .fontSize(16)
                .fill('#021c27')
                .text('СЕРТИФИКАТОМ ОБ ОКОНЧАНИИ КУРСА', {
                    align: 'center',
                })

            jumpLine(doc, 1)

            doc
                .font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('награждается', {
                    align: 'center',
                });

            jumpLine(doc, 2)

            doc.font('./public/fonts/NotoSansJP-Bold.otf')
                .fontSize(24)
                .fill('#021c27')
                .text(`${(user.userSurname && user.userName) ? (user.userSurname + ' ' + user.userName) : (user.userNickname)}`, {
                    align: 'center',
                });

            jumpLine(doc, 1)

            doc.font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text(`Данный сертификат подтверждает, что студент прошел курс под названием ${course.courseName}`, {
                    align: 'center',
                })

            jumpLine(doc, 7)

            doc.lineWidth(1)

            const lineSize = 174;
            const signatureHeight = 390;

            doc.fillAndStroke('#021c27');
            doc.strokeOpacity(0.2);

            const startLine1 = 128;
            const endLine1 = 128 + lineSize;
            doc.moveTo(startLine1, signatureHeight)
                .lineTo(endLine1, signatureHeight)
                .stroke();

            const startLine2 = endLine1 + 32;
            const endLine2 = startLine2 + lineSize;
            doc.moveTo(startLine2, signatureHeight)
                .lineTo(endLine2, signatureHeight)
                .stroke();

            const startLine3 = endLine2 + 32;
            const endLine3 = startLine3 + lineSize;
            doc.moveTo(startLine3, signatureHeight)
                .lineTo(endLine3, signatureHeight)
                .stroke();

            doc.font('./public/fonts/Vivaldi.ttf')
                .fontSize(20)
                .fill('#021c27')
                .text('GilfanovaSA', startLine1, signatureHeight - 30, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                })

            doc.font('./public/fonts/NotoSansJP-Bold.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Гилфанова С.А.', startLine1, signatureHeight + 10, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                });

            doc.font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Наставник', startLine1, signatureHeight + 25, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                });

            doc.font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Обучающийся', startLine2, signatureHeight + 10, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                });

            doc.font('./public/fonts/Vivaldi.ttf')
                .fontSize(20)
                .fill('#021c27')
                .text('OsadchayaDM', startLine3, signatureHeight - 30, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                })

            doc.font('./public/fonts/NotoSansJP-Bold.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Осадчая Д.М.', startLine3, signatureHeight + 10, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                });

            doc.font('./public/fonts/NotoSansJP-Light.otf')
                .fontSize(10)
                .fill('#021c27')
                .text('Директор', startLine3, signatureHeight + 25, {
                    columns: 1,
                    columnGap: 0,
                    height: 40,
                    width: lineSize,
                    align: 'center',
                });

            jumpLine(doc, 4)
            const bottomHeight = doc.page.height - 150;

            const language = await Language.findByPk(course.languageId)
            const duration = await Duration.findByPk(course.durationId)

            const qrData = `Студент: ${(user.userSurname && user.userName && user.userPatronymic) ? (user.userSurname + ' ' + user.userName + ' ' + user.userPatronymic) : (user.userNickname)}.\n` +
                `Пройден курс под названием: ${course.courseName}.\n` +
                `Выбранный иностранный язык: ${language.languageName}.\n` +
                `Длительность курса: ${duration.durationValue}.`

            const qrImage = await QRCode.toDataURL(qrData);

            doc.image(qrImage, doc.page.width / 2 - 60, bottomHeight, {
                fit: [120, 120],
            })

            doc.end();

            await Certificate.create({
                certificate: documentName,
                userId: user.id
            })

            return res.json({message: 'Сертификат успешно отправлен обучающемуся.'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async getAllUser(req, res, next) {
        try {
            const users = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: 1
                    }
                }
            });
            const userIds = users.map((user) => user.id);

            const userCourses = await UserCourse.findAll({
                where: {
                    userId: userIds
                }
            });
            const courseIds = userCourses.map((userCourse) => userCourse.courseId);
            const courses = await Course.findAll({
                where: {
                    id: courseIds
                }
            })
            const courseContents = await CourseContent.findAll({
                where: {
                    courseId: courseIds
                }
            });
            const courseContentIds = courseContents.map((content) => content.id);

            const tests = await Test.findAll({
                where: {
                    courseContentId: courseContentIds
                }
            });
            const testIds = tests.map((test) => test.id);

            const userTests = await UserTest.findAll({
                where: {
                    testId: testIds,
                    userId: userIds
                }
            });

            const response = {
                users,
                userCourses,
                courses,
                courseContents,
                tests,
                userTests
            };

            return res.json({response});
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`));
        }
    }
}

module.exports = new CertificateController()