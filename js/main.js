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
		$(".weather-container").append(bodyString);
	}

	function loadWeather(location, woeid) {
	  $.simpleWeather({
	    location: location,
	    woeid: woeid,
	    unit: 'f',
			success: simpleWeatherSuccess,
	    error: simpleWeatherError
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
		
		createBody();
		fillBody(temp, thumb, loc, conditions, wind);
	}
	
	function simpleWeatherError(error) {
		$("#weather").html('<p>'+error+'</p>');
	}
	
	function fillBody(temp, thumb, loc, conditions, wind) {
		$("#temp").html(temp);
		$("#thumb").html(thumb);
		$("#loc").html(loc);
		$("#weather").html(conditions);
		$('#wind').html(wind);
	}
	
	function setBackground(photos) {
		var photo;
		
		if (!photos.length) {
			photos = ["http://static.pexels.com/wp-content/uploads/2014/06/clouds-colorful-colourful-1029.jpg"];
		}
		
		photo = photos[Math.floor(Math.random()*photos.length)];
		$('body').css('background-image', 'url(' + photo + ')');
	}
	
	function buildPhotoUrl(coords) {
		var diff = 0.01,
				minx = coords[0] - diff,
				miny = coords[1] - diff,
				maxx = coords[0] + diff,
				maxy = coords[1] + diff
				 url = "http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20" +
									"&minx=" + minx +
									"&miny=" + miny +
									"&maxx=" + maxx +
									"&maxy=" + maxy +
									"&size=original&mapfilter=true";
									
		return url;
	}
	
	function geolocationSuccess(data) {
		var photos = [];
		
		data.photos.forEach(function(photoObj) {
			photos.push(photoObj.photo_file_url);
		});
		
		setBackground(photos);
	}
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var coords = [position.coords.longitude, position.coords.latitude],
						 url = buildPhotoUrl(coords);
		  loadWeather(position.coords.latitude+','+position.coords.longitude);	
											
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: url,
					success: geolocationSuccess
				})
				
		  }, function(error) { 
				loadWeather('Boston, MA', '');
		});
	} else {
		loadWeather('Boston, MA', '');
	}
	
	$("body").on('click', "#switch", function() {
		if (fTemp){
			// otherwise temperature hasn't loaded yet so disable switching
			if (fahrenheit) {
				temp = '<h2>'+cTemp+'&deg;C</h2>';
			} else {
				temp = '<h2>'+fTemp+'&deg;F</h2>';
			}
			fahrenheit = !fahrenheit;
			$("#temp").html(temp);
		}
	});
});

