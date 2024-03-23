const {DataTypes} = require('sequelize')
const sequelize = require('../db')

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