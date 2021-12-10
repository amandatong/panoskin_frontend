const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const stateData = require('./stateData.json')

const app = express()
const apiPort = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/api/state_data', (req, res) => {
    res.send(stateData);
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));