// Map Scales
Template.map.x_scale = d3.scale.linear()
		.domain([longitude_1, longitude_2])
		.range([0, map_width]);


Template.map.y_scale = d3.scale.linear()
		.domain([latitude_1, latitude_2])
		.range([0, map_height]);

Template.map.plot_nodes = function () {
	// console.log("inside plot_nodes");
	console.log(oneDayBlogs(Session.get("day_start")).count());

    var data = oneDayBlogs(Session.get("day_start")).fetch();
    var svg = d3.select("svg#map");

    // console.log("day_start: "+Session.get("day_start"));
    // console.log("day_change_tracker: "+Session.get("day_change_tracker"));

    // Remove all pins initially and if the day changes
    if (Session.get("day_change_tracker") == null || (Session.get("day_start").valueOf() != Session.get("day_change_tracker").valueOf())) {
    	console.log("day changed!");
    	Session.set("day_change_tracker", Session.get("day_start"));
    	// Template.map.remove_nodes();
    	svg.selectAll(".pin").remove();
    };

    var nodes = svg.selectAll(".pin").data(data)

    nodes.enter().append("circle")
    .attr("class", "pin")
    .attr("r", 2)
    .attr('cx', function(d) {
    	return Template.map.x_scale(d.longitude);
    })
    .attr('cy', function(d){
    	return Template.map.y_scale(d.latitude);
    });

    // Append the brush rectangle to the end of the svg, so that it stays on top of all points
    d3.selectAll('svg#map > rect.background, svg#map > rect.extent').each(function () {
    	this.parentNode.appendChild(this);
    })
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

Template.map.rendered = function () {

	// Append the svg
	var svg = d3.select("#map_container")
        .append("svg")
        .attr("id", "map")
        .attr("width", map_width)
        .attr("height", map_height);

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

	svg.selectAll(".hospitals")
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
			"stroke-width": 4,
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

