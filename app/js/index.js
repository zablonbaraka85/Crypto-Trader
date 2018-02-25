const path = require('path');
jsSHA = require("jssha");
bittrexAPI = require(path.join(__dirname, './js/bittrexAPI.js'));
algorithm = require(path.join(__dirname, './js/algorithm.js'));



updateOrderBook();



function updateOrderBook(){
	bittrexAPI.getOrderBook('btc-eth',
	function(err, data) {
		for(var i = 1; i < 6; i ++){
			document.getElementById("bidTotal" + i.toString()).innerHTML = data.result.buy[i].Quantity * data.result.buy[i].Rate;
			document.getElementById("bidQuan" + i.toString()).innerHTML = data.result.buy[i].Quantity;
			document.getElementById("bidRate" + i.toString()).innerHTML = data.result.buy[i].Rate;
			
			document.getElementById("askTotal" + i.toString()).innerHTML = data.result.sell[i].Quantity * data.result.buy[i].Rate;
			document.getElementById("askQuan" + i.toString()).innerHTML = data.result.sell[i].Quantity;
			document.getElementById("askRate" + i.toString()).innerHTML = data.result.sell[i].Rate;
		}
	
	});
}


// Set Globals
// Fake keys!
var apiKeyString 		= ""; //Insert Keys Here 
var secretKeyString		= ""; //Insert Keys Here
var tickerString 		= "btc-eth";
var baseCurrencyString 	= tickerString.substring(0, tickerString.indexOf('-'));
var tradeCurrencyString = tickerString.substring(tickerString.indexOf('-') + 1);
var runAlgo = false; 

var debug = false;

// Call Updates


update();


openOrders(apiKeyString,secretKeyString,tickerString);


updateMyBalance(apiKeyString, secretKeyString, baseCurrencyString, tradeCurrencyString);

function update() {
	updateStats(tickerString);
	updateBuySellInfo(baseCurrencyString, tradeCurrencyString);
	updateOrderBook();

	// console.log(apiKeyString);
	
	setTimeout(update, 500);
}



// Updates market stats with the given ticker
function updateStats(ticker) {
	getJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + ticker,
		function(err, data) {
			if(err != null){
				console.log('somethinig went wrong: ' + err);
			} else {
				if(data.success){
					document.getElementById("marketName").innerHTML = "Market Name: " + data.result[0].MarketName;
					document.getElementById("high").innerHTML = "24hr High: " + data.result[0].High + " BTC";
					document.getElementById("low").innerHTML = "24hr Low: " + data.result[0].Low + " BTC";
					document.getElementById("volume").innerHTML = "24hr Volume: " + data.result[0].Volume + " BTC";
					document.getElementById("bid").innerHTML = "Current Bid: " + data.result[0].Bid + " BTC";
					document.getElementById("ask").innerHTML = "Current Ask: " + data.result[0].Ask + " BTC";
				}
			}	
		});
}

