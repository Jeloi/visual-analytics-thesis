Template.timeline.draw = function() { 
	// Timeline
	// var svg = d3.select("#timeline_container").append("svg")
	// 	.attr("id", "timeline_chart")
	//     .attr("width", map_width)
	//     .attr("height", timeline_height);

	// var data = oneDayBlogs(Session.get("day_start")).fetch();
	console.log(day_data);
	var main_data = day_data;
	var cross = crossfilter(main_data);
	var hours_dimension = cross.dimension(function (d) { return d.date_time.getHours() });

	var hours_group = hours_dimension.group().reduceCount();

	// Grouped data, where each object is of the form {key: <>, value: >}, key being hour of day and value being sum blogs
	var data = hours_group.all();

	console.log(hours_group.size());
	console.log(hours_group.all());

	// var blogsPerHourChart = dc.barChart("#timeline_container");

	// blogsPerHourChart
	// 	.width(map_width).height(timeline_height)
	// 	.dimension(hours_dimension)
	// 	.group(hours_group)
	// 	// .round(d3.time.hour.floor)
	// 	// .centerBar(true)
	// 	// .alwaysUseRounding(true)
	// 	// .xUnits(d3.time.hours)
	// 	.x(d3.time.scale().domain([0,24])); 

	// blogsPerHourChart.yAxis().ticks(2)
	// blogsPerHourChart.xAxis().ticks(24)


	var margin = {top: 0, bottom: 20, left: 0, right: 0},
		width = map_width,
		height = timeline_height,
		duration = 500,
		formatNumber = d3.format(',d'),
		brush = d3.svg.brush();

	// Construct margin based on the max Y val's length * font-size
	margin.left = formatNumber(d3.max(data, function(d) { return d.value; })).length * 8;

	var w = width - margin.left - margin.right,
		h = height - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	          .rangeRoundBands([0, w], .1),
		y = d3.scale.linear()
	          .range([h, 0]);


	y.domain([0, d3.max(data, function(d) { return d.value; })]);
	x.domain(data.map(function(d) { return d.key; }));

	var xAxis = d3.svg.axis()
	                .scale(x)
	                // .tickPadding(3)
	                .tickFormat(function(d) { return d+":00" })
	                .orient('bottom'),
	    yAxis = d3.svg.axis()
	                .scale(y)
	                .orient('left'),
	    brush = d3.svg.brush()
	                      .x(x)
	                      .on('brushstart', brushstart)
	                      .on('brush', brushmove)
	                      .on('brushend', brushend);

	var svg = d3.select('#timeline_container').selectAll('svg').data([data]);
	var svgEnter = svg.enter().append('svg')
              .append('g')
                .attr('width', w)
                .attr('height', h)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .classed('chart', true);
	      chart = d3.select('#timeline_container .chart');

	  svgEnter.append('g')
	            .classed('x axis', true)
	            .attr('transform', 'translate(' + 0 + ',' + h + ')');
	  svgEnter.append('g')
	            .classed('y axis', true)
	  svgEnter.append('g').classed('barGroup', true);
	  chart.selectAll('.brush').remove();
	  chart.selectAll('.selected').classed('selected', false);
	  chart.append('g')
	            .classed('brush', true)
	            .call(brush)
	          .selectAll('rect')
	            .attr('height', h);

	  bars = chart.select('.barGroup').selectAll('.bar').data(data);

	  bars.enter()
	        .append('rect')
	          .classed('bar', true)
	          .attr('x', w) // start here for object constancy
	          .attr('width', x.rangeBand())
	          .attr('y', function(d, i) { return y(d.value); })
	          .attr('height', function(d, i) { return h - y(d.value); });

	  bars.transition()
	        .duration(duration)
	          .attr('width', x.rangeBand())
	          .attr('x', function(d, i) { return x(d.key); })
	          .attr('y', function(d, i) { return y(d.value); })
	          .attr('height', function(d, i) { return h - y(d.value); });

	  bars.exit()
	        .transition()
	            .duration(duration)
	                .style('opacity', 0)
	                .remove();

	  chart.select('.x.axis')
	        .transition()
	            .duration(duration)
	              .call(xAxis);
	  chart.select('.y.axis')
	        .transition()
	            .duration(duration)
	              .call(yAxis);

	  // Ticks start at beginning of bars
	  chart.selectAll('.x.axis g.tick text').style("text-anchor", "end");
	  // chart.selectAll('.x.axis g.tick line').attr("x1", -21);
	  // chart.selectAll('.x.axis g.tick line').attr("x2", -21);

	  function brushstart() {
	    chart.classed("selecting", true);
	  }

	  function brushmove() {
	    var extent = d3.event.target.extent();
	    bars.classed("selected", function(d) { return extent[0] <= x(d.key) && x(d.key) + x.rangeBand() <= extent[1]; });
	    makeSum();
	  }

	  function brushend() {
	    chart.classed("selecting", !d3.event.target.empty());
	  }    

	  function makeSum() {
	    var sumDiv = d3.select('#sum'),
	        extent = brush.extent(),
	        sum = 0;
	    
	    data.forEach(function(d) {
	      if (extent[0] <= x(d.key) && x(d.key) + x.rangeBand() <= extent[1])
	        sum += d.y;
	    });
	    sumDiv.text('TOTAL: ' + sum);
	  }  

	  makeSum();
		


}