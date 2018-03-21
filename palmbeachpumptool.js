var apiURL = 'https://bittrex.com/api/v1.1';
var lastNonces = [];


var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js"; //"https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
$("head").append(s);


//var s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://raw.githubusercontent.com/bartaz/sandbox.js/master/jquery.highlight.js";
//$("head").append(s);

	
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

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

function load() {
	var context = document.querySelector(".contt");
	var instance = new Mark(context);
	instance.mark("aion",[ "span"]);
	
	//$('#contt').highlight('aion');
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