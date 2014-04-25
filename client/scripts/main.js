Deps.autorun(function () {
	console.log("AUTORUN BEING CALLED");
	if (Session.get("day_start") != null) {
		Meteor.subscribe("day_blogs", Session.get("day_start"), Session.get("day_end"), function () { console.log('done loading all microblogs for the selected day');
			Template.map.brush(); //add brushing after points have been plotted
		});	//updates when Session.get("day_start"), Session.get("day_end") changes

		// Session.set("current_day_blogs", oneDayBlogs(Session.get("day_start")));
		console.log("I think it was storying all the blogs in the session");
		
		Template.map.plot_nodes(); //updates because of the call to Microblogs collection, which is getting streamed in by the subscription
	};

// 	Meteor.subscribe("all", function() { 
// 		console.log("done subscribing");
// 	});



});


