console.log(apikey);
console.log(apisecret);
console.log(apiURL);
setTimeout(function(){
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "https://rawgit.com/sytelus/CryptoJS/master/rollups/hmac-sha512.js";
	$("head").append(s);

	var prices = {};
	$.getJSON('https://bittrex.com/api/v1.1/public/getmarketsummaries', function(data) {
		//data is the JSON string
		$.each(data.result, function(i, record) {
			prices[record.MarketName] = record.Last
		});
	});

	var getLastPrice=function(currency){
		var uri = getURI('public/getmarketsummary', "market=btc-"+currency);
		var result = 0
		$.getJSON(uri, function(data) {
		//data is the JSON string
		$.each(data.result, function(i, record) {
			console.log(record.MarketName);
			console.log(record.Last);
			result = record.Last;
		});
		console.log("result = " + result);
		return result;
	});
	}
	
	var lastNonces = [];
	var getNonce = function() {
		var nonce = new Date().getTime();
		if (lastNonces.indexOf(nonce) > -1) {
		  // we already used this nonce so keep trying to get a new one.
		return getNonce();
		}
		// keep the last X to try ensure we don't have collisions even if the clock is adjusted
		lastNonces = lastNonces.slice(-50);
		lastNonces.push(nonce);
		return nonce;
	  };
	
	var getURI = function(command, params){
		var result = apiURL + command + "?" +params+ "&nonce=" + getNonce();
		return result;
	}
	
	$("#balanceTable tbody").find("tr").each(function(){
		var marketName = $(this).find("a").html();
		if (marketName === undefined){
			marketName = $(this).find("td.text").html();
		}
		$(this).append("<select id='percent_"+marketName+"' style='color: black'><option value='30'>30%</option><option value='50'>50%</option><option value='80'>80%</option><option value='100'>100%</option></select>");
		var buttonCancel = document.createElement("button");
		buttonCancel.innerHTML = "CANCEL";
		$(this).append(buttonCancel)
		buttonCancel.addEventListener ("click", function() {
			var conf = confirm("SELL 「'"+marketName+"'」: "+prices["BTC-"+marketName])
			if (conf){
				var uri = apiURL + 'market/getopenorders?apikey='+apikey+'&nonce=' + getNonce();
				var sign = CryptoJS.HmacSHA512(uri, apisecret);
				console.log("SHA512:" + sign);
				console.log("URL:"+uri);
				var orderid = null
				$.ajax({
					url: uri,
					headers: {
						'apisign': sign, 
						'Content-Type': 'application/json'
					},
					method: 'POST',
					success: function(data){
						console.log(data.result[0].OrderUuid);
						uri = apiURL + 'market/cancel?apikey='+apikey+'&uuid=' + data.result[0].OrderUuid+'&nonce=' + getNonce();;
						sign = CryptoJS.HmacSHA512(uri, apisecret);
						console.log("SHA512:" + sign);
						console.log("URL:"+uri);
						$.ajax({
							url: uri,
							headers: {
								'apisign': sign, 
								'Content-Type': 'application/json'
							},
							method: 'POST',
							success: function(data){
							console.log(data);
							}
						});
					}
				});
			}
		});
		
		var buttonSell = document.createElement("button");
		buttonSell.innerHTML = "SELL";
		$(this).append(buttonSell)
		buttonSell.addEventListener ("click", function() {
			//Get last price
			getLastPrice(marketName);
			
			// var conf = confirm("SELL 「'"+marketName+"'」: "+prices["BTC-"+marketName])
			// if (conf){
				// var uri = getURI('account/getbalance', ["apikey="+apikey], "currency="+marketName);
				// var sign = CryptoJS.HmacSHA512(uri, apisecret);
				// console.log("SHA512:" + sign);
				// console.log("URL:"+uri);
				
				// $.ajax({
					// url: uri,
					// headers: {
						// 'apisign': sign, 
						// 'Content-Type': 'application/json'
					// },
					// method: 'POST',
					// success: function(data){
					  // console.log(data);
					  // console.log(data.result[0].OrderUuid);					  
					// }
				// });
			// }
		});
	});
},1000); //delay is in milliseconds 
