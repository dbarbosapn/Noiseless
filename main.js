/*
 * Filename: main.js
 * Project: noiseless
 * Created Date: Monday, April 15th 2019, 2:19:10 pm
 * Author: Diogo Barbosa (pessoal.dbarbosa@gmail.com)
 * 
 * Copyright (c) 2019 Diogo Barbosa
 */

const express = require('express');
const path = require('path');

const app = express();
const port = 3000

app.use('/documentation', express.static(__dirname + "/documentation"))
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname + "/documentation/start.html"))
})

app.use('/display', express.static(__dirname + "/display"))
app.get('/display', (req, res) => res.sendFile(path.join(__dirname + '/display/index.html')))

app.use('/', express.static(__dirname + "/admin"))
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/admin/index.html')))

app.listen(port, () => console.log(`Server listening on port ${port}!`))