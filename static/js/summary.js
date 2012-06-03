window.onload = function() {
	summaryStats();
}

//TODO -- set timeout from success
	
	function summaryStats() {
		
		var interval = 1000;
		var iv = setInterval( function() {
				var url = '/summary';
				var req = new XMLHttpRequest();
				req.onreadystatechange = function() {
					if (req.readyState === 4) {
						var responseHeaders = req.getAllResponseHeaders();
						var summaryData = req.responseText;
						var summaryDataJSON = parseData(summaryData); //from common.js


						for (var i in summaryDataJSON) {
							
							var stat = summaryDataJSON[i];
							
							if ( i !== 'uptime') { // no graph for uptime
								
								document.getElementById( i + "-summary-span").innerHTML = stat + '%';
								document.getElementById( i + "-summary-bar").value = stat;

								var canvas = document.getElementById(i + '-stats-canvas');
								var ctx = canvas.getContext('2d');
								
								ctx.clearRect(0,0,260,140);							
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
							} else { // must be uptime
								document.getElementById(i).innerHTML = stat;
							}
						}

						
					}

				};

				req.open('GET', url ,true);
				req.setRequestHeader('X-Requested-With','XMLHttpRequest');
				req.send(null);
				
			}, interval );

	}

		
