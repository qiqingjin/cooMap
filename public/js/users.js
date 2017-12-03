/*
* @Author: claireyyli
* @Date:   2017-12-02 15:43:32
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 15:52:44
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
        }
    });
});