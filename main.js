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
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./.scratch');
}

const app = express();
const port = 3000

app.use(express.urlencoded({ extended: true }));

app.use('/documentation', express.static(__dirname + "/documentation"))
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname + "/documentation/start.html"))
})

app.use('/display', express.static(__dirname + "/display"))
app.get('/display', (req, res) => res.sendFile(path.join(__dirname + '/display/index.html')))

app.use('/', express.static(__dirname + "/admin"))
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/admin/index.html')))

app.listen(port, () => console.log(`Server listening on port ${port}!`))

var validatePassword = function(pw) {
    var password = (process.env.noiselesspw == null) ? "1234" : process.env.noiselesspw;
    return (pw === password);
}

app.post('/setpassword', function(req, res) {
    if(validatePassword(req.body.pw)) {
        process.env.noiselesspw = req.body.password;
        res.send({"result": true});
    } else {
        res.send({"result": false})
    }
})

app.post('/settimers', function(req, res) {
    if(validatePassword(req.body.pw)) {
        var startingTime = req.body.startingTime.split(':')
        var endingTime = req.body.endingTime.split(':')
        localStorage.setItem("startingTime", (parseInt(startingTime[0]) * 60 * 60 * 1000) + (parseInt(startingTime[1]) * 60 * 1000))
        localStorage.setItem("endingTime", (parseInt(endingTime[0]) * 60 * 60 * 1000) + (parseInt(endingTime[1]) * 60 * 1000))
        res.send({"result": true});
    } else {
        res.send({"result": false})
    }
})

app.get('/gettimers', function(req, res) {
    res.send({
        "result": {
            "startingTime": (localStorage.getItem("startingTime") == null) ? "0" : localStorage.getItem("startingTime"),
            "endingTime": (localStorage.getItem("endingTime") == null) ? "82800000" : localStorage.getItem("endingTime")
        }
    })
})

app.post('/setfill', function(req, res) {
    if(validatePassword(req.body.pw)) {
        localStorage.setItem("fillTime", req.body.fillTime)
        res.send({"result": true});
    } else {
        res.send({"result": false})
    }
})

app.get('/getfill', function(req, res) {
    res.send({
        "result": {
            "fillTime": (localStorage.getItem("fillTime") == null) ? "5" : localStorage.getItem("fillTime"),
        }
    })
})

app.get('/getnoiseaverage', function(req, res) {
    res.send({
        "result": (localStorage.getItem("noiseAverage") == null) ? [] : JSON.parse(localStorage.getItem("noiseAverage"))
    })
})

app.get('/getnoiseaverageweek', function(req, res) {
    res.send({
        "result": (localStorage.getItem("noiseAverageWeek") == null) ? [] : JSON.parse(localStorage.getItem("noiseAverageWeek"))
    })
})

app.post('/pushaverage', function(req, res) {
    var d = new Date();
    d.setHours(0,0,0,0);
    var average = parseFloat(req.body.average);
    
    // Push average for "Noise Average per Day"
    var data = (localStorage.getItem("noiseAverage") == null) ? [] : localStorage.getItem("noiseAverage")
    data.push({
        x: d,
        y: average
    })
    localStorage.setItem("noiseAverage", JSON.stringify(data));

    // Push average for "Noise Average per Week Day"
    var counters = (localStorage.getItem("weekCounters") == null) ? [0, 0, 0, 0, 0, 0, 0] : JSON.parse(localStorage.getItem("weekCounters"))
    var weekdata = (localStorage.getItem("noiseAverageWeek") == null) ? [0, 0, 0, 0, 0, 0, 0] : JSON.parse(localStorage.getItem("noiseAverageWeek"))
    var weekDay = d.getDay()

    weekdata[weekDay] = ((weekdata[weekDay] * counters[weekDay]) + average) / (counters[weekDay]+1);
    counters[weekDay] += 1;
    
    localStorage.setItem("weekCounters", JSON.stringify(counters));
    localStorage.setItem("noiseAverageWeek", JSON.stringify(weekdata));
    
    res.send({"result": true});
})