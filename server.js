var express = require('express');
var path = require('path');
var conf = require('./conf');

var RouteEncode = require('./route-encode');
var RouteForm = require('./route-form');

var bodyParser = require('body-parser');

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY){
  throw new Error('required environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
}

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var cbkRoute = function(res, err, data) {
  if (err){
    res.status(500);
    res.json(err.message);
    return;
  }

  res.json(data);
};

var routeForm = new RouteForm(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
app.get('/api/calc-form-params', function (req, res) {

  routeForm.run(cbkRoute.bind(null, res));

});

var routeEncode = new RouteEncode(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
app.post('/api/encode-to-mp3', function(req, res){
  // name - source baseFileName (without a path)
  if (!req.body) {
    res.status(400);
    res.json("required: params");
    return;
  }

  var baseFileName = req.body.name;
  var kbps = req.body.kbps;

  if (!baseFileName || !kbps) {
    res.status(400);
    res.json("required: name and kbps");
    return;
  }
  
  routeEncode.encode(baseFileName, kbps, cbkRoute.bind(null, res));
});

app.get('/api/read-job', function(req, res){
  if (!req.query) {
    res.status(400);
    res.json("required: query");
    return;
  }

  var jobId = req.query.id;
  if (!jobId) {
    res.status(400);
    res.json("required: id");
    return;
  }

  routeEncode.readJob(jobId, cbkRoute.bind(null, res));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res) {
  res.status(404).json('Page not Found');
});

app.listen(conf.port, function () {
  console.log('Example app listening on port ' + conf.port);
});
