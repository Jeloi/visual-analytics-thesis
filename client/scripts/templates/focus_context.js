Template.focus_context.update = function() { 
	data = hour_counts;

	var margin = {top: 10, right: 10, bottom: 100, left: 40},
	    margin2 = {top: 0, right: 0, bottom: 0, left: 0},//{top: 430, right: 10, bottom: 20, left: 40},
	    width = map_width - margin.left - margin.right,
	    height =  500 - margin.top - margin.bottom, // height of focus
	    height2 = 100; // height of context

	var x = d3.scale.linear().range([0, width]),
	    x2 = d3.scale.linear().range([0, width]),
	    y = d3.scale.linear().range([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");

   	var brush = d3.svg.brush()
   	    .x(x2)
   	    .on('brushstart', brushstart)
   	    .on("brush", brushmove);

   	var area = d3.svg.area()
   	    .interpolate("monotone")
   	    .x(function(d) { return x(d.hour_index); })
   	    .y0(height)
   	    .y1(function(d) { return y(d.count); });

   	var area2 = d3.svg.area()
   	    .interpolate("monotone")
   	    .x(function(d) { return x2(d.hour_index); })
   	    .y0(height2)
   	    .y1(function(d) { return y2(d.count); });

    var svg = d3.select("#focus_context").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        x.domain(d3.extent(data.map(function(d) { return d.hour_index; })));
        y.domain([0, d3.max(data.map(function(d) { return d.count; }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

        focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

        context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

        context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    function brushmove() {

	    var extent = brush.extent();
    	d3.selectAll("svg#map g.hour_group.showing").classed("showing", false);
		

		// Implement focus by changing its scale's domain
	    x.domain(brush.empty() ? x2.domain() : brush.extent());
	    focus.select(".area").attr("d", area);
	    focus.select(".x.axis").call(xAxis);

		// bars.classed("selected", function(d) { return extent[0] <= x(d.x) && x(d.x) + x.rangeBand() <= extent[1]; });

		var min_hour = Math.floor(extent[0]), max_hour = Math.floor(extent[1]);

		for (var i = min_hour; i <= max_hour; i++) {
			d3.select("svg#map g#hour-"+i).classed("showing", true);
		}
		// d3.selectAll("svg#map g.hour_group").classed('hidden', function() { 
		// 	var hour = this.getAttribute("data-hour");
		// 	if (hour >= min_hour && hour <= max_hour){
		// 		// console.log(hour);
		// 		return false;
		// 	} else {
		// 		return true;
		// 	}
		// });
    }

    function brushstart () {
    }

}