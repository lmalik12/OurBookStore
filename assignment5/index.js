var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var MongoClient = require('mongodb').MongoClient;
var db;
var url = 'mongodb://localhost:27017/collection';

// Initialize connection once
  MongoClient.connect(url, function(err, database) { 

    if(err){ 
      throw err;
      console.log("Error cannot connect to Mongo Client");
    } else {
      db = database;

      // populate tables with data
      populateTables(db, function(){ });

      console.log("Connected correctly to server.");
    }
  }); 

app.get('/products', function(request, response) {
  console.log("HEY KELLY");

  var products = db.collection('products');
  var cursor = products.find().toArray(function (err, data){
               response.json(data);
        });
}); 

var populateTables = function(){
  var collection = db.collection('products');
  collection.count(function (err, count) {
      if (!err && count === 0) { // if collection is empty, populate db with the following collections

           db.createCollection('products', {strict:true}, function(err, collection){
              if (err) {
                console.log("products collection error" + err);
              };
            });
    
          db.createCollection('users', {strict:true}, function(err, collection){
            if (err) {
              console.log("users collection error" + err);
            } 
          });
          
          db.createCollection('orders', {strict:true}, function(err, collection){
            if (err) {
              console.log("orders collection error" + err);
            } 
          });

             var p = [
      {name:'KeyboardCombo', price:40, quantity:20, image:'https://cpen400a.herokuapp.com/images/KeyboardCombo.png'},
      {name:'Mice', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Mice.png'},
      {name:'PC1', price:350, quantity:20, image:'https://cpen400a.herokuapp.com/images/PC1.png'},
      {name:'PC2', price:400, quantity:20, image:'https://cpen400a.herokuapp.com/images/PC2.png'},
      {name:'PC3', price:450, quantity:20, image:'https://cpen400a.herokuapp.com/images/PC3.png'},
      {name:'Tent', price:100, quantity:20, image:'https://cpen400a.herokuapp.com/images/tent.png'},
      {name:'Box1', price:10, quantity:20, image:'https://cpen400a.herokuapp.com/images/Box1.png'},
      {name:'Box2', price:5, quantity:20, image:'https://cpen400a.herokuapp.com/images/Box2.png'},
      {name:'Clothes1', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Clothes1.png'},
      {name:'Clothes2', price:30, quantity:20, image:'https://cpen400a.herokuapp.com/images/Clothes2.png'},
      {name:'Jeans', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Jeans.png'},
      {name:'Keyboard', price:30, quantity:20, image:'https://cpen400a.herokuapp.com/images/Keyboard.png'}
    ];  

        collection.insert(p, {w:1}, function(err, result) {
          if (err){ 
            console.log(" problem inserting into collection" + err); 
          }else {
            console.log("Inserted %d documents into the 'products' collection. ", result.length);
          }
        });
      }
    });
}; 

var getData = function(db, callback){
     
}
 // Start the application after the database connection is ready
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

   