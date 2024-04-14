const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Language = sequelize.define('language', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    languageName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})


module.exports = Language