
// Global variables
var cart = {
};

// the price in this case represent the quantity of items available for purchase
var products = {
	Box1: 10,
	Box2: 5,
	Clothes1: 20,
	Clothes2: 30,
	Jeans: 50,
	Keyboard: 20,
	KeyboardCombo:40,
	Mice: 20,
	PC1: 350,
	PC2: 400,
	PC3: 300,
	Tent: 100
};

// Initialize at the start
var inactiveTime = window.setInterval(function(){
	alert("Hey there! Are you still planning to buy something?");
},30000);


var Button = function(){

	$(".addToCart").on('click', function(event){ // capture the click events, this ensures click handling for multiple buttons
		var productName = $(event.target).closest('button').data().id; // closest() get the first element that matches the selector
		addToCart(productName);

		window.clearInterval(inactiveTime);
		// console.log("cleared timer interval");
	});

	$(".removeFromCart").on('click', function(event){
		var productName = $(event.target).closest('button').data().id;
		removeFromCart(productName);

		window.clearInterval(inactiveTime);
		// console.log("cleared timer interval");
	});

	//  Add a timer to this like in description -> check the description first
	$(".cartTotal").on("click", function(){
		var key;
		for(key in cart){
			var inactiveTime2 = setTimeout(function(){
			if(cart.hasOwnProperty(key)){
				// inactiveTime2(key)
				console.log("CRAPPP");
				
					alert("Your cart has " + cart[key] + " " + key);
				}	
			}, 1000);
			// }
		}
		if( jQuery.isEmptyObject(cart) == true){
			alert(" Your cart is empty");
		}	
	});

	// var inactiveTime2 = setTimeout(function(key){
	// 	alert("Your cart has " + cart[key] + " " + key);
	// , 1000);

};

Button();

// {param} Object prodName = ProductName
var addToCart = function(prodName){
	console.log("prodName is", prodName);
	console.log(cart[prodName]);

		if (jQuery.isEmptyObject(cart) == true){
			var value = cart[prodName];
			cart[prodName] = 1;
			var quantity = products[prodName];
			products[prodName] = quantity - 1;

		} else if(cart[prodName] > 0){
			var value = cart[prodName];
			cart[prodName] = value + 1;
			var quantity = products[prodName];
			products[prodName] = quantity - 1;

		}else if (cart[prodName] == undefined){
			console.log("randomness");
			cart[prodName] = 1;
			var quantity = products[prodName];
			products[prodName] = quantity - 1;
		}
	console.log("Update: add to Cart", cart);
};


// {param} Object prodName = ProductName
var removeFromCart = function(prodName){
	console.log("prodName is", prodName);

	if(cart[prodName] > 0){
		console.log("cart > 0");
		var value = cart[prodName];
		cart[prodName] = value - 1;

		var quantity = products[prodName];
		products[prodName] = quantity + 1;

		console.log("removed item from cart");

			if(cart[prodName] == 0){
				console.log("0 of this item in cart", prodName, "deleting from cart");
				delete cart[prodName];		
			}

	} else {
		console.log("else");
		// delete cart[prodName];
		alert("Your cart currently has no " + prodName + "to remove");
	};
	console.log("Update: remove from Cart", cart);
};


// Manual testing
// 	var noBox1 = products["Box1"];
// 	var noBox2 = products["Box2"];
// 	addToCart("Box1");
// 	addToCart("Box1");
// 	addToCart("Box2");
// 	addToCart("Box2");

// 	if(cart["Box1"] != 2 || cart["Box2"] != 2){
// 		alert("Error: Cannot correctly add products to cart", cart["Box1"], cart["Box2"]);
// 		// passFlag = false;
// 	} else {
// 		alert("correct box values,", cart);
// 		console.log("$$$$$$$", cart["Box1"], cart["Box2"]);
// 	}
// document.writeln("this is my current cart", cart);


