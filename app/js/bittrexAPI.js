/// This is intended to be a JavaScript wrapper for all bittrex api calls.
jsSHA = require("jssha");


function cancelOrder(apiKey, secretKey, orderUUID, callback){
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/market/cancel?apikey=" + apiKey + "&uuid=" + orderUUID + "&nonce=" + nonce, "", "", true,
		function(err,data) {
			callback(err, data);
		});
}

function getMarketHistory(ticker, callback) {
	getSignedJSON("https://bittrex.com/api/v1.1/public/getmarkethistory?market=" + ticker, "", "", false,
		function(err, data){
			callback(err, data);
		});
}

function getOrderBook(ticker, callback) {
	getSignedJSON("https://bittrex.com/api/v1.1/public/getorderbook?market=" + ticker + "&type=both", "", "", false,
		function(err,data) {
			callback(err, data);
		});
}

function getOpenOrders(apiKey, secretKey, ticker, callback) {
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/market/getopenorders?apikey="+ apiKey + "&market=" + ticker + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}

function getWithdrawalHistory(apiKey, secretKey, currency, callback) {
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/account/getwithdrawalhistory?currency=" + currency + "&apikey=" + apiKey + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}

function getDepositHistory(apiKey, secretKey, currency, callback) {
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/account/getwithdrawalhistory?currency=" + currency + "&apikey=" + apiKey + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}

function placeSellOrder(apiKey, secretKey, ticker, quantity, rate, callback) {
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/market/selllimit?apikey=" + apiKey + "&market=" + ticker + "&quantity="+ quantity + "&rate="+ rate + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}

function placeBuyOrder(apiKey, secretKey, ticker, quantity, rate, callback) {
	var nonce = getNonce();
	getSignedJSON("https://bittrex.com/api/v1.1/market/buylimit?apikey=" + apiKey + "&market=" + ticker + "&quantity="+ quantity + "&rate="+ rate + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}

function getTickerBalances(apiKey, secretKey, baseCurrency, tradeCurrency, callback) {
	var nonce = getNonce()
	getSignedJSON("https://bittrex.com/api/v1.1/account/getbalance?apikey=" + apiKey + "&currency=" + baseCurrency + "&nonce=" + nonce, secretKey, nonce, true,
		function(err, data) {
			callback(err, data);
		});
}


function getMarketStats(ticker, callback) {
	getSignedJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + ticker, "","",false,
		function(err, data) {
			callback(err, data);
		});
}

function getMarketSummary(ticker, callback) {
	getSignedJSON("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + ticker, "", "",false,
		function(err, data) {
			callback(err, data);
		});
}

function getMarketSummaries(callback) {
	getSignedJSON("https://bittrex.com/api/v1.1/public/getmarketsummaries", "","", false,
		function(err, data) {
			callback(err, data);
		});
}

function getNonce(){
	return Math.round((new Date()).getTime() / 1000);
}

function getSignedJSON(url, secretKey, nonce, isSigned, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	if(isSigned){
		var shaObj = new jsSHA("SHA-512", "TEXT");
		shaObj.setHMACKey(secretKey, "TEXT");
		shaObj.update(url);
		var hash = shaObj.getHMAC("HEX");
		xhr.setRequestHeader("apisign", hash);
	}
	xhr.onload = function() {
		var status = xhr.status;
		if (status == 200){
			callback(null, xhr.response);
		} else{
			callback(status, null);
		}
	};
	xhr.send();
}

module.exports = {
	getMarketSummary: getMarketSummary,
	getMarketSummaries: getMarketSummaries,
	getTickerBalances: getTickerBalances,
	placeBuyOrder: placeBuyOrder,
	placeSellOrder: placeSellOrder,
	getDepositHistory: getDepositHistory,
	getWithdrawalHistory: getWithdrawalHistory,
	getMarketHistory: getMarketHistory,
	getOrderBook: getOrderBook,
	cancelOrder: cancelOrder,
}