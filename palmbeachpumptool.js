var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js"; 
$("head").append(s);

var binanceAllTikersAPI = "https://www.binance.com/api/v1/ticker/allBookTickers";

function getAllTikers(uriAPI){
	var Httpreq = new XMLHttpRequest(); 
    Httpreq.open("GET",uriAPI,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
} 

function load() {
	//get tikers
	//var json_obj = JSON.parse(getAllTikers(binanceAllTikersAPI));
	c//onsole.log("List "+json_obj[0].symbol);
	
	var context = document.querySelector(".contt");
	var instance = new Mark(context);
	instance.mark(["(aion)","(BTC)","(ETH)","(XMR)","(PPY)","(FCT)","(STORJ)","(ETC)","(DASH)","(XRP)","(OMG)","(ZEN)","(GTO)","(STEEM)","(NEO)","(CND)","(ICN)","(XEM)","(LSK)","(BAT)","(WAVES)","(MAID)","(EOS)","(BNB)","(XLM)","(DRGN)","(WAX)","(VEN)"]);
	addJumpButton();
};

function addJumpButton(){
	var buttonLoad = document.createElement("button");
	buttonLoad.innerHTML = "(.)(.)";
	buttonLoad.className = "btn btn-default btn-toolbar";
	buttonLoad.addEventListener ("click", jumpToFirstCoin);
	document.getElementsByClassName('grid col-700')[0].appendChild(buttonLoad);
}

function jumpToFirstCoin(){
	// jump to first coin 
	document.getElementsByTagName('mark')[0].scrollIntoView();
}

jQuery(window).load(function () {
	load();
});

console.log("Page is loaded");