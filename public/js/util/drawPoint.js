/*
* @Author: claireyyli
* @Date:   2017-12-05 11:22:55
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-10 17:36:38
*/

define(function(){
    function enableCreatePoint(draw, view, layer, Graphic) {
        var action = draw.create("point");

        /*action.on("cursor-update", function (evt) {
            layer.graphics.removeMany(layer.graphics.splice(layer.graphics.length -1, 1));
            createPointGraphic(evt.coordinates, view, layer, Graphic);
        });*/

        action.on("draw-complete", function (evt) {
            createPointGraphic(evt.coordinates, view, layer, Graphic);
        });
    }
    function createPointGraphic(coordinates, view, layer, Graphic){

        window.SOCKET.emit('client point change', JSON.stringify(coordinates) );

        var point = {
            type: "point",
            x: coordinates[0],
            y: coordinates[1],
            spatialReference: view.spatialReference
        };

        var graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          style: "round",
          color: [138, 43, 226],
          size: "16px",
          outline: {
            color: [255, 255, 255],
            width: 1
          }
        }
        });
      layer.graphics.add(graphic);
    }
    return {
        enableCreatePoint: enableCreatePoint,
        createPointGraphic: createPointGraphic
    }
});