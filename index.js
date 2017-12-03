/*
* @Author: claireyyli
* @Date:   2017-12-02 12:57:50
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-03 15:18:17
*/
// dependencies
const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
//const multer = require('multer');
const app = express();

// routers
const indexRouter = require("./routers/index");
const usersRouter = require("./routers/users");
const changeExtentRouter = require("./routers/changeExtent");

app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs")
   .use("/",indexRouter)
   .use("/users", usersRouter)
   .use("/extent", changeExtentRouter)
   .listen(666, "127.0.0.1", function(){
   		console.log('Server is ready, on port 666');
   });