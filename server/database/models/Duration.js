const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Duration = sequelize.define('duration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    durationValue: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

const durationValues = [
    '1 месяц', '2 месяца', '3 месяца', '4 месяца', '5 месяцев',
    '6 месяцев', '7 месяцев', '8 месяцев', '9 месяцев', '10 месяцев',
    '11 месяцев', '1 год'
]
const durations = durationValues.map(durationValue => ({durationValue}))

Duration.bulkCreate(durations)
    .then(() => {
        console.log('Данные в таблицу Duration успешно добавлены!')
    }).catch((error) => {
    console.error(`При добавлении данных в таблицу Duration произошли следующие ошибки: ${error}`)
})

module.exports = Duration