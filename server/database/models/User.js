const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userNickname: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole: {
        type: DataTypes.ENUM(
            'ADMIN',
            'USER'
        ),
        defaultValue: 'USER'
    },
    userSurname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userPatronymic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
})

module.exports = User