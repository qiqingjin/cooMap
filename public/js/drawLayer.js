/*
* @Author: claireyyli
* @Date:   2017-12-05 16:21:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-06 08:23:21
*/
function createLayer(map, FeatureLayer){
	console.log('=====draw feature layer');
	var featureLayer = null;
	
	var layerService = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
	featureLayer = new FeatureLayer({
      url: layerService
    });
	window.SOCKET.emit('client layer change', JSON.stringify({url:layerService}) );

    map.add(featureLayer);
    return featureLayer;
}