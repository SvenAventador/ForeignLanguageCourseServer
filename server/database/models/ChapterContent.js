const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ChapterContent = sequelize.define('chapter_content', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chapterContent: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = ChapterContent