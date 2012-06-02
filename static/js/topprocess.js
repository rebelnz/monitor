// setInterval(updateTopProcess, 3000);

function showDetails(pid) {
	var url = '/processdetails';
	var params = ['pid=' + pid];
				  
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
		
			var responseHeaders = req.getAllResponseHeaders();
			var detailData = req.responseText;
			var detailDataJSON= parseData(detailData);
			
			var detailListDiv = document.getElementById("detail-list");	
			
			function jsonToHtmlList(json) {
				return objToHtmlList(JSON.parse(json));
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

			var detailListHTML = objToHtmlList(detailDataJSON); 
			detailListDiv.innerHTML = '';
			detailListDiv.appendChild(detailListHTML);
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

function reloadProgress(pData) {	
	var procList = document.getElementById("process-list");	
	procList.innerHTML = '';
	for (var i in pData) {
		procList.innerHTML += 
			'<li>' + pData[i][1]['name'] + ' ' + 
			'PID ' + pData[i][1]['pid'] + ' ' +
			'CPU Time ' + pData[i][1]['cpu_time'] + ' ' +
			'<span onclick="showDetails(' + pData[i][1]['pid'] +')">Details</span></li>';
	}

}
