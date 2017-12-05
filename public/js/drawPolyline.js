/*
* @Author: claireyyli
* @Date:   2017-12-04 16:49:35
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 05:23:35
*/
function enableCreateLine(draw, view, Draw, Graphic, Polyline, geometryEngine, layer) {
    // creates and returns an instance of PolyLineDrawAction 
    var action = draw.create("polyline");

    // focus the view to activate keyboard shortcuts for sketching
    view.focus();

    // listen to vertex-add event on the polyline draw action
    action.on("vertex-add", updateVertices);

    // listen to vertex-remove event on the polyline draw action
    action.on("vertex-remove", updateVertices);

    // listen to cursor-update event on the polyline draw action
    action.on("cursor-update", createLineGraphic);

    // listen to draw-complete event on the polyline draw action
    action.on("draw-complete", updateVertices);

  // This function is called from the "vertex-add" and "vertex-remove"
  // events. Checks if the last vertex is making the line intersect itself.
	function updateVertices(evt) {
	    // create a polyline from returned vertices
	    var result = createLineGraphic(evt);

	    window.SOCKET.emit('client line change', JSON.stringify(evt.vertices) );
	    // if the last vertex is making the line intersects itself,
	    // prevent "vertex-add" or "vertex-remove" from firing
	    if (result.selfIntersects) {
	      evt.preventDefault();
	    }
	}

	// create a new graphic presenting the polyline that is being drawn on the view
	function createLineGraphic(evt) {
	    var vertices = evt.vertices;
	    layer.graphics.removeAll();

	    // a graphic representing the polyline that is being drawn
	    var graphic = new Graphic({
	      	geometry: new Polyline({
	        		paths: vertices,
	        		spatialReference: view.spatialReference
	    		}),
	      	symbol: {
	        	type: "simple-line", // autocasts as new SimpleFillSymbol
	        	color: [138, 43, 226],
	        	width: 2,
	        	cap: "round",
	        	join: "round"
	     	}
	    });

	    // check the polyline intersects itself.
	    var intersectingFeature = getIntersectingFeature(graphic.geometry);

	    // Add a new graphic for the intersecting segment.
	    if (intersectingFeature) {
	      layer.graphics.addMany([graphic, intersectingFeature]);
	    }
	    // Just add the graphic representing the polyline if no intersection
	    else {
	      layer.graphics.add(graphic);
	    }

	    // return the graphic and intersectingSegment
	    return {
	      graphic: graphic,
	      selfIntersects: intersectingFeature
	    }
	}

	// function that checks if the line intersects itself
	function isSelfIntersecting(polyline) {
	    if (polyline.paths[0].length < 3) {
	      return false
	    }
	    var line = polyline.clone();

	    //get the last segment from the polyline that is being drawn
	    var lastSegment = getLastSegment(polyline);
	    line.removePoint(0, line.paths[0].length - 1);

	    // returns true if the line intersects itself, false otherwise
	    return geometryEngine.crosses(lastSegment, line);
	  }

	  // Checks if the line intersects itself. If yes, changes the last 
	  // segment's symbol giving a visual feedback to the user.
	  function getIntersectingFeature(polyline) {
	    if (isSelfIntersecting(polyline)) {
	      return new Graphic({
	        geometry: getLastSegment(polyline),
	        symbol: {
	          type: "simple-line", // autocasts as new SimpleLineSymbol
	          style: "short-dot",
	          width: 3.5,
	          color: "yellow"
	        }
	      });
	    }
	    return null;
	}

	// Get the last segment of the polyline that is being drawn
	function getLastSegment(polyline) {
	    var line = polyline.clone();
	    var lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
	    var existingLineFinalPoint = line.getPoint(0, line.paths[0].length -
	      1);

	    return new Polyline({
	      spatialReference: view.spatialReference,
	      hasZ: false,
	      paths: [
	        [
	          [existingLineFinalPoint.x, existingLineFinalPoint.y],
	          [lastXYPoint.x, lastXYPoint.y]
	        ]
	      ]
	    });
	}

}