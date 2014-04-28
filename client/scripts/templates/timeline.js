Template.timeline.helpers({
	current_day: function () {
		var i = Session.get("day_index");
		var d = days[i];
		var curr_date = d.getDate();
	    var curr_month = d.getMonth() + 1; //Months are zero based
	    var curr_year = d.getFullYear();
	    return (curr_month + "-" + curr_date + "-" + curr_year);
	},
	total_microblogs: function() { 
		return Session.get("total_day_microblogs");
	}	
});

Template.timeline.draw = function(day_index) { 
	// Timeline
	// var svg = d3.select("#timeline_container").append("svg")
	// 	.attr("id", "timeline_chart")
	//     .attr("width", map_width)
	//     .attr("height", timeline_height);

	// var data = oneDayBlogs(Session.get("day_start")).fetch();

	var data = daychart_data[day_index];
	console.log(data);

	// console.log(hours_group.size());
	// console.log(hours_group.all());


	var margin = {top: 0, bottom: 20, left: 0, right: 0},
		width = map_width,
		height = timeline_height,
		duration = 500,
		formatNumber = d3.format(',d'),
		brush = d3.svg.brush();

	// Construct margin based on the max Y val's length * font-size
	margin.left = formatNumber(d3.max(data, function(d) { return d.value; })).length * 8;

	console.log("got to here");

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
	    var min_key, max_key
	    // Iterate over bars, giving it the selected class if its in the extent range
	    // Also keep track of min and max index (bar)
	    bars.classed("selected", function(d) {
	    	var selected = false;
	    	if (extent[0] <= x(d.key) && x(d.key) + x.rangeBand() <= extent[1]) {
	    		selected = true;
	    		if (min_key == null || d.key < min_key) {
	    			min_key = d.key;
	    		}
	    		if (max_key == null || d.key > max_key) {
	    			max_key = d.key;
	    		};
	    	};
	     	return selected; 
	 	});

	 	// console.log(min_key+" "+max_key);

	 	d3.select("svg#map g#day-"+Session.get("day_index")).selectAll('.pin').classed('hidden', function  (d) {
	 		var hour = d.date_time.getHours();
	 		return !(hour >= min_key && hour <= max_key);
	 	})

	    // Calculate and show total selected
	    makeSum();

	    // days[extent]
	  }

	  function brushend() {
	    chart.classed("selecting", !d3.event.target.empty());
	    // d3.selectAll('.pin').classed("hidden", false); //show all pins for the day
	  }    

	  function makeSum() {
	    var extent = brush.extent(),
	        sum = 0;
	    
	    data.forEach(function(d) {
	      if (extent[0] <= x(d.key) && x(d.key) + x.rangeBand() <= extent[1])
	        sum += d.value;
	    });
	    d3.select('#selected_microblogs div').text(sum);
	  }  

	  makeSum();
		


}