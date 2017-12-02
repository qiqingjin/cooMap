/*
* @Author: claireyyli
* @Date:   2017-12-02 13:16:06
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-02 15:52:21
*/
const express = require("express");
const router = express.Router();

router.get("/:name", function(req, res){
    res.render("users/users",{
        name: req.params.name,
        id: req.query.id
    });
})

module.exports = router;