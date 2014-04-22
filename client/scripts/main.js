Template.map.rendered = function () {
	// Map Dimensions
	var map_width = 960;
	var map_height = 488.3;
	// Top left corner
	var latitude_1 = 42.3017,
	    longitude_1 = 93.5673;
	// Bottom right corner
	var latitude_2 = 42.1609,
	    longitude_2 = 93.1923;

	var center_coords = [(longitude_1+longitude_2)/2, (latitude_1+latitude_2)/2]

	console.log("center coords: "+center_coords);

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

	var x_scale = d3.scale.linear()
	    .domain([longitude_1, longitude_2])
	    .range([0, map_width]);

	var y_scale = d3.scale.linear()
	    .domain([latitude_1, latitude_2])
	    .range([0, map_height]);
}