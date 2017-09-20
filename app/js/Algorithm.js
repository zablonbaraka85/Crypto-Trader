const path = require("path");
bittrexAPI = require(path.join(__dirname, './bittrexAPI.js'));
bittrexIndicators = require(path.join(__dirname, './bittrexIndicators.js'));


async function algorithm() {
    console.log("hi im the algorithm");
   	var test = 0;
   	test = bittrexIndicators.simpleMovingAverage(10, "BTC-ETH");
   	console.log("The simple moving average is: " + test);



}

module.exports.algorithm = algorithm;