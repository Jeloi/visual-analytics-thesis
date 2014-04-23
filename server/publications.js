Meteor.publish('day_blogs', function (day_start) {
	var start_copy = new Date(day_start.getTime());
	var day_end = new Date(start_copy.setDate(day_start.getDate() + 1));
	console.log(day_start);
	console.log(day_end);
	return Microblogs.find({date_time: {$gte: day_start, $lt: day_end}}, {fields: {"text": 0, "id": 0}, limit:5000});

	// return Microblogs.find();
});
