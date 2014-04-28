// console.log("STARTUP FILE BEING CALLED");

// Array to store all the dates
days = [];
// First and last day
var first_day = new Date(2011, 3, 30);
var last_day = new Date(2011, 4, 21);
for (var d = first_day; d <= last_day; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
}


// Set initial day_start and day_end
Session.set("day_index", 0);
Session.set("day_start", days[0]);


// var microblogs_subscription = Meteor.subscribe("day_blogs", Session.get("day_start"), function () { 
// 	Template.map.plot_nodes(); //updates because of the call to Microblogs collection, which is getting streamed in by the subscription
// 	Template.map.brush(); //add brushing after points have been plotted
// 	Template.timeline.draw(); //draw the timeline
// });	//updates when Session.get("day_start"), Session.get("day_end") changes

Deps.autorun(function () {
	// if (Session.get("day_start") != null) {
	// 	microblogs_subscription.stop();
	// Meteor.subscribe("day_blogs", Session.get("day_start"), function () { 
	// 		// Template.map.plot_nodes(); //updates because of the call to Microblogs collection, which is getting streamed in by the subscription
	// 		// Template.map.brush(); //add brushing after points have been plotted
	// 		Template.timeline.draw(); //draw the timeline
	// });	//updates when Session.get("day_start")

});


// Separate Deps.autorun so that dayChange isn't called as subscription is streamed in.
Deps.autorun(function  () {
	Template.map.plot_nodes();
	// Template.timeline.draw();
	// dayChange(); // the reactive source in the call to Template.map.remove_nodes() (Session.get("day_start")) makes this get called
})


