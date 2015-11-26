
// Global variables
var cart = {
	Box1: 0,
	Box2: 0,
	Clothes1: 0,
	Clothes2: 0,
	Jeans: 0,
	Keyboard: 0,
	KeyboardCombo: 0,
	Mice: 0,
	PC1: 0,
	PC2: 0,
	PC3: 0,
	Tent: 0
};

// have 20 of each item
var products = {
	Box1: {
		'price':14,
		'quantity': 20
	},
	Box2:{
		'price': 7,
		'quantity': 20
	},
	Clothes1: {
		'price': 24,
		'quantity': 20
	},
	Clothes2: {
		'price': 45,
		'quantity': 20
	},
	Jeans: {
		'price': 35,
		'quantity': 20
	},
	Keyboard: {
		'price': 50,
		'quantity': 20
	},
	KeyboardCombo: {
		'price': 100,
		'quantity': 20
	},
	Mice: {
		'price': 48,
		'quantity': 20
	},
	PC1: {
		'price': 344,
		'quantity': 20
	},
	PC2: {
		'price': 555,
		'quantity': 20
	},
	PC3: {
		'price': 355,
		'quantity': 20
	},
	Tent: {
		'price': 190,
		'quantity': 20
	}
};
var total = 0;

var duration = 300000;
var inactiveTime;

var flag = 0;
// Start the timer when the page has finished loading
window.onload = function() {
	var display = document.querySelector("#timer");
	startTimer(duration, display);
	
	if (flag == 0) { // initialized backstore on the first time page has finished loading
		ajaxRequest(function(){
			console.log("'Backstore' is initialized");
			flag = 1;
		});
	}
};

// Countdown timer
var startTimer = function(duration, display){
	var timer = duration / 1000;
	var minutes;
	var seconds;
	inactiveTime = setInterval(function(){
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);
		// adding leading zeroes
		minutes = (minutes < 10)? "0"+ minutes : minutes
		seconds = (seconds < 10)? "0"+ seconds : seconds;
		display.textContent =  minutes + ":" + seconds;
		timer = timer - 1;
		if(timer < 0){
			clearInterval(inactiveTime);
			alert("Hey there! Are you still planning to buy something?");
			window.onload(); // reset the timer
		}
	}, 1000);
};

var Button = function(){
	//Initialize Event Handlers
	$(".addToCart").on('click', function(event){ // capture the click events, this ensures click handling for multiple buttons
		var productName = $(event.target).closest('button').data().id; // closest() get the first element that matches the selector
		addToCart(productName);

		clearInterval(inactiveTime);
		window.onload();
	});

	$(".removeFromCart").on('click', function(event){
		var productName = $(event.target).closest('button').data().id;
		removeFromCart(productName);

		clearInterval(inactiveTime);
		window.onload();
	});

	//  Add a timer to this like in description -> check the description first
	// Populate the modal with table view
	$(".cartTotal").on("click", function(){
		var modalBody = document.getElementById('modal-body');
		var modalFooter = document.getElementById('modal-footer');

		// remove previous totals/ tables
		var children = modalBody.children;
		for(var i = 0; i < children.length; i++){
			modalBody.children[i].remove();
		};

		var total = modalFooter.children;
		if(modalFooter.children.item(0).getAttribute('class') === "total-price"){ // @before: if(modalFooter.children.item("total-price")){
			modalFooter.children.item(0).remove();
		}

		// dynamically generate table with items in cart
		createModalTable();

		//Initialize Event Handlers
		$(".addToCartModal").on('click', function(event){ // capture the click events, this ensures click handling for multiple buttons
			var productName = $(event.target).closest('button').data().id; // closest() get the first element that matches the selector
			addToCart(productName);
			updateModal(productName);
		});

		$(".removeFromCartModal").on('click', function(event){
			var productName = $(event.target).closest('button').data().id;
			removeFromCart(productName);
			updateModal(productName);
		});

	});

	// When document is ready, calculate the inital total value = 0
	$(document).ready(function(){
		transTotal(total);
	});

	//Initialize removal of all remove buttons
	hideRemoveButton();

	$(".checkOut").on('click', function(event){
		console.log("checkout button clicked");
		if (cartPriceTotal() == 0) { 
			return; 
		} else { 
			
			// sends an ajax request to the server to get data from the database
			ajaxRequest(function(){
				console.log('callback from ajaxRequest');

				comparePriceAndQuantity(function() { // compares the price and quantity that is in the db
					console.log('callback from comparePriceAndQuantity');
						
					/*
					 * Sends POST request to the server
					 * @param total: the cart price total
					 * @param finalCart: an object to store items from 'cart' that has items in it  
					 */
					var total = cartPriceTotal();
					var finalCart = {}; 
					for (key in cart) {
						if (cart[key] > 0) {
							finalCart[key] = cart[key];
						}
					}

					$.post("http://localhost:5000/checkout", {cart: finalCart, total: total}, function(data){
						if(data === 'done') {
							$('#myModal').modal('hide');
							alert("Your order has been placed. Thank you for shopping with us.");	
						}
					});
				}); 
			});
			
		}
	});
};

