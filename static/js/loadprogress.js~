window.onload = function() {
	graphProcess();
}

// this should be more modular... 
// graph stuff jas been thrown in to 
// utilise the existing GET request
	
	function graphProcess() {
		
		var tv = 2000;

		var graph = new Rickshaw.Graph( {
				element: document.getElementById("graph"),
				width: 940,
				height: 200,
				renderer: 'line',
				series: new Rickshaw.Series.FixedDuration([{ name: 'one' }], undefined, {
						timeInterval: tv,
						maxDataPoints: 100,
						timeBase: new Date().getTime() / 1000
					}) 
			} );

		graph.render();


		var iv = setInterval( function() {
				var url = '/progress';
				var req = new XMLHttpRequest();
				req.onreadystatechange = function() {
					if (req.readyState === 4) {
						var responseHeaders = req.getAllResponseHeaders();
						var progressData = req.responseText;

						// parse response to get real JSON
						var progressDataJSON = JSON.parse(progressData, function (key, value) {
								var type;
								if (value && typeof value === 'object') {
									type = value.type;
									if (typeof type === 'string' && typeof window[type] === 'function') {
										return new (window[type])(value);
									}
								}
								return value;
							});

						//update progress bars
						for (var i in progressDataJSON) {
							document.getElementById( i + "-progress-span").innerHTML = progressDataJSON[i] + '%';
							document.getElementById( i + "-progress-bar").value = progressDataJSON[i];;
						}

						var data = { one: progressDataJSON['cpu']*10, 
									 two:progressDataJSON['disk']*10, 
									 three:progressDataJSON['virtual']*10, 
									 four:progressDataJSON['memory']*10, 
						};
												
						graph.series.addData(data);
						graph.render();
						
					}

				};

				req.open('GET', url ,true);
				req.setRequestHeader('X-Requested-With','XMLHttpRequest');
				req.send(null);
				
			}, tv );

	}

		
