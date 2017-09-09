jsSHA = require("jssha");

// Set Globals
var apiKeyString 		= "7b05b6d881c4426990d7e1a6a466229e";
var secretKeyString		= "d3484fe7b49f4ec3a8bef064d59bef03";
var tickerString 		= "btc-eth";
var baseCurrencyString 	= tickerString.substring(0, tickerString.indexOf('-'));
var tradeCurrencyString = tickerString.substring(tickerString.indexOf('-') + 1);

var debug = false;

// Call Updates


update();

function update() {
	updateStats(tickerString);
	updateMyBalance(apiKeyString, secretKeyString, baseCurrencyString, tradeCurrencyString);
	setTimeout(update, 5000);
}



// Updates market stats with the given ticker
function updateStats(ticker) {
	getJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + ticker,
		function(err, data) {
			if(err != null){
				console.log('somethinig went wrong: ' + err);
				if(debug == true){
					customAlert("Warning: API Endpoint not connected.", 10000, "alert alert-warning");					
				}
			} else {
				if(debug == true){
					customAlert("Success: API Endpoint connected.",3000, "alert alert-success");
				}
				document.getElementById("marketName").innerHTML = "Market Name: " + data.result[0].MarketName;
				document.getElementById("high").innerHTML = "24hr High: " + data.result[0].High + " BTC";
				document.getElementById("low").innerHTML = "24hr Low: " + data.result[0].Low + " BTC";
				document.getElementById("volume").innerHTML = "24hr Volume: " + data.result[0].Volume + " BTC";
				document.getElementById("bid").innerHTML = "Current Bid: " + data.result[0].Bid + " BTC";
				document.getElementById("ask").innerHTML = "Current Ask: " + data.result[0].Ask + " BTC";
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
	
	// remove when done
	console.log(uri);
	console.log(hash);
	
	getSignedJSON(uri, hash,
		function(err, data) {
			if(err != null){
				console.log('something went wrong: ' + err);
				//customAlert("Warning: Balance API Endpoint not connected. Error: " + err, 10000, "alert alert-warning");
			}else{
				if(debug == true){
					customAlert("Success: Balance API Endpoint connected.", 3000, "alert alert-success");
				}
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

	// remove when done
	console.log(uri2);
	console.log(hash2);

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
				
				// data.result.Balance
				// data.result.Pending
				// data.result.Address
			}
		});

}

// Set Bittrex Key to a variable
function setBittrexKey(){
	apiKeyString = document.getElementById("bittrexKey").innerHTML;
}

// Set Bittrex Secret Key to a variable
function setBittrexSecret(){
	secretKeyString = document.getElementById("secretKeyString").innerHTML;
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