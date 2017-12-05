/*
* @Author: claireyyli
* @Date:   2017-12-03 18:37:55
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 07:54:03
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
			createPolylineGraphic(serverLineObj, Graphic, view);
			window.CLIENT.clientLineObj = serverLineObj;
		}
	});
};

MapSocket.prototype.updatePolygon = function(Graphic, Polygon, view){
	console.log('--------updatePolygon');
	window.SOCKET.on('server polygon change', function(serverPolygonMsg){
		var serverPolygonObj = JSON.parse(serverPolygonMsg);
		var clientLineMsg = JSON.stringify(window.CLIENT.clientPolygonObj);
		if(serverPolygonMsg !== clientLineMsg){
			console.log('-------server polygon change');
			createPolygonGraphic(serverPolygonObj, Graphic, Polygon, view);
			window.CLIENT.clientPolygonObj = serverPolygonObj;
		}
	});
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
    });;
	var graphic = new Graphic({
      geometry: polygon,
      	symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: [255, 99, 71, 0.2],
        style: "solid",
        outline: { // autocasts as SimpleLineSymbol
          color: [255, 255, 255],
          width: 2
        }
      }
    });;
	view.graphics.add(graphic);
}