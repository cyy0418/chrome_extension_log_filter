function send(obj){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendRequest(tabs[0].id,obj, function(result) {
			if(result && result.data){
		  		console.log(result.data);
		  		renderTable(result.data);
			}else{
				alert("没有获取到数据");
			}
		});
	});
}

function renderTable(data){
	var html = "";
	if(!data.length){
		html += "<tr><td colspan=6>没有数据<td></td>"
	}else{
		for(var i=0;i<data.length;i++){
			var tr = data[i];
			var body = typeof tr.body == "string"?tr.body:'<pre>'+JSON.stringify(tr.body,null,2)+'</pre>';
			html +=["<tr>",
			'<td><nobr>'+tr.time+'<nobr></td>',
			'<td>'+tr.authID+'</td>',
			'<td>'+tr.method+'</td>',
			'<td>'+tr.method_describe+'</td>',
			'<td>'+tr.url+'</td>',
			'<td>'+body+'</td>',
			"</tr>"].join("");
		}
	}
	$("#log_table>tbody").html(html);
}
/*chrome.extension.onRequest.addListener(request);

function request(request, sender, sendResponse) {
	console.log(request);
	var body = request.body;
	console.log($("body"));
	if(body){

	}else{
		alert("获取数据失败");
	}

	sendResponse({message:"finsh",body:$("body").text()});
}
*/

$(function() {
    $("#formatBtn").click(function() {
    	send({query: {a:1}});
        //chrome.tabs.executeScript(null, {file: "js/content_script.js"});
    });
});
