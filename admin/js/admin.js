/*
 * Filename: admin/admin.js
 * Project: noiseless
 * Created Date: Monday, April 15th 2019, 2:19:10 pm
 * Author: Diogo Barbosa (pessoal.dbarbosa@gmail.com)
 * 
 * Copyright (c) 2019 Diogo Barbosa
 */

$(document).ready(function() {
    setTimers();
    setFillTime();
    setupCharts();
})

// Useful Variables
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function setTimers() {
    $.ajax({
        url: "/gettimers",
        type: "get",
        success: function(response) {
            $('#startingTime').val(msToTime(response.result.startingTime))
            $('#endingTime').val(msToTime(response.result.endingTime))
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
            $('#fillTime').val(response.result.fillTime)
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError)
            alert("Error retrieving fill time.")
        }
    })
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes;
}

$('#submit_newpw').click(function() {
    if($('#newPassword').val() != '') {
        var password = prompt("This action requires password authentication. ");
        $.ajax({
            url: "/setpassword",
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            data: {
                'pw': password,
                'password': $('#newPassword').val(),
            },
            success: function(response) {
                if(response.result) {
                    alert("Success!")
                    location.reload()
                } else {
                    alert("Wrong password!")
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError)
                alert("Error changing password.")
            }
        })
    } else {
        alert("Password field is empty.")
    }
})

$('#submit_timers').click(function() {
    if($('#startingTime').val() != '' && $('#endingTime').val() != '') {
        var password = prompt("This action requires password authentication. ");
        $.ajax({
            url: "/settimers",
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            data: {
                'pw': password,
                'startingTime': $('#startingTime').val(),
                'endingTime': $('#endingTime').val(),
            },
            success: function(response) {
                if(response.result) {
                    alert("Success!")
                    location.reload()
                } else {
                    alert("Wrong password!")
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError)
                alert("Error changing timers.")
            }
        })
    } else {
        alert("Please fill starting and ending time.")
    }
})

$('#submit_filltime').click(function() {
    if($('#fillTime').val() != '') {
        var password = prompt("This action requires password authentication. ");
        $.ajax({
            url: "/setfill",
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            data: {
                'pw': password,
                'fillTime': $('#fillTime').val(),
            },
            success: function(response) {
                if(response.result) {
                    alert("Success!")
                    location.reload()
                } else {
                    alert("Wrong password!")
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError)
                alert("Error changing fill time.")
            }
        })
    } else {
        alert("Fill time field is empty.")
    }
})

$('#get_noiseaverage').click(function() {
    document.getElementById('noiseAverageChart').toBlob(function(blob) {
        saveAs(blob, "noiseAverageChart.png");
    })
})

$('#get_noiseaverageweek').click(function() {
    document.getElementById('noiseAverageWeekChart').toBlob(function(blob) {
        saveAs(blob, "noiseAverageWeekChart.png");
    })
})

function setupCharts() {

    // noise average day
    $.ajax({
        url: "/getnoiseaverage",
        type: "get",
        success: function(response) {
            var ctx = document.getElementById("noiseAverageChart").getContext("2d");
            var noiseAverageChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets : [{
                        data: response.result,
                        borderColor: 'rgb(255, 191, 0)',
                        backgroundColor: 'rgb(255, 191, 0, 0.1)',
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: 150
                            }
                        }]
                    },
                    tooltips: { 
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var d = new Date(tooltipItem.xLabel);
                                return days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + ": " + tooltipItem.yLabel;
                            },
                        }
                    }
                }
            })
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError)
            alert("Error retrieving noise average data.")
        }
    })


    // noise average week day
    $.ajax({
        url: "/getnoiseaverageweek",
        type: "get",
        success: function(response) {
            var ctx = document.getElementById("noiseAverageWeekChart").getContext("2d");
            var noiseAverageWeekChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    datasets : [{
                        fill: true,
                        backgroundColor: [
                            '#2ecc71',
                            '#3498db',
                            '#9b59b6',
                            '#f1c40f',
                            '#e67e22',
                            '#e74c3c',
                            '#1abc9c'
                        ],
                        data: response.result,
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: false,
                }
            })
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError)
            alert("Error retrieving noise average week data.")
        }
    })
}

function generateDownload(data) {
    var url = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
    console.log(url);
    window.open(url);
}