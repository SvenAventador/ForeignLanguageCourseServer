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
const Duration = require("./models/Duration");
const ChapterContent = require("./models/ChapterContent");

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

CourseContent.belongsToMany(User, {
    through: UserCourseContent
})
User.belongsToMany(CourseContent, {
    through: UserCourseContent
})

CourseContent.hasMany(ChapterContent)
ChapterContent.belongsTo(CourseContent)

ChapterContent.hasMany(ChapterGallery)
ChapterGallery.belongsTo(ChapterContent)

Course.hasMany(CourseContent)
CourseContent.belongsTo(Course)

CourseContent.hasOne(Test)
Test.belongsTo(CourseContent)

Test.hasMany(TestQuestion)
TestQuestion.belongsTo(Test)

TestQuestion.hasMany(TestAnswer)
TestAnswer.belongsTo(TestQuestion)

module.exports = {
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
    UserCourseContent
}

