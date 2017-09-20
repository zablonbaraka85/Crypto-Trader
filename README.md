# Welcome to the Crypto-Trader wiki!
Crypto-Trader is an algorithmic trading platform where anyone can code their own trading algorithms and run them with ease.

## How to Use:
1. Create an account with a supported crypto-currency exchange.
2. Create API secret keys for the account on the respective exchange.
3. Code your trading algorithm in the algorithm.js file using the applied JavaScript API built into the repo.
4. Run Crypto-Trader: $npm start
5. Click on the algorithm tab and click start!

## Algorithmic Trading Development Tools:

Notation:
+ ticker = "BTC-ETH"
+ currency = "ETH"

### Currently Available API Calls (BittrexAPI.js for Bittrex Exchange):
- cancelOrder(apiKey, secretKey, orderUUID) -> cancels the order with the orderUUID.
- getMarketHistory(ticker, callback) -> retrieves the market history for the given ticker.
- getOrderBook(ticker, callback) -> retrieves the order book for the given ticker.
- getOpenOrders(apiKey, secretKey, ticker, callback) -> retrieves the open orders list for the given ticker.
- getWithdrawlHistory(apiKey, secretKey, currency, callback) -> retrieves the withdrawl history for the given currency.
- getDepositHistory(apiKey, secretKey, currency, callback) -> retrieves the deposit history for the given currency.
- placeSellOrder(apiKey, secretKey, ticker, quantity, rate, callback) -> places a limit sell order for the ticker at quantity for rate price. 
- placeBuyOrder(apiKey, secretKey, ticker, quantity, rate, callback) -> places a limit buy order for the ticker at quantity for rate price.
- getTickerBalances(apiKey, secretKey, baseCurrency, tradeCurrency, callback) -> gets the balances for the base and trade currencies.
- getMarketStats(ticker, callback) -> gets the market data including: [24hr volume, highest bid, lowest ask, 24hr highest bid, 24hr lowest ask].
- getMarketSummaries(callback) -> returns the market summaries for the entire exchange.

## Supported Exchanges:
- Bittrex

