/*
* @Author: claireyyli
* @Date:   2017-12-02 12:57:50
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 23:34:52
*/
// dependencies
var path = require("path");
var express = require("express");
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var http = require('http');
var app = express();
var fs = require('fs');

app.set('port', process.env.PORT || 666);

var server = http.createServer(app);
var io = socket.listen(server);

// routers
var indexRouter = require("./routers/index");
var usersRouter = require("./routers/users");

app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs")
   .use("/",indexRouter)
   .use("/users", usersRouter);
server.listen(app.get('port'), function(){
	console.log('Server is ready, on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
	console.log('66666 sockets connect');

	socket.on('client extent change', function(clientExtentMsg){
		var serverExtentMsg = fs.readFileSync('./public/data/extent.json');
    	if( clientExtentMsg !== serverExtentMsg ){
    		fs.writeFileSync( './public/data/extent.json', clientExtentMsg );
    		console.log('---------write extent----', clientExtentMsg);
    		socket.broadcast.emit('server extent change', clientExtentMsg);
    	}
	});
});