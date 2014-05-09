Template.weather.object = function  () {
	var date = Session.get("current_day");
	var weather_object = _.findWhere(weather, {date: date});
	return weather_object;
}

Template.weather.weather_visible = function() {
	return Session.get("show_weather");
}