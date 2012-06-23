window.onload = function() {
	setInterval(grabStats,1000);
	keyPresser();
	clickForGraph();
};


// so we can pass the fuction to ajaxer
var displayData = function(data) {
	for (var i in data) {
		var stat = data[i];						
		if ( i === 'uptime') { // throw uptime into masthead
			document.getElementById(i).innerHTML = stat;			
		} else { 
			paintCircle(stat, i); // make circles of the rest
		}		
	}
};


function grabStats() {
	var url = '/summary';	
	ajaxer(url,displayData);	
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

function highlightUptime() {	
	var uptimeH3 = document.getElementById('uptime');
	uptimeH3.style.color = '#0FE500';
	setTimeout(function() {
				   uptimeH3.style.color = "#CECECE";
			   },2000);
}

function replaceWithGraph(item) {

	var graphDiv = document.getElementById(item+'-hidden-graph');
	var canvasDiv = document.getElementById(item+'-stats-canvas');

	canvasDiv.style.display = "none";
	graphDiv.style.display = "block";
	
	setTimeout(function() {
				   canvasDiv.style.display = "block";
				   graphDiv.style.display = "none";
			   },3000);
}


function keyPresser() {

	onkeydown = function keyStats(k) {

		var keyPressed = k.which;
		
		switch (keyPressed) { 
		case 67: // c
			replaceWithGraph('cpu');
			break;
			
		case 68: // d
			replaceWithGraph('disk');
		break;
			
		case 77: // m
			replaceWithGraph('memory');
			break;
			
		case 86: // v
			replaceWithGraph('virtual');
			break;
			
		case 85: // u
			highlightUptime();
			break;
			
		};
		
	};
}

function clickForGraph() {
	canvases = document.getElementsByTagName('canvas');
	for ( var i = 0; i < canvases.length; i++ ) {
		canvases[i].onclick = function() {
			self = this;
			var item = self.getAttribute('id').split("-")[0];
			replaceWithGraph(item);
		}; 					  
	}
}
	
	