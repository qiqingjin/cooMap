/*
* @Author: claireyyli
* @Date:   2017-12-03 18:37:55
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 19:09:54
*/
window.SOCKET = window.SOCKET || io();

function MapSocket(){}

MapSocket.prototype.updateExtent = function(view, Extent){
	window.SOCKET.on('server extent change', function(serverExtentMsg){
		var serverExtentObj = JSON.parse(serverExtentMsg);
		var clientExtentMsg = JSON.stringify(window.CLIENT.clientExtentObj);
		if(serverExtentMsg !== clientExtentMsg){
			view.extent = new Extent(serverExtentObj);
			window.CLIENT.clientExtentObj = serverExtentObj;
		}
	});
};

MapSocket.prototype.updateLine = function(Graphic, view){
	console.log('--------updateLine');
	window.SOCKET.on('server line change', function(serverLineMsg){
		var serverLineObj = JSON.parse(serverLineMsg);
		var clientLineMsg = JSON.stringify(window.CLIENT.clientLineObj);
		if(serverLineMsg !== clientLineMsg){
			view.graphics.removeAll();
			createPolylineGraphic(serverLineObj, Graphic, view);
			window.CLIENT.clientLineObj = serverLineObj;
		}
	});
};

MapSocket.prototype.updatePolygon = function(Graphic, Polygon, view){
	console.log('--------updatePolygon');
	window.SOCKET.on('server polygon change', function(serverPolygonMsg){
		var serverPolygonObj = JSON.parse(serverPolygonMsg);
		var clientPolygonMsg = JSON.stringify(window.CLIENT.clientPolygonObj);
		if(serverPolygonMsg !== clientPolygonMsg){
			console.log('-------server polygon change');
			view.graphics.removeAll();
			createPolygonGraphic(serverPolygonObj, Graphic, Polygon, view);
			window.CLIENT.clientPolygonObj = serverPolygonObj;
		}
	});
}

MapSocket.prototype.updatePoint = function(Graphic, view){
	console.log('--------updatePolygon');
	window.SOCKET.on('server point change', function(serverPointMsg){
		var serverPointObj = JSON.parse(serverPointMsg);
		var clientPointMsg = JSON.stringify(window.CLIENT.clientPointObj);
		if(serverPointMsg !== clientPointMsg){
			console.log('-------server point change');
			view.graphics.removeAll();
			createPointGraphic(serverPointObj, Graphic, view);
			window.CLIENT.clientPointObj = serverPointObj;
		}
	});
}

MapSocket.prototype.updateLayer = function(map, layer, FeatureLayer){
	console.log('--------updateLayer');
	var featureLayer = layer || null;
	window.SOCKET.on('server layer change', function(serverLayerMsg){
		var serverLayerObj = JSON.parse(serverLayerMsg);
		var clientLayerMsg = JSON.stringify(window.CLIENT.clientLayerObj);
		
		if(serverLayerMsg !== clientLayerMsg && serverLayerObj.url && !featureLayer){
			featureLayer = new FeatureLayer({
		      	url: serverLayerObj.url
		    });
		    map.add(featureLayer);
		    window.CLIENT.clientLayerObj = serverLayerObj;
		}else{
			map.remove(featureLayer);
		}

	});
	return featureLayer;
}

function createPolylineGraphic(vertices, Graphic, view){
	view.graphics.removeAll();
	var polyline = {
	type: "polyline", // autocasts as Polyline
	paths: vertices,
	spatialReference: view.spatialReference
	};

	var graphic = new Graphic({
	geometry: polyline,
	symbol: {
	  type: "simple-line", // autocasts as SimpleLineSymbol
	  color: [255, 99, 71],
	  width: 2,
	  cap: "round",
	  join: "round"
	}
	});
	view.graphics.add(graphic);
}

function createPolygonGraphic(vertices, Graphic, Polygon, view){
	var polygon = new Polygon({
      	rings: vertices,
      	spatialReference: view.spatialReference
    });
	var graphic = new Graphic({
      geometry: polygon,
      	symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: [255, 99, 71, 0.8],
        style: "solid",
        outline: { // autocasts as SimpleLineSymbol
          color: [255, 255, 255],
          width: 2
        }
      }
    });
	view.graphics.add(graphic);
}

function createPointGraphic(coordinates, Graphic, view){
	var point = {
	    type: "point", // autocasts as /Point
	    x: coordinates[0],
	    y: coordinates[1],
	    spatialReference: view.spatialReference
	};

	var graphic = new Graphic({
	    geometry: point,
	    symbol: {
	      type: "simple-marker", // autocasts as SimpleMarkerSymbol
	      style: "round",
	      color: [255, 215, 0],
	      size: "16px",
	      outline: { // autocasts as SimpleLineSymbol
	        color: [255, 255, 255],
	        width: 1
	      }
	    }
	});
	view.graphics.add(graphic);
}