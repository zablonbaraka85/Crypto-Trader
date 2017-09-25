const path = require("path");
bittrexAPI = require(path.join(__dirname, './bittrexAPI.js'));
bittrexIndicators = require(path.join(__dirname, './bittrexIndicators.js'));


async function algorithm() {
    // console.log("hi im the algorithm");
   	var SMA = bittrexIndicators.simpleMovingAverage(10, "BTC-ETH");
   	console.log("The simple moving average is: " + SMA);
   	
}

module.exports.algorithm = algorithm;