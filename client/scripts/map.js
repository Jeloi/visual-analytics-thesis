Template.map.microblogs = function () {
	console.log(Microblogs.find().count());
	return Microblogs.find().fetch();
}

// Map Scales
Template.map.x_scale = d3.scale.linear()
		.domain([longitude_1, longitude_2])
		.range([0, map_width]);


Template.map.y_scale = d3.scale.linear()
		.domain([latitude_1, latitude_2])
		.range([0, map_height]);


Template.map.plot_nodes = function () {
    var data = Microblogs.find().fetch();
	console.log(Microblogs.find().count());
    var svg = d3.select("#map svg");

    svg.selectAll(".pin")
    .data(data)
    .enter().append("circle")
    .attr("class", "pin")
    .attr("r", 2)
    .attr('cx', function(d) {
    	return Template.map.x_scale(d.longitude);
    })
    .attr('cy', function(d){
    	return Template.map.y_scale(d.latitude);
    });

    var brush = d3.svg.brush()
        .x(Template.map.x_scale)
        .y(Template.map.y_scale);
        // .on("brushstart", brushstart)
        // .on("brush", brushmove)
        // .on("brushend", brushend);
    svg.call(brush);
}

Template.map.rendered = function () {

	// Append the svg
	var svg = d3.select("#map")
        .append("svg")
        .attr("width", map_width)
        .attr("height", map_height);

	// Map color
	$(".map_color").on('click', 'button', function(event) {
		event.preventDefault();
		$(".map_color button").removeClass('active');
		$(this).addClass('active');
		console.log($(this).data("color"));
		if ($(this).data("color") == "bw") {
			$("#map > svg").css('background-image', "url(/images/Vastopolis_Map_BW.png)");		
		} else{
			$("#map > svg").css('background-image', "url(/images/Vastopolis_Map.png)");	
		};
	});

	// Hospitals
	var hospital_coords = [[42.1656,93.3432],[42.1718,93.3911],[42.2023,93.4448],[42.2011,93.4954],[42.2020,93.5570],[42.2539,93.4789],[42.2969,93.5317],[42.2503,93.4192],[42.2832,93.3645],[42.2916,93.2342],[42.2170,93.2479],[42.2378,93.3307],[42.2131,93.3611]];

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
	d3.select("#map svg").on('mousemove', function(event) {
		mouse_coords = d3.mouse(this);
		// Use the scales, inverted to go in opposite direction. Round to 4 decimals
		var x = Template.map.x_scale.invert(mouse_coords[0]);
		var y = Template.map.y_scale.invert(mouse_coords[1]);
		$('div.mousecoords span.x').html(x.toFixed(4));
		$('div.mousecoords span.y').html(y.toFixed(4));
	});
}

