var bitbankAPI = "https://public.bitbank.cc/";

function b_getticker(currency, callback){
	var uri = bitbankAPI + currency + "/ticker";
	$.getJSON(uri, callback);
}