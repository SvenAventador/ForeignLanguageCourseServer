const ChapterGallery = require("./models/ChapterGallery");
const Course = require("./models/Course");
const CourseContent = require("./models/CouseContent");
const Language = require("./models/Language");
const Test = require("./models/Test");
const TestAnswer = require("./models/TestAnswer");
const TestQuestion = require("./models/TestQuestion");
const User = require("./models/User");
const UserCourse = require("./models/UserCourse");
const UserCourseContent = require("./models/UserCourseContent");

User.belongsToMany(Course, {
    through: UserCourse
})
Course.belongsToMany(User, {
    through: UserCourse
})

Language.hasOne(Course)
Course.belongsTo(Language)

CourseContent.belongsToMany(User, {
    through: UserCourseContent
})
User.belongsToMany(CourseContent, {
    through: UserCourseContent
})

ChapterGallery.hasMany(CourseContent)
CourseContent.belongsTo(ChapterGallery)

Course.hasMany(CourseContent)
CourseContent.belongsTo(Course)

CourseContent.hasOne(Test)
Test.belongsTo(CourseContent)

Test.hasMany(TestQuestion)
TestQuestion.belongsTo(Test)

TestQuestion.hasMany(TestAnswer)
TestAnswer.belongsTo(TestQuestion)

module.exports = {
    ChapterGallery,
    Course,
    CourseContent,
    Language,
    Test,
    TestAnswer,
    TestQuestion,
    User,
    UserCourse,
    UserCourseContent
}

