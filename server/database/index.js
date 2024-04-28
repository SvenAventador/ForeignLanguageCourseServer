const ChapterGallery = require("./models/ChapterGallery");
const Course = require("./models/Course");
const CourseContent = require("./models/CouseContent");
const Language = require("./models/Language");
const Test = require("./models/Test");
const TestAnswer = require("./models/TestAnswer");
const TestQuestion = require("./models/TestQuestion");
const User = require("./models/User");
const UserCourse = require("./models/UserCourse");
const UserTest = require("./models/UserTest");
const Duration = require("./models/Duration");
const ChapterContent = require("./models/ChapterContent");
const Certificate = require("./models/Certificate");

User.belongsToMany(Course, {
    through: UserCourse
})
Course.belongsToMany(User, {
    through: UserCourse
})

Language.hasOne(Course)
Course.belongsTo(Language)

Duration.hasOne(Course)
Course.belongsTo(Duration)

Test.belongsToMany(User, {
    through: UserTest
})
User.belongsToMany(Test, {
    through: UserTest
})

CourseContent.hasMany(ChapterContent)
ChapterContent.belongsTo(CourseContent)

CourseContent.hasMany(ChapterGallery)
ChapterGallery.belongsTo(CourseContent)

Course.hasMany(CourseContent)
CourseContent.belongsTo(Course)

CourseContent.hasOne(Test)
Test.belongsTo(CourseContent)

Test.hasMany(TestQuestion)
TestQuestion.belongsTo(Test)

TestQuestion.hasMany(TestAnswer)
TestAnswer.belongsTo(TestQuestion)

User.hasMany(Certificate)
Certificate.belongsTo(User)

module.exports = {
    Certificate,
    ChapterContent,
    ChapterGallery,
    Course,
    CourseContent,
    Duration,
    Language,
    Test,
    TestAnswer,
    TestQuestion,
    User,
    UserCourse,
    UserTest
}

