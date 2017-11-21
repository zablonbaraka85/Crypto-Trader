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

var AverageSellPrice = 0;
function getAverageSellPrice(duration, ticker, isTime) {
	if(isTime){
		// TO BE IMPLEMENTED
		return 0;
	}else{
		bittrexAPI.getMarketHistory(ticker, function(err, data) {
			var sum = 0;
			var counted = 0;
			while(counted <= duration){
				if(data.result[counted].OrderType == "SELL") {
					sum += data.result[counted].Price;
				}
			}
			AverageSellPrice = sum / duration;
		});
		return AverageSellPrice;
	}
}

var AverageBuyPrice = 0;
function getAverageBuyPrice(duration, ticker, isTime) {
	if(isTime){
		// TO BE IMPLEMENTED
		return 0;
	} else {
		bittrexAPI.getMarketHistory(ticker, function(err, data) {
			var sum = 0;
			var counted = 0;
			while(counted <= duration){
				if(data.result[counted].OrderType == "BUY") {
					sum += data.result[counted].Price;
				}
				counted++;
			}
			AverageBuyPrice = sum / duration;
		});
		return AverageBuyPrice;
	}
}

var AverageSellVolume = 0;
function getAverageSellVolume(duration, ticker, isTime) {
	if(isTime) {
		// TO BE IMPLEMENTED
		return 0;
	}else {
		bittrexAPI.getMarketHistory(ticker, function(err, data) {
			var sum = 0;
			var counted = 0;
			while(counted <= duration) {
				if(data.result[counted].OrderType == "SELL") {
					sum += data.result[counted].Quantity;
				}
				counted++;
			}
			AverageSellVolume = sum / duration;
		});
		return AverageSellVolume;
	}
}

var AverageBuyVolume = 0;
function getAverageBuyVolume(duration, ticker, isTime) {
	if(isTime) {
		// TO BE IMPLEMENTED
		return 0;
	} else {
		bittrexAPI.getMarketHistory(ticker, function(err, data) {
			var sum = 0;
			var counted = 0;
			while(counted <= duration) {
				if(data.result[counted].OrderType == "BUY") {
					sum += data.result[counted].Quantity;
				}
				counted++;
			}
			AverageBuyVolume = sum / duration;
		});
		return AverageBuyVolume;
	}
} 


module.exports = {
	simpleMovingAverage: simpleMovingAverage,
	getAverageBuyPrice: getAverageBuyPrice,
	getAverageSellPrice: getAverageSellPrice,
	getAverageSellVolume: getAverageSellVolume,
	getAverageBuyVolume: getAverageBuyVolume
}


