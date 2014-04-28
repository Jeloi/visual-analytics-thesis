// Accepts a start date and returns the date 1 day later
oneDayFrom = function  (start_date) {
	var start_copy = new Date(start_date.getTime());
	return new Date(start_copy.setDate(start_copy.getDate() + 1));
}

oneDayBlogs = function  (day_start, limit) {
	if (limit == null) {
	  // return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}}, {fields: {"text": 0, "id": 0}});
	  return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}});
	} else {
		return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}}, {fields: {"text": 0, "id": 0}, limit: limit});
	}
}

dayChange = function  () {
	Template.map.remove_nodes();
	
}

// Development helper to view the contents of a filter on a dimension using Crossfilter
print_filter = function (filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 