Button();

/*
* Add chosen item to cart, increment the count of item, decrement the product quantity
* @param{prodName} string
*/
var addToCart = function(prodName){
	var value = cart[prodName];
	var price = products[prodName].price;
	var quantity = products[prodName].quantity;

	// If there is 0 of this this product in the cart
	if(cart[prodName] == 0){
		cart[prodName] = 1;
		products[prodName].quantity = quantity - 1;
	} else if(cart[prodName] > 0){
		cart[prodName] = value + 1;
		products[prodName].quantity = quantity - 1;
	}else if (cart[prodName] == undefined){
		cart[prodName] = 1;
		products[prodName].quantity = quantity - 1;
	}

	// update cart total
	cartPriceTotal();
	showRemoveButton(prodName);
};

/*
* remove chosen item from cart, increment product quantity available number, decrement number of items in cart
* @param {prodName} string
*/
var removeFromCart = function(prodName){
	if(cart[prodName] > 0){
		var value = cart[prodName];
		var quantity = products[prodName];

		cart[prodName] = value - 1;
		products[prodName].quantity = quantity + 1;
	} else {
		alert("Your cart currently has 0 " + prodName + " to remove");
	};

	// Need to update the cart price Total
	cartPriceTotal();
	hideRemoveButton(prodName);
};

/*
* Print out the total cost of items in cart
* @param{total} Number
*/
function transTotal(total){
	x = "Cart:($ " + total + " )";
	document.getElementById("s1").value = x;
}

function cartPriceTotal (){
	var key;
	var total = 0;
	for(key in cart){
		var temp;

		if(cart[key] > 0){
			var price = products[key].price;
			temp = price * cart[key];
			total += temp;
		}
	}

	// update Cart Button
	transTotal(total);
	return total;
}

/*
* When user clicks the add/subtract buttons in the modal, the  values in the table also dynamically change
* @param {productName} string
*/
function updateModal(productName){
	var rows = document.getElementsByClassName("trow");
	var thisRow = -1;
	for(var i = 0; i < rows.length; i++){
		var product = rows[i].classList[0];
		product = product.slice(9, product.length);

		if(productName == product){
			thisRow = i + 1;
		}
	}

	var actualQ = cart[productName];
	var actualP = (products[productName].price * cart[productName]);
	var actualUP = products[productName].price;

	var quantity = document.getElementsByClassName("rowq_" + productName);
	var price = document.getElementsByClassName("rowp_" + productName);
	var unitPrice = document.getElementsByClassName("rowup_"+ productName);
	var totalPrice = document.getElementsByClassName("total-price");

	if(quantity[0].innerHTML != actualQ){
		quantity[0].innerHTML = cart[productName];
	}

	if(price[0].innerHTML != actualP){
		price[0].innerHTML = ( "$" + products[productName].price * cart[productName]);
	}

	if(unitPrice[0].innerHTML != actualUP) {
		unitPrice[0].innerHTML = ( "$" + products[productName].price);

	}

	//update the total-price
	totalPrice[0].innerHTML = ("Total: $" + cartPriceTotal());

	if(quantity[0].innerHTML == 0){
		document.getElementById("modal-table").deleteRow(thisRow);
	}

	if (document.getElementById("modal-table").rows.length == 1){
		$(".modal-table").empty();
		document.getElementById("modal-footer").children.item(0).remove(); // remove total price at modal-footer
		var p = document.createElement('h3');
		p.innerHTML = " Your cart is currently empty!";
		$(".modal-table").append(p);
	}
}

/*
* Shows the remove button once the cart has atleast one of the product
* @param {prodName} string
*/
function showRemoveButton(prodName){
	var allRemoveButtons = document.getElementsByClassName("removeFromCart");
	for(var i = 0; i < allRemoveButtons.length; i++){
		if(allRemoveButtons[i].getAttribute("data-id") === prodName && cart[prodName] > 0){
			allRemoveButtons[i].style.display = "initial";
		}
	}
}

/*
* Hides all the remove buttons when the page first loads
* Also hides the remove buttons if the cart no longer holds any of that product
* @param {prodName} string
*/
function hideRemoveButton(prodName){
	var allRemoveButtons = document.getElementsByClassName("removeFromCart");
	for(var i = 0; i < allRemoveButtons.length; i++){
		if(prodName == undefined){
			allRemoveButtons[i].style.display = "none";
		}else {
			if(allRemoveButtons[i].getAttribute("data-id") === prodName && cart[prodName] == 0){
				allRemoveButtons[i].style.display = "none";
			}
		}
	}
}

