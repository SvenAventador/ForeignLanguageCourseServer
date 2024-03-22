const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const CourseContent = require("./CouseContent");
const TestQuestion = require("./TestQuestion");

const Test = sequelize.define('test', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    testName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

module.exports = Test