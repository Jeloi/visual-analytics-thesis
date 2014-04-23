Template.map.microblogs = function () {
	console.log(Microblogs.find().count());
	return Microblogs.find().fetch();
}

Template.map.plot_nodes = function () {
    // console.log(data);

    // var d = data[50];
    // console.log(d.longitude+" "+d.latitude);
    // Map Scales


    var data = Microblogs.find().fetch();
	console.log(Microblogs.find().count());
    var map_bg = d3.select("#map svg")

    map_bg.selectAll(".pin")
    .data(data)
    .enter().append("circle")
    .attr("class", "pin")
    .attr("r", 2)
    .attr('cx', function(d) {
    	return x_scale(d.longitude);
    })
    .attr('cy', function(d){
    	return y_scale(d.latitude);
    });
}

Template.map.rendered = function () {

	var map_bg = d3.select("#map")
	        .append("svg")
	        .attr("width", map_width)
	        .attr("height", map_height);

	map_bg.append("svg:image")
	    .attr("xlink:href", "images/Vastopolis_Map.png")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("x", 0)
	    .attr("y",0);

	// Mouse coordinates
	var mouse_coords = [0, 0];
	d3.select("#map svg").on('mousemove', function(event) {
		mouse_coords = d3.mouse(this);
		// Use the scales, inverted to go in opposite direction. Round to 4 decimals
		var x = x_scale.invert(mouse_coords[0]);
		var y = y_scale.invert(mouse_coords[1]);
		$('div.mousecoords span.x').html(x.toFixed(4));
		$('div.mousecoords span.y').html(y.toFixed(4));
	});
}

