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
})

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