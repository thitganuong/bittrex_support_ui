console.log("bittrex-balance-addin.js file is loaded");
$('h2.section-header-in-row:contains("Account")').parent().parent().hide();
var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/bittrex-api-ver2.js?ver="+(new Date()).getTime();
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/bitbank-api-v2.js?ver="+(new Date()).getTime();
$("head").append(s);

s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/notify.min.js";
$("head").append(s);

var buttonLoad = document.createElement("button");
buttonLoad.innerHTML = "(.)(.)";
buttonLoad.className = "btn btn-default btn-toolbar";
$(buttonLoad).insertBefore($('#toolbar-balances').find('[type=button]'));
buttonLoad.addEventListener ("click", load);

var buttonCancelAll = document.createElement("button");
buttonCancelAll.innerHTML = "CANCEL";
buttonCancelAll.className = "btn btn-default btn-toolbar";
$("balanceTable_paginate").append(buttonCancelAll);
buttonCancelAll.addEventListener ("click", cancelAll);
$(buttonCancelAll).insertBefore($('#toolbar-balances').find('[type=button]'));

var buttonAll = document.createElement("button");
buttonAll.innerHTML = "SELL";
buttonAll.className = "btn btn-default btn-toolbar";
$("balanceTable_paginate").append(buttonAll);
buttonAll.addEventListener ("click", function(){
	sellAll(false);
});
$(buttonAll).insertBefore($('#toolbar-balances').find('[type=button]'));

var buttonProfit = document.createElement("button");
buttonProfit.innerHTML = "PROFIT";
buttonProfit.className = "btn btn-default btn-toolbar";
$("balanceTable_paginate").append(buttonProfit);
buttonProfit.addEventListener ("click", function(){
	sellAll(true);
});
$(buttonProfit).insertBefore($('#toolbar-balances').find('[type=button]'));


function load(){
	//Check exist

	if($("#balanceTable tbody").find("select").size() > 0) return;
	$.notify("Choice rate for sell in drop down list \nand check to checkbox which you want buy.", "info");

	$("#balanceTable tbody").find("tr").each(function(){
		var marketName = $(this).find("a").html();
		if (marketName === undefined){
			marketName = $(this).find("td.text").html();
		}

		if (marketName == "USDT" || marketName == "BTC") return;

		$(this).append("<select id='percent_"+marketName+"' style='color: black'><option value='30'>30%</option><option value='50'>50%</option><option value='80'>80%</option><option value='100' selected>100%</option></select>");

		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.id = "cb_"+marketName;
		checkbox.checked = "checked";
		$(this).append(checkbox);

		// var buttonSell = document.createElement("button");
		// buttonSell.innerHTML = "SELL";
		// $(this).append(buttonSell);
		// buttonSell.addEventListener ("click", function() {
			// sellOrder(marketName);
		// });

		// var buttonCancel = document.createElement("button");
		// buttonCancel.innerHTML = "CANCEL";
		// $(this).append(buttonCancel);
		// buttonCancel.addEventListener("click", function() {
			// cancelOrder(marketName);
		// });

	});
}

function cancelOrder(marketName){
	getopenorders("BTC-"+marketName,function(data){
		$.each(data.result, function(i, record) {
			cancel(record.OrderUuid, function(){
				$.notify("Cancel order "+marketName+' COMPLETED', "success");
			});
		});
	});
}

