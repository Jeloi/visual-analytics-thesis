Template.view_options.events({
	'change input[type=checkbox]': function (p) {
		var option = p.target.value;
		if (option == "microblogs") {
			if (p.target.checked) {
				d3.selectAll('#map .pin').classed({'hidden': false});
			} else{
				d3.selectAll('#map .pin').classed({'hidden': true});
			};
		};
	}
});