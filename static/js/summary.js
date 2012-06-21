window.onload = function() {
	setInterval(grabStats,1000);
	// hoverGraph(); // in progress
	// testHover();
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
	}
	
	req.open('GET', url ,true);
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');
	req.send(null);	
}


function displayData(data) {
	for (var i in data) {
			var stat = data[i];						
		if ( i !== 'uptime') { // no graph for uptime
			paintCircle(stat, i);
		} else { 
			document.getElementById(i).innerHTML = stat;			
		}		
	}
}


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
									
		if ( stat < 50 )
			ctx.strokeStyle = "#0FE500";
		else if ( stat >= 50 && stat < 75 )
			ctx.strokeStyle = "#F2EA07";
		else if ( stat >= 75 && stat < 90  )
			ctx.strokeStyle = "#FF761C";
		else
			ctx.strokeStyle = "#FF3205";
									
		ctx.lineWidth = 6;
		ctx.arc(x,y,radius,startAngle,endAngle,clockwise);
		ctx.stroke();
	}

}	


function hoverGraph() {
	canvases = document.getElementsByTagName('canvas');
	for ( var i = 0; i < canvases.length; i++ ) {
		canvases[i].onmouseover = function() {
			self = this;
			summaryItem = self.getAttribute('id').split("-")[0]; //cpu,disk,memory,virtuall
			//self.removeAttribute('id');
			//console.log(summaryItem); // = stats-canvas
			
			// get last hours(?) worth of stats and make graph 

			var context = self.getContext("2d");
			context.fillStyle = "rgba(0, 255, 255, .5)";
			context.fillRect(0,0,300,160);
		} 					  
	}
}

function testHover() {
	var testList = document.getElementById("uptime"); 
	if ( testList.mouseover == false ) {
		console.log(testList);
	};
}