function sellOrder(marketName){
	var market = "BTC-"+marketName;
	//Get marketSummary
	getbalance(marketName, function(balance){
		var avaribaleBalance =  balance.result.Available;
		getmarketsummary(market, function(marketsummary){
			var rate = marketsummary.result[0].Bid*sellrate;
			var percent = $("#percent_"+marketName).val();
			var quantity = avaribaleBalance * percent/100;
			var message =  market
						+ '\nRate        :  ' + rate
						+'\nQuantity :  '+quantity+'  ('+percent+'%)'
						+'\n\nAre you OK?'
			if(confirm(message)){
				selllimit(market,quantity,rate,function(){
					$.notify("Sell order "+market+' COMPLETED', "success");
				})
			}
		});
	});
}
function sellAll(flag){
	load();

	var items = [];
	$("#balanceTable tbody").find("input[type=checkbox]:checked").each(function(){
		items.push("BTC-"+$(this).attr("id").replace("cb_",""))
	});

	if (items.length ==0){
		$.notify("Please select item which you want sell.","error");
		return;
	}

	$.notify("Please wait 10 seconds for calculate profit. \nDon't move to other screen ","info");
	getbalances(function(balances){
		getmarketsummaries(function(marketsummaries){
			getorderhistory("",function(orderhistories){
				b_getticker("btc_jpy", function(bitbankdata){
					var priceArray = {};
					var estmateValue = 0;
					$.each(marketsummaries.result, function(i, record) {
						priceArray[record.MarketName] = record.Bid
					});

					var quantityArray = {};
					$.each(balances.result, function(i, record) {
						if (record.Available > 0){
							quantityArray[record.Currency] = record.Available
							estmateValue += record.Balance*(priceArray['BTC-'+record.Currency]  == undefined ? 0:priceArray['BTC-'+record.Currency]);
						}
					});

					var orderArray={};
					$.each(orderhistories.result, function(i, record) {
						if (record.OrderType = 'LIMIT_BUY' && orderArray[record.Exchange] == undefined){
							orderArray[record.Exchange] = record.PricePerUnit;
						}
					});

					var profit = 0;
					var items = [];
					var message ='WARNING: SELL ALL. Are you OK?';
					message +=   '\n------------------------------------------------------------------------------'
					message +=   '\n|　Currency |  Quantity (xx%)                     |   Rate          | BTC  | Profit    |'
					message +=   '\n------------------------------------------------------------------------------'
					$("#balanceTable tbody").find("tr").each(function(){
						var marketName = $(this).find("a").html();
						if (marketName === undefined){
							marketName = $(this).find("td.text").html();
						}

						if (marketName == "USDT" || marketName == "BTC") return;
						if ($("#cb_"+marketName+":checked").size() == 0) return;

						var percent = $("#percent_"+marketName).val();

						var sellItem = {
							'Currency':marketName,
							'Quantity':quantityArray[marketName]*percent/100,
							'Rate': priceArray['BTC-'+marketName]*sellrate,
							'Est': priceArray['BTC-'+marketName]*sellrate*quantityArray[marketName]*percent/100,
							'Profit': ((((priceArray['BTC-'+marketName]*sellrate) - orderArray['BTC-'+marketName])*100/orderArray['BTC-'+marketName]) - 0.25)
						}
						profit += (priceArray['BTC-'+marketName]*sellrate - orderArray['BTC-'+marketName])*quantityArray[marketName];
						sellItem.Profit = sellItem.Profit > 0 ? ("＋" + sellItem.Profit.toFixed(2).padStart(5,'0')): ("－" + (0-sellItem.Profit).toFixed(2).padStart(5,'0'))
						items.push(sellItem)
						message += '\n|　'+convertHaftToFull(marketName.padEnd(4,'＿'))+'    |  '
						message += sellItem.Quantity.toFixed(6).padStart(16,'0')+ '('+ percent.padStart(3,' ') +'%) | ' + sellItem.Rate.toFixed(8) + ' | ' + sellItem.Est.toFixed(3) + ' | ' +sellItem.Profit + '%|';

					});
					message +=   '\n------------------------------------------------------------------------------'
					message +=   '\n∑PROFIT : ' + profit.toFixed(4) + ' (BTC) ⇒ ' + parseInt(profit*priceArray["USDT-BTC"]).toLocaleString('en-US', {style: 'currency',currency: 'USD',}) + "  ⇒ "+ parseInt(bitbankdata.data.last*profit).toLocaleString('ja-JP', {style: 'currency',currency: 'JPY',});

					if (flag){
						message +=  "\nEstimatedValue: "+(estmateValue*0.9975).toFixed(4)+' (BTC) ⇒ '+parseInt(estmateValue*0.9975*priceArray["USDT-BTC"]).toLocaleString('en-US', {style: 'currency',currency: 'USD',})+ "  ⇒ "+ parseInt(bitbankdata.data.last*(estmateValue*0.9975-0.001)).toLocaleString('ja-JP', {style: 'currency',currency: 'JPY',});
						message +=   '\n------------------------------------------------------------------------------'
						$.notify(message
							+ "\nTokyo Japan----------: "+ calcTime('+9')
							+ "\nUnited States--------: " + calcTime('-9')
							+ "\nUnited Kingdom----: " + calcTime('+0')
							+ "\nChina, Hong Kong--: " + calcTime('+8'),
						{
							autoHide: false,
							clickToHide: true,
							position: 'left bottom',
							className:'info'
						});
					}else if (confirm(message)){
						message +=  "\nEstimatedValue: "+(estmateValue*0.9975).toFixed(4)+' (BTC) ⇒ '+parseInt(estmateValue*0.9975*priceArray["USDT-BTC"]).toLocaleString('en-US', {style: 'currency',currency: 'USD',})+ "  ⇒ "+ parseInt(bitbankdata.data.last*(estmateValue*0.9975-0.001)).toLocaleString('ja-JP', {style: 'currency',currency: 'JPY',});
						message +=   '\n-----------------------------------------------------------------------------'

						$.notify(message
							+ "\nTokyo Japan----------: "+ calcTime('+9')
							+ "\nUnited States--------: " + calcTime('-9')
							+ "\nUnited Kingdom----: " + calcTime('+0')
							+ "\nChina, Hong Kong--: " + calcTime('+8'),
						{
							autoHide: false,
							clickToHide: true,
							position: 'left bottom',
							className:'info'
						});
						$.each(items, function(i, record) {
							selllimit("BTC-"+record.Currency,record.Quantity,record.Rate,function(){
								$.notify("Sell order "+record.Currency+' COMPLETED', "success");
							})
						});
						$.notify("Done all sell task.", "success");
					}
				});
			});
		});
	});
}

function cancelAll(){
	load();

	var items = [];
	$("#balanceTable tbody").find("input[type=checkbox]:checked").each(function(){
		items.push("BTC-"+$(this).attr("id").replace("cb_",""))
	});

	if (items.length ==0){
		$.notify("Please select item which you want cancel.","error");
		return;
	}

	if (confirm("CANCEL ALL OPEN ORDER. \n\n"+items.join()+"\n\nAre you OK?")){
		$.notify("Please wait for cancel all open order", "info");

		getopenorders("",function(data){
			$.each(data.result, function(i, record) {
				if (items.indexOf(record.Exchange) > -1){
					cancel(record.OrderUuid, function(){
						$.notify("Cancel order "+ record.OrderType+" "+record.Exchange+" COMPLETED", "success");
					});
				}
			});
		});

		$.notify("Done all cancel task.", "success");
	}
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function convertHaftToFull(input){
	return input.replace(/[A-Za-z0-9]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	});
}

function calcTime(offset) {
	var d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	nd = new Date(utc + (3600000 * offset));
	return nd.toLocaleString();
}
$(document).ready(function() {
    setTimeout(function(){ $.notify("Click on button (.)(.) to start.", "info"); }, 3000);
});
