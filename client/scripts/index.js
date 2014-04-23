Meteor.startup(function () {
	// Map Dimensions (global variables)
	map_width = 1200;
	map_height = 610.375;

	// Top left corner
	latitude_1 = 42.3017,
	    longitude_1 = 93.5673;
	// Bottom right corner
	latitude_2 = 42.1609,
	longitude_2 = 93.1923;

	center_coords = [(longitude_1+longitude_2)/2, (latitude_1+latitude_2)/2];

	console.log("center coords: "+center_coords);


	x_scale = d3.scale.linear()
		.domain([longitude_1, longitude_2])
		.range([0, map_width]);

	y_scale = d3.scale.linear()
		.domain([latitude_1, latitude_2])
		.range([0, map_height]);

	// First and last day
	var first_day = new Date(2011, 3, 30);
	var last_day = new Date(2011, 4, 21);

	days = [];
	for (var d = first_day; d <= last_day; d.setDate(d.getDate() + 1)) {
	    days.push(new Date(d));
	}

	console.log(days);

	// Set initial day
	Session.set("day_start", days[0]);
});


Deps.autorun(function () {
	// Template.map.plot_nodes();
	console.log("subscribing to microblogs");
	Meteor.subscribe("day_blogs", Session.get("day_start"), function () {
		Template.map.plot_nodes();
		console.log('done loading microblogs');
	});


});


