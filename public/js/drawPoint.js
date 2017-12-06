/*
* @Author: claireyyli
* @Date:   2017-12-05 11:22:55
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-06 08:30:17
*/
function enableCreatePoint(draw, view, layer, Graphic) {
	var action = draw.create("point");

	action.on("cursor-update", function (evt) {
		createPointGraphic(evt.coordinates);
	});

	action.on("draw-complete", function (evt) {
		createPointGraphic(evt.coordinates);
	});

	function createPointGraphic(coordinates){
		layer.graphics.removeAll();

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
		  color: [255, 106, 106],
		  size: "16px",
		  outline: {
		    color: [255, 255, 0],
		    width: 1
		  }
		}
		});
	  layer.graphics.add(graphic);
	}
}

