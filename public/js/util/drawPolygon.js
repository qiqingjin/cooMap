/*
* @Author: claireyyli
* @Date:   2017-12-04 16:53:12
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-07 11:58:49
*/
define(function(){
    
    function enableCreatePolygon(draw, view, Graphic, Polygon, layer) {
        var action = draw.create("polygon");

        //view.focus();

        action.on("vertex-add", function(evt){
            updatePolygon(evt.vertices, view, Graphic, Polygon, layer);
        });

        //action.on("cursor-update", drawPolygon);

        //action.on("vertex-remove", drawPolygon);

        action.on("draw-complete", function(evt){
            drawPolygon(evt.vertices, view, Graphic, Polygon, layer)
        });
    
    }
    function updatePolygon(vertices, view, Graphic, Polygon, layer){

        window.SOCKET.emit('client polygon change', JSON.stringify(vertices) );
        
        drawPolygon(vertices, view, Graphic, Polygon, layer);
    }
    function drawPolygon(vertices, view, Graphic, Polygon, layer) {

        //layer.graphics.removeAll();
        var polygon = createPolygon(vertices, Polygon, view);
        var graphic = createPolygonGraphic(polygon, Graphic);
        
        layer.graphics.add(graphic);
    }

    function createPolygon(vertices, Polygon, view) {
        return new Polygon({
          rings: vertices,
          spatialReference: view.spatialReference
        });
    }

    function createPolygonGraphic(polygon, Graphic) {
        graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill",
            color: [138, 43, 226],
            style: "solid",
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          }
        });
        return graphic;
    }

    return {
        enableCreatePolygon: enableCreatePolygon,
        drawPolygon: drawPolygon
    }
});
