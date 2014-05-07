// Actual text search function
_searchMicroblogs = function (searchText) {
    var Future = Npm.require('fibers/future');
    var future = new Future();
    MongoInternals.defaultRemoteCollectionDriver().mongo.db.executeDbCommand({
        text: 'microblogs',
        search: searchText,
        limit: 1000000,
        project: {
          hour_index: 1,
          id: 1 // Only take the ids
        }
     }
     , function(error, results) {
        if (results && results.documents[0].ok === 1) {
            future['return'](results.documents[0].results);
        }
        else {
            future['return']('');
        }
    });
    return future.wait();
};
 
// Helper that extracts the ids from the search results. Returns an array w/ first element containing search counts and second element containing binned id's of search hits
searchMicroblogs = function (searchText) {
    if (searchText && searchText !== '') {
        var searchResults = _searchMicroblogs(searchText);
        console.log(searchResults.length);
        var search_counts = [];
        var search_results = {};

        // Initialize counts of bins to 0
        for (var i = 0; i < num_hours; i++) {
            search_counts[i] = {hour_index: i, count: 0};
        };

        console.log(num_hours);

        // Bin the search results by hour_index
        for (var i = 0; i < searchResults.length; i++) {
            var hour_index = searchResults[i].obj.hour_index;

            if (hour_index < num_hours) {
                search_counts[hour_index].count = (search_counts[hour_index].count+1);
            };

            if (!(hour_index in search_results)) {
                search_results[hour_index] = [searchResults[i].obj._id];
            } else {
                search_results[hour_index].push(searchResults[i].obj._id);
            };
        }
        console.log("inside searchMicroblogs");

        // Initialize bins for hours that will each hold an array of id's
        console.log(search_counts.length);
        return [search_counts, search_results, searchResults.length];
    }
};