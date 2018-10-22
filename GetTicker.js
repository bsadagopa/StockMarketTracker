//
// UNIT TEST CODE
//
//Not used in deployed application, used only for local testing.

const https = require('https');
const http = require('http');
var request = require('request');
// var dt = require('./myfirstmodule');


// var url = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?\
// query=microsoft&region=US&lang=en-US&row=ALL&\
// callback=YAHOO.Finance.SymbolSuggest.ssCallback';

// request(url, function(err, resp, body){
//     ticker = JSON.parse(body.split("(")[1].split(")")[0]).ResultSet.Result[0].symbol;
//     console.log("Stock Ticker = " + ticker);
// });

var companyName = "microsoft"; //"wells fargo";
var priceType = "closing";
var date = "2018-10-22T12:00:00-02:00";

var tickerPathString = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=" +
	companyName +
	"&region=US&lang=en-US&row=ALL&callback=YAHOO.Finance.SymbolSuggest.ssCallback";

http.get(tickerPathString, (res) => {
	//console.log('statusCode:', res.statusCode);
	//console.log('headers:', res.headers);

	console.log("+++++++++++++++++++++");
	console.log("Date = " + date);
	console.log("Current Time = " + new Date().getTime());
	if(isfutureDate(date))  {
		console.log("I have not learnt future predictions yet, so cannot provide stock quote for future dates.")
		return;
	}

	var stockTicker = "";
	res.on('data', (d) => {
		output = d.toString();
		//process.stdout.write(output);
		jsonVal = output.split("(")[1].split(")")[0];
		console.log(jsonVal); //.split(")")[0]).ResultSet.Result[0].symbol;
		console.log(JSON.parse(jsonVal).ResultSet.Result[0].symbol);
		stockTicker = JSON.parse(jsonVal).ResultSet.Result[0].symbol;
		stockTicker = stockTicker.split('-')[0];
		var seconds = 1;
		while (stockTicker === '') {
			var waitTill = new Date(new Date().getTime() + seconds * 1000);
			while (waitTill > new Date()) {}
		}
		if (stockTicker !== '') {
			getStockDetails(companyName, stockTicker, priceType, date);
		}
		console.log("Stock Ticker = " + stockTicker);
	});

}).on('error', (e) => {
	console.error(e);
});


function getStockDetails(companyName, stockTicker, priceType, date) {

	console.log(" Inside getStockDetails() ");

	var priceMap = {
		"opening": "open_price",
		"closing": "close_price",
		"maximum": "high_price",
		"high": "high_price",
		"low": "low_price",
		"minimum": "low_price"
	};

	//var stockTicker = tickerMap[companyName.toLowerCase()];
	var priceTypeCode = priceMap[priceType.toLowerCase()];
	console.log('pricetypecode: ' + priceTypeCode);
	if (priceTypeCode == "undefined") {
		priceTypeCode = "close_price";
	}
	//priceTypeCode = "close_price";

	var pathString = "/historical_data?ticker=" + stockTicker + "&item=" + priceTypeCode +
		"&start_date=" + date +
		"&end_date=" + date;

	console.log('path string:' + pathString);

	var username = "552e505aa4a022dc4af3223aa92c772e";
	var password = "31493e00d8c1631994624b330d44e95b";

	var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');

	console.log("AUTH = " + auth);

	var request = https.get({
		host: "api.intrinio.com",
		path: pathString,
		headers: {
			"Authorization": auth
		}
	}, function (response) {
		var json = "";
		response.on('data', function (chunk) {
			json += chunk;
			console.log("CHUNK..." + chunk);
			console.log("JSON..." + json);
		});
		response.on('end', function () {
			var jsonData = JSON.parse(json);
			var stockPrice = jsonData.data[0].value;

			console.log("the stock price received is:" + stockPrice);

			var chat = "The" + priceType + " price for " + companyName +
				" on " + date + " was " + stockPrice;

			return chat;

		});
	});
	request.end();
}

function isfutureDate(value) {
	var now = new Date();
	var target = new Date(value);

	if (target.getFullYear() > now.getFullYear()) {
		return true;
	} 
	else if (target.getFullYear() == now.getFullYear()) {
		if (target.getMonth() > now.getMonth()) {
			return true;
		} 
		else if (target.getMonth() == now.getMonth()) {
			if (target.getDate() > now.getDate()) {
				return true;
			} 
			else if(target.getDate() == now.getDate()) {
				// current time less than market open time then return true
				var time = now.getHours();
				if(time <= 9) {
					return true;
				} 
				else {
					return false;
				}				
			}
			else {
				return false
			}
		}
	}
	else {
		return false;
	}
}