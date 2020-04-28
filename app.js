//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
var path = require("path");

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({ extended: false }))
// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initialising connection string
var dbConfig = {
    user:  "emladmin",
    password: "emladmin!",
    server: "10.24.0.155",
    database: "EMLDB"
};

//Function to connect to database and execute query
var executeQuery = function(req, res){             
    sql.connect(dbConfig, function (err) {
        if (err) {   
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
          // create Request object
          var request = new sql.Request();
          // query to the database
          request.query(req, function (err, response) {
            if (err) {
              console.log("Error while querying database :- " + err);
              res.send(err);
              }
              else {
                res.send(response);
              }
          });
        }
    });           
}

var category;
app.post("/category", function (req, res) {
  category = req.body.category.toString();
  res.send(category);
});

//GET ALL ACTIVE USERS FOR PATHWAYS
app.post("/users", function(req, res){
  var sort = req.body.sort.toString();
  var query = "select t1.*, t2.review from dbo.StoreListTable t1 join dbo.ReviewTable t2 on t1.name = t2.name"
                    + " and t1.address = t2.address and t1.menu = t2.menu where t1."
                    + category + " = 1 order by t2." + sort;
  console.log(query);
  executeQuery(query, res);
});

app.post("/index", function (req, res) {
  var name = req.body.name;
  var query = "select homepage from dbo.StoreListTable where name = '" + name + "'";
  console.log(query);
  executeQuery(query, res);
});

app.post("/review_update", function (req, res) {
  var name = req.body.name;
  var query = "update dbo.ReviewTable set review = review + 1 where name = '" + name + "'";
  console.log(query);
  executeQuery(query, res);
});

app.post("/review_get", function (req, res) {
  var name = req.body.name;
  var query = "select review from dbo.ReviewTable where name = '" + name + "'";
  console.log(query);
  executeQuery(query, res);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

/*//GET ONE USER
app.get("/users/:userid/", function(req, res){
  var query = "select * from LMS.dbo.Users where UserID = " + req.params.userid;
  executeQuery(query, res);
});*/

// //POST API
//  app.post("/api/user ", function(req , res){
//                 var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
//                 executeQuery (res, query);
// });

// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });

// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });
