const path = require("path");
bittrexAPI = require(path.join(__dirname, './bittrexAPI.js'));
bittrexIndicators = require(path.join(__dirname, './bittrexIndicators.js'));


async function algorithm() {
	var ticker = "BTC-ETH";
    // console.log("hi im the algorithm");
   	var SMA = bittrexIndicators.simpleMovingAverage(10, ticker);
   	console.log("The simple moving average is: " + SMA);
   	var AverageBuyPrice = bittrexIndicators.getAverageBuyPrice(10, ticker);
   	//var AverageSell = bittrexIndicators.getAverageSell(10, ticker);
   	console.log("The average buy is: " + AverageBuyPrice);


}

module.exports.algorithm = algorithm;