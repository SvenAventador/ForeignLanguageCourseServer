require('dotenv').config()
const routes = require('./routes/routes')
const PORT = process.env.PORT || 5000

const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const {resolve} = require('path')

const app = express()
app.use(express.json())
app.use(cors())
app.use(fileUpload({}))
app.use(express.static(resolve(__dirname, 'static')))
app.use('/api', routes)

const errorHandler = require('./middlewares/errorHandlerMiddleware')
app.use(errorHandler)


const database = require('./database/db')
require('./database/index')
const {User} = require("./database/index")

const start = async () => {
    try {
        await database.authenticate()
        await database.sync()

        const candidate = await User.findOne({where: {userNickname: 'admin'}})
        if (candidate) {
            console.log('This data already exist in the User table!')
        } else {
            await User.create(JSON.parse(process.env.USER_ADMIN_DATA));
            console.log('The data was successfully added in the User table!')
        }

        await app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        })
    } catch (error) {
        console.error(`Server find next errors during connection with database: ${error}`)
    }
}

start().then(() => {
    console.log(`Server started successfully!`);
}).catch((error) => {
    console.error(`Server find next errors: ${error}`)
})