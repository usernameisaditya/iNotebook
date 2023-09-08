const connectToMongo = require('./db');
const express = require('express')
connectToMongo();
const path = require('path');
const cors = require('cors');
const app = express()

app.use(cors())
app.use(express.json())

const staticpath = path.join(`${__dirname}`,'..','build')
app.use(express.static(staticpath))

const port = process.env.PORT || 8000
//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})