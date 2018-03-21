var apiURL = 'https://bittrex.com/api/v1.1';
var lastNonces = [];

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js"; //"https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
$("head").append(s);


var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://raw.githubusercontent.com/bartaz/sandbox.js/master/jquery.highlight.js";
$("head").append(s);

	
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.min.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.es6.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.es6.min.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.min.js";
//$("head").append(s);
//s = document.createElement("script");
// 
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.js";
//$("head").append(s);
//
//s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/master/dist/jquery.mark.es6.min.js";
//$("head").append(s);

//var buttonLoad = document.createElement("button");
//buttonLoad.innerHTML = "(.)(.)";
//buttonLoad.className = "btn btn-default btn-toolbar";
//$(buttonLoad).insertBefore($('#cursor-pointer').find('[type=button]'));
//buttonLoad.addEventListener ("click", load);

function load() {
//	var context = document.querySelector(".contt");
//	var instance = new Mark(context);
//	instance.mark("aion",[ "mark"]);
	
	$('#contt').highlight('aion');
};

jQuery(window).load(function () {
	load();
	  // alert('page is loaded');
	   
//	    setTimeout(function () {
//	        alert('page is loaded and 1 minute has passed');   
//	    }, 6); 
});


//getNonce();
console.log("bittrex-api-ver1.js file is loaded");