/*
This is main file which will contain all of our endpoints.
Once we have enough endpoints defined we start breaking them into modules for better code readability
*/

// Importing all the required libraries
var express = require('express');
var bodyParser = require('body-parser'); //body parser to parse the request body
var db = require('./db.js'); //this file contains the knex file import. it's equal to knex=require('knex')
var app = express();


// Importing models from the models directory
var Articles = require('./models/article.js');
var Topics = require('./models/topic.js');


// Using the body parser middleware to parse request body
app.use(bodyParser());


app.get('/api',function(req,res){
  // this is just a sample endpoint I build to see if things are working
  res.send("Hey! You're looking at the matterwiki API");
});


app.post('/new/topic',function(req,res){
  /*
  This endpoint takes the topic name and topic description from the request body.
  It then saves those values in the database using the insert query.
  */
  db('topics').insert({name: req.body.name, description: req.body.description}).then( function (result) {
      res.json({ success: true, message: 'ok' });     // responds back to request
   })
});



app.post('/new/article',function(req,res){
  /*
  This endpoint takes the article title, article body, and topic id from the request body.
  It then saves those values in the database using the insert query.
  After the operation is complete the endpoint returns the success object.
  TODO: create formal guidelines for different object structures and follow that throughout the API.
  */
  db('articles').insert({title: req.body.title, body: req.body.body, topic_id: req.body.topic_id}).then( function (result) {
      res.json({ success: true, message: 'ok' });     // responds back to request
   })
});

app.get('/articles',function(req,res){
  /*
  This is a GET endpoint that responds with the list of all the articles in the articles table
  the articles are present in the data object in the returning object.
  the error key in the returning object is a boolen which is false if there is no error and true otherwise
  */
  Articles.forge()
  .fetchAll()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

app.get('/topic/:id/articles',function(req,res){
  /*
  This is a GET endpoint that responds with the list of all the articles that belong to a particular topic (topic of given id param)
  the articles are present in the data object in the returning object.
  the error key in the returning object is a boolen which is false if there is no error and true otherwise
  */
  Topics.where({id: req.params.id}).fetch({withRelated: ['articles']}).then(function(topic) {
    res.status(200).json(topic.related('articles'));
  });
});

app.use(express.static(__dirname + '/client'));

app.listen(5000 || process.env.PORT, function(){
  console.log("The magic is happening on port 5000");
});
