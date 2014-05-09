// Map helpers
Template.map.helpers({
	date_start: function () {
		return prettyDate(hourToDate(Session.get("brush_start")));
	}, 
	date_end: function() { 
		return prettyDate(hourToDate(Session.get("brush_end")));
	}
});

// Map events
Template.map.events({
	'click circle.pin': function (p) {
		console.log($(p));
		console.log("got here!");
	},
	'click' : function(p) { 
		console.log(p);
		console.log("got here!");
	}
})


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
		    	// .attr('title', function (d) {
		    	// 	return prettyDate(d.date_time);
		    	// })
		    	// .attr('data-content', function(d) { return d.text; })
		    	.attr("r", 3)
		    	.attr('cx', function(d) {
		    		return Template.map.x_scale(d.longitude);
		    	})
		    	.attr('cy', function(d){
		    		return Template.map.y_scale(d.latitude);
		    	});

	    };

	    // Initialize bootstrap popovers
	    // $('.pin').click(function(this) {

	    // 	$(this).popover()
	    // });

}

Template.map.plot_searched = function(searchId) {
	console.log("inside plot_searched");
	Session.set("plotting", true);

	var svg = d3.select("svg#map");
	var searched_nodes = search_data[searchId];

    // Append a group to the relevant hour, for this subset (or full set) of data	
    for (var key in searched_nodes) {
		if (searched_nodes.hasOwnProperty(key)) {
	    	var g = svg.select('#nodes').append('g')
	    		.attr({
	    			'data-group': searchId,
	    			'data-hour': key,
	    			'class': 'hour_group showing '+search_colors[searchId]
	    		});

	    	// d3.select("g#focus rect[data-hour='"+i+"']").attr('class', 'bar loaded');

	    	g.selectAll(".pin").data(searched_nodes[key], mongoId).enter().append('circle')
		    	.attr("class", "pin")
		    	.attr('title', function (d) {
		    		return prettyDate(d.date_time);
		    	})
		    	.attr('data-content', function(d) { return d.text; })
		    	.attr("r", 3)
		    	.attr('cx', function(d) {
		    		return Template.map.x_scale(d.longitude);
		    	})
		    	.attr('cy', function(d){
		    		return Template.map.y_scale(d.latitude);
		    	});
	    }
    };
}


Template.map.gen_brush = function () {
	var svg = d3.select("svg#map")
	var g = svg.append('g').attr('id', 'map_brush');
	g.call(Template.map.brush);
	console.log("called brush!");
	Session.set("map_brush_on", true);

}

Template.map.remove_brush = function  () {
	map_brush_data.length = 0;
	Session.set("map_brush_on", false);
    var g = d3.select("svg#map #map_brush").remove();
    d3.select('#map_brush').classed("active", false);
    d3.selectAll("#nodes .pin").classed("selected", false);


}

Template.map.brush_move = function () {
	// Clear map_brush_data
	map_brush_data.length = 0;
	var extent = Template.map.brush.extent();
	// console.log("got here!");
	// console.log(extent[0][0] +" "+ extent[0][1]+" "+ extent[1][0]+" "+ extent[1][1]);
	var pins = d3.selectAll("#nodes .pin")

	pins.each(function(d) { d.scanned = d.selected = false; });
	search(Template.map.quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
	// pins.classed("scanned", function(d) { return d.scanned; });
	pins.classed("selected", function(d) { return d.selected; });

	// Find the nodes within the specified rectangle.
	function search(quadtree, x0, y0, x3, y3) {
	  quadtree.visit(function(node, x1, y1, x2, y2) {
	    var p = node.point;
	    if (p) {
	      // p.scanned = true;
	      if ((p.longitude >= x0) && (p.longitude < x3) && (p.latitude >= y0) && (p.latitude < y3)) {
	      	p.selected = true;
	      	map_brush_data.push(p);
	      } else {
	      	p.selected = false;
	      };
	    }
	    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
	  });
	}
}

Template.map.brush = d3.svg.brush()
	    .x(Template.map.x_scale)
	    .y(Template.map.y_scale)
	    .on("brush", Template.map.brush_move);
	    // .on("brushstart", brushstart)
	    // .on("brushend", brushend);

Template.map.quadtree;

Template.map.gen_quadtree = function() {
	quad_nodes = []
	// Find the nodes from the groups that are showing, and aggregate them
	d3.selectAll("g.hour_group.showing").each(function(index, el) {
		var group = $(this).data('group');
		var hour = $(this).data('hour');
		if (group == "all_nodes") {
			// console.log(hours_data[hour].length);
			quad_nodes = quad_nodes.concat(hours_data[hour]);
		} else {
			// console.log(search_data[group][hour]);
			quad_nodes = quad_nodes.concat(search_data[group][hour]);
		}
	});
	// console.log("total: "+quad_nodes.length);
	// console.log(quad_nodes);

	var factory = d3.geom.quadtree();
	factory.y(function(d) { return d.latitude });
	factory.x(function(d) { return d.longitude });

	// Buld the quad tree
	Template.map.quadtree = factory(quad_nodes);
}



Template.map.rendered = function () {

	// Append the svg
	var svg = d3.select("#map_container")
        .append("svg")
        .attr("id", "map")
        .attr("width", map_width)
        .attr("height", map_height);

    var nodes = svg.append('g').attr('id', 'nodes');



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


