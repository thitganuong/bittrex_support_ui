!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Mark=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=function(){function e(n){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5e3;t(this,e),this.ctx=n,this.iframes=r,this.exclude=i,this.iframesTimeout=o}return n(e,[{key:"getContexts",value:function(){var e=[];return(void 0!==this.ctx&&this.ctx?NodeList.prototype.isPrototypeOf(this.ctx)?Array.prototype.slice.call(this.ctx):Array.isArray(this.ctx)?this.ctx:"string"==typeof this.ctx?Array.prototype.slice.call(document.querySelectorAll(this.ctx)):[this.ctx]:[]).forEach(function(t){var n=e.filter(function(e){return e.contains(t)}).length>0;-1!==e.indexOf(t)||n||e.push(t)}),e}},{key:"getIframeContents",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},r=void 0;try{var i=e.contentWindow;if(r=i.document,!i||!r)throw new Error("iframe inaccessible")}catch(e){n()}r&&t(r)}},{key:"isIframeBlank",value:function(e){var t="about:blank",n=e.getAttribute("src").trim();return e.contentWindow.location.href===t&&n!==t&&n}},{key:"observeIframeLoad",value:function(e,t,n){var r=this,i=!1,o=null,a=function a(){if(!i){i=!0,clearTimeout(o);try{r.isIframeBlank(e)||(e.removeEventListener("load",a),r.getIframeContents(e,t,n))}catch(e){n()}}};e.addEventListener("load",a),o=setTimeout(a,this.iframesTimeout)}},{key:"onIframeReady",value:function(e,t,n){try{"complete"===e.contentWindow.document.readyState?this.isIframeBlank(e)?this.observeIframeLoad(e,t,n):this.getIframeContents(e,t,n):this.observeIframeLoad(e,t,n)}catch(e){n()}}},{key:"waitForIframes",value:function(e,t){var n=this,r=0;this.forEachIframe(e,function(){return!0},function(e){r++,n.waitForIframes(e.querySelector("html"),function(){--r||t()})},function(e){e||t()})}},{key:"forEachIframe",value:function(t,n,r){var i=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},a=t.querySelectorAll("iframe"),s=a.length,c=0;a=Array.prototype.slice.call(a);var u=function(){--s<=0&&o(c)};s||u(),a.forEach(function(t){e.matches(t,i.exclude)?u():i.onIframeReady(t,function(e){n(t)&&(c++,r(e)),u()},u)})}},{key:"createIterator",value:function(e,t,n){return document.createNodeIterator(e,t,n,!1)}},{key:"createInstanceOnIframe",value:function(t){return new e(t.querySelector("html"),this.iframes)}},{key:"compareNodeIframe",value:function(e,t,n){if(e.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_PRECEDING){if(null===t)return!0;if(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING)return!0}return!1}},{key:"getIteratorNode",value:function(e){var t=e.previousNode();return{prevNode:t,node:null===t?e.nextNode():e.nextNode()&&e.nextNode()}}},{key:"checkIframeFilter",value:function(e,t,n,r){var i=!1,o=!1;return r.forEach(function(e,t){e.val===n&&(i=t,o=e.handled)}),this.compareNodeIframe(e,t,n)?(!1!==i||o?!1===i||o||(r[i].handled=!0):r.push({val:n,handled:!0}),!0):(!1===i&&r.push({val:n,handled:!1}),!1)}},{key:"handleOpenIframes",value:function(e,t,n,r){var i=this;e.forEach(function(e){e.handled||i.getIframeContents(e.val,function(e){i.createInstanceOnIframe(e).forEachNode(t,n,r)})})}},{key:"iterateThroughNodes",value:function(e,t,n,r,i){for(var o,a=this,s=this.createIterator(t,e,r),c=[],u=[],l=void 0,p=void 0;void 0,o=a.getIteratorNode(s),p=o.prevNode,l=o.node;)this.iframes&&this.forEachIframe(t,function(e){return a.checkIframeFilter(l,p,e,c)},function(t){a.createInstanceOnIframe(t).forEachNode(e,function(e){return u.push(e)},r)}),u.push(l);u.forEach(function(e){n(e)}),this.iframes&&this.handleOpenIframes(c,e,n,r),i()}},{key:"forEachNode",value:function(e,t,n){var r=this,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},o=this.getContexts(),a=o.length;a||i(),o.forEach(function(o){var s=function(){r.iterateThroughNodes(e,o,t,n,function(){--a<=0&&i()})};r.iframes?r.waitForIframes(o,s):s()})}}],[{key:"matches",value:function(e,t){var n="string"==typeof t?[t]:t,r=e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector;if(r){var i=!1;return n.every(function(t){return!r.call(e,t)||(i=!0,!1)}),i}return!1}}]),e}(),o=function(){function e(n){t(this,e),this.opt=r({},{diacritics:!0,synonyms:{},accuracy:"partially",caseSensitive:!1,ignoreJoiners:!1,ignorePunctuation:[],wildcards:"disabled"},n)}return n(e,[{key:"create",value:function(e){return"disabled"!==this.opt.wildcards&&(e=this.setupWildcardsRegExp(e)),e=this.escapeStr(e),Object.keys(this.opt.synonyms).length&&(e=this.createSynonymsRegExp(e)),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),this.opt.diacritics&&(e=this.createDiacriticsRegExp(e)),e=this.createMergedBlanksRegExp(e),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.createJoinersRegExp(e)),"disabled"!==this.opt.wildcards&&(e=this.createWildcardsRegExp(e)),e=this.createAccuracyRegExp(e),new RegExp(e,"gm"+(this.opt.caseSensitive?"":"i"))}},{key:"escapeStr",value:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}},{key:"createSynonymsRegExp",value:function(e){var t=this.opt.synonyms,n=this.opt.caseSensitive?"":"i",r=this.opt.ignoreJoiners||this.opt.ignorePunctuation.length?"\0":"";for(var i in t)if(t.hasOwnProperty(i)){var o=t[i],a="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(i):this.escapeStr(i),s="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(o):this.escapeStr(o);""!==a&&""!==s&&(e=e.replace(new RegExp("("+this.escapeStr(a)+"|"+this.escapeStr(s)+")","gm"+n),r+"("+this.processSynonyms(a)+"|"+this.processSynonyms(s)+")"+r))}return e}},{key:"processSynonyms",value:function(e){return(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),e}},{key:"setupWildcardsRegExp",value:function(e){return(e=e.replace(/(?:\\)*\?/g,function(e){return"\\"===e.charAt(0)?"?":""})).replace(/(?:\\)*\*/g,function(e){return"\\"===e.charAt(0)?"*":""})}},{key:"createWildcardsRegExp",value:function(e){var t="withSpaces"===this.opt.wildcards;return e.replace(/\u0001/g,t?"[\\S\\s]?":"\\S?").replace(/\u0002/g,t?"[\\S\\s]*?":"\\S*")}},{key:"setupIgnoreJoinersRegExp",value:function(e){return e.replace(/[^(|)\\]/g,function(e,t,n){var r=n.charAt(t+1);return/[(|)\\]/.test(r)||""===r?e:e+"\0"})}},{key:"createJoinersRegExp",value:function(e){var t=[],n=this.opt.ignorePunctuation;return Array.isArray(n)&&n.length&&t.push(this.escapeStr(n.join(""))),this.opt.ignoreJoiners&&t.push("\\u00ad\\u200b\\u200c\\u200d"),t.length?e.split(/\u0000+/).join("["+t.join("")+"]*"):e}},{key:"createDiacriticsRegExp",value:function(e){var t=this.opt.caseSensitive?"":"i",n=this.opt.caseSensitive?["aàáảãạăằắẳẵặâầấẩẫậäåāą","AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćč","CÇĆČ","dđď","DĐĎ","eèéẻẽẹêềếểễệëěēę","EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïī","IÌÍỈĨỊÎÏĪ","lł","LŁ","nñňń","NÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøō","OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rř","RŘ","sšśșş","SŠŚȘŞ","tťțţ","TŤȚŢ","uùúủũụưừứửữựûüůū","UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿ","YÝỲỶỸỴŸ","zžżź","ZŽŻŹ"]:["aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćčCÇĆČ","dđďDĐĎ","eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïīIÌÍỈĨỊÎÏĪ","lłLŁ","nñňńNÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rřRŘ","sšśșşSŠŚȘŞ","tťțţTŤȚŢ","uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿYÝỲỶỸỴŸ","zžżźZŽŻŹ"],r=[];return e.split("").forEach(function(i){n.every(function(n){if(-1!==n.indexOf(i)){if(r.indexOf(n)>-1)return!1;e=e.replace(new RegExp("["+n+"]","gm"+t),"["+n+"]"),r.push(n)}return!0})}),e}},{key:"createMergedBlanksRegExp",value:function(e){return e.replace(/[\s]+/gim,"[\\s]+")}},{key:"createAccuracyRegExp",value:function(e){var t=this,n=this.opt.accuracy,r="string"==typeof n?n:n.value,i="";switch(("string"==typeof n?[]:n.limiters).forEach(function(e){i+="|"+t.escapeStr(e)}),r){case"partially":default:return"()("+e+")";case"complementary":return"()([^"+(i="\\s"+(i||this.escapeStr("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~¡¿")))+"]*"+e+"[^"+i+"]*)";case"exactly":return"(^|\\s"+i+")("+e+")(?=$|\\s"+i+")"}}}]),e}(),a=function(){function a(e){t(this,a),this.ctx=e,this.ie=!1;var n=window.navigator.userAgent;(n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1)&&(this.ie=!0)}return n(a,[{key:"log",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"debug",r=this.opt.log;this.opt.debug&&"object"===(void 0===r?"undefined":e(r))&&"function"==typeof r[n]&&r[n]("mark.js: "+t)}},{key:"getSeparatedKeywords",value:function(e){var t=this,n=[];return e.forEach(function(e){t.opt.separateWordSearch?e.split(" ").forEach(function(e){e.trim()&&-1===n.indexOf(e)&&n.push(e)}):e.trim()&&-1===n.indexOf(e)&&n.push(e)}),{keywords:n.sort(function(e,t){return t.length-e.length}),length:n.length}}},{key:"isNumeric",value:function(e){return Number(parseFloat(e))==e}},{key:"checkRanges",value:function(e){var t=this;if(!Array.isArray(e)||"[object Object]"!==Object.prototype.toString.call(e[0]))return this.log("markRanges() will only accept an array of objects"),this.opt.noMatch(e),[];var n=[],r=0;return e.sort(function(e,t){return e.start-t.start}).forEach(function(e){var i=t.callNoMatchOnInvalidRanges(e,r),o=i.start,a=i.end;i.valid&&(e.start=o,e.length=a-o,n.push(e),r=a)}),n}},{key:"callNoMatchOnInvalidRanges",value:function(e,t){var n=void 0,r=void 0,i=!1;return e&&void 0!==e.start?(r=(n=parseInt(e.start,10))+parseInt(e.length,10),this.isNumeric(e.start)&&this.isNumeric(e.length)&&r-t>0&&r-n>0?i=!0:(this.log("Ignoring invalid or overlapping range: "+JSON.stringify(e)),this.opt.noMatch(e))):(this.log("Ignoring invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:n,end:r,valid:i}}},{key:"checkWhitespaceRanges",value:function(e,t,n){var r=void 0,i=!0,o=n.length,a=t-o,s=parseInt(e.start,10)-a;return(r=(s=s>o?o:s)+parseInt(e.length,10))>o&&(r=o,this.log("End range automatically set to the max value of "+o)),s<0||r-s<0||s>o||r>o?(i=!1,this.log("Invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)):""===n.substring(s,r).replace(/\s+/g,"")&&(i=!1,this.log("Skipping whitespace only range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:s,end:r,valid:i}}},{key:"getTextNodes",value:function(e){var t=this,n="",r=[];this.iterator.forEachNode(NodeFilter.SHOW_TEXT,function(e){r.push({start:n.length,end:(n+=e.textContent).length,node:e})},function(e){return t.matchesExclude(e.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},function(){e({value:n,nodes:r})})}},{key:"matchesExclude",value:function(e){return i.matches(e,this.opt.exclude.concat(["script","style","title","head","html"]))}},{key:"wrapRangeInTextNode",value:function(e,t,n){var r=this.opt.element?this.opt.element:"mark",i=e.splitText(t),o=i.splitText(n-t),a=document.createElement(r);a.setAttribute("data-markjs","true");var s=document.createElement("a"),c=document.createTextNode(i.textContent);s.appendChild(c);var u=i.textContent.replace("(","");return u=u.replace(")",""),s.setAttribute("href","https://www.binance.com/trade.html?symbol="+u.toUpperCase()+"_BTC"),a.appendChild(s),this.opt.className&&a.setAttribute("class",this.opt.className),i.parentNode.replaceChild(a,i),o}},{key:"wrapRangeInMappedTextNode",value:function(e,t,n,r,i){var o=this;e.nodes.every(function(a,s){var c=e.nodes[s+1];if(void 0===c||c.start>t){if(!r(a.node))return!1;var u=t-a.start,l=(n>a.end?a.end:n)-a.start,p=e.value.substr(0,a.start),h=e.value.substr(l+a.start);if(a.node=o.wrapRangeInTextNode(a.node,u,l),e.value=p+h,e.nodes.forEach(function(t,n){n>=s&&(e.nodes[n].start>0&&n!==s&&(e.nodes[n].start-=l),e.nodes[n].end-=l)}),n-=l,i(a.node.previousSibling,a.start),!(n>a.end))return!1;t=a.end}return!0})}},{key:"wrapGroups",value:function(e,t,n,r){return r((e=this.wrapRangeInTextNode(e,t,t+n)).previousSibling),e}},{key:"separateGroups",value:function(e,t,n,r,i){for(var o=t.length,a=1;a<o;a++){var s=e.textContent.indexOf(t[a]);t[a]&&s>-1&&r(t[a],e)&&(e=this.wrapGroups(e,s,t[a].length,i))}return e}},{key:"wrapMatches",value:function(e,t,n,r,i){var o=this,a=0===t?0:t+1;this.getTextNodes(function(t){t.nodes.forEach(function(t){t=t.node;for(var i=void 0;null!==(i=e.exec(t.textContent))&&""!==i[a];){if(o.opt.separateGroups)t=o.separateGroups(t,i,a,n,r);else{if(!n(i[a],t))continue;var s=i.index;if(0!==a)for(var c=1;c<a;c++)s+=i[c].length;t=o.wrapGroups(t,s,i[a].length,r)}e.lastIndex=0}}),i()})}},{key:"wrapMatchesAcrossElements",value:function(e,t,n,r,i){var o=this,a=0===t?0:t+1;this.getTextNodes(function(t){for(var s=void 0;null!==(s=e.exec(t.value))&&""!==s[a];){var c=s.index;if(0!==a)for(var u=1;u<a;u++)c+=s[u].length;var l=c+s[a].length;o.wrapRangeInMappedTextNode(t,c,l,function(e){return n(s[a],e)},function(t,n){e.lastIndex=n,r(t)})}i()})}},{key:"wrapRangeFromIndex",value:function(e,t,n,r){var i=this;this.getTextNodes(function(o){var a=o.value.length;e.forEach(function(e,r){var s=i.checkWhitespaceRanges(e,a,o.value),c=s.start,u=s.end;s.valid&&i.wrapRangeInMappedTextNode(o,c,u,function(n){return t(n,e,o.value.substring(c,u),r)},function(t){n(t,e)})}),r()})}},{key:"unwrapMatches",value:function(e){for(var t=e.parentNode,n=document.createDocumentFragment();e.firstChild;)n.appendChild(e.removeChild(e.firstChild));t.replaceChild(n,e),this.ie?this.normalizeTextNode(t):t.normalize()}},{key:"normalizeTextNode",value:function(e){if(e){if(3===e.nodeType)for(;e.nextSibling&&3===e.nextSibling.nodeType;)e.nodeValue+=e.nextSibling.nodeValue,e.parentNode.removeChild(e.nextSibling);else this.normalizeTextNode(e.firstChild);this.normalizeTextNode(e.nextSibling)}}},{key:"markRegExp",value:function(e,t){var n=this;this.opt=t,this.log('Searching with expression "'+e+'"');var r=0,i="wrapMatches";this.opt.acrossElements&&(i="wrapMatchesAcrossElements"),this[i](e,this.opt.ignoreGroups,function(e,t){return n.opt.filter(t,e,r)},function(e){r++,n.opt.each(e)},function(){0===r&&n.opt.noMatch(e),n.opt.done(r)})}},{key:"mark",value:function(e,t){var n=this;this.opt=t;var r=0,i="wrapMatches",a=this.getSeparatedKeywords("string"==typeof e?[e]:e),s=a.keywords,c=a.length;this.opt.acrossElements&&(i="wrapMatchesAcrossElements"),0===c?this.opt.done(r):function e(t){var a=new o(n.opt).create(t),u=0;n.log('Searching with expression "'+a+'"'),n[i](a,1,function(e,i){return n.opt.filter(i,t,r,u)},function(e){u++,r++,n.opt.each(e)},function(){0===u&&n.opt.noMatch(t),s[c-1]===t?n.opt.done(r):e(s[s.indexOf(t)+1])})}(s[0])}},{key:"markRanges",value:function(e,t){var n=this;this.opt=t;var r=0,i=this.checkRanges(e);i&&i.length?(this.log("Starting to mark with the following ranges: "+JSON.stringify(i)),this.wrapRangeFromIndex(i,function(e,t,r,i){return n.opt.filter(e,t,r,i)},function(e,t){r++,n.opt.each(e,t)},function(){n.opt.done(r)})):this.opt.done(r)}},{key:"unmark",value:function(e){var t=this;this.opt=e;var n=this.opt.element?this.opt.element:"*";n+="[data-markjs]",this.opt.className&&(n+="."+this.opt.className),this.log('Removal selector "'+n+'"'),this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT,function(e){t.unwrapMatches(e)},function(e){var r=i.matches(e,n),o=t.matchesExclude(e);return!r||o?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},this.opt.done)}},{key:"opt",set:function(e){this._opt=r({},{element:"",className:"",exclude:[],iframes:!1,iframesTimeout:5e3,separateWordSearch:!0,acrossElements:!1,ignoreGroups:0,each:function(){},noMatch:function(){},filter:function(){return!0},done:function(){},debug:!1,log:window.console},e)},get:function(){return this._opt}},{key:"iterator",get:function(){return new i(this.ctx,this.opt.iframes,this.opt.exclude,this.opt.iframesTimeout)}}]),a}();return function(e){var t=this,n=new a(e);return this.mark=function(e,r){return n.mark(e,r),t},this.markRegExp=function(e,r){return n.markRegExp(e,r),t},this.markRanges=function(e,r){return n.markRanges(e,r),t},this.unmark=function(e){return n.unmark(e),t},this}});var s=document.createElement("link");s.type="text/css",s.rel="stylesheet",s.href="https://cdn.rawgit.com/thitganuong/bittrex_support_ui/d8aa04e9/dist/font-awesome.min.css",$("head").append(s);var binanceAllTikersAPI="https://www.binance.com/api/v1/ticker/allBookTickers",jsonData="",listCoin=createTickerList(),jumpPosition=0,totalMarkNum=0,x=document.getElementsByClassName("grid col-700")[0],priceText="",currentTickerName="",priceBTCPair=0,priceUSDPair=0,serverTime="";function load(){var e=document.querySelector(".contt");new Mark(e).mark(listCoin),(totalMarkNum=document.getElementsByTagName("mark").length)>0&&(floatButton(),floatButtonPick(),floatButtonPre(),floatButtonNext(),floatPortfolioButton())}function getAllTickers(){if(void 0===localStorage.listCoin||null===localStorage.listCoin||"null"==localStorage.listCoin){console.log("Binance list coin was null or at issue page. ");var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return jsonData=e.responseText,localStorage.listCoin=jsonData,console.log("New Binance list coin was cached"),jsonData},e.open("GET","https://www.binance.com/api/v1/ticker/allBookTickers",!1),e.send()}else console.log("Binance list coin was cached, no need to fetch ")}function sendMessage2(){var e=document.getElementsByTagName("mark")[0].textContent;if(""!=(e=(e=e.replace("(","")).replace(")",""))||null!=e){var t="https://api.telegram.org/"+botID+"/sendMessage?chat_id="+Shark_UX_Signal+"&text="+e,n=new XMLHttpRequest;n.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("sendMessage2 Done. "+e)},n.open("GET",t,!1),n.send()}}function forceUpdateTickers(){delete localStorage.listCoin,listCoin=createTickerList()}function createTickerList(){getAllTickers();for(var e=JSON.parse(localStorage.listCoin),t=0,n=[];t<e.length;)e[t].symbol.includes("BTC")&&!e[t].symbol.includes("USDT")&&n.push("("+e[t].symbol.replace("BTC","")+")"),t++;return console.log("List coin count:"+e.length),n}function jumpToFirstCoin(){jumpPosition=0,document.getElementsByTagName("mark")[jumpPosition].scrollIntoView(),setTicker(jumpPosition)}function jumpToPortfolio(){document.getElementsByClassName("portfolio-group-title")[1].scrollIntoView()}function floatButton(){var e=document.createElement("a");e.className="float",e.addEventListener("click",jumpToFirstCoin);var t=document.createElement("i");t.className="fa fa-plus my-float",e.appendChild(t),x.appendChild(e)}function floatPortfolioButton(){var e=document.createElement("a");e.className="float5",e.addEventListener("click",jumpToPortfolio);var t=document.createElement("i");t.className="fa fa-list my-float",e.appendChild(t),x.appendChild(e)}function floatButtonPick(){var e=document.createElement("a");e.className="float2",e.addEventListener("click",jumpToPump);var t=document.createElement("i");t.className="fa my-float";var n=document.getElementsByTagName("mark")[0].textContent;n=(n=n.replace("(","")).replace(")",""),t.innerHTML=n.toUpperCase(),e.appendChild(t),x.appendChild(e);var r=document.createElement("div");r.className="label-container";var i=document.createElement("div");i.className="label-text",i.innerHTML=priceText;var o=document.createElement("i");o.className="fa fa-play label-arrow",r.appendChild(i),r.appendChild(o),x.appendChild(r),getTickerPricebyBTC(n.toUpperCase()),getTickerPricebyUSD(n.toUpperCase())}function floatButtonPre(){var e=document.createElement("a");e.className="float3",e.addEventListener("click",jumpBack);var t=document.createElement("i");t.className="fa fa-arrow-up my-float",e.appendChild(t),x.appendChild(e)}function floatButtonNext(){var e=document.createElement("a");e.className="float4",e.addEventListener("click",jumpNext);var t=document.createElement("i");t.className="fa fa-arrow-down my-float",e.appendChild(t),x.appendChild(e)}function jumpToPump(){var e=document.getElementsByTagName("mark")[jumpPosition].textContent,t="https://www.binance.com/trade.html?symbol="+(e=(e=e.replace("(","")).replace(")","")).toUpperCase()+"_BTC";window.open(t,"_blank").location}function jumpNext(){(jumpPosition+=1)>=totalMarkNum&&(jumpPosition=totalMarkNum-1),jumpProcess(jumpPosition)}function jumpBack(){(jumpPosition-=1)<0&&(jumpPosition=0),jumpProcess(jumpPosition)}function jumpProcess(e){console.log("jumpPosition: "+e),jumpToPosition(e),setTicker(e)}function jumpToPosition(e){document.getElementsByTagName("mark")[e].scrollIntoView()}function setTicker(e){var t=document.getElementsByTagName("mark")[e].textContent;t=(t=t.replace("(","")).replace(")",""),document.getElementsByClassName("fa my-float")[1].innerText=t.toUpperCase(),getTickerPricebyBTC(currentTickerName=t.toUpperCase()),getTickerPricebyUSD(currentTickerName)}function getPriceInfo(e){return e+"BTC: "+getTickerPricebyBTC(e)}function getTickerPricebyBTC(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return priceBTCPair=JSON.parse(t.responseText).price,document.getElementsByClassName("label-text")[0].innerText=priceBTCPair+"Ƀ",priceBTCPair},t.open("GET","https://api.binance.com/api/v1/ticker/price?symbol="+e+"BTC",!1),t.send()}function getTickerPricebyUSD(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return priceUSDPair=JSON.parse(t.responseText).price,document.getElementsByClassName("label-text")[0].innerText=priceBTCPair+"Ƀ\n"+priceUSDPair+"$",priceBTCPair},t.open("GET","https://api.binance.com/api/v1/ticker/price?symbol="+e+"USDT",!1),t.send()}function getServerTime(){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status)return serverTime=JSON.parse(e.responseText).serverTime},e.open("GET","https://api.binance.com/api/v1/time",!1),e.send()}function buyNow(){getServerTime();var e=new XMLHttpRequest;e.open("POST","https://api.binance.com/api/v3/order/test",!0),e.setRequestHeader("X-MBX-APIKEY",API_Key),e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log(this.responseText)};var t="symbol=LTCBTC&side=BUY&type=MARKET&quantity=1&recvWindow=6000000&timestamp="+serverTime,n=t+"&signature="+CryptoJS.HmacSHA256(t,Secret).toString();console.log("Param: "+n),e.send(n)}jQuery(window).load(function(){}),window.onkeydown=function(e){var t=e.keyCode?e.keyCode:e.which;console.log("KEY: "+t),69==t?jumpToPump():87==t?jumpBack():83==t?jumpNext():84==t?sendMessage2():85==t&&(console.log("Delete list coin."),forceUpdateTickers(),console.log("Binance list updated."))},load(),console.log("Page is loaded");var CryptoJS=CryptoJS||function(e,t){var n={},r=n.lib={},i=function(){},o=r.Base={extend:function(e){i.prototype=this;var t=new i;return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},a=r.WordArray=o.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=void 0!=t?t:4*e.length},toString:function(e){return(e||c).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes;if(e=e.sigBytes,this.clamp(),r%4)for(var i=0;i<e;i++)t[r+i>>>2]|=(n[i>>>2]>>>24-i%4*8&255)<<24-(r+i)%4*8;else if(65535<n.length)for(i=0;i<e;i+=4)t[r+i>>>2]=n[i>>>2];else t.push.apply(t,n);return this.sigBytes+=e,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=o.clone.call(this);return e.words=this.words.slice(0),e},random:function(t){for(var n=[],r=0;r<t;r+=4)n.push(4294967296*e.random()|0);return new a.init(n,t)}}),s=n.enc={},c=s.Hex={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++){var i=t[r>>>2]>>>24-r%4*8&255;n.push((i>>>4).toString(16)),n.push((15&i).toString(16))}return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new a.init(n,t/2)}},u=s.Latin1={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++)n.push(String.fromCharCode(t[r>>>2]>>>24-r%4*8&255));return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new a.init(n,t)}},l=s.Utf8={stringify:function(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(e){throw Error("Malformed UTF-8 data")}},parse:function(e){return u.parse(unescape(encodeURIComponent(e)))}},p=r.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new a.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=l.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n=this._data,r=n.words,i=n.sigBytes,o=this.blockSize,s=i/(4*o);if(t=(s=t?e.ceil(s):e.max((0|s)-this._minBufferSize,0))*o,i=e.min(4*t,i),t){for(var c=0;c<t;c+=o)this._doProcessBlock(r,c);c=r.splice(0,t),n.sigBytes-=i}return new a.init(c,i)},clone:function(){var e=o.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});r.Hasher=p.extend({cfg:o.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){p.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new h.HMAC.init(e,n).finalize(t)}}});var h=n.algo={};return n}(Math);!function(e){for(var t=CryptoJS,n=(i=t.lib).WordArray,r=i.Hasher,i=t.algo,o=[],a=[],s=function(e){return 4294967296*(e-(0|e))|0},c=2,u=0;64>u;){var l;e:{l=c;for(var p=e.sqrt(l),h=2;h<=p;h++)if(!(l%h)){l=!1;break e}l=!0}l&&(8>u&&(o[u]=s(e.pow(c,.5))),a[u]=s(e.pow(c,1/3)),u++),c++}var f=[];i=i.SHA256=r.extend({_doReset:function(){this._hash=new n.init(o.slice(0))},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],i=n[1],o=n[2],s=n[3],c=n[4],u=n[5],l=n[6],p=n[7],h=0;64>h;h++){if(16>h)f[h]=0|e[t+h];else{var d=f[h-15],m=f[h-2];f[h]=((d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3)+f[h-7]+((m<<15|m>>>17)^(m<<13|m>>>19)^m>>>10)+f[h-16]}d=p+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&u^~c&l)+a[h]+f[h],m=((r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22))+(r&i^r&o^i&o),p=l,l=u,u=c,c=s+d|0,s=o,o=i,i=r,r=d+m|0}n[0]=n[0]+r|0,n[1]=n[1]+i|0,n[2]=n[2]+o|0,n[3]=n[3]+s|0,n[4]=n[4]+c|0,n[5]=n[5]+u|0,n[6]=n[6]+l|0,n[7]=n[7]+p|0},_doFinalize:function(){var t=this._data,n=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return n[i>>>5]|=128<<24-i%32,n[14+(i+64>>>9<<4)]=e.floor(r/4294967296),n[15+(i+64>>>9<<4)]=r,t.sigBytes=4*n.length,this._process(),this._hash},clone:function(){var e=r.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=r._createHelper(i),t.HmacSHA256=r._createHmacHelper(i)}(Math),function(){var e=CryptoJS,t=e.enc.Utf8;e.algo.HMAC=e.lib.Base.extend({init:function(e,n){e=this._hasher=new e.init,"string"==typeof n&&(n=t.parse(n));var r=e.blockSize,i=4*r;n.sigBytes>i&&(n=e.finalize(n)),n.clamp();for(var o=this._oKey=n.clone(),a=this._iKey=n.clone(),s=o.words,c=a.words,u=0;u<r;u++)s[u]^=1549556828,c[u]^=909522486;o.sigBytes=a.sigBytes=i,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher;return e=t.finalize(e),t.reset(),t.finalize(this._oKey.clone().concat(e))}})}();