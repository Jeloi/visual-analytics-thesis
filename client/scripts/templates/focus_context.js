Template.focus_context.update = function() { 
	data = hour_counts;

	var focusGraph;

	// Context
	var margin = {top: 140, right: 10, bottom: 0, left: 50},
	    margin2 = {top: 10, right: 0, bottom: 20, left: 50},//{top: 430, right: 10, bottom: 20, left: 40},
	    width = map_width - margin.left - margin.right,
	    height =  100, // height of focus
	    height2 = 100; // height of context

	var x2 = d3.scale.linear().range([0, width]),
	    y2 = d3.scale.linear().range([height2, 0]);

	var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

   	var brush = d3.svg.brush()
   	    .x(x2)
   	    .on('brushstart', brushstart)
   	    .on("brush", brushmove);

   	var area2 = d3.svg.area()
   	    .interpolate("monotone")
   	    .x(function(d) { return x2(d.hour_index); })
   	    .y0(height2)
   	    .y1(function(d) { return y2(d.count); });

    var svg = d3.select("#focus_context").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 260);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", width)
            .attr("height", height);

   

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        x2.domain(d3.extent(data.map(function(d) { return d.hour_index; })));
        y2.domain([0, d3.max(data.map(function(d) { return d.count; }))]);

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




    var focus = svg.append("g")
        .attr('class', 'focus')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1),
        y = d3.scale.linear().range([height, 0]);

	    x.domain(data.map(function(d) { return d.hour_index; }));
	    y.domain([0, d3.max(data.map(function(d) { return d.count; }))]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(8);

    var barsGroup = focus.append("g")
        .attr('clip-path', 'url(#clip)');

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        focusGraph = barsGroup.selectAll("rect")
            .data(data)
          .enter().append("rect")
          	.attr('class', 'bar')
            .attr("x", function(d, i) { return x(d.hour_index); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return height - y(d.count); });

        // focus.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("class", "bar")
        //     .attr("x", function(d) { return x(d.hour_index); })
        //     .attr("width", x.rangeBand())
        //     .attr("y", function(d) { return y(d.count); })
        //     .attr("height", function(d) { return height - y(d.count); });







    function brushmove() {

	    var extent = brush.extent();
		var min_hour = Math.floor(extent[0]), max_hour = Math.floor(extent[1]);

        // Set the session variables to the proper range being displayed
        if (brush.empty()) {
            Session.set("brush_start", Session.get("date_start"));
            Session.set("brush_end", Session.get("date_end"));
        } else {
            Session.set("brush_start", hourToDate(min_hour));
            Session.set("brush_end", hourToDate(max_hour+1));
        }

        console.log(Session.get("brush_start"));
        console.log(Session.get("brush_end"));

		// Implement focus by changing its scale's domain
		x.domain(brush.empty() ? x2.domain() : rangeArray(min_hour, max_hour));
        focusGraph.attr("x", function(d, i) { return x(d.hour_index); });
		focusGraph.attr("width", x.rangeBand() );
		focus.select(".x.axis").call(xAxis);


		// bars.classed("selected", function(d) { return extent[0] <= x(d.x) && x(d.x) + x.rangeBand() <= extent[1]; });

    	d3.selectAll("svg#map g.hour_group.showing").classed("showing", false);


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