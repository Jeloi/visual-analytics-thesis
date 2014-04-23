// Development methods to call on the server to clean up data in the database
Meteor.methods({
	dev_convertDates: function () {
		var cursor = Microblogs.find();
		cursor.forEach(function (doc) {
			var date = Date.parse(doc.created_at);
			Microblogs.update({_id : doc._id}, {$set: {date_time: new Date(date)}});
			Microblogs.update({_id : doc._id}, {$unset: {created_at: ""}});
		});
		console.log("finished!");
	},
	dev_renameDateField: function () {
		Microblogs.update({}, {$rename: {'date_time': 'created_at' }});
	},
	dev_removeBadDates: function () {
		var date = new Date(2010,1,1);
		var writeResult = Microblogs.remove({date_time: {$lt: date}});
		console.log(writeResult);
	}
});
