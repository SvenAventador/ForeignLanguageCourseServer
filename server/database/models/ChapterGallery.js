const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const CourseContent = require("./CouseContent");

const ChapterGallery = sequelize.define('chapter_gallery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chapterGalleryContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isMainVideo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = ChapterGallery