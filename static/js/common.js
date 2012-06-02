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
