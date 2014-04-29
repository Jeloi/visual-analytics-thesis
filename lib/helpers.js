// Convert a date_time object to the hour from the starting date_time
dateToHour = function  (date_time) {
	var hours = Math.floor((date_time-start_date_time)/(3600*1000)); //convert difference to hours from milliseconds
	// console.log(date_time);
	// console.log(hours);
	return hours;
}

// Helper function to addhours in javascript http://stackoverflow.com/questions/1050720/adding-hours-to-javascript-date-object
Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}

// Convert from an hour_index to a date_time object
hourToDate = function  (hour_index) {
	var date = start_date_time.addHours(hour_index);
	console.log(date);
	return date;
}

// Accepts a start date and returns the date 1 day later
oneDayFrom = function  (start_date) {
	var start_copy = new Date(start_date.getTime());
	return new Date(start_copy.setDate(start_copy.getDate() + 1));
}

oneDayBlogs = function  (day_start, limit) {
	if (limit == null) {
	  // return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}}, {fields: {"text": 0, "id": 0}});
	  return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}},  {sort: {date_time: 1}});
	} else {
		return Microblogs.find({date_time: {$gte: day_start, $lt: oneDayFrom(day_start)}}, {fields: {"text": 0, "id": 0}, limit: limit, sort: {date_time: 1}});
	}
}

dayChange = function  () {
	var day_index = Session.get("day_index");
	if (Session.get("all_data_loaded")) {
	    Session.set("total_day_microblogs", all_data[day_index].length);
    	// Call brushing method
    	Template.map.brush();

	    // Show only the current day's g (contains all the pins)
	    var g = d3.selectAll('svg#map g');
	    g.classed("hidden", function(d) { 
	    	var id = $(this).attr('id');
	    	return !(id == "day-"+Session.get("day_index"));
	    })
	    //Plot the day's nodes
		Template.map.plot_nodes(all_data[day_index], day_index);

	    // Redraw the timeline
	    Template.timeline.draw(day_index);
	};
}

mongoId = function(d) { 
	return d._id._str;
}


gotHere = function() { 
	console.log("GOT HEREE!!!");
}

// Development helper to view the contents of a filter on a dimension using Crossfilter
print_filter = function (filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 