/*
* @Author: claireyyli
* @Date:   2017-12-02 15:43:32
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 16:56:26
*/
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
	var curExtent = JSON.parse(document.getElementById('extent').dataset.extent);
	console.log('extent', curExtent);
	var view = new MapView({
		container: "viewContainer",
		map: map,
		extent: curExtent
	});
    watchUtils.whenTrue(view, "stationary", function() {
        if (view.extent) {
          	//console.log('post new extent');
          	fetch('/extent/change', {
          		method: 'POST',
          		headers: {
			        'Content-Type': 'application/json'
			    },
          		body: JSON.stringify(view.extent)
          	}).then(function(res){
          		//console.log(res.text());
          	});
          	/*var ws = new WebSocket(window.location.href);
			ws.onmessage=function(e){  
				console.log('_message');
				console.log(e.data);
			};
			ws.onerror=function(err){  
				console.log('_error');
				console.log(err);
			};
			ws.onopen=function(){  
				console.log('_connect')  
			};
			ws.onclose=function(){  
				console.log('_close');
			};

			ws.send(JSON.stringify(view.extent));*/
        }
    });
});