var d=new Date,n=d.getTime();!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Mark=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=function(){function e(n){var i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5e3;t(this,e),this.ctx=n,this.iframes=i,this.exclude=a,this.iframesTimeout=r}return n(e,[{key:"getContexts",value:function(){var e=[];return(void 0!==this.ctx&&this.ctx?NodeList.prototype.isPrototypeOf(this.ctx)?Array.prototype.slice.call(this.ctx):Array.isArray(this.ctx)?this.ctx:"string"==typeof this.ctx?Array.prototype.slice.call(document.querySelectorAll(this.ctx)):[this.ctx]:[]).forEach(function(t){var n=e.filter(function(e){return e.contains(t)}).length>0;-1!==e.indexOf(t)||n||e.push(t)}),e}},{key:"getIframeContents",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},i=void 0;try{var a=e.contentWindow;if(i=a.document,!a||!i)throw new Error("iframe inaccessible")}catch(e){n()}i&&t(i)}},{key:"isIframeBlank",value:function(e){var t="about:blank",n=e.getAttribute("src").trim();return e.contentWindow.location.href===t&&n!==t&&n}},{key:"observeIframeLoad",value:function(e,t,n){var i=this,a=!1,r=null,o=function o(){if(!a){a=!0,clearTimeout(r);try{i.isIframeBlank(e)||(e.removeEventListener("load",o),i.getIframeContents(e,t,n))}catch(e){n()}}};e.addEventListener("load",o),r=setTimeout(o,this.iframesTimeout)}},{key:"onIframeReady",value:function(e,t,n){try{"complete"===e.contentWindow.document.readyState?this.isIframeBlank(e)?this.observeIframeLoad(e,t,n):this.getIframeContents(e,t,n):this.observeIframeLoad(e,t,n)}catch(e){n()}}},{key:"waitForIframes",value:function(e,t){var n=this,i=0;this.forEachIframe(e,function(){return!0},function(e){i++,n.waitForIframes(e.querySelector("html"),function(){--i||t()})},function(e){e||t()})}},{key:"forEachIframe",value:function(t,n,i){var a=this,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},o=t.querySelectorAll("iframe"),s=o.length,c=0;o=Array.prototype.slice.call(o);var l=function(){--s<=0&&r(c)};s||l(),o.forEach(function(t){e.matches(t,a.exclude)?l():a.onIframeReady(t,function(e){n(t)&&(c++,i(e)),l()},l)})}},{key:"createIterator",value:function(e,t,n){return document.createNodeIterator(e,t,n,!1)}},{key:"createInstanceOnIframe",value:function(t){return new e(t.querySelector("html"),this.iframes)}},{key:"compareNodeIframe",value:function(e,t,n){if(e.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_PRECEDING){if(null===t)return!0;if(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING)return!0}return!1}},{key:"getIteratorNode",value:function(e){var t=e.previousNode();return{prevNode:t,node:null===t?e.nextNode():e.nextNode()&&e.nextNode()}}},{key:"checkIframeFilter",value:function(e,t,n,i){var a=!1,r=!1;return i.forEach(function(e,t){e.val===n&&(a=t,r=e.handled)}),this.compareNodeIframe(e,t,n)?(!1!==a||r?!1===a||r||(i[a].handled=!0):i.push({val:n,handled:!0}),!0):(!1===a&&i.push({val:n,handled:!1}),!1)}},{key:"handleOpenIframes",value:function(e,t,n,i){var a=this;e.forEach(function(e){e.handled||a.getIframeContents(e.val,function(e){a.createInstanceOnIframe(e).forEachNode(t,n,i)})})}},{key:"iterateThroughNodes",value:function(e,t,n,i,a){for(var r,o=this,s=this.createIterator(t,e,i),c=[],l=[],u=void 0,h=void 0;void 0,r=o.getIteratorNode(s),h=r.prevNode,u=r.node;)this.iframes&&this.forEachIframe(t,function(e){return o.checkIframeFilter(u,h,e,c)},function(t){o.createInstanceOnIframe(t).forEachNode(e,function(e){return l.push(e)},i)}),l.push(u);l.forEach(function(e){n(e)}),this.iframes&&this.handleOpenIframes(c,e,n,i),a()}},{key:"forEachNode",value:function(e,t,n){var i=this,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},r=this.getContexts(),o=r.length;o||a(),r.forEach(function(r){var s=function(){i.iterateThroughNodes(e,r,t,n,function(){--o<=0&&a()})};i.iframes?i.waitForIframes(r,s):s()})}}],[{key:"matches",value:function(e,t){var n="string"==typeof t?[t]:t,i=e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector;if(i){var a=!1;return n.every(function(t){return!i.call(e,t)||(a=!0,!1)}),a}return!1}}]),e}(),r=function(){function e(n){t(this,e),this.opt=i({},{diacritics:!0,synonyms:{},accuracy:"partially",caseSensitive:!1,ignoreJoiners:!1,ignorePunctuation:[],wildcards:"disabled"},n)}return n(e,[{key:"create",value:function(e){return"disabled"!==this.opt.wildcards&&(e=this.setupWildcardsRegExp(e)),e=this.escapeStr(e),Object.keys(this.opt.synonyms).length&&(e=this.createSynonymsRegExp(e)),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),this.opt.diacritics&&(e=this.createDiacriticsRegExp(e)),e=this.createMergedBlanksRegExp(e),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.createJoinersRegExp(e)),"disabled"!==this.opt.wildcards&&(e=this.createWildcardsRegExp(e)),e=this.createAccuracyRegExp(e),new RegExp(e,"gm"+(this.opt.caseSensitive?"":"i"))}},{key:"escapeStr",value:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}},{key:"createSynonymsRegExp",value:function(e){var t=this.opt.synonyms,n=this.opt.caseSensitive?"":"i",i=this.opt.ignoreJoiners||this.opt.ignorePunctuation.length?"\0":"";for(var a in t)if(t.hasOwnProperty(a)){var r=t[a],o="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(a):this.escapeStr(a),s="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(r):this.escapeStr(r);""!==o&&""!==s&&(e=e.replace(new RegExp("("+this.escapeStr(o)+"|"+this.escapeStr(s)+")","gm"+n),i+"("+this.processSynonyms(o)+"|"+this.processSynonyms(s)+")"+i))}return e}},{key:"processSynonyms",value:function(e){return(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),e}},{key:"setupWildcardsRegExp",value:function(e){return(e=e.replace(/(?:\\)*\?/g,function(e){return"\\"===e.charAt(0)?"?":""})).replace(/(?:\\)*\*/g,function(e){return"\\"===e.charAt(0)?"*":""})}},{key:"createWildcardsRegExp",value:function(e){var t="withSpaces"===this.opt.wildcards;return e.replace(/\u0001/g,t?"[\\S\\s]?":"\\S?").replace(/\u0002/g,t?"[\\S\\s]*?":"\\S*")}},{key:"setupIgnoreJoinersRegExp",value:function(e){return e.replace(/[^(|)\\]/g,function(e,t,n){var i=n.charAt(t+1);return/[(|)\\]/.test(i)||""===i?e:e+"\0"})}},{key:"createJoinersRegExp",value:function(e){var t=[],n=this.opt.ignorePunctuation;return Array.isArray(n)&&n.length&&t.push(this.escapeStr(n.join(""))),this.opt.ignoreJoiners&&t.push("\\u00ad\\u200b\\u200c\\u200d"),t.length?e.split(/\u0000+/).join("["+t.join("")+"]*"):e}},{key:"createDiacriticsRegExp",value:function(e){var t=this.opt.caseSensitive?"":"i",n=this.opt.caseSensitive?["aàáảãạăằắẳẵặâầấẩẫậäåāą","AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćč","CÇĆČ","dđď","DĐĎ","eèéẻẽẹêềếểễệëěēę","EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïī","IÌÍỈĨỊÎÏĪ","lł","LŁ","nñňń","NÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøō","OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rř","RŘ","sšśșş","SŠŚȘŞ","tťțţ","TŤȚŢ","uùúủũụưừứửữựûüůū","UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿ","YÝỲỶỸỴŸ","zžżź","ZŽŻŹ"]:["aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćčCÇĆČ","dđďDĐĎ","eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïīIÌÍỈĨỊÎÏĪ","lłLŁ","nñňńNÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rřRŘ","sšśșşSŠŚȘŞ","tťțţTŤȚŢ","uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿYÝỲỶỸỴŸ","zžżźZŽŻŹ"],i=[];return e.split("").forEach(function(a){n.every(function(n){if(-1!==n.indexOf(a)){if(i.indexOf(n)>-1)return!1;e=e.replace(new RegExp("["+n+"]","gm"+t),"["+n+"]"),i.push(n)}return!0})}),e}},{key:"createMergedBlanksRegExp",value:function(e){return e.replace(/[\s]+/gim,"[\\s]+")}},{key:"createAccuracyRegExp",value:function(e){var t=this,n=this.opt.accuracy,i="string"==typeof n?n:n.value,a="";switch(("string"==typeof n?[]:n.limiters).forEach(function(e){a+="|"+t.escapeStr(e)}),i){case"partially":default:return"()("+e+")";case"complementary":return"()([^"+(a="\\s"+(a||this.escapeStr("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~¡¿")))+"]*"+e+"[^"+a+"]*)";case"exactly":return"(^|\\s"+a+")("+e+")(?=$|\\s"+a+")"}}}]),e}(),o=function(){function o(e){t(this,o),this.ctx=e,this.ie=!1;var n=window.navigator.userAgent;(n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1)&&(this.ie=!0)}return n(o,[{key:"log",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"debug",i=this.opt.log;this.opt.debug&&"object"===(void 0===i?"undefined":e(i))&&"function"==typeof i[n]&&i[n]("mark.js: "+t)}},{key:"getSeparatedKeywords",value:function(e){var t=this,n=[];return e.forEach(function(e){t.opt.separateWordSearch?e.split(" ").forEach(function(e){e.trim()&&-1===n.indexOf(e)&&n.push(e)}):e.trim()&&-1===n.indexOf(e)&&n.push(e)}),{keywords:n.sort(function(e,t){return t.length-e.length}),length:n.length}}},{key:"isNumeric",value:function(e){return Number(parseFloat(e))==e}},{key:"checkRanges",value:function(e){var t=this;if(!Array.isArray(e)||"[object Object]"!==Object.prototype.toString.call(e[0]))return this.log("markRanges() will only accept an array of objects"),this.opt.noMatch(e),[];var n=[],i=0;return e.sort(function(e,t){return e.start-t.start}).forEach(function(e){var a=t.callNoMatchOnInvalidRanges(e,i),r=a.start,o=a.end;a.valid&&(e.start=r,e.length=o-r,n.push(e),i=o)}),n}},{key:"callNoMatchOnInvalidRanges",value:function(e,t){var n=void 0,i=void 0,a=!1;return e&&void 0!==e.start?(i=(n=parseInt(e.start,10))+parseInt(e.length,10),this.isNumeric(e.start)&&this.isNumeric(e.length)&&i-t>0&&i-n>0?a=!0:(this.log("Ignoring invalid or overlapping range: "+JSON.stringify(e)),this.opt.noMatch(e))):(this.log("Ignoring invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:n,end:i,valid:a}}},{key:"checkWhitespaceRanges",value:function(e,t,n){var i=void 0,a=!0,r=n.length,o=t-r,s=parseInt(e.start,10)-o;return(i=(s=s>r?r:s)+parseInt(e.length,10))>r&&(i=r,this.log("End range automatically set to the max value of "+r)),s<0||i-s<0||s>r||i>r?(a=!1,this.log("Invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)):""===n.substring(s,i).replace(/\s+/g,"")&&(a=!1,this.log("Skipping whitespace only range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:s,end:i,valid:a}}},{key:"getTextNodes",value:function(e){var t=this,n="",i=[];this.iterator.forEachNode(NodeFilter.SHOW_TEXT,function(e){i.push({start:n.length,end:(n+=e.textContent).length,node:e})},function(e){return t.matchesExclude(e.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},function(){e({value:n,nodes:i})})}},{key:"matchesExclude",value:function(e){return a.matches(e,this.opt.exclude.concat(["script","style","title","head","html"]))}},{key:"wrapRangeInTextNode",value:function(e,t,n){var i=this.opt.element?this.opt.element:"mark",a=e.splitText(t),r=a.splitText(n-t),o=document.createElement(i);o.setAttribute("data-markjs","true");var s=document.createElement("a"),c=document.createTextNode(a.textContent);s.appendChild(c);var l=a.textContent.replace("(","");return l=l.replace(")",""),s.setAttribute("href","https://www.binance.com/trade.html?symbol="+l.toUpperCase()+"_BTC"),o.appendChild(s),this.opt.className&&o.setAttribute("class",this.opt.className),a.parentNode.replaceChild(o,a),r}},{key:"wrapRangeInMappedTextNode",value:function(e,t,n,i,a){var r=this;e.nodes.every(function(o,s){var c=e.nodes[s+1];if(void 0===c||c.start>t){if(!i(o.node))return!1;var l=t-o.start,u=(n>o.end?o.end:n)-o.start,h=e.value.substr(0,o.start),p=e.value.substr(u+o.start);if(o.node=r.wrapRangeInTextNode(o.node,l,u),e.value=h+p,e.nodes.forEach(function(t,n){n>=s&&(e.nodes[n].start>0&&n!==s&&(e.nodes[n].start-=u),e.nodes[n].end-=u)}),n-=u,a(o.node.previousSibling,o.start),!(n>o.end))return!1;t=o.end}return!0})}},{key:"wrapGroups",value:function(e,t,n,i){return i((e=this.wrapRangeInTextNode(e,t,t+n)).previousSibling),e}},{key:"separateGroups",value:function(e,t,n,i,a){for(var r=t.length,o=1;o<r;o++){var s=e.textContent.indexOf(t[o]);t[o]&&s>-1&&i(t[o],e)&&(e=this.wrapGroups(e,s,t[o].length,a))}return e}},{key:"wrapMatches",value:function(e,t,n,i,a){var r=this,o=0===t?0:t+1;this.getTextNodes(function(t){t.nodes.forEach(function(t){t=t.node;for(var a=void 0;null!==(a=e.exec(t.textContent))&&""!==a[o];){if(r.opt.separateGroups)t=r.separateGroups(t,a,o,n,i);else{if(!n(a[o],t))continue;var s=a.index;if(0!==o)for(var c=1;c<o;c++)s+=a[c].length;t=r.wrapGroups(t,s,a[o].length,i)}e.lastIndex=0}}),a()})}},{key:"wrapMatchesAcrossElements",value:function(e,t,n,i,a){var r=this,o=0===t?0:t+1;this.getTextNodes(function(t){for(var s=void 0;null!==(s=e.exec(t.value))&&""!==s[o];){var c=s.index;if(0!==o)for(var l=1;l<o;l++)c+=s[l].length;var u=c+s[o].length;r.wrapRangeInMappedTextNode(t,c,u,function(e){return n(s[o],e)},function(t,n){e.lastIndex=n,i(t)})}a()})}},{key:"wrapRangeFromIndex",value:function(e,t,n,i){var a=this;this.getTextNodes(function(r){var o=r.value.length;e.forEach(function(e,i){var s=a.checkWhitespaceRanges(e,o,r.value),c=s.start,l=s.end;s.valid&&a.wrapRangeInMappedTextNode(r,c,l,function(n){return t(n,e,r.value.substring(c,l),i)},function(t){n(t,e)})}),i()})}},{key:"unwrapMatches",value:function(e){for(var t=e.parentNode,n=document.createDocumentFragment();e.firstChild;)n.appendChild(e.removeChild(e.firstChild));t.replaceChild(n,e),this.ie?this.normalizeTextNode(t):t.normalize()}},{key:"normalizeTextNode",value:function(e){if(e){if(3===e.nodeType)for(;e.nextSibling&&3===e.nextSibling.nodeType;)e.nodeValue+=e.nextSibling.nodeValue,e.parentNode.removeChild(e.nextSibling);else this.normalizeTextNode(e.firstChild);this.normalizeTextNode(e.nextSibling)}}},{key:"markRegExp",value:function(e,t){var n=this;this.opt=t,this.log('Searching with expression "'+e+'"');var i=0,a="wrapMatches";this.opt.acrossElements&&(a="wrapMatchesAcrossElements"),this[a](e,this.opt.ignoreGroups,function(e,t){return n.opt.filter(t,e,i)},function(e){i++,n.opt.each(e)},function(){0===i&&n.opt.noMatch(e),n.opt.done(i)})}},{key:"mark",value:function(e,t){var n=this;this.opt=t;var i=0,a="wrapMatches",o=this.getSeparatedKeywords("string"==typeof e?[e]:e),s=o.keywords,c=o.length;this.opt.acrossElements&&(a="wrapMatchesAcrossElements"),0===c?this.opt.done(i):function e(t){var o=new r(n.opt).create(t),l=0;n.log('Searching with expression "'+o+'"'),n[a](o,1,function(e,a){return n.opt.filter(a,t,i,l)},function(e){l++,i++,n.opt.each(e)},function(){0===l&&n.opt.noMatch(t),s[c-1]===t?n.opt.done(i):e(s[s.indexOf(t)+1])})}(s[0])}},{key:"markRanges",value:function(e,t){var n=this;this.opt=t;var i=0,a=this.checkRanges(e);a&&a.length?(this.log("Starting to mark with the following ranges: "+JSON.stringify(a)),this.wrapRangeFromIndex(a,function(e,t,i,a){return n.opt.filter(e,t,i,a)},function(e,t){i++,n.opt.each(e,t)},function(){n.opt.done(i)})):this.opt.done(i)}},{key:"unmark",value:function(e){var t=this;this.opt=e;var n=this.opt.element?this.opt.element:"*";n+="[data-markjs]",this.opt.className&&(n+="."+this.opt.className),this.log('Removal selector "'+n+'"'),this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT,function(e){t.unwrapMatches(e)},function(e){var i=a.matches(e,n),r=t.matchesExclude(e);return!i||r?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},this.opt.done)}},{key:"opt",set:function(e){this._opt=i({},{element:"",className:"",exclude:[],iframes:!1,iframesTimeout:5e3,separateWordSearch:!0,acrossElements:!1,ignoreGroups:0,each:function(){},noMatch:function(){},filter:function(){return!0},done:function(){},debug:!1,log:window.console},e)},get:function(){return this._opt}},{key:"iterator",get:function(){return new a(this.ctx,this.opt.iframes,this.opt.exclude,this.opt.iframesTimeout)}}]),o}();return function(e){var t=this,n=new o(e);return this.mark=function(e,i){return n.mark(e,i),t},this.markRegExp=function(e,i){return n.markRegExp(e,i),t},this.markRanges=function(e,i){return n.markRanges(e,i),t},this.unmark=function(e){return n.unmark(e),t},this}});var s=document.createElement("link");s.type="text/css",s.rel="stylesheet",s.href="https://cdn.rawgit.com/thitganuong/bittrex_support_ui/d8aa04e9/dist/font-awesome.min.css",$("head").append(s);var binanceAllTikersAPI="https://www.binance.com/api/v1/ticker/allBookTickers",jsonData="",listCoin=createTickerList(),jumpPosition=0,totalMarkNum=0,x=document.getElementsByClassName("grid col-700")[0],priceText="",currentTickerName="",priceBTCPair=0,priceUSDPair=0,serverTime="";function load(){var e=document.querySelector(".contt");new Mark(e).mark(listCoin),(totalMarkNum=document.getElementsByTagName("mark").length)>0&&(floatButton(),floatButtonPick(),floatButtonPre(),floatButtonNext(),floatPortfolioButton())}function getAllTickers(){if(void 0===localStorage.listCoin||null===localStorage.listCoin||"null"==localStorage.listCoin){console.log("Binance list coin was null or at issue page. ");var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return jsonData=e.responseText,localStorage.listCoin=jsonData,console.log("New Binance list coin was cached"),jsonData},e.open("GET","https://www.binance.com/api/v1/ticker/allBookTickers",!1),e.send()}else console.log("Binance list coin was cached, no need to fetch ")}function forceUpdateTickers(){delete localStorage.listCoin,listCoin=createTickerList()}function createTickerList(){getAllTickers();for(var e=JSON.parse(localStorage.listCoin),t=0,n=[];t<e.length;)e[t].symbol.includes("BTC")&&!e[t].symbol.includes("USDT")&&n.push("("+e[t].symbol.replace("BTC","")+")"),t++;return console.log("List coin count:"+e.length),n}function jumpToFirstCoin(){jumpPosition=0,document.getElementsByTagName("mark")[jumpPosition].scrollIntoView(),setTicker(jumpPosition)}function jumpToPortfolio(){document.getElementsByClassName("portfolio-group-title")[1].scrollIntoView()}function floatButton(){var e=document.createElement("a");e.className="float",e.addEventListener("click",jumpToFirstCoin);var t=document.createElement("i");if(t.className="fa fa-plus my-float",e.appendChild(t),x.appendChild(e),console.log("Load pick button: "+(n-getTime())/1e3),"undefined"!=typeof autoSend&&autoSend){var i=document.getElementsByTagName("mark")[0].textContent;sendMessage_Shark_tank_home_signal(i=(i=i.replace("(","")).replace(")",""),getTime()),sendMessage_Shark_UX_Signal(i,getTime()),sendMessage_Shark_tank_JP_Signal(i,getTime()),sendMessage_Shark_Tank_FU_Signal(i,getTime()),getDetailPricebyBTC(i)}}function floatPortfolioButton(){var e=document.createElement("a");e.className="float5",e.addEventListener("click",jumpToPortfolio);var t=document.createElement("i");t.className="fa fa-list my-float",e.appendChild(t),x.appendChild(e)}function floatButtonPick(){var e=document.createElement("a");e.className="float2",e.addEventListener("click",jumpToPump);var t=document.createElement("i");t.className="fa my-float";var i=document.getElementsByTagName("mark")[0].textContent;i=(i=i.replace("(","")).replace(")",""),t.innerHTML=i.toUpperCase(),e.appendChild(t),x.appendChild(e),console.log("Load jump pick button: "+(n-getTime())/1e3);var a=document.createElement("div");a.className="label-container";var r=document.createElement("div");r.className="label-text",r.innerHTML=priceText;var o=document.createElement("i");o.className="fa fa-play label-arrow",a.appendChild(r),a.appendChild(o),x.appendChild(a),getTickerPricebyBTC(i.toUpperCase()),getTickerPricebyUSD(i.toUpperCase())}function floatButtonPre(){var e=document.createElement("a");e.className="float3",e.addEventListener("click",jumpBack);var t=document.createElement("i");t.className="fa fa-arrow-up my-float",e.appendChild(t),x.appendChild(e)}function floatButtonNext(){var e=document.createElement("a");e.className="float4",e.addEventListener("click",jumpNext);var t=document.createElement("i");t.className="fa fa-arrow-down my-float",e.appendChild(t),x.appendChild(e)}function jumpToPump(){var e=document.getElementsByTagName("mark")[jumpPosition].textContent,t="https://www.binance.com/trade.html?symbol="+(e=(e=e.replace("(","")).replace(")","")).toUpperCase()+"_BTC";window.open(t,"_blank").location}function jumpNext(){(jumpPosition+=1)>=totalMarkNum&&(jumpPosition=totalMarkNum-1),jumpProcess(jumpPosition)}function jumpBack(){(jumpPosition-=1)<0&&(jumpPosition=0),jumpProcess(jumpPosition)}function jumpProcess(e){console.log("jumpPosition: "+e),jumpToPosition(e),setTicker(e)}function jumpToPosition(e){document.getElementsByTagName("mark")[e].scrollIntoView()}function setTicker(e){var t=document.getElementsByTagName("mark")[e].textContent;t=(t=t.replace("(","")).replace(")",""),document.getElementsByClassName("fa my-float")[1].innerText=t.toUpperCase(),getTickerPricebyBTC(currentTickerName=t.toUpperCase()),getTickerPricebyUSD(currentTickerName)}function getPriceInfo(e){return e+"BTC: "+getTickerPricebyBTC(e)}function getTickerPricebyBTC(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return priceBTCPair=JSON.parse(t.responseText).price,document.getElementsByClassName("label-text")[0].innerText=priceBTCPair+"Ƀ",priceBTCPair},t.open("GET","https://api.binance.com/api/v1/ticker/price?symbol="+e+"BTC",!1),t.send()}function getTickerPricebyUSD(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return priceUSDPair=JSON.parse(t.responseText).price,document.getElementsByClassName("label-text")[0].innerText=priceBTCPair+"Ƀ\n"+priceUSDPair+"$",priceBTCPair},t.open("GET","https://api.binance.com/api/v1/ticker/price?symbol="+e+"USDT",!1),t.send()}function getDetailPricebyBTC(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var n=JSON.parse(t.responseText),i=n[0][2],a=n[0][3],r=n[0][4];console.log("Param: "+i+" "+a+" "+r),sendMessageDetailPrice(e,i,a,r,Shark_tank_home_signal),sendMessageDetailPrice(e,i,a,r,Shark_UX_Signal),sendMessageDetailPrice(e,i,a,r,Shark_Tank_FU_Signal),sendMessageDetailPrice(e,i,a,r,Shark_tank_JP_Signal)}},t.open("GET","https://api.binance.com/api/v1/klines?interval=5m&limit=1&symbol="+e+"BTC",!1),t.send()}function getServerTime(){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return serverTime=JSON.parse(e.responseText).serverTime},e.open("GET","https://api.binance.com/api/v1/time",!1),e.send()}function buyNow(){getServerTime();var e=new XMLHttpRequest;e.open("POST","https://api.binance.com/api/v3/order/test",!0),e.setRequestHeader("X-MBX-APIKEY",API_Key),e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log(this.responseText)};var t="symbol=LTCBTC&side=BUY&type=MARKET&quantity=1&recvWindow=6000000&timestamp="+serverTime,n=t+"&signature="+CryptoJS.HmacSHA256(t,Secret).toString();console.log("Param: "+n),e.send(n)}function randomText(){var e=["%0A%0A☝️MÚÚÚÚÚÚÚÚCCCC!!!","%0A%0A☝️MÚUUUUUUUTTTTT🔥🔥","%0A%0A🔥🔥BUY THE TOP💣🔥","%0A%0A🔥🔥ĐU ĐỈNH NGAY💀💀","%0A%0A🔥🔥PUMP NOW SIR!🔥🔥"];return e[Math.floor(Math.random()*e.length)]}function sendMessage_Shark_UX_Signal(e,t){if(void 0!=e&&""!=e&&null!=e){var n="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+Shark_UX_Signal+"&text=https://www.binance.com/trade.html?symbol="+e.toUpperCase()+"_BTC"+randomText()+" ("+(t-getTime()/1e3)+"s)",i=new XMLHttpRequest;i.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("Shark_UX_Signal: "+e)},i.open("GET",n,!0),i.send()}}function sendMessage_Shark_tank_home_signal(e,t){if(void 0!=e&&""!=e&&null!=e){var n="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+Shark_tank_home_signal+"&text=https://www.binance.com/trade.html?symbol="+e.toUpperCase()+"_BTC"+randomText()+" ("+(t-getTime()/1e3)+"s)",i=new XMLHttpRequest;i.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("Shark_tank_home_signal:"+e)},i.open("GET",n,!0),i.send()}}function sendMessage_Shark_tank_JP_Signal(e,t){if(void 0!=e&&""!=e&&null!=e){var n="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+Shark_tank_JP_Signal+"&text=https://www.binance.com/trade.html?symbol="+e.toUpperCase()+"_BTC"+randomText()+" ("+(t-getTime()/1e3)+"s)",i=new XMLHttpRequest;i.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("Shark_tank_JP_Signal: "+e)},i.open("GET",n,!0),i.send()}}function sendMessage_Shark_Tank_FU_Signal(e,t){if(void 0!=e&&""!=e&&null!=e){var n="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+Shark_Tank_FU_Signal+"&text=https://www.binance.com/trade.html?symbol="+e.toUpperCase()+"_BTC"+randomText()+" ("+(t-getTime()/1e3)+"s)",i=new XMLHttpRequest;i.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("Shark_Tank_FU_Signal: "+e)},i.open("GET",n,!0),i.send()}}function sendMessageDetailPrice(e,t,n,i,a){var r="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+a+"&text="+("Max: "+t+"Ƀ%0AMin: "+n+"Ƀ%0ACurrent: "+i+"Ƀ%0A%0A Let The Game Come To You👈🙏✌️👌🚀"),o=new XMLHttpRequest;o.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("CurrentPrice: "+i)},o.open("GET",r,!0),o.send()}function getTime(){return(new Date).getTime()}jQuery(window).load(function(){}),window.onkeydown=function(e){var t=e.keyCode?e.keyCode:e.which;if(console.log("KEY: "+t),69==t)jumpToPump();else if(87==t)jumpBack();else if(83==t)jumpNext();else if(84==t){if("undefined"!=typeof autoSend){var n=document.getElementsByTagName("mark")[0].textContent;sendMessage_Shark_tank_home_signal(n=(n=n.replace("(","")).replace(")",""),getTime()),sendMessage_Shark_UX_Signal(n,getTime()),sendMessage_Shark_tank_JP_Signal(n,getTime()),sendMessage_Shark_Tank_FU_Signal(n,getTime()),getDetailPricebyBTC(n)}}else 85==t&&(console.log("Delete list coin."),forceUpdateTickers(),console.log("Binance list updated."))},load(),console.log("Page is loaded");var CryptoJS=CryptoJS||function(e,t){var n={},i=n.lib={},a=function(){},r=i.Base={extend:function(e){a.prototype=this;var t=new a;return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},o=i.WordArray=r.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=void 0!=t?t:4*e.length},toString:function(e){return(e||c).stringify(this)},concat:function(e){var t=this.words,n=e.words,i=this.sigBytes;if(e=e.sigBytes,this.clamp(),i%4)for(var a=0;a<e;a++)t[i+a>>>2]|=(n[a>>>2]>>>24-a%4*8&255)<<24-(i+a)%4*8;else if(65535<n.length)for(a=0;a<e;a+=4)t[i+a>>>2]=n[a>>>2];else t.push.apply(t,n);return this.sigBytes+=e,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=r.clone.call(this);return e.words=this.words.slice(0),e},random:function(t){for(var n=[],i=0;i<t;i+=4)n.push(4294967296*e.random()|0);return new o.init(n,t)}}),s=n.enc={},c=s.Hex={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],i=0;i<e;i++){var a=t[i>>>2]>>>24-i%4*8&255;n.push((a>>>4).toString(16)),n.push((15&a).toString(16))}return n.join("")},parse:function(e){for(var t=e.length,n=[],i=0;i<t;i+=2)n[i>>>3]|=parseInt(e.substr(i,2),16)<<24-i%8*4;return new o.init(n,t/2)}},l=s.Latin1={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],i=0;i<e;i++)n.push(String.fromCharCode(t[i>>>2]>>>24-i%4*8&255));return n.join("")},parse:function(e){for(var t=e.length,n=[],i=0;i<t;i++)n[i>>>2]|=(255&e.charCodeAt(i))<<24-i%4*8;return new o.init(n,t)}},u=s.Utf8={stringify:function(e){try{return decodeURIComponent(escape(l.stringify(e)))}catch(e){throw Error("Malformed UTF-8 data")}},parse:function(e){return l.parse(unescape(encodeURIComponent(e)))}},h=i.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=u.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n=this._data,i=n.words,a=n.sigBytes,r=this.blockSize,s=a/(4*r);if(t=(s=t?e.ceil(s):e.max((0|s)-this._minBufferSize,0))*r,a=e.min(4*t,a),t){for(var c=0;c<t;c+=r)this._doProcessBlock(i,c);c=i.splice(0,t),n.sigBytes-=a}return new o.init(c,a)},clone:function(){var e=r.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});i.Hasher=h.extend({cfg:r.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new p.HMAC.init(e,n).finalize(t)}}});var p=n.algo={};return n}(Math);!function(e){for(var t=CryptoJS,n=(a=t.lib).WordArray,i=a.Hasher,a=t.algo,r=[],o=[],s=function(e){return 4294967296*(e-(0|e))|0},c=2,l=0;64>l;){var u;e:{u=c;for(var h=e.sqrt(u),p=2;p<=h;p++)if(!(u%p)){u=!1;break e}u=!0}u&&(8>l&&(r[l]=s(e.pow(c,.5))),o[l]=s(e.pow(c,1/3)),l++),c++}var d=[];a=a.SHA256=i.extend({_doReset:function(){this._hash=new n.init(r.slice(0))},_doProcessBlock:function(e,t){for(var n=this._hash.words,i=n[0],a=n[1],r=n[2],s=n[3],c=n[4],l=n[5],u=n[6],h=n[7],p=0;64>p;p++){if(16>p)d[p]=0|e[t+p];else{var f=d[p-15],m=d[p-2];d[p]=((f<<25|f>>>7)^(f<<14|f>>>18)^f>>>3)+d[p-7]+((m<<15|m>>>17)^(m<<13|m>>>19)^m>>>10)+d[p-16]}f=h+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&l^~c&u)+o[p]+d[p],m=((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+(i&a^i&r^a&r),h=u,u=l,l=c,c=s+f|0,s=r,r=a,a=i,i=f+m|0}n[0]=n[0]+i|0,n[1]=n[1]+a|0,n[2]=n[2]+r|0,n[3]=n[3]+s|0,n[4]=n[4]+c|0,n[5]=n[5]+l|0,n[6]=n[6]+u|0,n[7]=n[7]+h|0},_doFinalize:function(){var t=this._data,n=t.words,i=8*this._nDataBytes,a=8*t.sigBytes;return n[a>>>5]|=128<<24-a%32,n[14+(a+64>>>9<<4)]=e.floor(i/4294967296),n[15+(a+64>>>9<<4)]=i,t.sigBytes=4*n.length,this._process(),this._hash},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=i._createHelper(a),t.HmacSHA256=i._createHmacHelper(a)}(Math),function(){var e=CryptoJS,t=e.enc.Utf8;e.algo.HMAC=e.lib.Base.extend({init:function(e,n){e=this._hasher=new e.init,"string"==typeof n&&(n=t.parse(n));var i=e.blockSize,a=4*i;n.sigBytes>a&&(n=e.finalize(n)),n.clamp();for(var r=this._oKey=n.clone(),o=this._iKey=n.clone(),s=r.words,c=o.words,l=0;l<i;l++)s[l]^=1549556828,c[l]^=909522486;r.sigBytes=o.sigBytes=a,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher;return e=t.finalize(e),t.reset(),t.finalize(this._oKey.clone().concat(e))}})}();