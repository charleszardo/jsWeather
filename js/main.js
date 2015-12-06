var fTemp = null;
var cTemp = null;

$(document).ready(function() {
	var fahrenheit = true;
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
		    loadWeather(position.coords.latitude+','+position.coords.longitude);
		  });
	} else {
		loadWeather('Boston, MA', '');
	}
	
	$("#switch").click(function() {
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
      html = '<li>'+weather.alt.temp+'&deg;C</li></ul>';  
      
			$("#temp").html(temp);
			$("#thumb").html(thumb);
			$("#loc").html(loc);
			$("#weather").html(conditions);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}