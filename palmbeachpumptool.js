var apiURL = 'https://bittrex.com/api/v1.1';
var lastNonces = [];

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.jsdelivr.net/mark.js/7.0.0/mark.js"; //"https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.jsdelivr.net/mark.js/7.0.0/mark.min.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.jsdelivr.net/mark.js/7.0.0/mark.es6.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.jsdelivr.net/mark.js/7.0.0/mark.es6.min.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.min.js";
$("head").append(s);
s = document.createElement("script");
 
s.type = "text/javascript";
s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.min.js";
$("head").append(s);

$(".contt").mark("aion");
function getNonce() {
	//var context = document.querySelector(".contt");
	var instance = new Mark(context);
	instance.mark("aion",[ "mark"]);
};

//getNonce();
console.log("bittrex-api-ver1.js file is loaded");