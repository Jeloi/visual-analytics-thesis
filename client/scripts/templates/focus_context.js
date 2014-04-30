Template.focus_context.update = function() { 
	data = hour_counts;

	var focusGraph;

    // Intervals for Ticks
    var interval6 = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 276, 282, 288, 294, 300, 306, 312, 318, 324, 330, 336, 342, 348, 354, 360, 366, 372, 378, 384, 390, 396, 402, 408, 414, 420, 426, 432, 438, 444, 450, 456, 462, 468, 474, 480, 486, 492, 498, 504],
        interval12 = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 468, 480, 492, 504],
        interval24 = [0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360, 384, 408, 432, 456, 480, 504];
    var full_interval = rangeArray(0,504);

	// Context
	var margin = {top: 140, right: 50, bottom: 0, left: 50},
	    margin2 = {top: 10, right: 50, bottom: 20, left: 50},//{top: 430, right: 10, bottom: 20, left: 40},
	    width = map_width - margin.left - margin.right,
	    height =  100, // height of focus
	    height2 = 100; // height of context

	var x2 = d3.scale.linear().range([0, width]),
	    y2 = d3.scale.linear().range([height2, 0]);

	var xAxis2 = d3.svg.axis().scale(x2).orient("bottom")
        .tickValues(interval24).tickFormat(tick_formatter);
    var yAxis2 = d3.svg.axis().scale(y2).orient("left").ticks(0);

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
        .attr("class", "y axis")
        .call(yAxis2);

        context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);




    var focus = svg.append("g")
        .attr('class', 'focus')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

	    x.domain(x2.domain());
	    y.domain([0, d3.max(data.map(function(d) { return d.count; }))]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues(interval24).tickFormat(tick_formatter);
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(3);

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
            .attr("width", (map_width*0.4)/num_hours)
            .attr("height", function(d) { return height - y(d.count); });

        // focus.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("class", "bar")
        //     .attr("x", function(d) { return x(d.hour_index); })
        //     .attr("width", x.rangeBand())
        //     .attr("y", function(d) { return y(d.count); })
        //     .attr("height", function(d) { return height - y(d.count); });

    // Returns a date 5/1 or the am/pm hour of the day, given an hour_index
    function tick_formatter (d) {
        console.log(d);
        if (d % 24 == 0) {
            var date = hourToDate(d);
            return (date.getMonth()+1)+"/"+date.getDate();
        } else {
            var mil = d%24;
            if (mil > 12) {
                return (mil%12)+"pm";
            } else if (mil == 12) {
                return "12pm";
            }
            else {
                return mil+"am";
            }
            // return (d%24)+":00";
            // return d;
        };
    }




    function brushmove() {

	    var extent = brush.extent();
		var min_hour = Math.floor(extent[0]+1), max_hour = Math.floor(extent[1]);


        // Set the session variables to the range being displayed
        if (brush.empty()) {
            Session.set("brush_start", Session.get("date_start"));
            Session.set("brush_end", Session.get("date_end"));
        } else {
            Session.set("brush_start", hourToDate(min_hour));
            Session.set("brush_end", hourToDate(max_hour+1));
        }


		// Implement focus by changing its scale's domain
		// x.domain(brush.empty() ? x2.domain() : rangeArray(min_hour, max_hour));
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focusGraph.attr("x", function(d, i) { return x(d.hour_index); });

        // Calculate bar widths responsively
        var diff = Math.ceil(extent[1]) - Math.floor(extent[0]+1);
        var bar_width = (map_width*0.4)/diff;
        bar_width = (diff == 0) ? (map_width*0.4)/num_hours : bar_width;

        // Calculate tick interval to use based on the diff
        if (diff > 100 || brush.empty()) {
            xAxis.tickValues(interval24);
        } else if (diff > 72) {
            xAxis.tickValues(interval12);
        } 
        else if (diff > 12) {
            xAxis.tickValues(interval6);
        } 
        else {
            xAxis.tickValues(full_interval);
        }
        // Update bar widths and x-axis
		focusGraph.attr("width", bar_width );
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