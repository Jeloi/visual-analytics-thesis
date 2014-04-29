Template.browse_blogs.blogs = function() { 
	var blogs = d3.selectAll("svg#map g#day-"+Session.get("day_index")+" .pin").filter(":not(.hidden)").data();
	console.log(blogs.length);
	return blogs;
}