/*
* @Author: claireyyli
* @Date:   2017-12-04 16:49:35
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-06 08:30:08
*/
function enableCreateLine(draw, view, Draw, Graphic, Polyline, geometryEngine, layer) {
    var action = draw.create("polyline");

    view.focus();

    action.on("vertex-add", updateVertices);

    action.on("vertex-remove", updateVertices);

    action.on("cursor-update", createLineGraphic);

    action.on("draw-complete", updateVertices);

	function updateVertices(evt) {
	    var result = createLineGraphic(evt);

	    window.SOCKET.emit('client line change', JSON.stringify(evt.vertices) );
	    
	    if (result.selfIntersects) {
	      	evt.preventDefault();
	    }
	}

	function createLineGraphic(evt) {
	    var vertices = evt.vertices;
	    layer.graphics.removeAll();

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

	    var intersectingFeature = getIntersectingFeature(graphic.geometry);

	    if (intersectingFeature) {
	      	layer.graphics.addMany([graphic, intersectingFeature]);
	    }
	    else {
	      	layer.graphics.add(graphic);
	    }

	    return {
	      	graphic: graphic,
	      	selfIntersects: intersectingFeature
	    }
	}

	function isSelfIntersecting(polyline) {
	    if (polyline.paths[0].length < 3) {
	      	return false
	    }
	    var line = polyline.clone();

	    var lastSegment = getLastSegment(polyline);
	    line.removePoint(0, line.paths[0].length - 1);

	    return geometryEngine.crosses(lastSegment, line);
	  }

	  function getIntersectingFeature(polyline) {
	    if (isSelfIntersecting(polyline)) {
	      return new Graphic({
	        geometry: getLastSegment(polyline),
	        symbol: {
	          	type: "simple-line",
	          	style: "short-dot",
	          	width: 3.5,
	          	color: "yellow"
	        }
	      });
	    }
	    return null;
	}

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