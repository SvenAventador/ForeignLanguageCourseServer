const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const UserTest = sequelize.define('user_test', {
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

module.exports = UserTest