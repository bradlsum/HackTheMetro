/*Written By: Sumner J Bradley*/

/*Required modules*/
var http = require('http');
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var fs = require("fs");
var html = fs.readFileSync('HackMetro.html');

/*Varriables*/
const hostname = '';
const port = 3000;

/*Settings for getting rtd data*/
var requestSettings = {
  method: 'GET',
  // 'http://www.rtd-denver.com/google_sync/VehiclePosition.pb'
  // 'http://www.rtd-denver.com/google_sync/TripUpdate.pb'
  url: 'http://www.rtd-denver.com/google_sync/VehiclePosition.pb',
  encoding: null,
  'auth' : {
    'user' : 'RTDgtfsRT',
    'pass' : 'realT!m3Feed',
    'sendImediatley' : false
  }
};

// Server is running
console.log('running');

var server = http.createServer(function(req, res) {

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);

});
/*Listening to this port*/
server.listen(3001);

/*Create server to parse data*/
var server = http.createServer(function(req, res) {

  /*Get rtd*/
  request(requestSettings, function (error, response, body) {
    console.log(response.statusCode);
    
    if (!error && response.statusCode == 200) {
      /*Decode body into data*/
      var feed = GtfsRealtimeBindings.FeedMessage.decode(body);

      /*Prompt length*/
      console.log("Parse Complete, " + feed.entity.length + " entries found.");

      /*Convert into JSON*/
      var data = JSON.stringify(feed);

      /*Test that data is recieved*/
      //console.log(data);

      /*Formate and write response*/
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'text/JSON',
        'Access-Control-Allow-Origin': '*' });
      res.statusCode = 200;
      res.write(JSON.stringify(feed));
      res.end();

      /*Display that the response was sent*/
      console.log("Response sent!");
    }
  });
});
/*Listening to this port*/
server.listen(3000);