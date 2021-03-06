Session.set("date_start", 0);
Session.set("date_end", num_hours);
Session.set("brush_start", Session.get("date_start"));
Session.set("brush_end", Session.get("date_end"));
Session.set("hours_loaded", 0);
Session.set("all_data_loaded", false);
Session.set("num_searches", 0);
Session.set("next_color", 0);
// Session.set("next_color", Math.floor(Math.random() * (9.9)));

// Weather variables
Session.set("show_weather", false);
Session.set("current_day", hourToDate(Session.get("brush_end")).setHours(0));

Session.set("map_brush_on", false);
Session.set("plot_overview", false);
Session.set("filter_view", false)


Deps.autorun(function () {
	if (Session.get("hours_loaded") == num_hours) {
		Session.set("all_data_loaded", true);
		console.log("loaded all "+num_hours);

		Template.focus_context.draw();
		$('#loading_screen').fadeOut('slow');
	};
});

Deps.autorun(function () {
	// Template.weather.object(Session.get("brush_end"));
	if (hourToDate(Session.get("brush_end")).setHours(0) != Session.get("current_day")) {
		Session.set("current_day", hourToDate(Session.get("brush_end")).setHours(0));
	};
});


Deps.autorun(function () {
	if (Session.get("filter_view") == true) {
		d3.selectAll("#nodes g[data-group='all_nodes']").classed("disabled", true);
	} else {
		d3.selectAll("#nodes g[data-group='all_nodes']").classed("disabled", false);
	}
});

Deps.autorun(function () {
	if (Session.get("map_brush_on") == false) {
		Template.map.remove_brush();
	}
});

// jQuery/Bootstrap startup
$('.btn').button();
