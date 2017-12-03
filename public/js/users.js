/*
* @Author: claireyyli
* @Date:   2017-12-02 15:43:32
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 23:33:33
*/
window.onload = function(){
	window.SOCKET = window.SOCKET || io();
	require([
		"esri/Map",
		"esri/views/MapView",
	    "esri/geometry/Extent",
	    "esri/core/watchUtils", 
		"dojo/domReady!"
	], function(Map, MapView, Extent, watchUtils) {
		var map = new Map({
			basemap: "hybrid"
		});
		var clientExtentObj = JSON.parse(document.getElementById('extent').dataset.extent);
		var view = new MapView({
			container: "viewContainer",
			map: map,
			extent: clientExtentObj
		});
		window.SOCKET.on('server extent change', function(serverExtentMsg){
      		var serverExtentObj = JSON.parse(serverExtentMsg);
      		var clientExtentMsg = JSON.stringify(clientExtentObj);
      		if(serverExtentMsg !== clientExtentMsg){
      			view.extent = new Extent(serverExtentObj);
      			clientExtentObj = serverExtentObj;
      		}
      	});
	    watchUtils.whenTrue(view, "stationary", function() {
	        if (view.extent) {
	          	window.SOCKET.emit('client extent change', JSON.stringify(view.extent) );
	        }
	    });
	});
}