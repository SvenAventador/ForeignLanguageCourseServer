const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Certificate = sequelize.define('certificate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    certificate: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Certificate