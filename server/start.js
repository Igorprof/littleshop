const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = 3000;
const static_dir = '../public';

const app = express();

app.use(bodyParser.json());
app.use(express.static(static_dir));

app.get('/catalogData', (req, res) => {
    fs.readFile('data/catalog.json', 'utf8', (err, data) => {
        res.send(data);
    })
})

app.listen(port, function() {
    console.log(`Server is running on port ${port}!`)
})