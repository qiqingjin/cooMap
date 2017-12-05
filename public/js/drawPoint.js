/*
* @Author: claireyyli
* @Date:   2017-12-05 11:22:55
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 13:30:18
*/
function enableCreatePoint(draw, view, layer, Graphic) {
	var action = draw.create("point");

	// PointDrawAction.cursor-update
	// Give a visual feedback to users as they move the pointer over the view
	action.on("cursor-update", function (evt) {
		createPointGraphic(evt.coordinates);
	});

	// PointDrawAction.draw-complete
	// Create a point when user clicks on the view or presses "C" key.
	action.on("draw-complete", function (evt) {
		createPointGraphic(evt.coordinates);
	});

	function createPointGraphic(coordinates){
		layer.graphics.removeAll();

		window.SOCKET.emit('client point change', JSON.stringify(coordinates) );

		var point = {
		type: "point", // autocasts as /Point
		x: coordinates[0],
		y: coordinates[1],
		spatialReference: view.spatialReference
		};

		var graphic = new Graphic({
		geometry: point,
		symbol: {
		  type: "simple-marker", // autocasts as SimpleMarkerSymbol
		  style: "round",
		  color: [255, 106, 106],
		  size: "16px",
		  outline: { // autocasts as SimpleLineSymbol
		    color: [255, 255, 0],
		    width: 1
		  }
		}
		});
	  layer.graphics.add(graphic);
	}
}

