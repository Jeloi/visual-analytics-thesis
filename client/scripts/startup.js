Meteor.startup(function () {
	console.log("STARTUP FILE BEING CALLED");
	 var center_coords = [(longitude_1+longitude_2)/2, (latitude_1+latitude_2)/2];

	console.log("center coords: "+center_coords);

	// First and last day
	var first_day = new Date(2011, 3, 30);
	var last_day = new Date(2011, 4, 21);

	days = [];
	for (var d = first_day; d <= last_day; d.setDate(d.getDate() + 1)) {
	    days.push(new Date(d));
	}
	console.log("please?");
	console.log(days);

	// Set initial day
	Session.set("day_start", days[20]);
	var day_end = oneDayFrom(Session.get("day_start"));
	Session.set("day_end", day_end);
	// console.log(Session.get("day_start"));
	// console.log(Session.get("day_end"));
});