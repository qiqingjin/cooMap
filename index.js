/*
* @Author: claireyyli
* @Date:   2017-12-02 12:57:50
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 18:15:03
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

  socket.on('client line change', function(clientLineMsg){
    var serverLineMsg = fs.readFileSync('./public/data/line.json');
      if( clientLineMsg !== serverLineMsg ){
        fs.writeFileSync( './public/data/line.json', clientLineMsg );
        console.log('---------write line----');
        socket.broadcast.emit('server line change', clientLineMsg);
      }
  });

  socket.on('client polygon change', function(clientPolygonMsg){
    var serverPolygonMsg = fs.readFileSync('./public/data/polygon.json');
      if( clientPolygonMsg !== serverPolygonMsg ){
        fs.writeFileSync( './public/data/polygon.json', clientPolygonMsg );
        console.log('---------write polygon----');
        socket.broadcast.emit('server polygon change', clientPolygonMsg);
      }
  });

  socket.on('client point change', function(clientPointMsg){
    var serverPointMsg = fs.readFileSync('./public/data/point.json');
      if( clientPointMsg !== serverPointMsg ){
        fs.writeFileSync( './public/data/point.json', clientPointMsg );
        console.log('---------write point----');
        socket.broadcast.emit('server point change', clientPointMsg);
      }
  });

  socket.on('client layer change', function(clientLayerMsg){
    var serverLayerMsg = fs.readFileSync('./public/data/layer.json');
      if( clientLayerMsg !== serverLayerMsg ){
        fs.writeFileSync( './public/data/layer.json', clientLayerMsg );
        console.log('---------write layer----', serverLayerMsg, clientLayerMsg);
        socket.broadcast.emit('server layer change', clientLayerMsg);
      }
  });

});