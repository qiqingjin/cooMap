/*
* @Author: claireyyli
* @Date:   2017-12-02 13:16:06
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 15:58:56
*/
const express = require("express");
const router = express.Router();
const fs = require('fs');
const defaultExtent = '{}';

router.get("/:name", function(req, res){
	const extent = JSON.parse(fs.readFileSync('./public/data/extent.json')) || defaultExtent;
	console.log('========extent read========', extent);
    res.render("users",{
        name: req.params.name,
        extent: JSON.stringify(extent)
    });
})

module.exports = router;