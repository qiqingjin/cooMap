/*
* @Author: claireyyli
* @Date:   2017-12-02 15:43:32
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 19:31:22
*/
window.onload = function(){
	window.SOCKET = window.SOCKET || io();
	require([
		"esri/Map",
		"esri/views/MapView",
	    "esri/geometry/Extent",
	    "esri/core/watchUtils",
      	"esri/views/2d/draw/Draw",
      	"esri/Graphic",
      	"esri/geometry/Polyline",
      	"esri/geometry/Polygon",
     	"esri/geometry/geometryEngine",
     	"esri/layers/GraphicsLayer",
     	"esri/layers/FeatureLayer",
		"dojo/domReady!"
	], function(Map, MapView, Extent, watchUtils, Draw, Graphic, Polyline, Polygon, geometryEngine, GraphicsLayer, FeatureLayer) {
		var map = new Map({
			basemap: "streets"
		});
		window.CLIENT.clientExtentObj = JSON.parse(document.getElementById('extent').dataset.extent);
		var view = new MapView({
			container: "viewContainer",
			map: map,
			extent: window.CLIENT.clientExtentObj
		});
		var mapSocket = new MapSocket();
		var graphicsLayer = new GraphicsLayer({graphics: []});
		var featureLayerDraw = null;
		var featureLayerOther = null;
		var featureLayer = null;
		graphicsLayer.graphics.add(new Graphic({}));

		view.ui.add("line-button", "top-left");
		view.ui.add("draw-polygon", "top-left");
		view.ui.add("draw-point", "top-left");
		view.ui.add("draw-layer", "top-left");
		view.ui.add("draw-redo", "top-left");

		view.then(function(evt) {
	        var draw = new Draw({
	          	view: view
	        });
	        var drawLineButton = document.getElementById("line-button");
	        var drawPolygonButton = document.getElementById("draw-polygon");
	        var drawRedoButton = document.getElementById("draw-redo");
	        var drawPointButton = document.getElementById("draw-point");
	        var drawLayerButton = document.getElementById("draw-layer");

			mapSocket.updateExtent(view, Extent);

	        drawLineButton.addEventListener("click", function() {
	        	graphicsLayer.graphics.removeAll();
	        	window.SOCKET.emit('client line change', JSON.stringify([]) );         	
	          	enableCreateLine(draw, view, Draw, Graphic, Polyline, geometryEngine, graphicsLayer);
	          	map.add(graphicsLayer);
	        });
	        drawPolygonButton.addEventListener("click", function() {
	        	graphicsLayer.graphics.removeAll();
	        	window.SOCKET.emit('client polygon change', JSON.stringify([]) );
	          	enableCreatePolygon(draw, view, Graphic, Polygon, geometryEngine, graphicsLayer);
	          	map.add(graphicsLayer);
	        });
	        drawRedoButton.addEventListener("click", function(){
	          	view.graphics.removeAll();
	          	graphicsLayer.graphics.removeAll();
	          	featureLayer && map.remove(featureLayer);
	          	window.SOCKET.emit('client layer change', JSON.stringify({}) );
	        });
	        drawPointButton.addEventListener("click", function(){
	        	graphicsLayer.graphics.removeAll();
	        	window.SOCKET.emit('client point change', JSON.stringify([]) );
	        	enableCreatePoint(draw, view, graphicsLayer, Graphic);
	        	map.add(graphicsLayer);
	        });
	        drawLayerButton.addEventListener("click", function(){
	        	featureLayer = createLayer(map, featureLayer, FeatureLayer);
	        });
	    });
	    
	    watchUtils.whenTrue(view, "stationary", function() {
	        if (view.extent) {
	          	window.SOCKET.emit('client extent change', JSON.stringify(view.extent) );
	        }
	    });
	    map.allLayers.on("change", function(e){
	    	mapSocket.updateLine(Graphic, view);
	    	mapSocket.updatePolygon(Graphic, Polygon, view);
	    	mapSocket.updatePoint(Graphic, view);
	    	featureLayer = mapSocket.updateLayer(map, featureLayer, FeatureLayer);
	    });
		
	});
}