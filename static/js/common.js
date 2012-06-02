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
		var ol = document.createElement('ul');
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
