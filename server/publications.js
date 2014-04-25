Meteor.publish('day_blogs', function (day_start, day_end) {

	console.log(day_start);
	console.log(day_end);
	return Microblogs.find({date_time: {$gte: day_start, $lt: day_end}}, {fields: {"text": 0, "id": 0}, limit:5000});
	// return oneDayBlogs(day_start, 5000);

	// return Microblogs.find();
});

Meteor.publish('all',  function  () {
	return Microblogs.find();
})
