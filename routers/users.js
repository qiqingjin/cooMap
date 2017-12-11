/*
* @Author: claireyyli
* @Date:   2017-12-02 13:16:06
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-10 17:10:02
*/
var express = require("express");
var router = express.Router();
var fs = require('fs');
var defaultExtent = {"xmin":-9177811,"ymin":4247000,"xmax":-9176791,"ymax":4247784,"spatialReference":{"wkid":102100}};

router.get("/:name", function(req, res){
	var extent = fs.readFileSync('./data/extent.json') || defaultExtent;
    var line = fs.readFileSync('./data/line.json');
    var point = fs.readFileSync('./data/point.json');
    var polygon = fs.readFileSync('./data/polygon.json');
    var layer = fs.readFileSync('./data/layer.json');
    var num = parseInt(JSON.parse(fs.readFileSync('./data/chat.json')).num);

    res.render("users",{
        name: req.params.name,
        extent: extent,
        line: line,
        point: point,
        polygon: polygon,
        layer: layer,
        num: num
    });
})

module.exports = router;