Session.set("hours_loaded", 0);

// Populate hours_data with the datapoints binned by hour
for (var i = 0; i < num_hours; i++) {
	Meteor.call("get_hour", i, function  (error, result) {
		console.log(result.length);
		var hour_index = Session.get("hours_loaded");
		hour_counts.push({hour_index: hour_index, count: result.length});
		hours_data.push({hour_index: hour_index, array: result});

		console.log(Session.get("hours_loaded"));
		Session.set("hours_loaded", Session.get("hours_loaded")+1);
	});
};

Deps.autorun(function () {
	if (Session.get("hours_loaded") == num_hours) {
		Session.set("all_data_loaded", true);
		console.log("loaded all "+num_hours);

		Template.context_timeline.update();
		$('#loading_screen').fadeOut('slow');
	};
});
