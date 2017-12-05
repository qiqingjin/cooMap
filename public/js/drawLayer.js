/*
* @Author: claireyyli
* @Date:   2017-12-05 16:21:07
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 19:13:28
*/
function createLayer(map, layer, FeatureLayer){
	console.log('=====draw feature layer');
	var featureLayer = layer || null;
	featureLayer && map.remove(featureLayer);
	
	var layerService = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
	featureLayer = new FeatureLayer({
      url: layerService
    });
	window.SOCKET.emit('client layer change', JSON.stringify({url:layerService}) );
    /*view.whenLayerView(featureLayer).then(function(lyrView){
		lyrView.watch("updating", function(val){
			console.log('------in watch updating----feature')
			if(!val){  // wait for the layer view to finish updating
			  	lyrView.queryFeatures().then(function(results){
			    	console.log('layer update', results);  // prints all the client-side graphics to the console
			  	});
			}
		});
	});*/

    map.add(featureLayer);
    return featureLayer;
}