Template.focus_context.helpers({
	x: d3.scale.linear()
});


Template.focus_context.draw = function() { 
	data = hour_counts;

	var focusGraph;

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

   	var context_brush = d3.svg.brush()
   	    .x(x2)
   	    .on('brushstart', context_brushstart)
   	    .on("brush", context_brushmove);

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
        .attr("id", "context")
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
        .attr("class", "context_brush")
        .call(context_brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);




    var focus = svg.append("g")
        .attr('id', 'focus')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear().range([height, 0]);
    Template.focus_context.x.range([0, width]);

	    Template.focus_context.x.domain(x2.domain());
	    y.domain([0, d3.max(data.map(function(d) { return d.count; }))]);

    var xAxis = d3.svg.axis().scale(Template.focus_context.x).orient("bottom").tickValues(interval24).tickFormat(tick_formatter);
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

        /* Initialize tooltip */
        tip = d3.tip().offset([-10,0]).attr('class', 'd3-tip').html(function(d) { return "<span class='yellow'>"+d.count+"</span> blogs<br><span class='date'>"+tip_date(d.hour_index)+"</span>"; });

        /* Invoke the tip in the context of your visualization */
        focus.call(tip)

        /*Make bars of bar chart*/
        focusGraph = barsGroup.selectAll("rect")
            .data(data)
          .enter().append("rect")
          	.attr('class', 'bar')
          	// .attr('data-hour', "1")
          	.attr('data-hour', function(d) { return d.hour_index })
            .attr("x", function(d, i) { return Template.focus_context.x(d.hour_index); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", (map_width*0.4)/num_hours)
            .attr("height", function(d) { return height - y(d.count); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    function context_brushmove() {

	    var extent = context_brush.extent();
		var min_hour = (extent[0] - Math.floor(extent[0]) > 0.4 ? Math.floor(extent[0]+1) : Math.floor(extent[0]));
		var max_hour = Math.floor(extent[1]-0.01);


        // Set the session variables to the range being displayed
        if (context_brush.empty()) {
            Session.set("brush_start", Session.get("date_start"));
            Session.set("brush_end", Session.get("date_end"));
        } else {
            Session.set("brush_start", min_hour);
            Session.set("brush_end", max_hour+1);
        }


		// Implement focus by changing its scale's domain
		// x.domain(brush.empty() ? x2.domain() : rangeArray(min_hour, max_hour));
        Template.focus_context.x.domain(context_brush.empty() ? x2.domain() : context_brush.extent());
        focusGraph.attr("x", function(d, i) { return Template.focus_context.x(d.hour_index); });

        // Calculate bar widths responsively
        var diff = Math.ceil(extent[1]) - Math.floor(extent[0]+1);
        var bar_width = (map_width*0.4)/diff;
        bar_width = (diff == 0) ? (map_width*0.4)/num_hours : bar_width;

        // Calculate tick interval to use based on the diff
        if (diff > 100 || context_brush.empty()) {
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

		// TODO: Use this code for showing the hours brushed on the FOCUS timeline
  //   	d3.selectAll("svg#map g.hour_group.showing").classed("showing", false);


		// for (var i = min_hour; i <= max_hour; i++) {
		// 	d3.select("svg#map g#hour-"+i).classed("showing", true);
		// }
    }

    function context_brushstart () {
    	// if (Session.get("explore_section")) {
    		Session.set("plot_overview", false);
            Session.set("map_brush_on", false);
    		d3.selectAll("svg#map g#nodes g[data-group='all_nodes']").remove();
    		d3.select('g#focus g#focus_brush').remove();
    		focus.selectAll('rect.selected').classed('selected', false);
    		context.select('rect.extent').classed('explored', false);
            d3.select('#explore_section').classed("active", false);
    	// };
    }
}


Template.focus_context.explore_section = function  (start_hour, end_hour) {
	Session.set("explore_section", true);
	Template.map.plot_brushed("all_nodes");

	var focus = d3.select('#focus_context #focus'),
		context = d3.select('#focus_context #context');



	// Highlight the context brush
	context.select('rect.extent').classed('explored', true);

	var focus_brush = d3.svg.brush()
	    .x(Template.focus_context.x)
	    .on("brush", focus_brushmove);
	    // .on('brushstart', context_brushstart)

    focus.append("g")
	    .attr("id", "focus_brush")
	    .call(focus_brush)
	    .selectAll("rect")
	    .attr("y", -6)
	    .attr("height", 100 + 7);


    function focus_brushmove() {
        Session.set("map_brush_on", false);
		var extent = d3.event.target.extent();
		var x = Template.focus_context.x;

		var extent = focus_brush.extent();
		var max_hour = Math.floor(extent[1]-0.01);
		var min_hour = (extent[0] - Math.floor(extent[0]) > 0.4 ? Math.floor(extent[0]+1) : Math.floor(extent[0]));


		if (focus_brush.empty()) {
			console.log("focus is empty!");
			d3.selectAll("#nodes g").classed('showing', false);
			focus.selectAll("rect.selected").classed('selected', false);
			Session.set("brush_start", start_hour);
			Session.set("brush_end", end_hour);
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
						focus.select("rect[data-hour='"+i+"']").classed('selected', false);
						d3.selectAll("#nodes g[data-hour='"+i+"']").classed('showing', false);
					};
				// };

				// Add range actions
				for (var i = add_min; i <= add_max; i++) {
					focus.select("rect[data-hour='"+i+"']").classed('selected', true);
					d3.selectAll("#nodes g[data-hour='"+i+"']").classed('showing', true);
				};

			};

			Session.set("brush_start", min_hour);
			Session.set("brush_end", max_hour);

			Session.set("old_min_hour", min_hour);
			Session.set("old_max_hour", max_hour);

		};
	 //   // Calculate and show total selected
	 //   makeSum();
    }



	
}