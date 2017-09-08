

updateStats();

var apikey = "7b05b6d881c4426990d7e1a6a466229e";

var ticker = "btc-eth";

var baseCurrency = ticker.substring(1,4);
var tradeCurrency = ticker.substring(5,8);

function updateStats() {
	getJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-eth",
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
function updateMyBalance() {
	getJSON("https://bittrex.com/api/v1.1/account/getbalance?apikey=" + apikey + "&currency=" + baseCurrency,
		function(err, data) {
			if(err != null){
				console.log('something went wrong: ' + err);
				customAlert("Warning: Balance API Endpoint not connected. Error: " + err, 10000, "alert alert-warning");
			}else{
				customAlert("Success: Balance API Endpoint connected.", 3000, "alert alert-success");
				document.getElementById("baseCurrency").innerHTML = baseCurrency + " " + data.result.Available;
			}
		});
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



