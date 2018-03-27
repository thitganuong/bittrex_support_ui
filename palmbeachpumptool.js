var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
$("head").append(s);

//<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
var s = document.createElement("link");
s.type = "text/css";
s.rel = 'stylesheet';
s.href = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/font-awesome.min.css";
$("head").append(s);

var binanceAllTikersAPI = "https://www.binance.com/api/v1/ticker/allBookTickers";
//var jsonData = "[{\"symbol\":\"ETHBTC\",\"bidPrice\":\"0.06166400\",\"bidQty\":\"54.65900000\",\"askPrice\":\"0.06171600\",\"askQty\":\"0.00100000\"}]";
var jsonData = "";
var listCoin = createTickerList();
var jumpPosition = 0;
var totalMarkNum = 0;
var x = document.getElementsByClassName("grid col-700")[0];
var priceText = "";
var currentTickerName = "";
var priceBTCPair = 0;
var priceUSDPair = 0;
function load() {	
	//add marks
	var context = document.querySelector(".contt");
	var instance = new Mark(context);
	//instance.mark(["(aion)","(BTC)""]);
	instance.mark(listCoin);
	totalMarkNum = document.getElementsByTagName('mark').length;
	
	//add buttons 
	if(totalMarkNum > 0){
		floatButton();
		floatButtonPick();
		floatButtonPre();
		floatButtonNext();
		floatPortfolioButton();
	}
};

function getAllTickers(){
	//|| document.getElementsByClassName("page-title")[0].innerText == "Monthly Issues"
	if( localStorage['listCoin'] === undefined || localStorage['listCoin'] === null|| localStorage['listCoin'] == "null"){
		console.log("Binance list coin was null or at issue page. ");
		var url = "https://www.binance.com/api/v1/ticker/allBookTickers"; 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       // Typical action to be performed when the document is ready:
		    		jsonData = Httpreq.responseText;//JSON.parse(Httpreq.responseText);
		    		localStorage['listCoin'] = jsonData;
		    		console.log("New Binance list coin was cached");
		    		return jsonData;
		    }
		};
		Httpreq.open("GET",url,false);
		Httpreq.send();
	} else {
		console.log("Binance list coin was cached, no need to fetch ");
	}
}

function forceUpdateTickers(){
	delete localStorage['listCoin'];
	listCoin = createTickerList();
}

function createTickerList(){
	//get tickers from binance
	getAllTickers();
	//get tikers
	var json_obj = JSON.parse(localStorage['listCoin']);//JSON.parse(jsonData);
	var i = 0;
	var pair = "BTC";
	var pairUSDT = "USDT";
	var listTicker = [];
	while (i < json_obj.length){
		if(json_obj[i].symbol.includes(pair) && !json_obj[i].symbol.includes(pairUSDT)){
			listTicker.push("("+ json_obj[i].symbol.replace(pair, "") + ")");
		}
		i++;
	}
	console.log("List coin count:"+json_obj.length);
	return listTicker;
}

function jumpToFirstCoin(){
	// jump to first coin
	jumpPosition = 0;
	document.getElementsByTagName('mark')[jumpPosition].scrollIntoView();
	setTicker(jumpPosition);
}

function jumpToPortfolio(){
	document.getElementsByClassName('portfolio-group-title')[1].scrollIntoView();
}

function floatButton(){
	
	var buttonFloat = document.createElement("a");
	buttonFloat.className = "float";
	buttonFloat.addEventListener ("click", jumpToFirstCoin);

	var childElement = document.createElement("i");
	childElement.className = "fa fa-plus my-float"; //fa-plus
	buttonFloat.appendChild(childElement);
	x.appendChild(buttonFloat);
}


function floatPortfolioButton(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var buttonFloat = document.createElement("a");
	buttonFloat.className = "float5";
	buttonFloat.addEventListener ("click", jumpToPortfolio);

	var childElement = document.createElement("i");
	childElement.className = "fa fa-list my-float"; //fa-plus
	buttonFloat.appendChild(childElement);
	x.appendChild(buttonFloat);
}


