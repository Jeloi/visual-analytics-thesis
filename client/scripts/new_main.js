Session.set("hours_loaded", 0);

// Initial Load
// Populate hours_data with the datapoints binned by hour
for (var i = 0; i < num_hours; i++) {
	Meteor.call("get_hour", i, function  (error, result) {
		// console.log(result.length);
		var hour_index = Session.get("hours_loaded");
		hour_counts.push({hour_index: hour_index, count: result.length});
		hours_data.push({hour_index: hour_index, array: result});

		// Template.map.plot_pins(result, hour_index);

		console.log(Session.get("hours_loaded"));
		Session.set("hours_loaded", Session.get("hours_loaded")+1);

		// Update loading bar
		var percentage = Template.loading.percentage()+'%';
		d3.select('#loading_contents .progress-bar').style('width', percentage);
		d3.select('#loading_contents .percentage').text(percentage+" Loaded");
	});
};

Session.set("date_start", 0);
Session.set("date_end", num_hours);
Session.set("brush_start", Session.get("date_start"));
Session.set("brush_end", Session.get("date_end"));

Deps.autorun(function () {
	if (Session.get("hours_loaded") == num_hours) {
		Session.set("all_data_loaded", true);
		console.log("loaded all "+num_hours);

		Template.focus_context.draw();
		$('#loading_screen').fadeOut('slow');
	};
});
