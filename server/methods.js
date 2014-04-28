Meteor.methods({
	get_day: function(day_start) {
		console.log("got here!");
		var results = oneDayBlogs(day_start).fetch();
		// console.log(results);
		return results;
	},
	get_all: function () {
		return Microblogs.find().fetch();
	}
})