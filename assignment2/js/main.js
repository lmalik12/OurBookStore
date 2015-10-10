
// Global variables
var cart = {
};

var products = {
	box1: 10,
	box2: 5,
	clothes1: 20,
	clothes2: 30,
	jeans: 50,
	keyboard: 20,
	keyboardCombo:40,
	mice: 20,
	pc1: 350,
	pc2: 400,
	pc3: 300,
	tent: 100
};

// Initialize at the start
var inactiveTime = window.setInterval(function(){
	alert("Hey there! Are you still planning to buy something?");
},30000);


var Button = function(cart){

	$(".addToCart").click(function(){
		var productName = $(".addToCart").data().id;
		addToCart(productName);

		window.clearInterval(inactiveTime);
		console.log("cleared timer interval");
	});

	$(".removeFromCart").click(function(){
		var productName = $(".removeFromCart").data().id;
		removeFromCart(productName);

		window.clearInterval(inactiveTime);
		console.log("cleared timer interval");
	});


	// $(".cartTotal").click(function(cart){
	// 	for(key in cart){
	// 		console.log(key);
	// 		console.log(cart);

	// 		if(cart.hasOwnProperty(key)){
	// 			console.log("1" + key);
	// 		}
	// 	}
	// })
};

Button();

// {param} Object prodName = ProductName
var addToCart = function(prodName){
	console.log("prodName is", prodName);

		if(cart[prodName] > 0){
			var value = cart[prodName];
			cart[prodName] = value + 1;
		}else{
			cart[prodName] = 1;
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

	} else {

		console.log("else");		
		delete cart[prodName];
		alert("Your cart currently has no " + prodName);
	};
	console.log("Update: remove from Cart", cart);	
};
























