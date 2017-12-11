/*
* @Author: claireyyli
* @Date:   2017-12-02 15:43:32
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-10 17:20:25
*/
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Extent",
    "esri/core/watchUtils",
    "esri/views/2d/draw/Draw",
    "esri/Graphic",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "../js/util/drawPoint.js",
    "../js/util/drawPolyline.js",
    "../js/util/drawPolygon.js",
    "../js/util/drawLayer.js",
    "../js/util/util.js",
    "dojo/domReady!"
], function(Map, MapView, Extent, watchUtils, Draw, Graphic, Polyline, Polygon, GraphicsLayer, FeatureLayer, drawPoint, drawPolyline, drawPolygon, drawLayer, util) {
    var map = new Map({
        basemap: "osm"
    });

    var serverPoint = JSON.parse(document.getElementById('point').dataset.point);
    var serverLine = JSON.parse(document.getElementById('line').dataset.line);
    var serverPolygon = JSON.parse(document.getElementById('polygon').dataset.polygon);
    var serverLayer = JSON.parse(document.getElementById('layer').dataset.layer);

    window.CLIENT.clientExtentObj = JSON.parse(document.getElementById('extent').dataset.extent);

    var view = new MapView({
        container: "viewContainer",
        map: map,
        extent: window.CLIENT.clientExtentObj,
        padding: {
          right: 350
        }
    });

    var mapSocket = new MapSocket();
    var graphicsLayer = new GraphicsLayer();
    window.CLIENT.featureLayerArr = [];
    window.CLIENT.featureLayerUrlArr = [];

    map.add(graphicsLayer);

    view.ui.add("draw-point", "top-left");
    view.ui.add("line-button", "top-left");
    view.ui.add("draw-polygon", "top-left");
    view.ui.add("draw-layer", "top-left");
    view.ui.add("draw-redo", "top-left");
    view.ui.add("layer-service", "bottom-left");

    view.then(function(evt) {
        var draw = new Draw({
            view: view
        });

        util.mapExecFunction(serverPoint, drawPoint.createPointGraphic, view, graphicsLayer, Graphic);
        util.mapExecFunction(serverLine, drawPolyline.createLineGraphic, view, Draw, Graphic, Polyline, graphicsLayer);
        util.mapExecFunction(serverPolygon, drawPolygon.drawPolygon, view, Graphic, Polygon, graphicsLayer);
        util.mapExecFunction(serverLayer, drawLayer.createLayer, map, FeatureLayer);

        var drawPointButton = document.getElementById("draw-point");
        var drawLineButton = document.getElementById("line-button");
        var drawPolygonButton = document.getElementById("draw-polygon");
        var drawLayerButton = document.getElementById("draw-layer");
        var drawRedoButton = document.getElementById("draw-redo");
        var outputMessages = document.getElementById("outputMessages");
        var inputMessage = document.getElementById("inputMessage");
        var sendMessage = document.getElementById("sendMessage");
        var currentUsersNum = document.getElementById("currentUsersNum");
        var currentUsersInfo = document.getElementById("currentUsersInfo");

        mapSocket.updateExtent(view, Extent);
        mapSocket.updateChantInfo(outputMessages, util.displayMessage);
        mapSocket.updateUserInfo(currentUsersInfo, currentUsersNum, util.displayMessageOneLine);

        window.SOCKET.emit('client user change', document.getElementsByTagName('h1')[0].innerHTML);

        sendMessage.addEventListener("click", function(){
            var userName = document.getElementsByTagName('h1')[0].innerHTML;
            var message = inputMessage.value;
            var info = "<br> <span> " + userName + "</span> : " + message;
            util.displayMessage(outputMessages, info);
            window.SOCKET.emit('client chat change', info);
        });

        drawLineButton.addEventListener("click", function() {
            //graphicsLayer.graphics.removeAll();
                        
            drawPolyline.enableCreateLine(draw, view, Draw, Graphic, Polyline, graphicsLayer);
        });
        drawPolygonButton.addEventListener("click", function() {
            //graphicsLayer.graphics.removeAll();
            drawPolygon.enableCreatePolygon(draw, view, Graphic, Polygon, graphicsLayer);
        });
        drawPointButton.addEventListener("click", function(){
            //graphicsLayer.graphics.removeAll();
            
            drawPoint.enableCreatePoint(draw, view, graphicsLayer, Graphic);
            
        });
        drawLayerButton.addEventListener("click", function(){
            drawLayer.createLayer(null, map, FeatureLayer);
        });
        drawRedoButton.addEventListener("click", function(){
            view.graphics.removeAll();
            graphicsLayer.graphics.removeAll();
            window.CLIENT.featureLayerArr && map.removeMany(window.CLIENT.featureLayerArr);
            window.CLIENT.featureLayerArr = [];
            window.CLIENT.featureLayerUrlArr = [];
            window.SOCKET.emit('client point change', JSON.stringify([]) );
            window.SOCKET.emit('client line change', JSON.stringify([]) );
            window.SOCKET.emit('client polygon change', JSON.stringify([]) );
            window.SOCKET.emit('client layer change', JSON.stringify({}) );
            window.SOCKET.emit('client data clear');
        });
        
    });
    
    watchUtils.whenTrue(view, "stationary", function() {
        if (view.extent) {
            window.SOCKET.emit('client extent change', JSON.stringify(view.extent) );
        }
    });
    map.allLayers.on("change", function(e){
        mapSocket.updateLine(Graphic, view, graphicsLayer);
        mapSocket.updatePolygon(Graphic, Polygon, view, graphicsLayer);
        mapSocket.updatePoint(Graphic, view, graphicsLayer);
        mapSocket.updateLayer(map, FeatureLayer);
    });
    
});