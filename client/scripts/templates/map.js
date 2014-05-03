// Map Scales
Template.map.x_scale = d3.scale.linear()
		.domain([longitude_1, longitude_2])
		.range([0, map_width]);


Template.map.y_scale = d3.scale.linear()
		.domain([latitude_1, latitude_2])
		.range([0, map_height]);

Template.map.plot_brushed = function(search_id) {
		console.log("inside plot_brushed");
		Session.set("plotting", true);

	    var svg = d3.select("svg#map");

	    var start = Session.get("brush_start"),
	    	end = Session.get("brush_end");

	    // Append a group to the relevant hour, for this subset (or full set) of data	
	    for (var i = start; i < end; i++) {
	    	// var g = svg.select("g[data-hour='"+i+"']").attr('class', 'brushed').append('g').attr('data-group', search_id);
	    	var g = svg.select('#nodes').append('g')
	    		.attr({
	    			'data-group': search_id,
	    			'data-hour': i,
	    			'class': 'hour_group'
	    		});

	    	// d3.select("g#focus rect[data-hour='"+i+"']").attr('class', 'bar loaded');

	    	g.selectAll(".pin").data(hours_data[i], mongoId).enter().append('circle')
		    	.attr("class", "pin")
		    	.attr("r", 2)
		    	.attr('cx', function(d) {
		    		return Template.map.x_scale(d.longitude);
		    	})
		    	.attr('cy', function(d){
		    		return Template.map.y_scale(d.latitude);
		    	});

	    };

}

Template.map.plot_nodes = function (data, day_index) {
	console.log("inside plot_nodes");

    var svg = d3.select("svg#map");

    // svg.selectAll(".pin").remove();

    // console.log(Session.get("day_index"));
    // d3.csv('csvs/day-'+Session.get("day_index")+'.csv', function(data) {
    // 	console.log(data[0]);
    // 	// Coerce the data into its proper form
    // 	data.forEach(function (d) {
    // 		// console.log(d);
    // 		d.date_time = d3.time.format.iso.parse(d.date_time);
    // 		d._id = d._id.replace(/ObjectID\(|\)/g, "");
    // 		// d.longitude = +d.longitude;
    // 		// d.latitude = +d.latitude;
    // 	});
    // 	console.log(data[0]);


    	day_data = all_data[Session.get("day_index")];
    	// Session.set("total_day_microblogs", day_data.length);

    	var g = svg.select('g#day-'+day_index);
    	// console.log(data.length);
    	var pins = g.selectAll(".pin").data(data, mongoId).enter().append("circle")
	    	.attr("class", "pin")
	    	.attr("r", 2)
	    	.attr('cx', function(d) {
	    		return Template.map.x_scale(d.longitude);
	    	})
	    	.attr('cy', function(d){
	    		return Template.map.y_scale(d.latitude);
	    	});

	    	g.classed("hidden", function() { 
	    		return !(day_index == Session.get("day_index"));
	    	})

   //  	if (day_index == Session.get("day_index")) {
	  //   	// Call brushing method
		 //    Template.map.brush();

		 //    // Append the brush rectangle to the end of the svg, so that it stays on top of all points
		 //    d3.selectAll('svg#map rect.background, svg#map rect.extent').each(function () {
		 //    	this.parentNode.appendChild(this);
		 //    })

			// // Call Timeline method
			// Template.timeline.draw(day_index);	    
   //  	};

    // });
}

Template.map.remove_nodes = function  () {
	console.log("in remove_nodes!");
	// Watch Session.get("day_start")
	var day_start = Session.get("day_start")
    var svg = d3.select("svg#map");
    var nodes = svg.selectAll(".pin").remove();
}

Template.map.brush = function () {
    var svg = d3.select("svg#map");

	var brush = d3.svg.brush()
	    .x(Template.map.x_scale)
	    .y(Template.map.y_scale);
	    // .on("brushstart", brushstart)
	    // .on("brush", brushmove)
	    // .on("brushend", brushend);
	svg.call(brush);
	console.log("called brush!");
}


Template.map.plot_pins = function (data, hour_index) {
	console.log("inside plot_nodes");

    var svg = d3.select("svg#map");

    	var g = svg.select('g#hour-'+hour_index).classed("hidden", function() { 
	    		return !(hour_index == Session.get("hour_index"));
    	});

    	// console.log(data.length);
    	var pins = g.selectAll(".pin").data(data, mongoId).enter().append("circle")
	    	.attr("class", "pin")
	    	.attr("r", 2)
	    	.attr('cx', function(d) {
	    		return Template.map.x_scale(d.longitude);
	    	})
	    	.attr('cy', function(d){
	    		return Template.map.y_scale(d.latitude);
	    	});

	    	g.classed("hidden", function() { 
	    		return !(hour_index == Session.get("hour_index"));
	    	})

   //  	if (day_index == Session.get("day_index")) {
	  //   	// Call brushing method
		 //    Template.map.brush();

		 //    // Append the brush rectangle to the end of the svg, so that it stays on top of all points
		 //    d3.selectAll('svg#map rect.background, svg#map rect.extent').each(function () {
		 //    	this.parentNode.appendChild(this);
		 //    })

			// // Call Timeline method
			// Template.timeline.draw(day_index);	    
   //  	};

    // });
}

Template.map.rendered = function () {

	// Append the svg
	var svg = d3.select("#map_container")
        .append("svg")
        .attr("id", "map")
        .attr("width", map_width)
        .attr("height", map_height);

    var nodes = svg.append('g').attr('id', 'nodes');

    // For all hours
    // for (var i = 0; i < num_hours; i++) {
    // 	nodes.append('g').attr('id', 'hour-'+i).attr('class', 'hour_group').attr('data-hour', i);;;
    // };


	// Map color
	$(".map_color").on('click', 'button', function(event) {
		event.preventDefault();
		$(".map_color button").removeClass('active');
		$(this).addClass('active');
		console.log($(this).data("color"));
		if ($(this).data("color") == "bw") {
			$("svg#map").css('background-image', "url(/images/Vastopolis_Map_BW.png)");		
		} else{
			$("svg#map").css('background-image', "url(/images/Vastopolis_Map.png)");	
		};
	});

	// Hospitals
	svg.append('g').attr('id', 'hospitals').selectAll(".hospitals")
		.data(hospital_coords)
		.enter().append("circle")
		.attr({
			"class": 'hospital hidden',
			r: '20',
			cx: function (d) {
				return Template.map.x_scale(d[1]);
			},
			cy: function (d) {
				return Template.map.y_scale(d[0]);
			},
			"fill": "none",
			"stroke-width": 2,
			"stroke-opacity": 0.8,
			"stroke": "#F5F590"
		});

	// Mouse coordinates
	var mouse_coords = [0, 0];
	d3.select("svg#map").on('mousemove', function(event) {
		mouse_coords = d3.mouse(this);
		// Use the scales, inverted to go in opposite direction. Round to 4 decimals
		var x = Template.map.x_scale.invert(mouse_coords[0]);
		var y = Template.map.y_scale.invert(mouse_coords[1]);
		$('div.mousecoords span.x').html(x.toFixed(4));
		$('div.mousecoords span.y').html(y.toFixed(4));
	});

}

Template.map.helpers({
	date_start: function () {
		console.log(Session.get("brush_start"));
		console.log(Session.get("brush_end"));
		return prettyDate(hourToDate(Session.get("brush_start")));
	}, 
	date_end: function() { 
		return prettyDate(hourToDate(Session.get("brush_end")));
	}
});

