var start = new Date(2011, 4, 1);
var end = new Date(2011, 4, 2);
Session.set("start_time", start);
Session.set("end_time", end);


// Map Dimensions (global variables)
map_width = 960;
map_height = 488.3;
// Top left corner
latitude_1 = 42.3017,
    longitude_1 = 93.5673;
// Bottom right corner
latitude_2 = 42.1609,
    longitude_2 = 93.1923;

center_coords = [(longitude_1+longitude_2)/2, (latitude_1+latitude_2)/2]

console.log("center coords: "+center_coords);

// Map Scales
var x_scale = d3.scale.linear()
    .domain([longitude_1, longitude_2])
    .range([0, map_width]);

var y_scale = d3.scale.linear()
    .domain([latitude_1, latitude_2])
    .range([0, map_height]);


Meteor.startup(function () {
});


Deps.autorun(function () {
	Meteor.subscribe("microblogs", Session.get("start_time"), Session.get("end_time"), function () {
		Template.map.plot_nodes();
		console.log('please');
	});


});


