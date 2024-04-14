const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const UserCourseContent = sequelize.define('user_course_content', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    testResult: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

module.exports = UserCourseContent