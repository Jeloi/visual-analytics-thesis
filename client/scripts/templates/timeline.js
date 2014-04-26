Template.timeline.x_scale = d3.time.scale()
		.range([0, map_width]);

Template.timeline.y_scale = d3.scale.linear()
		.range([timeline_height, 0]);

Template.timeline.draw = function() { 
	// Timeline
	var svg = d3.select("#timeline_container").append("svg")
		.attr("id", "timeline")
	    .attr("width", map_width)
	    .attr("height", timeline_height);

	var data = oneDayBlogs(Session.get("day_start")).fetch();
	var cross = crossfilter(data);
	var hours_dimension = cross.dimension(function (d) { return d.date_time.getHours() });

	var hours_group = hours_dimension.group().reduceCount();

	console.log(hours_group.size());

	var blogsPerHourChart = dc.lineChart("#timeline_container");

	blogsPerHourChart
		.width(map_width).height(timeline_height)
		.dimension(hours_dimension)
		.group(hours_group)
		.x(d3.time.scale().domain([0,24])); 


	// Data count 
	dc.dataCount(".dc-data-count")
	       .dimension(hours_dimension)
	       .group(hours_group);

	dc.renderAll("hours_group");

	// Timeline axis
	// var xAxis = d3.svg.axis().scale(Template.timeline.x_scale).orient("bottom");


	// var context = svg.append("g")
	//     .attr("class", "context");

	// context.append("g")
	//       .attr("class", "x axis")
	//       .attr("transform", "translate(0," + timeline_height + ")")
	//       .call(xAxis);

	// var area = d3.svg.area()
	//     .interpolate("monotone")
	//     .x(function(d) { return Template.timeline.x_scale(d.date); })
	//     .y0(timeline_height)
	//     .y1(function(d) { return y2(d.price); });




	// var brush = d3.svg.brush()
	//     .x(Template.timeline.x_scale)
	//     .on("brush", brushed);

	// var brushed = function  () {
		
	// }


}