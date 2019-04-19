navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
    
    navigator.getUserMedia({
        audio: true
      },
      function(stream) {
        streamFunction(stream)
    },
    function(err) {
        console.log("The following error occured: " + err.name);
    });
} else {
    console.log("getUserMedia not supported");
}