//function not working for some reason
function updateMyBalance(apiKey, secretKey, baseCurrency, tradeCurrency) {

	var nonce = Math.round((new Date()).getTime() / 1000);
	var uri = "https://bittrex.com/api/v1.1/account/getbalance?apikey=" + apiKey + "&currency=" + baseCurrency + "&nonce=" + nonce; 

	var shaObj = new jsSHA("SHA-512", "TEXT");
	shaObj.setHMACKey(secretKey, "TEXT");
	shaObj.update(uri);
	var hash = shaObj.getHMAC("HEX");

	//console.log(uri);
	//console.log(hash);

	
	getSignedJSON(uri, hash,
		function(err, data) {
			if(err != null){
				console.log('something went wrong: ' + err);
			}else{
				document.getElementById("base-title").innerHTML = baseCurrency.toUpperCase() + " Account Summary";
				document.getElementById("base-balance").innerHTML = "Balance: " + data.result.Balance + " " + baseCurrencyString.toUpperCase();
				document.getElementById("base-available").innerHTML = "Available: " + data.result.Available + " " + baseCurrencyString.toUpperCase();
				document.getElementById("base-address").innerHTML =  "Pending: " + data.result.Pending + " " + baseCurrencyString.toUpperCase();
				document.getElementById("base-pending").innerHTML = "Address: " + data.result.CryptoAddress;
				
			}
		});
	
	var nonce2 = Math.round((new Date()).getTime() / 1000);
	var uri2 = "https://bittrex.com/api/v1.1/account/getbalance?apikey=" + apiKey + "&currency=" + tradeCurrency + "&nonce=" + nonce2; 

	var shaObj2 = new jsSHA("SHA-512", "TEXT");
	shaObj2.setHMACKey(secretKey, "TEXT");
	shaObj2.update(uri2);
	var hash2 =shaObj2.getHMAC("HEX");

	getSignedJSON(uri2, hash2,
		function(err, data){
			if(err != null){
				console.log("something went wrong: " + err);
			}else {
				document.getElementById("trade-title").innerHTML = tradeCurrency.toUpperCase() + " Account Summary";
				document.getElementById("trade-balance").innerHTML = "Balance: " + data.result.Balance + " " + tradeCurrencyString.toUpperCase();
				document.getElementById("trade-available").innerHTML = "Available: " + data.result.Available + " " + tradeCurrencyString.toUpperCase();
				document.getElementById("trade-address").innerHTML =  "Pending: " + data.result.Pending + " " + tradeCurrencyString.toUpperCase();
				document.getElementById("trade-pending").innerHTML = "Address: " + data.result.CryptoAddress;
			}
		});

}

function placeBuyOrder() { // place order function
	sendBuyOrder(apiKeyString, secretKeyString, tickerString, 
		document.getElementById("buyPanelUnits").value,
		document.getElementById("buyPanelPrice").value);
}

function placeSellOrder() {
	sendSellOrder(apiKeyString, secretKeyString, tickerString,
		document.getElementById("sellPanelUnits").value,
		document.getElementById("sellPanelPrice").value);
}


// Current Open Orders
var openOrders = [];

// Checks Updates Open Orders List and Styler List
function openOrders(apiKey, secretKey, ticker) {
	var nonce = Math.round((new Date()).getTime() / 1000);
	var uri = "https://bittrex.com/api/v1.1/market/getopenorders?apikey=" + apiKey +"&market="+ ticker + "&nonce=" + nonce;

	var shaObj = new jsSHA("SHA-512", "TEXT");
	shaObj.setHMACKey(secretKey, "TEXT");
	shaObj.update(uri);
	var hash = shaObj.getHMAC("HEX");

	//console.log(uri);
	//console.log(hash);

	getSignedJSON(uri, hash,
		function(err, data) {
			if(err != null) {
				console.log("Something went wrong: " + err);
			} else if(data.success == "true" && data.result.length > 0) {
				for(var i = 0; i < openOrders.length; i++){
					openOrders[i].parentNode.removeChild(openOrders[i]);
				}

				for(var i = 0; i < data.result.length; i++){
					var styler = document.createElement("div");
					styler.className = "panel panel-body";
					styler.innerHTML = "OrderID: "  + data.result[i].OrderUuid + 
									" \nExchange: " + data.result[i].Exchange +
									" \nQuantity: " + data.result[i].Quantity +
									" \nQuantityRemaining: " + data.result[i].QuantityRemaining +
									" \nOpened: " + data.result[i].Opened +
									" \nPrice: " + data.result[i].Price +
									" \nPrice Per Unit: " + data.result[i].PricePerUnit;
					openOrders.push(styler);
				}
			}
		});
}


