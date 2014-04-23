Meteor.publish('microblogs', function (start_time, end_time) {
	// console.log(Microblogs.find().limit(20));
	console.log(start_time);
	console.log(end_time);
	return Microblogs.find({date_time: {$gte: start_time, $lt: end_time}}, {fields: {"text": 0}});
});
