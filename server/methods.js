Meteor.methods({
	// Returns a pair, with the first item being the array of microblogs for the day, and the second item being the day_index
	get_day: function(day_start, day_index) {
		var results = oneDayBlogs(day_start).fetch();
		// console.log(results);
		return [results, day_index];
	},
	get_all: function () {
		return Microblogs.find().fetch();
	}
})