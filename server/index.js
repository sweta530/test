const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send("users app is running")
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const fileUpload = require('express-fileupload')
app.use(fileUpload())
app.use(express.static('public'))

app.use(require('./routes'))
require('./model/connection')