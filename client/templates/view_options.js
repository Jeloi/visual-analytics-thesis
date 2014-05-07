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
	'click button#explore_section': function (p) {
		if (Session.get("explore_section") == false) {
			Template.focus_context.explore_section(Session.get("brush_start"), Session.get("brush_end"));
			console.log("clicked");
		};
	},
	'submit form#search': function( event ){   // also tried just 'submit', both work for me!
	   event.preventDefault();
	   event.stopPropagation();
	   $('#search input').val('');
	   return false; 
	 }
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
				result_ids = result[1];

			var search_results = {};

			// Handle result_ids by filtering hours_data and creating the binned arrays of data for the search
			for (var key in result_ids) {
				if (result_ids.hasOwnProperty(key) && (key < num_hours)) {
					search_results[key] = hours_data[key].filter(function(data) {
						return (result_ids[key].indexOf(data._id) > -1);
					});
				}
			}
			// Put the search results in the global variable, with search_id as key
			search_data[search_id] = search_results;

			// Handle counts by pushing them t the global variable search_counts
			search_counts[search_id] = counts;

			search_colors[search_id] = getColor();


			// Plot searched data
			Template.map.plot_searched(search_id);

			Session.set("num_searches", Session.get("num_searches")+1);
		}

	});
}

// Removing a search
Template.view_options.remove_search = function(searchId) {
	if (search_data.hasOwnProperty(searchId)) {
		// Remove rendered DOM elements

		// Delete data
		delete search_data[searchId];
		delete search_counts[searchId];
		delete search_colors[searchId];

		Session.set("num_searches", Session.get("num_searches")-1);
		return true;
	} else {
		return false;
	}
}
