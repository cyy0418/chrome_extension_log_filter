/*var body = document.getElementsByTagName("body");
console.log(body);
chrome.extension.sendRequest({body: body}, function(response) {
  console.log(response);
});
*/
chrome.extension.onRequest.addListener(request);

function request(request, sender, sendResponse) {
	var query = request.query;
	var data = getFormat(query);
	sendResponse({data:data});
	/*chrome.extension.sendRequest({body: body}, function(response) {
	  console.log(response);
	});*/
	//sendResponse({message:"finsh",body:$("body").text()});
}

function getFormat(query){
	var data = [];
	var trs = $(".kbn-table>tbody>tr");
	for(var i = 0;i < trs.length;i+=2){
		var item = filterData(trs[i]);
		if(item){
			data.push(item);
		}
	}
	return data;
}

function filterData(e){
	var tr = $(e);
	var m = tr.find(".source>dt:first");
	while(m.length && m.text() != "message:"){
		m = m.next();
	}
	m = m.next().text().split(" ");
	if(m[0].indexOf("DATE") == -1){
		return null;
	}
	var url = m[8].substring(4);
	var type = "";
	if(url.indexOf("campaign") !== -1){
		type += "广告方案";
	}else if(url.indexOf("group") !== -1){
		type += "广告组";
	}else if(url.indexOf("creative") !== -1){
		type += "广告创意";
	}else if(url.indexOf("creativegroup") !== -1){
		type += "广告创意组";
	}else if(url.indexOf("material") !== -1){
		type += "广告物料";
	}else if(url.indexOf("adoption") !== -1){
		type += "广告上下线";
	}else{
		return null;
	}

	var method = m[7].substring(7);
	var methodStr = "";
	switch(method){
		case "PUT":
			methodStr = "修改";
			break;
		case "POST":
			methodStr = "新建";
	}
	type+=methodStr;
	var body = {};
	try{
		body = JSON.parse(m[12].substring(5));
	}catch(e){
		body = m[12].substring(5);
	}
	var obj = {
		"time":dateFormat(m[0].substring(6)),
		"authID":m[3].substring(5),
		"method":method,
		"method_describe":type,
		"url":m[8].substring(4),
		"body":body
	}
	return obj
}


function dateFormat(str){
	var date = new Date(str);
	var yyyymmdd = [date.getFullYear(), ('00'+ (date.getMonth()+1)).slice(-2), ('00'+ date.getDate()).slice(-2)].join('-');
	var hhmmss = [('00'+ date.getHours()).slice(-2),('00'+ date.getMinutes()).slice(-2),('00'+ date.getSeconds()).slice(-2)].join(":");
	return yyyymmdd + "<wbr>"+hhmmss;
}
