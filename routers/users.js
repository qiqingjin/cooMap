/*
* @Author: claireyyli
* @Date:   2017-12-02 13:16:06
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-05 05:28:10
*/
var express = require("express");
var router = express.Router();
var fs = require('fs');
var defaultExtent = {"extent":{"xmin":-9176063.047064926,"ymin":4245763.007332374,"xmax":-9175182.826911155,"ymax":4246624.118229077,"spatialReference":{"wkid":102100}},"eid":0};

router.get("/:name", function(req, res){
	var extent = JSON.parse(fs.readFileSync('./public/data/extent.json')) || defaultExtent;
	console.log('========read extent========', extent);
    res.render("users",{
        name: req.params.name,
        extent: JSON.stringify(extent)
    });
})

module.exports = router;