function floatButtonPick(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button1 = document.createElement("a");
	button1.className = "float2";
	button1.addEventListener ("click", jumpToPump);
	var child1 = document.createElement("i");
	child1.className = "fa my-float";

	var ticker = document.getElementsByTagName('mark')[0].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");

	child1.innerHTML = ticker.toUpperCase();
	button1.appendChild(child1);
	x.appendChild(button1);
	
//	<div class="label-container">
//		<div class="label-text">Feedback</div>
//		<i class="fa fa-play label-arrow"></i>
//	</div>
	var labelContainer = document.createElement("div");
		labelContainer.className = "label-container";
	var labelText = document.createElement("div");
		labelText.className = "label-text";
		labelText.innerHTML = priceText;
	var labelArrow = document.createElement("i");
		labelArrow.className = "fa fa-play label-arrow";
	labelContainer.appendChild(labelText);
	labelContainer.appendChild(labelArrow);
	x.appendChild(labelContainer);
		
}

function floatButtonPre(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button3 = document.createElement("a");
	button3.className = "float3";
	button3.addEventListener ("click", jumpBack);
	var child3 = document.createElement("i");
	child3.className = "fa fa-arrow-up my-float";
	//child3.innerHTML = "⬆︎";
	button3.appendChild(child3);
	x.appendChild(button3);
}

function floatButtonNext(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button4 = document.createElement("a");
	button4.className = "float4";
	button4.addEventListener ("click", jumpNext);
	var child4 = document.createElement("i");
	child4.className = "fa fa-arrow-down my-float";
	//child4.innerHTML = "⬇︎︎︎";
	button4.appendChild(child4);
	x.appendChild(button4);
}

function jumpToPump(){
	var ticker = document.getElementsByTagName('mark')[jumpPosition].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");
	var url = 'https://www.binance.com/trade.html?symbol=' + ticker.toUpperCase() +'_BTC';
	var redirectWindow = window.open(url, '_blank');
	redirectWindow.location;
}

function jumpNext(){
	jumpPosition = jumpPosition +1;
	if(jumpPosition >= totalMarkNum){
		jumpPosition = totalMarkNum - 1;
	}
	jumpProcess(jumpPosition);
}

function jumpBack(){
	jumpPosition = jumpPosition - 1 ;
	if(jumpPosition < 0){
		jumpPosition = 0;
	}
	jumpProcess(jumpPosition);
}

function jumpProcess(jumpPosition){	
	console.log("jumpPosition: " + jumpPosition);
	jumpToPosition(jumpPosition);
	setTicker(jumpPosition);
}

function jumpToPosition(jumpPosition){
	document.getElementsByTagName('mark')[jumpPosition].scrollIntoView();
}

function setTicker(jumpPosition){
	var ticker = document.getElementsByTagName('mark')[jumpPosition].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");
	var buttonJump = document.getElementsByClassName('fa my-float');
	buttonJump[1].innerText = ticker.toUpperCase();
	currentTickerName = ticker.toUpperCase();
	//set price view for priceText
	priceText = getPriceInfo(currentTickerName);
}
function getPriceInfo(currentTickerName){
	var btcpair = currentTickerName +"BTC: "+ getTickerPricebyBTC(currentTickerName);
	var usdpair = currentTickerName +"USD: "+ getTickerPricebyUSD(currentTickerName);
	var priceString = btcpair+ "\n" + usdpair;
	return priceString;
}

function getTickerPricebyBTC(currentTickerName){
	var url = "https://api.binance.com/api/v1/ticker/price?symbol="; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	    		priceBTCPair = JSON.parse(Httpreq.responseText).price;//JSON.parse(Httpreq.responseText);
	    		return priceBTCPair;
	    }
	};
	Httpreq.open("GET",url + currentTickerName+ "BTC" ,false);
	Httpreq.send();
}

function getTickerPricebyUSD(currentTickerName){
	var url = "https://api.binance.com/api/v1/ticker/price?symbol="; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	    		priceUSDPair = JSON.parse(Httpreq.responseText).price;//JSON.parse(Httpreq.responseText);
	    		return priceBTCPair;
	    }
	};
	Httpreq.open("GET",url + currentTickerName+ "USDT" ,false);
	Httpreq.send();
}

jQuery(window).load(function () {
	load();
});

window.onkeydown = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   console.log("KEY: " + key);
	   if (key == 69) {//jump to binance  KEY [E]
		   jumpToPump();
	   }else if (key == 87) {//Back KEY [W]
		   jumpBack();
	   }else if (key == 83) {//Next  KEY [S]
		   jumpNext();
	   } else if(key == 85) {//Update list coin to cache KEY [U]
		   console.log("Delete list coin.");
		   forceUpdateTickers();
		   console.log("Binance list updated.");
	   }
	}

console.log("Page is loaded");
