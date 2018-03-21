var apiURL = 'https://bittrex.com/api/v1.1';
var lastNonces = [];

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.min.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.es6.js";
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.es6.min.js";
$("head").append(s);

//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.min.js";
//$("head").append(s);
//s = document.createElement("script");
// 
//s.type = "text/javascript";
//s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.min.js";
//$("head").append(s);


function getNonce() {
	var context = document.querySelector(".contt");
	var instance = new Mark(context);
	instance.mark("aion",[ "mark"]);
};

getNonce();
console.log("bittrex-api-ver1.js file is loaded");