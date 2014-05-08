Template.streamgraph.draw = function () {
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

	console.log(data);
	var max_count=0;
	for (var i = 0; i < data.length; i++) {
		var max_group = d3.max(data[i], function(d) {return d.y0+d.count});
		if (max_group > max_count) {
			max_count = max_group;
		}
	};
	console.log(max_count);

	var layers = stack(data);

	console.log(d3.max(layers, function(layer) { return d3.max(layer.counts, function(d) { return d.y0 + d.y; })}));
	Template.streamgraph.y_scale.domain([0, d3.max(layers, function(layer) { return d3.max(layer.counts, function(d) { return d.y0 + d.y; }); })]);

	// console.log(Template.streamgraph.y_scale.domain);

	// console.log(layers);

	var area = d3.svg.area()
		.interpolate("cardinal")
	    .x(function(d) { return Template.streamgraph.x_scale(d.hour_index); })
	    .y0(function(d) { return Template.streamgraph.y_scale(d.y0); })
	    .y1(function(d) { return Template.streamgraph.y_scale(d.y0 + d.count); });

    streams = svg.selectAll("path")
        .data(layers)

	streams.enter().append("path"); //add a new path for new streams

    streams.exit().remove(); // remove streams for old searches

    streams.attr("d", function(d) { return area(d.counts); }) //update the areas
        .attr('class', function(d) { return d.color });

}

Template.streamgraph.rendered = function() {
	var margin = {top: 0, right: 50, bottom: 0, left: 50},
		width = map_width - margin.left - margin.right,
		height = 200;


	var svg = d3.select("#streamgraph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")

	Template.streamgraph.x_scale.range([0, width]);
	Template.streamgraph.y_scale.range([height, 0]);

}

Template.streamgraph.x_scale = d3.scale.linear()
    .domain([0, num_hours - 1]);

Template.streamgraph.y_scale = d3.scale.linear()
    