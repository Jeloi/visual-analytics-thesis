Session.set("hours_loaded", 0);

// Populate hours_data with the datapoints binned by hour
for (var i = 0; i < num_hours; i++) {
	Meteor.call("get_hour", i, function  (error, result) {
		console.log(result.length);
		hour_counts.push(result.length);
		hours_data.push(result);

		// Template.dateline.add_daychart(result[0], result[1]);
		// Plot nodes and generate daychart
		// Template.map.plot_nodes(result[0], result[1]);
		console.log(Session.get("hours_loaded"));
		Session.set("hours_loaded", Session.get("hours_loaded")+1);
	});
};

Deps.autorun(function () {
	if (Session.get("hours_loaded") == num_hours) {
		Session.set("all_data_loaded", true);
		console.log("loaded all "+num_hours);

		$('#loading_screen').fadeOut('slow');
	};
});
