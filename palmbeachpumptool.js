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
	getTickerPricebyBTC(ticker.toUpperCase());
	getTickerPricebyUSD(ticker.toUpperCase());
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
	//priceText = getPriceInfo(currentTickerName);
	getTickerPricebyBTC(currentTickerName);
	getTickerPricebyUSD(currentTickerName);
}
function getPriceInfo(currentTickerName){
	var btcpair = currentTickerName +"BTC: "+ getTickerPricebyBTC(currentTickerName);
//	var usdpair = currentTickerName +"USD: "+ getTickerPricebyUSD(currentTickerName);
	var priceString = btcpair;//+ "\n" + usdpair;
	return priceString;
}

function getTickerPricebyBTC(currentTickerName){
	var url = "https://api.binance.com/api/v1/ticker/price?symbol="; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    		priceBTCPair = JSON.parse(Httpreq.responseText).price;//JSON.parse(Httpreq.responseText);
	    		document.getElementsByClassName('label-text')[0].innerText =  priceBTCPair +"Ƀ";
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
	    		document.getElementsByClassName('label-text')[0].innerText =  priceBTCPair +"Ƀ\n"+ priceUSDPair + "$";
	    		return priceBTCPair;
	    }
	};
	Httpreq.open("GET",url + currentTickerName+ "USDT" ,false);
	Httpreq.send();
}

function buyNow(){
	var url = "https://api.binance.com/api/v3/order/test"; 
	var xhr = new XMLHttpRequest();
	xhr.open('POST',url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
	    // do something to response
	    console.log(this.responseText);
	};
	//https://api.binance.com/api/v3/order?symbol=LTCBTC&side=BUY&type=LIMIT&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71'
	xhr.send('symbol=NEOBTC&side=BUY&type=LIMIT&quantity=1&price=0.1&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71');
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


/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(h, s) {
    var f = {},
        g = f.lib = {},
        q = function() {},
        m = g.Base = {
            extend: function(a) {
                q.prototype = this;
                var c = new q;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() {
                    c.$super.init.apply(this, arguments)
                });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        r = g.WordArray = m.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != s ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || k).stringify(this)
            },
            concat: function(a) {
                var c = this.words,
                    d = a.words,
                    b = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (b % 4)
                    for (var e = 0; e < a; e++) c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4) c[b + e >>> 2] = d[e >>> 2];
                else c.push.apply(c, d);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = h.ceil(c / 4)
            },
            clone: function() {
                var a = m.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var c = [], d = 0; d < a; d += 4) c.push(4294967296 * h.random() | 0);
                return new r.init(c, a)
            }
        }),
        l = f.enc = {},
        k = l.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) {
                    var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b += 2) d[b >>> 3] |= parseInt(a.substr(b,
                    2), 16) << 24 - 4 * (b % 8);
                return new r.init(d, c / 2)
            }
        },
        n = l.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b++) d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
                return new r.init(d, c)
            }
        },
        j = l.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = g.BufferedBlockAlgorithm = m.extend({
            reset: function() {
                this._data = new r.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = j.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var c = this._data,
                    d = c.words,
                    b = c.sigBytes,
                    e = this.blockSize,
                    f = b / (4 * e),
                    f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
                a = f * e;
                b = h.min(4 * a, b);
                if (a) {
                    for (var g = 0; g < a; g += e) this._doProcessBlock(d, g);
                    g = d.splice(0, a);
                    c.sigBytes -= b
                }
                return new r.init(g, b)
            },
            clone: function() {
                var a = m.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    g.Hasher = u.extend({
        cfg: m.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            u.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(c, d) {
                return (new a.init(d)).finalize(c)
            }
        },
        _createHmacHelper: function(a) {
            return function(c, d) {
                return (new t.HMAC.init(a,
                    d)).finalize(c)
            }
        }
    });
    var t = f.algo = {};
    return f
}(Math);
(function(h) {
    for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function(a) {
            return 4294967296 * (a - (a | 0)) | 0
        }, k = 2, n = 0; 64 > n;) {
        var j;
        a: {
            j = k;
            for (var u = h.sqrt(j), t = 2; t <= u; t++)
                if (!(j % t)) {
                    j = !1;
                    break a
                }
            j = !0
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++
    }
    var a = [],
        f = f.SHA256 = q.extend({
            _doReset: function() {
                this._hash = new g.init(m.slice(0))
            },
            _doProcessBlock: function(c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; 64 > p; p++) {
                    if (16 > p) a[p] =
                        c[d + p] | 0;
                    else {
                        var k = a[p - 15],
                            l = a[p - 2];
                        a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16]
                    }
                    k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p];
                    l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g);
                    q = n;
                    n = m;
                    m = h;
                    h = j + k | 0;
                    j = g;
                    g = f;
                    f = e;
                    e = k + l | 0
                }
                b[0] = b[0] + e | 0;
                b[1] = b[1] + f | 0;
                b[2] = b[2] + g | 0;
                b[3] = b[3] + j | 0;
                b[4] = b[4] + h | 0;
                b[5] = b[5] + m | 0;
                b[6] = b[6] + n | 0;
                b[7] = b[7] + q | 0
            },
            _doFinalize: function() {
                var a = this._data,
                    d = a.words,
                    b = 8 * this._nDataBytes,
                    e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32;
                d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
                d[(e + 64 >>> 9 << 4) + 15] = b;
                a.sigBytes = 4 * d.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var a = q.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    s.SHA256 = q._createHelper(f);
    s.HmacSHA256 = q._createHmacHelper(f)
})(Math);
(function() {
    var h = CryptoJS,
        s = h.enc.Utf8;
    h.algo.HMAC = h.lib.Base.extend({
        init: function(f, g) {
            f = this._hasher = new f.init;
            "string" == typeof g && (g = s.parse(g));
            var h = f.blockSize,
                m = 4 * h;
            g.sigBytes > m && (g = f.finalize(g));
            g.clamp();
            for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) k[j] ^= 1549556828, n[j] ^= 909522486;
            r.sigBytes = l.sigBytes = m;
            this.reset()
        },
        reset: function() {
            var f = this._hasher;
            f.reset();
            f.update(this._iKey)
        },
        update: function(f) {
            this._hasher.update(f);
            return this
        },
        finalize: function(f) {
            var g =
                this._hasher;
            f = g.finalize(f);
            g.reset();
            return g.finalize(this._oKey.clone().concat(f))
        }
    })
})();
