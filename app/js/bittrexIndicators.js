const path = require('path');
bittrexAPI = require(path.join(__dirname, './bittrexAPI.js'));

var SMA = 0;
function simpleMovingAverage(duration, ticker) {
	bittrexAPI.getMarketHistory(ticker, function(err, data) {
		var sum = 0;
		for(var i = 0; i < duration; i++) {
			sum += data.result[i].Price;
		}
		SMA = sum / duration;
	});
	if(SMA != 0) return SMA;
};

var AverageSold = 0;
function getAverageSold(duration, ticker) {
	bittrexAPI.getMarketHistory(ticker, function(err, data) {
		var sum = 0;
		var counted = 0;
		while(counted <= duration){
			if(data.result[i].OrderType == "SELL") {
				sum += data.result[i].Price;
				counted++;
			}

		}
	});
	if(AverageSold != 0) return AverageSold;
}

var AverageBought = 0;
function getAverageBuy(duration, ticker) {
	bittrexAPI.getMarketHistory(ticker, function(err, data) {
		var sum = 0;
		var counted = 0;
		while(counted <= duration){
			if(data.result[i].OrderType == "BUY") {
				sum += data.result[i].Price;
				counted++;
			}
		}
	});
	if(AverageBought != 0) return AverageBought;
}


module.exports = {
	simpleMovingAverage: simpleMovingAverage,
}


