Meteor.startup(function () {
});
	// Initial Load
	// Populate hours_data with the datapoints binned by hour
	for (var i = 0; i < num_hours; i++) {
		Meteor.call("get_hour", i, function  (error, result) {
			// console.log(result.length);
			var hour_index = Session.get("hours_loaded");
			hour_counts.push({hour_index: hour_index, count: result.length});
			// hours_data.push({hour_index: hour_index, array: result});
			hours_data[hour_index] = result;

			// Template.map.plot_pins(result, hour_index);

			console.log(Session.get("hours_loaded"));
			Session.set("hours_loaded", Session.get("hours_loaded")+1);

			// Update loading bar
			var percentage = Template.loading.percentage()+'%';
			d3.select('#loading_contents .progress-bar').style('width', percentage);
			d3.select('#loading_contents .percentage').text(percentage+" Loaded");
		});
	};
