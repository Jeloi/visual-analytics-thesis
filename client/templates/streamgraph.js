Template.streamgraph.draw = function () {
	// console.log(Session.get("num_searches"));
	if (Session.get("num_searches") > 0) {

		var svg = d3.select("#streamgraph g");

		var margin = {top: 0, right: 50, bottom: 0, left: 50},
			width = map_width - margin.left - margin.right,
			height = 200;

		var stack = d3.layout.stack()
			.offset("silhouette")
			.values(function(d) { return d.counts })
			.x(function(d) { return d.hour_index })
			.y(function(d) { return d.count });

		var data = _.map(search_counts, function(val, key) { return val } );

		// Filter out the streams that are in the disabled array
		data = _.filter(data, function(d) {
			return !disabled_searches.hasOwnProperty(d.search_id);
		})

		var layers = stack(data);

		Template.streamgraph.y_scale.domain([0, d3.max(layers, function(layer) { return d3.max(layer.counts, function(d) { return d.y0 + d.y; }); })]);

		// console.log(Template.streamgraph.y_scale.domain);

		// console.log(layers);

		var area = d3.svg.area()
			.interpolate("cardinal")
		    .x(function(d) { return Template.streamgraph.x_scale(d.hour_index); })
		    .y0(function(d) { return Template.streamgraph.y_scale(d.y0); })
		    .y1(function(d) { return Template.streamgraph.y_scale(d.y0 + d.count); });

		var xAxis = d3.svg.axis()
		    .scale(Template.streamgraph.x_scale)
		    .orient("bottom")
		    .ticks(10);

		var yAxis = d3.svg.axis()
			.orient("right")
		    .scale(Template.streamgraph.y_scale);

		var yAxisr = d3.svg.axis()
			.orient("left")
		    .scale(Template.streamgraph.y_scale);

		// Update Axis


		// Streamgraph
	    streams = svg.selectAll("path")
	        .data(layers)

		streams.enter().append("path"); //add a new path for new streams

	    streams.exit().remove(); // remove streams for old searches

	    streams.attr("d", function(d) { return area(d.counts); }) //update the areas
	        .attr('class', function(d) { return d.color });


	    // Axis
	    // d3.select(".x.axis").call(xAxis);
	    // d3.select(".y.axis.left").call(yAxis);
	    // d3.select(".y.axis.right").call(yAxisr);

    } else {
    	d3.selectAll("#streamgraph svg g path").remove();
    };

}

Template.streamgraph.rendered = function() {
	var margin = {top: 10, right: 50, bottom: 0, left: 50},
		width = map_width - margin.left - margin.right,
		height = 230;


	var svg = d3.select("#streamgraph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)



	var g = svg.append("g")
	    .attr('id', 'streams')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	Template.streamgraph.x_scale.range([0, width]);
	Template.streamgraph.y_scale.range([height, 0]);



	svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "stream_brush")
		.call(Template.streamgraph.brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", height + 5);

	// d3.select("#steamgraph > svg").append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + height + ")")

	// d3.select("#steamgraph > svg").append("g")
	//     .attr("class", "y axis right")
	//     .attr("transform", "translate(" + width + ", 0)")

	// d3.select("#steamgraph > svg").append("g")
	//     .attr("class", "y axis left")
}

Template.streamgraph.brushmove = function(){
	var brush = Template.streamgraph.brush;
	var extent = brush.extent();
	var min_hour = (Math.floor(extent[0]));
	var max_hour = Math.floor(extent[1]);

	// console.log(min_hour);
	// console.log(max_hour);

	// Set the session variables to the range being displayed
	if (brush.empty()) {
	    Session.set("brush_start", Session.get("date_start"));
	    Session.set("brush_end", Session.get("date_end"));
	} else {
	    Session.set("brush_start", min_hour);
	    Session.set("brush_end", max_hour);
	}
	

	if (brush.empty()) {
		console.log("stream brush is empty!");
		d3.selectAll("#nodes g").classed('showing', false);
		Session.set("old_min_hour", -1);
	} else {

		var old_min_hour = Session.get("old_min_hour"),
			old_max_hour = Session.get("old_max_hour");

		var add_min, add_max, remove_min, remove_max; // variables to store ranges for hours that are added/removed
		// Figure out the range to remove and range to add
		if (!(min_hour == old_min_hour && max_hour == old_max_hour)) { //only do stuff if the range has changed
			if (min_hour > old_max_hour || max_hour < old_min_hour) { // disjoint ranges
				add_min = min_hour;
				add_max = max_hour;
				remove_min = old_min_hour;
				remove_max = old_max_hour;
			} else {
				if (min_hour < old_min_hour ) {	
					add_min = min_hour;
					add_max = old_min_hour - 1;
				} 
				if (min_hour > old_min_hour) {
					remove_min = old_min_hour;
					remove_max = min_hour-1;
				}
				if (max_hour > old_max_hour) {
					add_min = old_max_hour+1;
					add_max = max_hour;
				} 
				if (max_hour < old_max_hour) {
					remove_min = max_hour+1;
					remove_max = old_max_hour;
				}

			}

			// Remove range actions
			// if (Session.get("old_min_hour") == -1) {
				for (var i = remove_min; i <= remove_max; i++) {
					// focus.select("rect[data-hour='"+i+"']").classed('selected', false);
					d3.selectAll("#nodes g[data-hour='"+i+"']").classed('showing', false);
				};
			// };

			// Add range actions
			for (var i = add_min; i <= add_max; i++) {
				// focus.select("rect[data-hour='"+i+"']").classed('selected', true);
				d3.selectAll("#nodes g[data-hour='"+i+"']").classed('showing', true);
			};

		};

		Session.set("brush_start", min_hour);
		Session.set("brush_end", max_hour);

		Session.set("old_min_hour", min_hour);
		Session.set("old_max_hour", max_hour);

	};
}

Template.streamgraph.x_scale = d3.scale.linear()
    .domain([0, num_hours - 1]);

Template.streamgraph.y_scale = d3.scale.linear()


// Brush
Template.streamgraph.brush = d3.svg.brush()
    .x(Template.streamgraph.x_scale)
    // .on('brushstart', Template.streamgraph.brushstart)
    .on("brush", Template.streamgraph.brushmove);
    