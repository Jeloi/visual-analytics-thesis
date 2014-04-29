Meteor.methods({
	// Returns a pair, with the first item being the array of microblogs for the day, and the second item being the day_index
	get_day: function(day_start, day_index) {
		var results = oneDayBlogs(day_start).fetch();
		// console.log(results);
		return [results, day_index];
	},
	get_all: function () {
		return Microblogs.find().fetch();
	},
	get_hour: function  (time_start) {
		console.log(oneHourBlogs(time_start).fetch());
		return oneHourBlogs(time_start).fetch();
	},
	get_hour_binned_data: function() { 
		var start_time = new Date(2011, 3, 30);
		var end_time = new Date(2011, 4, 21);
		var hours = (end_time-start_time)/(3600*1000); //convert difference to hours from milliseconds
		console.log(hours);
	}
})