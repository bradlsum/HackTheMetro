var http = require('http');
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

const hostname = '';
const port = 3000;

var requestSettings = {
  method: 'GET',
  // 'http://www.rtd-denver.com/google_sync/VehiclePosition.pb'
  // 'http://www.rtd-denver.com/google_sync/TripUpdate.pb'
  url: 'http://www.rtd-denver.com/google_sync/TripUpdate.pb',
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
  res.writeHead(200);

  request(requestSettings, function (error, response, body) {
    console.log(response.statusCode);
    
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
      feed.entity.forEach(function(entity) {
        if (entity.trip_update) {
          console.log(entity.trip_update);
        }
      });
      res.end(feed.FeedMessage);
    }
  });

});
server.listen(8080);