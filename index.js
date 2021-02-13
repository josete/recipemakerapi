var path = require("path");
var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var options = process.argv.slice(2);

app.post("/recipe", function (req, res,next) {
    var date = new Date(Date.now());
    var dateString = date.getFullYear()+"-"+("0" + date.getMonth()).slice(-2)+"-"+("0" + date.getDay()).slice(-2);
    var fileName = dateString+"-"+req.body.receta.title;
    var recipeText = "--- \nlayout: post \ntitle: \""+req.body.receta.title+"\" \ndate: "+dateString+"\ncategories: "+req.body.receta.category+"\ningredientes: \n";
    req.body.receta.ingredientes.forEach(ingredient => {
        recipeText += ingredient+"\n";
    });
    recipeText+="pasos: \n";
    req.body.receta.pasos.forEach(paso => {
        recipeText += paso+"\n";
    });
    recipeText += "---";
    if (options.length == 0){
        fs.writeFileSync(fileName+".md",recipeText);
    }else{
        fs.writeFileSync(path.join(options[0],fileName+".md"),recipeText);
    }
    res.sendStatus(200);    
});

app.listen(3001);