/*
* Used to create a dynamic table in the modal.
* a new row is added for each different type of item in cart
*/
function createModalTable(){
	var modalBody = document.getElementById('modal-body');
	var modalFooter = document.getElementById('modal-footer');
	var key;

	// Find all the items in the cart with value greater than 0
	var tempArr = [];
	for(key in cart){
		if(cart[key] > 0 ){
			tempArr.push(key);
		}
	}

	// If cart is empty, show " Your cart is currently empty", else display table
	if( jQuery.isEmptyObject(tempArr) == true){
		var p = document.createElement('h3');
		p.innerHTML = "  Your cart is currently empty!";
		$(modalBody).prepend(p);

	} else {
		var table = document.createElement('table');
		table.id = "modal-table";

		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		var tr = document.createElement('tr');

		th1.innerHTML = "Product";
		th2.innerHTML = "Quantity";
		th3.innerHTML = "Unit Price";
		th4.innerHTML = "Price";
		th5.innerHTML = "Modify";

		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		tr.appendChild(th4);
		tr.appendChild(th5);

		$(table).append(tr);

		for(var i = 0; i < tempArr.length; i++){

			var tr2 = document.createElement('tr');
			tr2.classList.add("tableRow_"+tempArr[i]);
			tr2.classList.add("trow");

			var td1 = document.createElement('td');
			var td2 = document.createElement('td');
			var td3 = document.createElement('td');
			var td4 = document.createElement('td');
			var td5 = document.createElement('td');

			var text1 = document.createElement("Product");
			var text2 = document.createElement("Quantity");
			var text3 = document.createElement("UnitPrice");
			var text4 = document.createElement("Price");
			var text5 = document.createElement("Modify");

			text1.innerHTML = tempArr[i];
			text2.innerHTML = cart[tempArr[i]];
			text3.innerHTML = "$" + products[tempArr[i]].price;
			text4.innerHTML = "$" + products[tempArr[i]].price * cart[tempArr[i]];

			var add = document.createElement("button");
			var minus = document.createElement("button");

			add.innerHTML = "+";
			minus.innerHTML = "-";

			add.classList.add("addToCartModal");
			add.classList.add("btn-danger");
			add.classList.add("btn");
			minus.classList.add("removeFromCartModal");
			minus.classList.add("btn");
			minus.classList.add("btn-success");

			add.setAttribute("data-id", tempArr[i]);
			minus.setAttribute("data-id", tempArr[i]);

			text5.appendChild(add);
			text5.appendChild(minus);

			text2.classList.add("rowq_"+tempArr[i]);
			text3.classList.add("rowup_"+tempArr[i]);
			text4.classList.add("rowp_"+tempArr[i]);

			td1.appendChild(text1);
			td2.appendChild(text2);
			td3.appendChild(text3);
			td4.appendChild(text4);
			td5.appendChild(text5);

			tr2.appendChild(td1);
			tr2.appendChild(td2);
			tr2.appendChild(td3);
			tr2.appendChild(td4);
			tr2.appendChild(td5);

			$(table).append(tr2); // @before: (table).appendChild(tr2);
			table.classList.add("modal-table");
			table.classList.add("table");
			tr.classList.add('modal-rows')

			var p = document.createElement('h2');
			p.classList.add("total-price");
			p.innerHTML = ("Total: $" + cartPriceTotal());
		};

		modalBody.appendChild(table);
		$(modalFooter).prepend(p); // @before: modalFooter.appendChild(p)
	}
}

function comparePriceAndQuantity(callback) {
	// check if the products in the cart are still available in the backstore
	alert("We just need to confirm item availability and final total price before proceeding" + 
		", it will just take a minute.");
	for (prod in cart) {
		if (cart[prod] > 0) {

			if (backstore[prod].quantity == 0) {
				console.log("Sorry " + prod +" is unavailable!");
				alert("Sorry " + prod +" is unavailable!");
				cart[prod] = 0;
				updateModal(prod);

			} else { // else check if the quantity of products in the cart
				if (cart[prod] !== backstore[prod].price) {
					// update the product's price to the new price from the backstore
					products[prod].price = backstore[prod].price;
					console.log("Updated price of " + prod +" to $ " + products[prod].price);
					alert("The price of " + prod +" is now $" + products[prod].price);
					updateModal(prod);
				}	

				if (cart[prod] > backstore[prod].quantity) {
					// update the product's quantity in cart
					cart[prod] = backstore[prod].quantity;
					console.log("Updated quantity of " + prod +" to " + cart[prod]);
					alert("There's only " + cart[prod] + " of " + prod + " left in the store.");
					updateModal(prod);
				}
			}
		}
	}

	// calculate total
	var t = cartPriceTotal();
	console.log("New total: $" + t);
	alert("Your cart new total is: $" + t);
	if (callback)
		callback();
};