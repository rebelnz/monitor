// thanks Doug... http://www.json.org/js.html
function parseData(mydata) {
	var myData = JSON.parse(mydata, function (key, value) {
			var type;
			if (value && typeof value === 'object') {
				type = value.type;
				if (typeof type === 'string' && typeof window[type] === 'function') {
					return new (window[type])(value);
				}
			}
			return value;
		});
	return myData;
}


function objToHtmlList(obj) {
	if (obj instanceof Array) {
		var ol = document.createElement('ol');
		for (var child in obj) {
			var li = document.createElement('li');
			li.appendChild(objToHtmlList(obj[child]));
			ol.appendChild(li);
		}
		return ol;
	}
	else if (obj instanceof Object && !(obj instanceof String)) {
		var ul = document.createElement('ul');
		for (var child in obj) {
			var li = document.createElement('li');
			li.appendChild(document.createTextNode(child + ": "));
			li.appendChild(objToHtmlList(obj[child]));
			ul.appendChild(li);
		}
		return ul;
	}
	else {
		return document.createTextNode(obj);
	}
}			


function ajaxer(url,action,params) {

	// pass a url +
	// function to run with captured data
	// (optional) params for url
 
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var responseHeaders		= req.getAllResponseHeaders();
			var summaryData			= req.responseText;
			var summaryDataJSON		= parseData(summaryData); //from common.js			
			action(summaryDataJSON);
			action = null;
			summaryDataJSON = null;
		}
	};
	
	if ( params !== undefined ) {
		req.open('GET', url + '?' + params.join('&'), true);	
	} else {
		req.open('GET', url ,true);		
	}
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');
	req.send(null);	
}


