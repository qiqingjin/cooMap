/*
* @Author: claireyyli
* @Date:   2017-12-05 16:21:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-07 13:23:12
*/
define(function(){
    function createLayer(layerInfo, map, FeatureLayer){
        console.log('=====draw feature layer');
        var featureLayer = null;
        var userLayerService = document.getElementById("layer-service").value;        
        var layerService = userLayerService || layerInfo || "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
        var exitLayer = false;

        for(key in window.CLIENT.featureLayerUrlArr){
            if(window.CLIENT.featureLayerUrlArr[key] === layerService){
                exitLayer = true;
                break;
            }
        }

        if(exitLayer){
            return ;
        }

        featureLayer = new FeatureLayer({
          url: layerService
        });
        window.SOCKET.emit('client layer change', JSON.stringify({url:layerService}) );

        map.add(featureLayer);
        window.CLIENT.featureLayerArr.push(featureLayer);
        window.CLIENT.featureLayerUrlArr.push(layerService);
    }

    return {
        createLayer: createLayer
    }
});