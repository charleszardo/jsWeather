var fTemp;
var cTemp;
var fahrenheit = true;
var coords = [null, null]

$(document).ready(function() {
	
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			coords = [position.coords.longitude, position.coords.latitude];
		    loadWeather(position.coords.latitude+','+position.coords.longitude);
				
				var diff = 0.002,
						minx = coords[0] - diff,
						miny = coords[1] - diff,
						maxx = coords[0] + diff,
						maxy = coords[1] + diff
						testUrl = "http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20" +
											"&minx=" + minx +
											"&miny=" + miny +
											"&maxx=" + maxx +
											"&maxy=" + maxy +
											"&size=medium&mapfilter=true";
											
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: testUrl,
					success: function(data) {
						console.log(data);
					}
				})
				
		  }, function(error) { 
				loadWeather('Boston, MA', '');
		});


		
	} else {
		loadWeather('Boston, MA', '');
	}
	
	$("#switch").click(function() {
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
	})
	
	
});

function loadWeather(location, woeid) {

  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'f',
    success: function(weather) {
			fTemp = weather.temp;
			cTemp = weather.alt.temp;
			
      temp = '<h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      thumb = '<img src="'+weather.thumbnail+'">';
			loc = weather.city+', '+weather.region;
      conditions = weather.currently;
      wind = weather.wind.direction + " " + weather.wind.speed + " " + weather.units.speed;
      
			$("#temp").html(temp);
			$("#thumb").html(thumb);
			$("#loc").html(loc);
			$("#weather").html(conditions);
			$('#wind').html(wind);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}