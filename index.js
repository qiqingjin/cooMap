/*
* @Author: claireyyli
* @Date:   2017-12-02 12:57:50
* @Last Modified by:   claireyyli
* @Last Modified time: 2017-12-02 16:28:58
*/
const path = require("path");

const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const app = express();

const indexRouter = require("./routers/index");
const usersRouter = require("./routers/users");

app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("view engine", "ejs")
   .use("/",indexRouter)
   .use("/users", usersRouter)
   .listen(666, "127.0.0.1", function(){
   		console.log('Server is ready, on port 666');
   });