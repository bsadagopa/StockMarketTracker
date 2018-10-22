## Final Project - StockMarketTracker 1.0
#### Team Members
* Balaji K Sadagopa
* Suswith Gaddam

***Project Goals***
<p>
Build an API driven Cloud hosted application that supports various user interaction mediums. 
</p>

***Key Product features:***
***Cloud and External API source details***
<p>
* Google DialogFlow - ML to recognize and decipher voice and text commands.  
* Yahoo Finance API - Recognize and translate compant name to ticker. 
* Intrinio Financial Markets Data API - To get the stock details for the stock ticker.
</p>

***What is StockMarketTracker 1.0***
<p>
StockMarketTracker 1.0 is a ML BOT. That can be accesed by google voice or Slack.
StockMarketTracker 1.0 is a API component model designed application that can be  instructed verbally over google voice to get the stock quotes for any publically traded company. Note, with small moditication siri and cortana can alse be supported.
StockMarketTracker can also be instructed via slack.
StockMarketTracker uses google DialogFlow Machine Learning API to learn the human voice patterns to pull company name, date and price type from the user. It then uses the company name to get the stock ticker from "Yahoo Finance API". StockMarketTracker then gets the stock ticker price details from "Intrinio Financial Markets Data API". This information is returned back to the google DialogFlow.


