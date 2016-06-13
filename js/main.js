$(document).ready(function() {
	var fTemp, cTemp,
			fahrenheit = true,
			coords = [null, null]
	
	function createBody() {
		bodyString = 	'<div id="top-row" class="row">' +
										'<div id="thumb" class="item"></div>' +
										'<div id="temp" class="item"></div>' +
									'</div>' +
									'<div id="switch-row" class="row">' +
											'<a href="#" id="switch">switch units</a>' + 
									'</div>' +
									'<div id="bottom-row" class="row">' +
										'<div id="loc" class="item bottom"></div>' +
										'<div id="weather" class="item bottom"></div>' +
										'<div id="wind" class="item bottom"></div>' +
									'</div>';
		
		$("#loading").remove();
		$("body").append(bodyString);
	}

	function loadWeather(location, woeid) {
	  $.simpleWeather({
	    location: location,
	    woeid: woeid,
	    unit: 'f',
			success: simpleWeatherSuccess,
	    error: function(error) {
	      $("#weather").html('<p>'+error+'</p>');
	    }
	  });
	}
	
	function simpleWeatherSuccess(weather) {
		var temp = '<h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2>',
				thumb = '<img src="'+weather.thumbnail+'">',
				loc = weather.city+', '+weather.region,
				conditions = weather.currently,
				wind = weather.wind.direction + " " + weather.wind.speed + " " + weather.units.speed;
		
		fTemp = weather.temp;
		cTemp = weather.alt.temp;
		
		createBody()
		$("#temp").html(temp);
		$("#thumb").html(thumb);
		$("#loc").html(loc);
		$("#weather").html(conditions);
		$('#wind').html(wind);
	}
	
	function setBackground(photos) {
		if (!photos.length) {
			photos = ["http://static.pexels.com/wp-content/uploads/2014/06/clouds-colorful-colourful-1029.jpg"];
		}
		var photo = photos[Math.floor(Math.random()*photos.length)];
		$('body').css('background-image', 'url(' + photo + ')');
	}
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			coords = [position.coords.longitude, position.coords.latitude];
		    loadWeather(position.coords.latitude+','+position.coords.longitude);
				
				var diff = 0.01,
						minx = coords[0] - diff,
						miny = coords[1] - diff,
						maxx = coords[0] + diff,
						maxy = coords[1] + diff
						testUrl = "http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20" +
											"&minx=" + minx +
											"&miny=" + miny +
											"&maxx=" + maxx +
											"&maxy=" + maxy +
											"&size=original&mapfilter=true";
											
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: testUrl,
					success: function(data) {
						var photos = [];
						data.photos.forEach(function(photoObj) {
							photos.push(photoObj.photo_file_url);
						});
						setBackground(photos);
					}
				})
				
		  }, function(error) { 
				loadWeather('Boston, MA', '');
		});
	} else {
		loadWeather('Boston, MA', '');
	}
	
	$("body").on('click', "#switch", function() {
		if (!fTemp){
			// temperature hasn't loaded yet so disable swithing
			return;
		}
		if (fahrenheit) {
			temp = '<h2>'+cTemp+'&deg;C</h2>';
		} else {
			temp = '<h2>'+fTemp+'&deg;F</h2>';
		}
		fahrenheit = !fahrenheit;
		$("#temp").html(temp);
	});
});

