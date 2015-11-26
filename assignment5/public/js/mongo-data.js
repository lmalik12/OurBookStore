// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
	if (err) { 
    	return console.log("Unable to connect to MongoDB server. Err: " + err); 
  } else {
  	// perform query
  	var collection = db.collection('products');
  	collection.find().toArray(function(err, doc) {
  		db.close();
  		var count = doc.length;
  		if (count > 0) {
  			JSONStr = "";
  			for (var i = 0; i < count; i++) {
  				JSONStr += doc[i];
  				if (i < count) {
  					JSONStr += ',';
  				}
  			}
  			JSONStr = "bla";
  			callback("", JSON.parse(JSONStr));
  		}
  	})
  }
};