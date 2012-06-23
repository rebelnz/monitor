// setInterval(updateTopProcess, 3000);

var procList = document.getElementById("process-list");	

var reloader = function(pData) {	
	procList.innerHTML = '';
	for (var i in pData) {
		procList.innerHTML += 
		'<li>' + pData[i][1]['name'] + ' ' + 
			'PID ' + pData[i][1]['pid'] + ' ' +
			'CPU Time ' + pData[i][1]['cpu_time'] + ' ' +
			'<button class="small-btn btn-dark" onclick="showDetails(' + pData[i][1]['pid'] +')">Details</button></li>';
	}
};

var displayProcessDetails = function (recievedData) {
	var detailListHTML = objToHtmlList(recievedData); 
	var detailListDiv = document.getElementById("detail-list");					
	detailListDiv.innerHTML = '';
	detailListDiv.appendChild(detailListHTML);
};


function updateTopProcess (limit) { 
	var url = '/topprocess';
	var params = ['limit=' + limit];
	ajaxer(url,reloader,params);

}

function showDetails(pid) {
	var url = '/processdetails';
	var params = ['pid=' + pid];				  
	ajaxer(url,displayProcessDetails,params);
}


function clearTopProcess() {
	var procList = document.getElementById("process-list");	
	var detList = document.getElementById("detail-list");	
	procList.innerHTML = '';
	detList.innerHTML = '';
}	

