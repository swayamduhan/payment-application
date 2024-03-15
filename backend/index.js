const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
const mainRouter = require('./routes/index')

app.use(cors())
app.use(express.json())

// having a versioned api route is cool cause if you want to change the version at any point of time
// you can change only a number in your url and you're good to go
app.use('/api/v1', mainRouter)

app.listen(3000)
