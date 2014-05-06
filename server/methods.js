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
	get_hour: function  (hour_index) {
		// console.log(oneHourBlogs(hour_index).fetch());
		return oneHourBlogs(hour_index).fetch();
	},
	get_hour_binned_data: function() { 
		var binned_data = [];
		var binned_counts = [];
		for (var i = 0; i < 504; i++) {
			binned_data.push(oneHourBlogs(i).fetch());
		};		
		return binned_data;
	},
	search_microblogs: function(searchText) {
		return searchMicroblogs(searchText);
		// return "searchMicroblogs(searchText)";
	}
})