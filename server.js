var express = require('express'),
	config = require('./server/configure'),
	cors = require('cors'),
	https = require('https'),
	fs = require('fs'),
	app = express(),
	mongoose = require('mongoose');

mongoose.connect('mongodb://nodetechnoplasmsengine:ThUk73rDeS@ds031892.mongolab.com:31892/technoplasms_db');
//mongoose.connect('mongodb://localhost:27017/mongotest');
mongoose.connection.on('open',function() {
	console.log('Mongoose connected.');
});

var options = {
    key: fs.readFileSync('./ssl/privateKey.key'),
    cert: fs.readFileSync('./ssl/certificate.crt'),
};

app.use(cors());
app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app = config(app);

var server = app.listen(app.get('port'),function() {
	console.log('server up: http://localhost:' + app.get('port'));
});

/*var httpsServer = https.createServer(options, app).listen(433, function() {
	console.log('server up: https://localhost:' + 433);
});*/
