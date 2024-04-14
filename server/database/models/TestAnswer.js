const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const TestAnswer = sequelize.define('test_answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = TestAnswer