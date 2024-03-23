const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const TestQuestion = sequelize.define('test_question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = TestQuestion