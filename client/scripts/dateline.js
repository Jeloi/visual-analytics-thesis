Template.dateline.add_daychart = function(day_data, day_index) { 
	var cross = crossfilter(day_data);
	var hours_dimension = cross.dimension(function (d) { return d.date_time.getHours() });

	var hours_group = hours_dimension.group().reduceCount();

	// Grouped data, where each object is of the form {key: <>, value: >}, key being hour of day and value being sum blogs
	var data = hours_group.all();
	daychart_data[day_index] = data;


	// Make daychart
	var width=100, height=150;

	// Scales
	var x = d3.scale.linear()
	    .range([0, width])
	    .domain([0, data.length]);

	var y = d3.scale.linear()
	    .range([height, 0])
	    .domain([0,4000]);

    x.domain(d3.extent(data, function(d) { return d.key; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));

	var line = d3.svg.line()
	    .x(function(d) { return x(d.key); })
	    .y(function(d) { return y(d.value); });

	var svg = d3.select("#dateline").append("svg")
		.attr('width', width)
		.attr('height', height)
		.append('g');


	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .attr("d", line);
}