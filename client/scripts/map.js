Template.map.microblogs = function () {
	console.log(Microblogs.find().count());
	return Microblogs.find().fetch();
}

Template.map.plot_nodes = function () {
    // console.log(data);

    // var d = data[50];
    // console.log(d.longitude+" "+d.latitude);
    // Map Scales
    var x_scale = d3.scale.linear()
        .domain([longitude_1, longitude_2])
        .range([0, map_width]);

    var y_scale = d3.scale.linear()
        .domain([latitude_1, latitude_2])
        .range([0, map_height]);

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

}