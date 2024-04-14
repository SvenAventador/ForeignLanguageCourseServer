const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const CourseContent = sequelize.define('course_content', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chapterName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    chapterDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    chapterImage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = CourseContent