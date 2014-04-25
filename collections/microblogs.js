Microblogs = new Meteor.Collection('microblogs');



// microblogsPerHour = function() {
//   return Microblogs.find
// }
// processedItems = function() {
//   return Items.find({processed: true});
// }


// microblogsPerHour = function() {
// 	return Microblogs.group(
// 	{
// 		keyf: function(doc) {
// 			return { hour_of_day: doc.created_at.getHours() };
// 		},
// 		cond: { created_at: { $gt: Session.get("day_start"), $lt: Session.get("day_end")} },
// 		reduce: function ( curr, result ) { 
// 			result.total += 1;
// 		},
// 		initial: { total: 0}
// 	} )
// }

aFunction = function  () {
	console.log("call me maybe!");
}


// db.microblogs.aggregate(
//     { $group : {
//         _id : "$author",
//         docsPerAuthor : { $sum : 1 },
//         viewsPerAuthor : { $sum : "$pageViews" }
//     }}
// );