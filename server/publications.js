Meteor.publish('day_blogs', function (day_start) {

	console.log(day_start);
	return oneDayBlogs(day_start, 100000);

	// return Microblogs.find();
});

Meteor.publish('all',  function  () {
	return Microblogs.find();
})
