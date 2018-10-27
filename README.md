## Final Project - StockMarketTracker 1.0
### Team Members
* Balaji K Sadagopa
* Suswith Gaddam

### Project Goals
<p>
Build an API driven Cloud hosted application that supports various user interaction mediums. 
</p>

### Key Product features:
***Cloud and External API source details***
<p>
* Google DialogFlow - Machine Learning to recognize and decipher voice and text commands.  <br>
* Yahoo Finance API - Recognize and translate company name to ticker. <br>
* Intrinio Financial Markets Data API - To get the stock details for the stock ticker.<br>
</p>

### What is StockMarketTracker 1.0
<p>
StockMarketTracker 1.0 is a ML-Machine Learning BOT. That can be accessed by google voice or Slack. <br>
  
StockMarketTracker 1.0 is a API component model designed application that can be  instructed verbally over google voice to get the stock quotes for any publicly traded company. Note, with small modification, siri and cortana can also be supported.
StockMarketTracker can also be instructed via slack. <br>

StockMarketTracker uses google DialogFlow Machine Learning API to learn the human voice patterns to pull company name, date and price type from the user. It then uses the company name to get the stock ticker from "Yahoo Finance API". <br>

StockMarketTracker then gets the stock ticker price details from "Intrinio Financial Markets Data API". This information is returned back to the google DialogFlow. <br>



