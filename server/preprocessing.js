// var require __meteor_bootstrap__.require
var sys = Npm.require('sys');
var exec=Npm.require("child_process").exec;

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
	},
	dev_exportDayCSVs: function  () {
		// Array to store all the dates
		days = [];
		// First and last day
		var first_day = new Date(2011, 3, 30);
		var last_day = new Date(2011, 4, 21);
		for (var d = first_day; d <= last_day; d.setDate(d.getDate() + 1)) {
		    days.push(new Date(d));
		}

		for (var i = 0; i < days.length; i++) {
			console.log(days[i]);
			exec("mongoexport -h localhost:3001 --db meteor --collection microblogs --csv --fields '_id,id,date_time,text,longitude,latitude' -q '{date_time:{$gte:new Date("+days[i].getTime()+"),$lt:new Date("+days[i+1].getTime()+")}}"+"' --out ~/meteor-thesis/lib/csvs/day-"+i+".csv", function(error, stdout, stderr) {
				console.log(stdout);
				console.log(stderr);
			});
		};

	},
	dev_clog: function(arg) {
		var find_result = Microblogs.findOne({_id: arg});
		console.log(find_result);
		console.log(Microblogs.findOne({}));
	}
});
