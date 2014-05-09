// View Options Helpers
Template.view_options.helpers({
	selected_count: function  () {
		if (Session.get("all_data_loaded")) {
			var date_end = (Session.get("date_end")-1);
			var start = Session.get("brush_start");
			var end = (Session.get("brush_end") != Session.get("date_end") ? Session.get("brush_end") : date_end);
			var sum = 0;
			for (var i = start; i <= end; i++) {
				sum += hours_data[i].length;
			}
			return sum;
		}
	}
});

// View Options Events
Template.view_options.events({
	'change input[type=checkbox]': function (p) {
		var option = p.target.value;
		if (option == "microblogs") {
			if (p.target.checked) {
				d3.select('svg#map g#day-'+Session.get('day_index')).classed('hidden', false);
			} else{
				d3.select('svg#map g#day-'+Session.get('day_index')).classed('hidden', true);
			}
		}
		else if (option == 'hospitals') {
			if (p.target.checked) {
				d3.selectAll('#map .hospital').each(function(index, el) {
					this.parentNode.appendChild(this);
				});
				d3.selectAll('#map .hospital').classed({'hidden': false});
			} else{
				d3.selectAll('#map .hospital').classed({'hidden': true});
			}
		}
	},
	'click input.weather': function(p) {
		if (p.target.checked) {
			Session.set("show_weather", true);
		} else{
			Session.set("show_weather", false);
		}
	},
	'click button#explore_section': function (p) {
		if (Session.get("plot_overview") == false) {
			Template.focus_context.explore_section(Session.get("brush_start"), Session.get("brush_end"));
			console.log("clicked");
		};
	},
	'click button#map_brush': function (p) {
		Session.set("map_brush_on", true);
		Template.map.gen_quadtree();
		Template.map.gen_brush();
	},
	'submit form#search': function( event ){   // also tried just 'submit', both work for me!
	   event.preventDefault();
	   event.stopPropagation();
	   $("a[href='#filter_tab']").click();
	   var searchText = $('#search input').val();
	   if (searchText != "") {
		   Template.view_options.search(searchText);
		   $('#search input').val('');
	   };
	   return false; 
	 },
	 // Show/Hide a search_unit
	 "click .search_unit .clickable": function (event) {
	 	// var p = $(event.target).parent('.search_unit');
	 	var p = $(event.target).parents('.search_unit');
	 	var search_id = p.data('search-id');

	 	// console.log($(event.target).parents('.search_unit'));
	 	if (p.hasClass('inactive')) {
	 		p.removeClass('inactive');
	 		d3.selectAll("#map #nodes g[data-group='"+search_id+"']").classed('disabled', false);
	 		delete disabled_searches[search_id];
			Session.set("num_searches", Session.get("num_searches")+1);
			Template.streamgraph.draw()

	 	} else {
	 		p.addClass('inactive')
	 		d3.selectAll("#map #nodes g[data-group='"+search_id+"']").classed('disabled', true);
	 		disabled_searches[search_id] = 1;
			Session.set("num_searches", Session.get("num_searches")-1);
			Template.streamgraph.draw()
	 	}
	 },
	 // Remove a search
	 "click .search_unit .glyphicon-remove": function (event) {
	 	var p = $(event.target).parents('.search_unit');
	 	var search_id = p.data('search-id');
	 	Template.view_options.remove_search(search_id);
	 	p.remove();
	 },
	 // Filter view?
	 "click a[href='#overview_tab']": function() { 
	 	Session.set("filter_view", false);
	  },
	  "click a[href='#filter_tab']": function() { 
	 	Session.set("filter_view", true);
	  },
});

// Search functionality
Template.view_options.search = function(searchText) {
	Meteor.apply('search_microblogs', [searchText], function (error, result) {
		if (error) {
			console.log(error);
		} else {
			// console.log(result);
			// The search id, set to current time to be unique
			var search_id = new Date().getTime();
			var counts = result[0],
				result_ids = result[1],
				result_count = result[2];

			var search_results = {};

			// Handle result_ids by filtering hours_data and creating the binned arrays of data for the search
			for (var key in result_ids) {
				if (result_ids.hasOwnProperty(key) && (key < num_hours)) {
					search_results[key] = hours_data[key].filter(function(data) {
						return (result_ids[key].indexOf(data._id) > -1);
					});
				}
			}
			search_colors[search_id] = getColor();

			// Put the search results in the global variable, with search_id as key
			search_data[search_id] = search_results;

			// Handle counts by pushing them t the global variable search_counts
			search_counts[search_id] = {search_id: search_id, counts: counts, color: search_colors[search_id]}

			var render_data = {search_text: searchText, color: search_colors[search_id], count: result_count, search_id: search_id};
			var search_unit = UI.renderWithData(Template.search_unit, {search_unit: render_data});
			UI.insert(search_unit, $('#results_container')[0]);

			// Plot searched data
			Template.map.plot_searched(search_id);

			Session.set("num_searches", Session.get("num_searches")+1);

			// Update the stream
			Template.streamgraph.draw()

		}

	});
}

// Removing a search
Template.view_options.remove_search = function(searchId) {
	if (search_data.hasOwnProperty(searchId)) {
		console.log("removing: "+searchId);
		// Remove rendered DOM elements
		d3.selectAll("#map #nodes g[data-group='"+searchId+"']").remove();

		// Delete data
		delete search_data[searchId];
		delete search_counts[searchId];
		delete search_colors[searchId];

		Session.set("num_searches", Session.get("num_searches")-1);
		Template.streamgraph.draw()
		return true;
	} else {
		return false;
	}
}
