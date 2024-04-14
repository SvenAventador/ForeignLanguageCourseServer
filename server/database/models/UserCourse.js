const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const UserCourse = sequelize.define('user_course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = UserCourse