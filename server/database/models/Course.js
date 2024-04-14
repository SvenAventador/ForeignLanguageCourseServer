const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Course = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    courseDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    courseLevel: {
        type: DataTypes.ENUM(
            'Начинающий',
            'Элементарный',
            'Средний',
            'Продвинутый'
        ),
        allowNull: false
    },
    courseImage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Course