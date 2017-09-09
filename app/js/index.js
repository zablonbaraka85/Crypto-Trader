
var apiKeyString = "";
var tickerString = "usdt-eth";

var baseCurrencyString = tickerString.substring(0,4);
var tradeCurrencyString = tickerString.substring(5,8);

updateStats(tickerString);
updateMyBalance(apiKeyString, baseCurrencyString);

function updateStats(ticker) {
	getJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + ticker,
		function(err, data) {
			if(err != null){
				console.log('somethinig went wrong: ' + err);
				customAlert("Warning: API Endpoint not connected.", 10000, "alert alert-warning");
			} else {
				customAlert("Success: API Endpoint connected.",3000, "alert alert-success");
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
function updateMyBalance(apiKey, baseCurrency) {
	getJSON("https://bittrex.com/api/v1.1/account/getbalance?apikey=" + apiKey + "&currency=" + baseCurrency,
		function(err, data) {
			if(err != null){
				console.log('something went wrong: ' + err);
				customAlert("Warning: Balance API Endpoint not connected. Error: " + err, 10000, "alert alert-warning");
			}else{
				customAlert("Success: Balance API Endpoint connected.", 3000, "alert alert-success");
				document.getElementById("baseCurrency").innerHTML = baseCurrency + " " + data.success;
			}
		});
}

// Set Bittrex Key to A variable
function setBittrexKey(){
	apiKeyString = document.getElementById("bittrexKey").innerHTML;
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
};


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