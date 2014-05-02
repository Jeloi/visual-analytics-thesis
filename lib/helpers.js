prettyDate = function(d) { 
	var curr_day = d.getDay();
	var curr_date = d.getDate();
	var dayNames = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
	var monthNames = [ "January", "February", "March", "April", "May", "June",
	    "July", "August", "September", "October", "November", "December" ];
    var curr_month = d.getMonth(); //Months are zero based
    var curr_year = d.getFullYear();
    return (dayNames[curr_day]+" "+ monthNames[curr_month] + " " + curr_date +" "+d.getHours()+":00");
}

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
	var start_copy = new Date(start_date_time);
	var date = start_copy.addHours(hour_index);
	// console.log(date);
	return date;
}


oneHourFrom = function (date_time) {
	var start_copy = new Date(date_time.getTime());
	return start_copy.addHours(1);
}


// Find all blogs with a given hour_index
oneHourBlogs = function  (hour_index) {
	return Microblogs.find({hour_index: hour_index},  {sort: {date_time: 1}});
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

// Returns a document's mongoDb id in string form
mongoId = function(d) { 
	return d._id._str;
}

// Returns an array of integers that span the range [start, end]
rangeArray =  function(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
}


// Development helper to view the contents of a filter on a dimension using Crossfilter
print_filter = function (filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 