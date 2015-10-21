
// Global variables
var cart = {
};

// the price in this case represent the quantity of items available for purchase
var products = {
	Box1: 20,
	Box2: 20,
	Clothes1: 20,
	Clothes2: 30,
	Jeans: 50,
	Keyboard: 20,
	KeyboardCombo:40,
	Mice: 20,
	PC1: 35,
	PC2: 40,
	PC3: 30,
	Tent: 10
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
		// clearInterval(ret);
	});

	$(".removeFromCart").on('click', function(event){
		var productName = $(event.target).closest('button').data().id;
		removeFromCart(productName);

		window.clearInterval(inactiveTime);
		// clearInterval(ret);
	});

	//  Add a timer to this like in description -> check the description first
	$(".cartTotal").on("click", function(){
		var key;

		// //  If cart empty
		if( jQuery.isEmptyObject(cart) == true){
			alert(" Your cart is empty");
		} else {
		// 	//  Otherwise list all the items one by one
		var flag = false; 
		var i = 0;
		var arr = [];

			for(key in cart){
				arr.push(key);
				console.log("arr", arr);

				if(flag){
					var timer = setTimeout(function(i){
						console.log("what is i: ", i);
						alert("Your cart contains " + cart[key] + " " + arr[i]);
					}, i * 2000,i);
					flag = true;
				}

				if(!flag){
					alert("Your cart contains " + cart[key] + " " + key);
					flag = true;
				}
				i++;
				
			}
		}
			
		// var timeoutHandler = function(){
		// 		var arr = [];
		// 		for(key in cart){
		// 			arr.push(key);
		// 		}
		// 	return arr;
		// };
		
		// var ret = timeoutHandler();
		// for(var i = 0; i < )

		// for(key in cart){
			// console.log(key);
			// var ret = setTimeout(timeoutHandler("yo homie! " + item, + cart[item]), 6000);
		// 	// var ret = timeoutHandler("yo homie! " + key + cart[key]);
		// 	ret.timeoutHandler("yo homie " +  key + " " + cart[key]);
		// }

	});
};	

// var ret = setTimeout(timeoutHandler("yo homie! " + key, + cart[key]), 6000);	
// var timeoutHandler = function(msg){
// 	return function(){
// 			alert(msg);
// 		}
// };

Button();

// {param} Object prodName = ProductName
var addToCart = function(prodName){

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
			cart[prodName] = 1;
			var quantity = products[prodName];
			products[prodName] = quantity - 1;
		}
	// console.log("Update: add to Cart", cart);
};


// {param} Object prodName = ProductName
var removeFromCart = function(prodName){

	if(cart[prodName] > 0){
		var value = cart[prodName];
		cart[prodName] = value - 1;

		var quantity = products[prodName];
		products[prodName] = quantity + 1;

		if(cart[prodName] == 0){
			// console.log("0 of this item in cart", prodName, "deleting from cart");
			delete cart[prodName];		
		}

	} else {
		alert("Your cart currently has 0 " + prodName + " to remove");
	};
	// console.log("Update: remove from Cart", cart);
};
