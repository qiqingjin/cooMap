/*
* @Author: claireyyli
* @Date:   2017-12-02 13:16:06
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-02 15:46:10
*/
const express = require("express");
const router = express.Router();

router.get("/", function(req, res){
    res.render("index/index",{
    	
    });
})

module.exports = router;