function sendBuyOrder(apiKey, secretKey, ticker, quantity, rate) {
	var nonce = Math.round((new Date()).getTime() / 1000);
	var uri = "https://bittrex.com/api/v1.1/market/buylimit?apikey=" + apiKey + "&market=" + ticker + "&quantity="+ quantity + "&rate="+ rate + "&nonce=" + nonce;

	var shaObj = new jsSHA("SHA-512", "TEXT");
	shaObj.setHMACKey(secretKey, "TEXT");
	shaObj.update(uri);
	var hash = shaObj.getHMAC("HEX");

	// DEBUG
	//console.log(uri);
	//console.log(hash);
	
	getSignedJSON(uri, hash,
		function(err, data){
			if(err != null){
				console.log("Something went wrong: " + err);
			} else {
				if(data.success){
					customAlert("<b>Success:</b> Buy order placed!", 2000, "alert alert-success");
				} else {
					customAlert("<b>Error: </b>" + data.message, 2000, "alert alert-danger");
				}
			}
		});

}

function sendSellOrder(apiKey, secretKey, ticker, quantity, rate) {
	var nonce = Math.round((new Date()).getTime() / 1000);
	var uri = "https://bittrex.com/api/v1.1/market/selllimit?apikey=" + apiKey + "&market=" + ticker + "&quantity="+ quantity + "&rate="+ rate + "&nonce=" + nonce;

	var shaObj = new jsSHA("SHA-512", "TEXT");
	shaObj.setHMACKey(secretKey, "TEXT");
	shaObj.update(uri);
	var hash = shaObj.getHMAC("HEX");

	// DEBUG
	//console.log(uri);
	//console.log(hash);

	getSignedJSON(uri, hash,
		function(err, data) {
			if(err != null){
				console.log("Something went wrong: " + err);

			} else {
				if(data.success){
					customAlert("<b>Success:</b> Sell order placed!",2000, "alert alert-success");
				} else {
					customAlert("<b>Error: </b>" + data.message,2000, "alert alert-danger");
				}
			}
		});
}

function updateOrders() {
	
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAlgorithm() {
	while(runAlgo){
		isRunning = true;
		algorithm.algorithm()
		await sleep(100);
	}

}

function setAlgorithm(status){
	runAlgo = Boolean(status);
	runAlgorithm();	
}

function updateBuySellInfo(baseCurrency, tradeCurrency){
	document.getElementById("buyPanel").innerHTML = "Buy " + tradeCurrency.toUpperCase(); 
	document.getElementById("sellPanel").innerHTML = "Sell " + tradeCurrency.toUpperCase();

	document.getElementById("tradeCurrencyBuy").innerHTML = tradeCurrency.toUpperCase();
	document.getElementById("tradeCurrencySell").innerHTML = tradeCurrency.toUpperCase();

	document.getElementById("baseCurrencyBuy").innerHTML = baseCurrency.toUpperCase();
	document.getElementById("baseCurrencySell").innerHTML = baseCurrency.toUpperCase();

	document.getElementById("baseCurrencyBuyTotal").innerHTML = baseCurrency.toUpperCase();
	document.getElementById("baseCurrencySellTotal").innerHTML = baseCurrency.toUpperCase();

	document.getElementById("buyPanelTotal").value = document.getElementById("buyPanelPrice").value * document.getElementById("buyPanelUnits").value;
	document.getElementById("sellPanelTotal").value = document.getElementById("sellPanelPrice").value * document.getElementById("sellPanelUnits").value; 
}

// Set Bittrex Key to a variable
function setBittrexKey(){
	apiKeyString = document.getElementById("bittrexKey").value;
	console.log("other stuff works");
}

// Set Bittrex Secret Key to a variable
function setBittrexSecret(){
	secretKeyString = document.getElementById("secretKeyString").value;
}

// REST api function to connect to json endpoints.
function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  xhr.send();
}

function getSignedJSON(url, apiSign, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.setRequestHeader("apisign", apiSign);
	xhr.onload = function() {
		var status = xhr.status;
		if (status == 200){
			callback(null, xhr.response);
		} else{
			callback(status);
		}
	};
	xhr.send();
}

// Alerts show up in the alerts section.
function customAlert(msg, duration, className){
	var styler = document.createElement("div");
	styler.className = className;
	styler.innerHTML = msg;
	setTimeout(function(){
		styler.parentNode.removeChild(styler);
	}, duration);
	document.getElementById("alerts").appendChild(styler);
}

//Update display based on tab
function openTab(evt, tabName) {
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}



