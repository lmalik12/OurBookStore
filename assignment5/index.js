var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); // support encoded bodies

var MongoClient = require('mongodb').MongoClient;
var db;
var url = 'mongodb://localhost:27017/collection';

// Initialize connection once
MongoClient.connect(url, function(err, database) { 
  if (err) throw err;
  else {
    
    db = database;
    console.log("Connected correctly to server.");
    
    db.createCollection('products', {strict:true}, function(err, collection){
      if (err) {
        console.log(err);
      } else console.log("Successfully created 'products' collection");
    });
    
    db.createCollection('users', {strict:true}, function(err, collection){
      if (err) {
        console.log(err);
      } else console.log("Successfully created 'users' collection");
    });
    
    db.createCollection('orders', {strict:true}, function(err, collection){
      if (err) {
        console.log(err);
      } else console.log("Successfully created 'orders' collection");
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

    var collection = db.collection('products');
    collection.count(function (err, count) {
      if (!err && count === 0) { // if 'products' collection is empty, populate db
        collection.insertMany(p, {w:1}, function(err, result) {
          if (err) console.log(err); 
          else {
            console.log("Inserted documents into the 'products' collection.");
          }
        });
      }
    });

    // Start the application after the database connection is ready
    app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'));
    });
  }
});

/* 
 * Load the main page (index.html) 
 */
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '../index.html'));
  ajaxRequest();
});

/*
 * /products endpoint
 * @param products: an object to store all the product information from the database 
 */
var products = {};
app.get('/products', function(request, response) {

  var temp = {};  // a temporary object to hold all the data from database, before passing the 'products' variable  
  var collection = db.collection('products');
  
  // @param cursor: cursor to point at each doc(document/data) in the 'products' collection
  // @param err: holds error log 
  // @param doc: holds the actual document/data in the 'products' collection
  var cursor = collection.find({}, {_id:0});
  cursor.each(function(err, doc) {  
    if (err) {                      
       console.log(err);

    } else if (doc) {
      // console.log(doc); 

      // @param key: holds the 'name' field
      // @param val: holds the 'price', 'quantity' and 'url' fields
      var key = doc.name;
      var val = {     
        price : doc.price,
        quantity : doc.quantity,
        url : doc.image
      };

      temp[key] = val; // store in the temp object as {key:val}. e.g: {'Box1': {price:20, quantity:20, url:'some url'}}
      //console.log(temp);

    } else {

      products = temp; // after reading all documents, pass it to 'products' object
      console.log(products);
    }
  }); 
  
  if (!Object.keys(products).length) { // if 'products' object is empty, send an error message 
    response.status(500).send("An error occurred, please try again"); 
  } else {
    response.json(products);  // else send a response
  }
});

/*
 * POST endpoint /checkout 
 */
app.post('/checkout', function(request, response) {
  
  //@param newCart: JSON string for cart object
  //@param newTotal: cart total
  var newCart = request.body.cart;
  var newTotal = request.body.total;
  // console.log("Cart items: " + JSON.stringify(newCart) + ", Total: " + newTotal);
  
  //@param newOrder: an object to store cart object and cart total
  var newOrder = { 
    cart: newCart,
    total: newTotal
  };
  // console.log(newOrder);

  // Stores the new order object in the 'orders' collection
  var orders = db.collection('orders');
  orders.insert(newOrder, function(err, data) {
    if (err) {
      console.log("Error inserting new order into 'orders' collection!");
    } else {
      console.log("Successfully inserted a new order into 'orders' collection");
    }
  });

  updateQuantity(newCart, function(){
    response.end("done");
  });
});

/* 
 * Updates product's quantity in the 'products' collection
 * @param cart: cart object
 */
var updateQuantity = function (cart, callback) {
 // console.log("What's in cart " + cart);
  
  for (key in cart) {                       // for each item in the cart,
    var prodName = key;                       //  get the product name,
    var prodQ = cart[key];                    //  get the quantity,
    var originalQ = products[key].quantity;   //  get the original quantity that is available in db
    var newQ = originalQ - prodQ;             //  calculate the new quantity

    console.log("Cart item name: " + prodName);
    console.log("Cart item quantity: " + prodQ);
    console.log("Quantity in database: " + originalQ);
    console.log("New quantity: " + newQ);
    
    if (newQ < 0) {
      newQ = 0;
    }
    db.collection('products').updateOne(      //  update that quantity in the 'products' collection
      { name: prodName }, 
      { $set: {quantity: newQ} },
      function(err, results) {
        if (err) {
          console.log("Error updating the quantity of " + prodName);
        } else {
          console.log(results);
        }
        callback();
      });
  }
};