/*
* @Author: claireyyli
* @Date:   2017-12-04 16:49:35
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-06 23:49:53
*/
define(function(){
    
    function enableCreateLine(draw, view, Draw, Graphic, Polyline, layer) {
        var action = draw.create("polyline");

        //view.focus();

        action.on("vertex-add", function(evt){
            updateVertices(evt.vertices, view, Draw, Graphic, Polyline, layer);
        });

        //action.on("vertex-remove", updateVertices);

        //action.on("cursor-update", createLineGraphic);

        action.on("draw-complete", function(evt){
            updateVertices(evt.vertices, view, Draw, Graphic, Polyline, layer);
        });

    }
    function updateVertices(vertices, view, Draw, Graphic, Polyline, layer) {
        
        createLineGraphic(vertices, view, Draw, Graphic, Polyline, layer);

        window.SOCKET.emit('client line change', JSON.stringify(vertices) );
        
    }

    function createLineGraphic(vertices, view, Draw, Graphic, Polyline, layer) {
        
        //layer.graphics.removeAll();

        var graphic = new Graphic({
            geometry: new Polyline({
                    paths: vertices,
                    spatialReference: view.spatialReference
                }),
            symbol: {
                type: "simple-line",
                color: [138, 43, 226],
                width: 2,
                cap: "round",
                join: "round"
            }
        });


        layer.graphics.add(graphic);
    }
    return {
        enableCreateLine: enableCreateLine,
        createLineGraphic: createLineGraphic
    }
});