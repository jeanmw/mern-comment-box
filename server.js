'use strict'

//import dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Comment = require('./model/comments');

//create instances
var app = express(),
    router = express.Router();

// set port to env or 3000
var port = process.env.PORT || 3001;

//db config
mongoose.connect('mongodb://heroku_317rnljh:33687in0tsp8aqj2rbf9k1ijsr@ds147520.mlab.com:47520/heroku_317rnljh');

//config API to use bodyParser and look for JSON in req.body
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//Prevent CORS errors
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //Remove caching
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//set route path and init API
router.get('/', function(req,res) {
  res.json({message: 'API Initialized!'});
});

// delete all comments
router.route('/nuke').get(function(req,res){
  Comment.remove(function(err,succ){
  res.json(succ);
  });
});

//add /comments route to our /api router
router.route('/comments')
  // GET index
  .get(function(req,res) {
    //get all comments
    Comment.find(function(err, comments){
      if(err){ res.send(err)}
      // send comments
      res.json(comments);
    });
  })
  .post(function(req, res) {
    var comment = new Comment();
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if(err){res.send(err)}
      res.json({ message: 'Comment successfully added!'});
    });
  });

router.route('/comments/:comment_id')
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment){
      if(err){res.send(err)}
      (req.body.author) ? comment.author = req.body.author : null;
      (req.body.text) ? comment.text = req.body.text : null;

      comment.save(function(err) {
        if(err){res.send(err)}
        res.json({message: 'Comment has been updated'});
      });
    });
  })
  .delete(function(req, res){
    Comment.remove({_id: req.params.comment_id}, function(err, comment){
      if(err){res.send(err)}
      res.json({ message: 'Comment has been deleted' })
    })
  });

//use router config when we call /API
app.use('/api', router);

//start server
app.listen(process.env.PORT, function() {
  console.log(`api running on port ${port}`);
});
