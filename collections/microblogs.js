Microblogs = new Meteor.Collection('microblogs');

// db.microblogs.aggregate(
//     { $group : {
//         _id : "$author",
//         docsPerAuthor : { $sum : 1 },
//         viewsPerAuthor : { $sum : "$pageViews" }
//     }}
// );