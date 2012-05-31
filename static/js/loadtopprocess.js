setInterval(updateTopProcess, 3000);


//happens after but define it here
function showDetails(pid) {
	var url = '/processdetails';
	var params = ['pid=' + pid];
				  
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var responseHeaders = req.getAllResponseHeaders();
			var processData = req.responseText;
			var processDataJSON = parseData(processData);
			console.log(processDataJSON)
			//console.log(processDataJSON['io_count'])
		}
	};

	req.open('GET', url + '?' + params.join('&'), true);
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');
	req.send(null);	
	
}


function updateTopProcess () { 

	var url = '/topprocess';
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var responseHeaders = req.getAllResponseHeaders();
			var progressData = req.responseText;
			var progressDataJSON = parseData(progressData);
			//console.log(progressData['mem'])
			reloadProgress(progressDataJSON);
		}
	};

	req.open('GET', url ,true);
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');
	req.send(null);
}

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

function reloadProgress(pData) {	
	var procList = document.getElementById("top-processes");	
	procList.innerHTML = '';
	for (i in pData) {
		procList.innerHTML += 
			'<li>' + pData[i][1]['name'] + ' ' + 
			'PID ' + pData[i][1]['pid'] + ' ' +
			'CPU Time ' + pData[i][1]['cpu_time'] + ' ' +
			'<span onclick="showDetails(' + pData[i][1]['pid'] +')">Details</span></li>';
	}



}
