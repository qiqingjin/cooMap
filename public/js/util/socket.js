/*
* @Author: claireyyli
* @Date:   2017-12-03 18:37:55
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-07 20:53:43
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

MapSocket.prototype.updateLine = function(Graphic, view, graphicsLayer){
	//console.log('--------updateLine');
	window.SOCKET.on('server line change', function(serverLineMsg){
		var serverLineObj = JSON.parse(serverLineMsg);
		var clientLineMsg = JSON.stringify(window.CLIENT.clientLineObj);
		if(serverLineObj.length > 0 && clientLineMsg !== serverLineMsg){
			//view.graphics.removeAll();
			createPolylineGraphic(serverLineObj, Graphic, view);
			//window.CLIENT.clientLineObj = window.CLIENT.clientLineObj ? window.CLIENT.clientLineObj.push(serverLineObj) : [serverLineObj];
		}else{
			view.graphics.removeAll();
			graphicsLayer.graphics.removeAll();
		}
	});
};

MapSocket.prototype.updatePolygon = function(Graphic, Polygon, view, graphicsLayer){
	//console.log('--------updatePolygon');
	window.SOCKET.on('server polygon change', function(serverPolygonMsg){
		var serverPolygonObj = JSON.parse(serverPolygonMsg);
		var clientPolygonMsg = JSON.stringify(window.CLIENT.clientPolygonObj);
		if(serverPolygonObj.length > 0 && clientPolygonMsg !== serverPolygonMsg){
			//console.log('-------server polygon change');
			//view.graphics.removeAll();
			createPolygonGraphic(serverPolygonObj, Graphic, Polygon, view);
			//window.CLIENT.clientPolygonObj = window.CLIENT.clientPolygonObj ? window.CLIENT.clientPolygonObj.push(serverPolygonObj) : [serverPolygonObj];
		}else{
			view.graphics.removeAll();
			graphicsLayer.graphics.removeAll();
		}
	});
}

MapSocket.prototype.updatePoint = function(Graphic, view, graphicsLayer){
	//console.log('--------updatePolygon');
	window.SOCKET.on('server point change', function(serverPointMsg){
		var serverPointObj = JSON.parse(serverPointMsg);
		var clientPointMsg = JSON.stringify(window.CLIENT.clientPointObj);
		if(serverPointObj.length > 0 && clientPointMsg !== serverPointMsg){
			//console.log('-------server point change');
			//view.graphics.removeAll();
			createPointGraphic(serverPointObj, Graphic, view);
			//window.CLIENT.clientPointObj = window.CLIENT.clientPointObj ? window.CLIENT.clientPointObj.push(serverPointObj) : [serverPointObj];
		}else{
			view.graphics.removeAll();
			graphicsLayer.graphics.removeAll();
		}
	});
}

MapSocket.prototype.updateLayer = function(map, FeatureLayer){
	//console.log('--------updateLayer');
	var featureLayer =  null;
	window.SOCKET.on('server layer change', function(serverLayerMsg){
		var serverLayerObj = JSON.parse(serverLayerMsg);
		var exitLayer = false;

		for(key in window.CLIENT.featureLayerUrlArr){
			if(window.CLIENT.featureLayerUrlArr[key] === serverLayerObj.url){
				exitLayer = true;
				break;
			}
		}

		if(exitLayer){
			return ;
		}
		
		if(serverLayerObj.url){
			featureLayer = new FeatureLayer({
		      	url: serverLayerObj.url
		    });
		    map.add(featureLayer);

		    window.CLIENT.featureLayerArr.push(featureLayer);
		    window.CLIENT.featureLayerUrlArr.push(serverLayerObj.url);
		}else{
			window.CLIENT.featureLayerArr && map.removeMany(window.CLIENT.featureLayerArr);
			window.CLIENT.featureLayerArr = [];
            window.CLIENT.featureLayerUrlArr = [];
		}

	});

}

MapSocket.prototype.updateChantInfo = function(container, func){
	window.SOCKET.on('server chat change', function(serverChantMsg){
		func(container, serverChantMsg);
	});
}

MapSocket.prototype.updateUserInfo = function(currentUsersInfo, currentUsersNum, func){
	window.SOCKET.on('server user change', function(userInfo){
		//console.log('====server user change=', userInfo);
		var userName = userInfo.split('.')[0];
		var userNum = userInfo.split('.')[1];
		var numInfo = "online users: <span> " + userNum + "</span> !";
		
		func(currentUsersNum, numInfo);

		var info = "<span> " + userName + "</span> log in !" ;
		if(window.CLIENT.userNum > userNum){
			info = "<span> " + userName + "</span> log off !" ;
		}
		currentUsersInfo.style.display = 'block';
		func(currentUsersInfo, info);

		window.CLIENT.userNum = userNum;

		setTimeout(function(){
			currentUsersInfo.style.display = 'none';
		}, 10000);
	});
}

function createPolylineGraphic(vertices, Graphic, view){
	//view.graphics.removeAll();
	var polyline = {
	type: "polyline", // autocasts as Polyline
	paths: vertices,
	spatialReference: view.spatialReference
	};

	var graphic = new Graphic({
	geometry: polyline,
	symbol: {
	  type: "simple-line", // autocasts as SimpleLineSymbol
	  color: [138, 43, 226],
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
        color: [138, 43, 226],
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
	      color: [138, 43, 226],
	      size: "16px",
	      outline: { // autocasts as SimpleLineSymbol
	        color: [255, 255, 255],
	        width: 1
	      }
	    }
	});
	view.graphics.add(graphic);
}