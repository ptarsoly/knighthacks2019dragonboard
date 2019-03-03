var bodyParser = require('body-parser');
var express = require('express');
var SerialPort = require('serialport');
var childProcess = require('child_process');
var fs = require('fs');
var FormData = require('form-data');
const ngrok = require('ngrok');




var app = express();

var ffmpegParams = ['ffmpeg', '-i', '/dev/video0', '-frames', '1', './output.jpg']

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(req.path);
    console.log(req.query);
    next();
});

// var sensorPort = new SerialPort('/dev/ttyACM0', {
//     baudRate: 115200
// });

// var motorPort = new SerialPort('/dev/ttyACM1', {
//     baudRate: 115200
// });


//0 = empty
//1 = analyzing trash
//2 = discarding trash

var trashState = 0;

app.listen(3001);

app.post('/dispose', (req, res) => {
    if (req.body.class.includes("landfill")) {
        motorPort.write('g\n', () => {
            console.log("trash disposed");
            res.send(JSON.stringify({
                "return": "trash disposed"
            }));
        })
    }
    else if (req.body.class.includes("recycle")) {
        motorPort.write('r\n', () => {
            console.log("item recycled");
            res.send(JSON.stringify({
                "return": "item recycled"
            }));
        })
    }
})


sensorPort.on('readable', async function () {
    var str = await sensorPort.read().toString();
    if (str.includes("trash detected")) {

        //run ffmpeg
        childProcess.spawnSync('ffmpeg', ffmpegParams);

        //send image to ML
        var formData = {
            file: fs.createReadStream('output.jpg')
        };
        request.post({ url: '<YourUrl>', formData: formData }, (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log('Upload successful!  Server responded with:', body);
        });
    }
});