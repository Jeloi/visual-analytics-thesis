Template.dateline.add_daychart = function(day_data, day_index) { 
	var cross = crossfilter(day_data);
	var hours_dimension = cross.dimension(function (d) { return d.date_time.getHours() });

	var hours_group = hours_dimension.group().reduceCount();

	// Grouped data, where each object is of the form {key: <>, value: >}, key being hour of day and value being sum blogs
	var data = hours_group.all();
	daychart_data[day_index] = data;


	// Make daychart
}