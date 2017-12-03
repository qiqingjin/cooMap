/*
* @Author: claireyyli
* @Date:   2017-12-03 11:42:10
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 16:43:23
*/
const express = require("express");
const router = express.Router();
//const path = require("path");
const fs=require('fs');
//const JsonObj=JSON.parse(fs.readFileSync('./output.json'));
//console.log(JsonObj);

router.post("/change", function(req, res){
	try{
		fs.writeFileSync( './public/data/extent.json', JSON.stringify(req.body) );
		console.log('-----extent write----', req.body);
		res.send(true);
	}catch(err){
		console.log('-----extent write error----', err);
		res.send(false);
	}
});

module.exports = router;