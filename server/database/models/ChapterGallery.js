const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ChapterGallery = sequelize.define('chapter_gallery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chapterGalleryContent: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = ChapterGallery