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
	}
});

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