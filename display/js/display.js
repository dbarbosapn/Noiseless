/*
 * Filename: display/display.js
 * Project: noiseless
 * Created Date: Monday, April 15th 2019, 7:11:20 pm
 * Author: Diogo Barbosa (pessoal.dbarbosa@gmail.com)
 * 
 * Copyright (c) 2019 Diogo Barbosa
 */

 var chart;
 var ctx;
 var curVal;

 var noiseLimit = 80;

 var millisMin = 0;
 var millisMax = 82800000;
 var reset = false;
 var fillTime = 5/60;

 var movingAverage = new MovingAverageCalculator()

 var progress;
 
$(window).on('load', function(){ 
    $('#confetti').hide();
    $('#loader').loadgo({
        'direction':  'bt',
        'opacity':    0.9,
        'bgcolor':    '#2f3640'
    });
    progress = $('#loader').loadgo('getprogress');

    updateData();

    initializeChart();

    icecream();

});

function updateData() {
    setTimers();
    setFillTime();
    setTimeout(updateData, 5*60*1000);
}

function setTimers() {
    $.ajax({
        url: "/gettimers",
        type: "get",
        success: function(response) {
            millisMin = response.result.startingTime;
            millisMax = response.result.endingTime;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError)
            alert("Error retrieving timers.")
        }
    })
}

function setFillTime() {
    $.ajax({
        url: "/getfill",
        type: "get",
        success: function(response) {
            fillTime = response.result.fillTime;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError)
            alert("Error retrieving fill time.")
        }
    })
}

function initializeChart() {
    ctx = document.getElementById('chart').getContext("2d");
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: [],
                
                borderColor: 'rgb(255, 191, 0)',
                backgroundColor: 'rgb(255, 191, 0, 0.1)',
                borderWidth: 2,
                pointRadius: 0
            } , {
                data: [],
                
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(0, 0, 0, 0)',
                borderWidth: 2,
                pointRadius: 0
            }
        ]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'realtime',
                    realtime: {
                        onRefresh: function(chart) {
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y: curVal
                            });
                            chart.data.datasets[1].data.push({
                                x: Date.now(),
                                y: noiseLimit
                            })
                        },
                        refresh: 100,
                        delay: 200
                    },
                }],
                yAxes: [{
                    ticks: {
                        max: 150,
                        min: 0
                    }
                }]
            }
        }
    })
}

function icecream() {
    var d = Date.now() - (new Date(new Date().setHours(0,0,0,0))).getTime();
    if(d > millisMax || d < millisMin) {
        if(!reset) {
            $.ajax({
                url: "/pushaverage",
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    'average': movingAverage.mean,
                }
            })
            movingAverage = new MovingAverageCalculator();
            reset = true;
        }
    } else {
        if(reset) {
            progress = 0;
            $('#loader').loadgo('setprogress', progress);
            reset = false;
        }
        if(curVal < noiseLimit) {
            progress++;
            $('#loader').loadgo('setprogress', progress);
        }
        if(progress >= 100) {
            $('#confetti').show();
        }
    }
    setTimeout(icecream, fillTime*60*1000 / 100)
}

function streamFunction(stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }
        var average = values / (length);
        movingAverage.update(average);

        $('#text').text(average.toFixed(2) + "db");
        curVal = average;
    }
}