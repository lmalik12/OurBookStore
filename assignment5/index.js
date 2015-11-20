var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '../index.html'));
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var products;
app.get('/products', function(request, response) {
  // TODO: fetch products from database

  // response.header("Access-Control-Allow-Origin", "*");
  // response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // var option = getRandomInt(0,5);
  // if (option < 4) {
  //  products =  
  //   response.json(products);
  // } else if (option == 4) {
  //   response.status(500).send("An error occurred, please try again");
  // }
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});


MongoClient.connect(url, function(err, db) {
  // Initialize database with 3 collections : 'products', 'users', 'orders'

  if (err) { 
    return console.log("Unable to connect to MongoDB server. Error: " + err); 
  } else {
    console.log("Connected correctly to server.");

    db.createCollection('products', {strict:true}, function(err, collection){
      if (err) {

      } else {

      }
    });
    
    db.createCollection('users', {strict:true}, function(err, collection){
      if (err) {

      } else {
        
      }
    });
    
    db.createCollection('orders', {strict:true}, function(err, collection){
      if (err) {

      } else {
        
      }
    });

    // 'products' collection design 1
    var products = [    
    {    
        'KeyboardCombo' : {
          price : 40,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/KeyboardCombo.png'
        }
      },
      {
        'Mice' : {
          price : 20,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Mice.png'
        }
      },
      {      
        'PC1' : {
          price : 350,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/PC1.png'
        }
      },
      {
        'PC2' : {
          price : 400,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/PC2.png'
        }
      },
      {      
        'PC3' : {
          price : 300,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/PC3.png'
        }
      },
      {
        'Tent' : {
          price : 100,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Tent.png'
        }
      },
      {      
        'Box1' : {
          price : 10,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Box1.png'
        }
      },
      {
        'Box2' : {
          price : 5,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Box2.png'
        }
      },
      {
        'Clothes1' : {
          price : 20,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Clothes1.png'
        }
      },
      {
        'Clothes2' : {
          price : 30,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Clothes2.png'
        }
      },
      {      
        'Jeans' : {
          price : 50,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Jeans.png'
        }
      },
      {
        'Keyboard' : {
          price : 20,
          quantity : 20,
          url : 'https://cpen400a.herokuapp.com/images/Keyboard.png'
        }
       }];

    // 'products' collection design 2
    // var products = [
    //   {name:'KeyboardCombo', price:40, quantity:20, image:'https://cpen400a.herokuapp.com/images/KeyboardCombo.png'},
    //   {name:'Mice', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Mice.png'},
    //   {name:'PC1', price:350, quantity:20, image:'https://cpen400a.herokuapp.com/images/PC1.png'},
    //   {name:'PC2', price:400, quantity:20, image:'https://cpen400a.herokuapp.com/images/PC2.png'},
    //   {name:'Tent', price:100, quantity:20, image:'https://cpen400a.herokuapp.com/images/tent.png'},
    //   {name:'Box1', price:10, quantity:20, image:'https://cpen400a.herokuapp.com/images/Box1.png'},
    //   {name:'Box2', price:5, quantity:20, image:'https://cpen400a.herokuapp.com/images/Box2.png'},
    //   {name:'Clothes1', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Clothes1.png'},
    //   {name:'Clothes2', price:30, quantity:20, image:'https://cpen400a.herokuapp.com/images/Clothes2.png'},
    //   {name:'Jeans', price:20, quantity:20, image:'https://cpen400a.herokuapp.com/images/Jeans.png'},
    //   {name:'Keyboard', price:30, quantity:20, image:'https://cpen400a.herokuapp.com/images/Keyboard.png'}
    // ];

    // inserting documents into 'products' collection
    var collection = db.collection('products');
    collection.insert(products, {w:1}, function(err, result) {
      if (err) { 
        console.log(err)
      } else {
        console.log("Inserted %d documents into the 'products' collection. ", result.length);
      }
      db.close();
    });
  }
});