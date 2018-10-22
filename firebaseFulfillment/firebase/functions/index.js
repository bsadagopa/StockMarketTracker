const https = require ('https');
const http = require('http');

const functions = require('firebase-functions');
const DialogFlowApp = require('actions-on-google').DialogFlowApp;

console.log('== Begining ==');
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('Inside Main function.....');
    console.log('Request Headers: ' + JSON.stringify(request.headers));
    console.log('Request Body: ' + JSON.stringify(request.body));
  
    let action = request.body.queryResult.action;
    //const agent = new WebhookClient({ request, response });
    var chat = "here is a sample response: ";
    console.log(action);
    response.setHeader('Content-Type','application/json');
  
    if (action!= 'input.getStockPrice'){
      console.log('Inside input function');
      response.send(buildChatResponse("I'm sorry, I don't know this"));
      return;
    }
    const parameters = request.body.queryResult.parameters;
    
    var companyName = parameters['company_name'];
    var priceType = parameters['price_type'];
    var date = parameters ['date'];
    if(isfutureDate(date))  {
        console.log("Date = " + date);
        console.log("Date is in FUTURE, so return message..");
        chat = "Date is in FUTURE, future predictions are not possible YET!" +
		" so cannot provide " + companyName + " stock quote for " + date;
		console.log(chat);
		response.send(buildChatResponse(chat));
		return;
	}
	
	
    
    getStockPrice (companyName, priceType, date, response);
    
});

//
// Step 1: Get the stock ticker for the company 
// Step 2: Get the stock details
//
function getStockPrice (companyName, priceType, date, CloudFnResponse) {

	console.log('In Function Get Stock Price');

	console.log("company name: " + companyName);
	console.log("price type: " + priceType);
	console.log("Date: " + date);

	// 
	// Step 1: Get the stock ticker for the company 
	// Step 2: Get the stock details
	//
	var stockTicker = "";
	var tickerPathString = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query="
	+ companyName 
	+"&region=US&lang=en-US&row=ALL&callback=YAHOO.Finance.SymbolSuggest.ssCallback";

	http.get(tickerPathString, (res) => {
		//console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);
	
		res.on('data', (d) => {
			output = d.toString();
			//process.stdout.write(output);
			jsonVal = output.split("(")[1].split(")")[0];
			console.log(jsonVal);//.split(")")[0]).ResultSet.Result[0].symbol;
			console.log(JSON.parse(jsonVal).ResultSet.Result[0].symbol);
			
			stockTicker = JSON.parse(jsonVal).ResultSet.Result[0].symbol;
			stockTicker = stockTicker.split('-')[0];
			
			var seconds = 1;
			while(stockTicker === '') {
				var waitTill = new Date(new Date().getTime() + seconds * 1000);
				while(waitTill > new Date()){}
			}
			var msg = "";
			if(stockTicker !== '') {
			    console.log("Stock Ticker = " + stockTicker);
				getStockDetails(companyName, stockTicker, priceType, date, CloudFnResponse);
			}
		});
		
	
	}).on('error', (e) => {
		console.error(e);
		});
	
}

function buildChatResponse(chat) {
	return JSON.stringify({"fulfillmentText": chat});
}

//
// Get the stock ticker details
//
function getStockDetails(companyName, stockTicker, priceType, date, CloudFnResponse) {

	console.log(" Inside getStockDetails() ");
	
	var priceMap = {
		"opening" : "open_price",
		"closing" : "close_price",
		"maximum" : "high_price",
		"high" : "high_price",
		"low" : "low_price",
		"minimum" : "low_price"
	};

	//var stockTicker = tickerMap[companyName.toLowerCase()];
	var priceTypeCode = priceMap[priceType.toLowerCase()];
	console.log ('pricetypecode: ' + priceTypeCode);
	if(priceTypeCode == "undefined")  {
		priceTypeCode = "close_price";
	}
	//priceTypeCode = "close_price";

	var pathString = "/historical_data?ticker=" + stockTicker + "&item=" + priceTypeCode +
	"&start_date=" + date +
	"&end_date=" + date;

	console.log ('path string:' + pathString);

	var username = "552e505aa4a022dc4af3223aa92c772e";
	var password = "31493e00d8c1631994624b330d44e95b";

	var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');

	console.log("AUTH = " + auth);

    var chat = "";
	var request = https.get({
		host: "api.intrinio.com",
		path: pathString,
		headers: {
			"Authorization": auth
		}
		}, function(response) {
			var json = "";
			response.on('data', function (chunk) {
				json += chunk;
				console.log ("CHUNK..."+chunk);
				console.log ("JSON..."+json);
			});
			response.on('end', function(){
				var jsonData = JSON.parse(json);
				var stockPrice = jsonData.data[0].value;

				console.log ("the stock price received is:" + stockPrice);

				var chat = "The " + priceType + " price for " + companyName + 
				" on "  + date + " was " + stockPrice;
				
				console.log (chat);
				
				CloudFnResponse.send(buildChatResponse(chat));

			});
	});
	request.end();
}
//
// Check if date is in future if so return false else true
//
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