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
 
// Helper that extracts the ids from the search results
searchMicroblogs = function (searchText) {
    if (searchText && searchText !== '') {
        var searchResults = _searchMicroblogs(searchText);
        console.log(searchResults.length);
        var ids = [];
        for (var i = 0; i < searchResults.length; i++) {
            ids.push(searchResults[i].obj._id);
        }
        console.log("inside searchMicroblogs");
        return ids;
    }
};