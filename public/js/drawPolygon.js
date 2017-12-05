/*
* @Author: claireyyli
* @Date:   2017-12-04 16:53:12
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 08:07:43
*/
function enableCreatePolygon(draw, view, Graphic, Polygon, geometryEngine, layer) {
    // create() will return a reference to an instance of PolygonDrawAction
    var action = draw.create("polygon");

    // focus the view to activate keyboard shortcuts for drawing polygons
    view.focus();

    // listen to vertex-add event on the action
    action.on("vertex-add", updatePolygon);

    // listen to cursor-update event on the action
    action.on("cursor-update", drawPolygon);

    // listen to vertex-remove event on the action
    action.on("vertex-remove", drawPolygon);

    // *******************************************
    // listen to draw-complete event on the action
    // *******************************************
    action.on("draw-complete", drawPolygon);

    // this function is called from the polygon draw action events
	// to provide a visual feedback to users as they are drawing a polygon
	function updatePolygon(evt){

		debounce(function(evt){
			window.SOCKET.emit('client polygon change', JSON.stringify(evt.vertices) );
		}, 200);
		
		drawPolygon(evt);
	}
	function drawPolygon(evt) {
	    var vertices = evt.vertices;

	    //remove existing graphic
	    layer.graphics.removeAll();

	    // create a new polygon
	    var polygon = createPolygon(vertices);

	    // create a new graphic representing the polygon, add it to the view
	    var graphic = createPolygonGraphic(polygon);
	    layer.graphics.add(graphic);

	    // calculate the area of the polygon
	    var area = geometryEngine.geodesicArea(polygon, "acres");
	    if (area < 0) {
	      // simplify the polygon if needed and calculate the area again
	      var simplifiedPolygon = geometryEngine.simplify(polygon);
	      if (simplifiedPolygon) {
	        area = geometryEngine.geodesicArea(simplifiedPolygon, "acres");
	      }
	    }
	    // start displaying the area of the polygon
	    labelAreas(polygon, area);
	}

	// create a polygon using the provided vertices
	function createPolygon(vertices) {
	    return new Polygon({
	      rings: vertices,
	      spatialReference: view.spatialReference
	    });
	}

	// create a new graphic representing the polygon that is being drawn on the view
	function createPolygonGraphic(polygon) {
	    graphic = new Graphic({
	      geometry: polygon,
	      symbol: {
	        type: "simple-fill", // autocasts as SimpleFillSymbol
	        color: [138, 43, 226, 0.8],
	        style: "solid",
	        outline: { // autocasts as SimpleLineSymbol
	          color: [255, 255, 255],
	          width: 2
	        }
	      }
	    });
	    return graphic;
	}

	//Label polyon with its area
	function labelAreas(geom, area) {
	    var graphic = new Graphic({
	      geometry: geom.centroid,
	      symbol: {
	        type: "text",
	        color: "white",
	        haloColor: "black",
	        haloSize: "1px",
	        text: area.toFixed(2) + " acres",
	        xoffset: 3,
	        yoffset: 3,
	        font: { // autocast as Font
	          size: 14,
	          family: "sans-serif"
	        }
	      }
	    });
	    layer.graphics.add(graphic);
	}
}

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}