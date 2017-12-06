/*
* @Author: claireyyli
* @Date:   2017-12-04 16:53:12
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-06 08:30:12
*/
function enableCreatePolygon(draw, view, Graphic, Polygon, geometryEngine, layer) {
    var action = draw.create("polygon");

    view.focus();

    action.on("vertex-add", updatePolygon);

    action.on("cursor-update", drawPolygon);

    action.on("vertex-remove", drawPolygon);

    action.on("draw-complete", drawPolygon);

	function updatePolygon(evt){

		window.SOCKET.emit('client polygon change', JSON.stringify(evt.vertices) );
		
		drawPolygon(evt);
	}
	function drawPolygon(evt) {
	    var vertices = evt.vertices;

	    layer.graphics.removeAll();

	    var polygon = createPolygon(vertices);

	    var graphic = createPolygonGraphic(polygon);
	    layer.graphics.add(graphic);
	}

	function createPolygon(vertices) {
	    return new Polygon({
	      rings: vertices,
	      spatialReference: view.spatialReference
	    });
	}

	function createPolygonGraphic(polygon) {
	    graphic = new Graphic({
	      geometry: polygon,
	      symbol: {
	        type: "simple-fill",
	        color: [138, 43, 226, 0.8],
	        style: "solid",
	        outline: {
	          color: [255, 255, 255],
	          width: 2
	        }
	      }
	    });
	    return graphic;
	}
}
