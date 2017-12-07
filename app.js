/*
* @Author: claireyyli
* @Date:   2017-12-02 12:57:50
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-07 16:00:54
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

var pointArr = JSON.parse(fs.readFileSync('./data/point.json'));
var lineArr = JSON.parse(fs.readFileSync('./data/line.json'));
var polygonArr = JSON.parse(fs.readFileSync('./data/polygon.json'));
var layerArr = JSON.parse(fs.readFileSync('./data/layer.json'));

io.sockets.on('connection', function(socket) {
    console.log('-----------connect');
   
    var serverExtentMsg = '';
    var serverLineMsg = '';
    var serverPolygonMsg = '';
    var serverPointMsg = '';
    var serverLayerMsg = '';

    socket.on('client extent change', function(clientExtentMsg){
        serverExtentMsg = fs.readFileSync('./data/extent.json');
        if( clientExtentMsg !== serverExtentMsg ){
            fs.writeFileSync( './data/extent.json', clientExtentMsg );
            socket.broadcast.emit('server extent change', clientExtentMsg);
        }
    });

    socket.on('client line change', function(clientLineMsg){
        console.log('client line change');
        //var serverLineMsg = fs.readFileSync('./data/line.json');
        if(clientLineMsg !== '[]' && clientLineMsg.length > 0){
            lineArr = JSON.parse(fs.readFileSync('./data/line.json'));
            var lineExit = false;
            for(key in lineArr){
                if(JSON.stringify(lineArr[key]).replace(/ /g,'') === clientLineMsg.replace(/ /g,'')){
                    lineExit = true;
                    break;
                }
            }
            !lineExit && lineArr.push(JSON.parse(clientLineMsg));
            !lineExit && fs.writeFileSync( './data/line.json', JSON.stringify(lineArr) );
        }else{
            lineArr = [];
            fs.writeFileSync( './data/line.json', '[]' );
        }
        if( clientLineMsg !== serverLineMsg ){
            serverLineMsg = clientLineMsg;
            socket.broadcast.emit('server line change', clientLineMsg);
        }
    });

    socket.on('client polygon change', function(clientPolygonMsg){
        //var serverPolygonMsg = fs.readFileSync('./data/polygon.json');
        if(clientPolygonMsg !== '[]' && clientPolygonMsg.length > 0){
            polygonArr = JSON.parse(fs.readFileSync('./data/polygon.json'));
            var polygonExit = false;
            for(key in polygonArr){
                if(JSON.stringify(polygonArr[key]).replace(/ /g,'') === clientPolygonMsg.replace(/ /g,'')){
                    polygonExit = true;
                    break;
                }
            }
            !polygonExit && polygonArr.push(JSON.parse(clientPolygonMsg));
            !polygonExit && fs.writeFileSync( './data/polygon.json', JSON.stringify(polygonArr) );
        }else{
            polygonArr = [];
            fs.writeFileSync( './data/polygon.json', '[]' );
        }
        if( clientPolygonMsg !== serverPolygonMsg ){
            serverPolygonMsg = clientPolygonMsg;
            socket.broadcast.emit('server polygon change', clientPolygonMsg);
        }
    });

    socket.on('client point change', function(clientPointMsg){
        console.log('client point change');
        //var serverPointMsg = fs.readFileSync('./data/point.json');
        if(clientPointMsg !== '[]' && clientPointMsg.length > 0){
            pointArr = JSON.parse(fs.readFileSync('./data/point.json'));
            var pointExit = false;
            for(key in pointArr){
                if(JSON.stringify(pointArr[key]).replace(/ /g,'') === clientPointMsg.replace(/ /g,'')){
                    pointExit = true;
                    break;
                }
            }
            !pointExit && pointArr.push(JSON.parse(clientPointMsg));
            !pointExit && fs.writeFileSync( './data/point.json', JSON.stringify(pointArr) );
        }else{
            console.log('point is clear');
            pointArr = [];
            fs.writeFileSync( './data/point.json', '[]' );
        }
        if( clientPointMsg !== serverPointMsg ){
            serverPointMsg = clientPointMsg;
            socket.broadcast.emit('server point change', clientPointMsg);
        }
    });

    socket.on('client layer change', function(clientLayerMsg){
        console.log('client layer change');
        //var serverLayerMsg = fs.readFileSync('./data/layer.json');
        if(clientLayerMsg !== '{}' && clientLayerMsg.length > 0){
            layerArr = JSON.parse(fs.readFileSync('./data/layer.json'));
            var layerExit = false;
            for(key in layerArr){
                if(layerArr[key].replace(/ /g,'') === JSON.parse(clientLayerMsg).url.replace(/ /g,'')){
                    layerExit = true;
                    break;
                }
            }
            !layerExit && layerArr.push(JSON.parse(clientLayerMsg).url);
            !layerExit && fs.writeFileSync( './data/layer.json', JSON.stringify(layerArr) );
        }else{
            console.log('layer is clear');
            layerArr = [];
            fs.writeFileSync( './data/layer.json', '[]' );
        }

        serverLayerMsg = clientLayerMsg;
        socket.broadcast.emit('server layer change', clientLayerMsg);

    });

    socket.on('client data clear', function(){
        console.log('----------clear');
        lineArr = [];
        polygonArr = [];
        pointArr = [];
        layerArr = [];
        fs.writeFileSync( './data/line.json', '[]' );
        fs.writeFileSync( './data/polygon.json', '[]' );
        fs.writeFileSync( './data/point.json', '[]' );
        fs.writeFileSync( './data/layer.json', '[]' );
    })

    socket.on('disconnect', function(){
        console.log('------------disconnect');
        console.log('-----pointArr', pointArr);
        console.log('------layerArr', layerArr);

        lineArr.length > 0 && fs.writeFileSync( './data/line.json', JSON.stringify(lineArr) );
        polygonArr.length > 0 && fs.writeFileSync( './data/polygon.json', JSON.stringify(polygonArr) );
        pointArr.length > 0 && fs.writeFileSync( './data/point.json', JSON.stringify(pointArr) );
        layerArr.length > 0 && fs.writeFileSync( './data/layer.json', JSON.stringify(layerArr) );
    });

});