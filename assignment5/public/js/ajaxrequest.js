// Global variables
var backstore = {};

<<<<<<< HEAD
function ajaxRequest (callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:5000/products");
=======
var ajaxRequest = function () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://cpen400a.herokuapp.com/products");
>>>>>>> master
	xhr.onload= function(){
		if(xhr.status == 200) {
			//console.log("Received: " + xhr.responseText);
			
			var contType = xhr.getResponseHeader("Content-Type");
			if(contType == 'application/json; charset=utf-8') {
				var result = JSON.parse(xhr.responseText);
				console.log(result);
				backstore = result;
<<<<<<< HEAD
				initialProductValues();
				if (callback) // check if there's a callback function before calling it
					callback();

=======
				comparePriceAndQuantity();
>>>>>>> master
			}
		} else {
			console.log("Received error code: " + xhr.status);
			if (xhr.status == 500) {
				console.log("Retry sending request " + xhr);
<<<<<<< HEAD
				xhr.open("GET", "http://localhost:5000/products");
=======
				xhr.open("GET", "https://cpen400a.herokuapp.com/products");
>>>>>>> master
				xhr.send();
			}
		}
	};
	xhr.ontimeout = function() {
		console.log("Timed out after " + xhr.timeout + " ms");
		xhr.abort();
		console.log("Retry sending request " + xhr);
<<<<<<< HEAD
		xhr.open("GET", "http://localhost:5000/products");
=======
		xhr.open("GET", "https://cpen400a.herokuapp.com/products");
>>>>>>> master
		xhr.send();
	};
	xhr.onerror = function() {
		console.log("Resulted in an error !");
	};  
	xhr.onabort = function() {
		console.log("Aborted");
	};
	
	// All the handlers are setup, so send the message
	xhr.timeout = 5000;	 // Wait at most 5000 ms for a response
	console.log("Sending request " + xhr);
	xhr.send();
<<<<<<< HEAD
=======

>>>>>>> master
};