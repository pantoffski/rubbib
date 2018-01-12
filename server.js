babyshark2018require('dotenv').config();
//server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', (process.env.PORT || 5000));
var root = __dirname + '/public';
app.use(express.static('public'));
server.listen(app.get('port'), function () {
  console.log('listening to ' + process.env.PORT);
});
app.get('/mock/:tagId', function (req, res) {
  notiTag(req.params.tagId);
  res.send('ok');
});
//redis
const request = require('request');
const rubbibExpire = 1 * 24 * 60 * 60; // 1 day
const redis = require("redis");
redisClient = redis.createClient();
var lastUpdate = 0;
io.on('connection', function (client) {
  console.log('\n---io.on connection\n\n');
});
//init data on start up
redisClient.get('rubbib:lastUpdate', function (err, tStamp) {
  if (err) return false;
  if (typeof tStamp == 'undefined' || !tStamp) {
    redisClient.set('rubbib:lastUpdate', 0, 'EX', rubbibExpire);
  }
  lastUpdate = tStamp * 1;
  getNewData();
});

function notiTag(tagId) {
  //console.log('noti '+tagId);
  redisClient.get('rubbib:' + tagId, function (err, runner) {
    if (err) return false;
    if (typeof runner == 'undefined' || !runner) return false;
    runner = JSON.parse(runner);
    //console.log('emitting');
    io.emit('runner', {
      e: runner.e,
      name: runner.name,
      bibNo: runner.bibNo,
      bibName: runner.bibName,
      raceCat: runner.raceCat
    });
  });
}
var isGettingNewData = false;

function getNewData() {
  if (isGettingNewData) return;
  //console.log('https://babysharkicmm2018.herokuapp.com/apinaja/runners/' + lastUpdate);
  isGettingNewData = true;
  request.post({
    url: 'https://babysharkicmm2018.herokuapp.com/apinaja/runners/' + lastUpdate
  }, function (err, resp, body) {
    isGettingNewData = false;
    if (err || resp.statusCode != 200) return false;
    var data = JSON.parse(body);
    console.log(data);
    if (data.length > 0) lastUpdate = data[0].updatedAt;
    for (var i in data) {
      var runner = {
        e: data[i].e,
        bibNo: data[i].bibNo,
        bibName: data[i].bibName,
        name: data[i].name,
        raceCat: data[i].raceCat
      }
      redisClient.set('rubbib:' + data[i].tagId, JSON.stringify(runner), 'EX', rubbibExpire);
    }
    redisClient.set('rubbib:lastUpdate', lastUpdate, 'EX', rubbibExpire);
    //console.log(data);
    //console.log('getNewData');
  });
}
/***** yatta ******/
const matAddr = 0x01;
const portName = 'COM5';
var stay = 0x01;
var interval = 0x0;
var repeat = 0x02;
var rxBuff = [];
var lastBeat = new Date().getTime();
var beep = require('beepbeep');
var SerialPort = require('serialport');
var CronJob = require('cron').CronJob;
var port = new SerialPort(portName, {
  baudRate: 115200
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});
port.on('close', function (data) {
  beep(10);
});
port.on('data', function (data) {
  lastBeat = new Date().getTime();
  var cmd = [];
  for (var i = 0; i < data.length; i++) {
    rxBuff.push(data[i]);
  }
  while (rxBuff.length > 0 && rxBuff[0] != 0xA0) rxBuff.shift();
  while ((rxBuff[0] == 0xA0) && (rxBuff.length >= (rxBuff[1] + 2))) {
    cmd.push(rxBuff.splice(0, rxBuff[1] + 2));
  }
  for (var i in cmd) {
    var aCmd = cmd[i];
    if (chkSum(aCmd.slice(0, aCmd.length - 1)) == aCmd[aCmd.length - 1]) {
      if (aCmd.length==21) {
        var ant = aCmd[4] % 4;
        var tag = aCmd.splice(7, 12);
        //console.log(aCmd);
        //console.log('tag::', ant, new Buffer(tag).readUInt32BE(8));
        notiTag((new Buffer(tag).readUInt32BE(8)) % 3200);
      }
      if(aCmd.length==11){
        var tag;
        tag=('00'+aCmd[7].toString(16)).split('').splice(-2).join('');
        tag+=('00'+aCmd[8].toString(16)).split('').splice(-2).join('');
        tag=tag*1;
        notiTag(tag);
      }
      if (aCmd.length == 12) {
        writeFastSwitchCmd();
      }
    }
  }
});
writeFastSwitchCmd();
//e2 00 51 80 00 11 01 38 10 00 b5 82 ... 12 ตัว
function chkSum(inp) {
  return 256 + (~inp.reduce(function (total, num) {
    return total + num
  }) + 1) % 256;
}

function makeCmd(inp) {
  var tmp = [0xA0, inp.length + 2, matAddr, ...inp]
  tmp.push(chkSum(tmp));
  return new Buffer(tmp);
}

function writeFastSwitchCmd() {
  var fastSwitchCmd = makeCmd([0x8A, 0x00, stay, 0x01, stay, 0x02, stay, 0x03, stay, interval, repeat]);
  port.write(fastSwitchCmd, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
}
new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    var now = new Date().getTime();
    if ((now - lastBeat) > 3000) {
      beep();
      console.log(rxBuff.length);
      process.exit(1);
    }
  },
  start: true,
  timeZone: 'Asia/Bangkok',
  runOnInit: true
});
var newDataCron = new CronJob({
  cronTime: '0-59/10 * * * * *',
  onTick: function () {
    getNewData();
  },
  start: true,
  timeZone: 'Asia/Bangkok',
  runOnInit: false
});
