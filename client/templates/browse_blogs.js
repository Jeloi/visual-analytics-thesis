Template.browse_blogs.blogs = function() { 
	// Session.set("update_browse_blogs", false);
	d3.selectAll(".my_table tr.r").remove();
	return map_brush_data;
}

Template.browse_blogs.update = function() {
	return Session.get("update_browse_blogs");
}

Template.browse_blogs.prettyDate = function() { 
	return prettyDate(this.date_time);	
}