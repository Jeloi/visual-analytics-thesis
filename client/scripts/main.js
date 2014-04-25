Deps.autorun(function () {
	Meteor.subscribe("day_blogs", Session.get("day_start"), Session.get("day_end"), function () {
		console.log('done loading all microblogs for the selected day');
		Template.map.brush();
	});	//updates when Session.get("day_start"), Session.get("day_end") changes
// 	Meteor.subscribe("all", function() { 
// 		console.log("done subscribing");
// 	});

});

Deps.autorun(function() { 
	Template.map.plot_nodes(); //updates because of the call to Microblogs collection, which is getting streamed in by the subscription
});


