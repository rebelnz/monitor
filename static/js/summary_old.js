window.onload = function() {
	setInterval(grabStats,1000);
	// ajaxer('1','2');
	hoverGraph(); // in progress
	testHover();
};


function grabStats() {
	var url = '/summary';
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var responseHeaders		= req.getAllResponseHeaders();
			var summaryData			= req.responseText;
			var summaryDataJSON		= parseData(summaryData); //from common.js			
			displayData(summaryDataJSON);
		}
	};
	
	req.open('GET', url ,true);
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');
	req.send(null);	

}


function displayData(data) {
	for (var i in data) {
		var stat = data[i];						
			if ( i === 'uptime') { // throw uptime into masthead
				document.getElementById(i).innerHTML = stat;			
			} else { 
				paintCircle(stat, i); // make circles of the rest
			}		
		}
	};
	

function paintCircle(stat,item) {

	document.getElementById( item + "-summary-span").innerHTML = stat + '%';
	document.getElementById( item + "-summary-bar").value = stat;
	
	var canvas = document.getElementById(item + '-stats-canvas');

	if ( canvas != null) {
		var ctx = canvas.getContext('2d');
		
		ctx.clearRect(0,0,300,160);																
		ctx.beginPath();  							
		
		var x				= 145;			// x coordinate  
		var y				= 75;			// y coordinate  
		var radius			= 40;           // Arc radius  
		var clockwise		= false;		// clockwise or anticlockwise  
		var startAngle		= 2;
		var endAngle		= 2 + (6/100 * stat);
		
		ctx.strokeStyle = "#0FE500";
		if ( stat >= 50 && stat < 75 )
			ctx.strokeStyle = "#F2EA07";
		if ( stat >= 75 && stat < 90  )
			ctx.strokeStyle = "#FF761C";
		if ( stat >= 90 )
			ctx.strokeStyle = "#FF3205";
		
		ctx.lineWidth = 40;
		ctx.arc(x,y,radius,startAngle,endAngle,clockwise);
		ctx.stroke();
	}

}	

function testHover() {
	var testList = document.getElementById("uptime"); 
	if ( testList.mouseover == false ) {
		console.log(testList);
	};
}

