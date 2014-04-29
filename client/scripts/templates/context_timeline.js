Template.context_timeline.update = function() { 
	var margin = {top: 10, right: 10, bottom: 100, left: 40},
	    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
	    width = map_width - margin.left - margin.right,
	    height =  500 - margin.top - margin.bottom, // height of focus
	    height2 = 500 - margin2.top - margin2.bottom; // height of context

	var x = d3.time.scale().range([0, width]),
	    x2 = d3.time.scale().range([0, width]),
	    y = d3.scale.linear().range([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");


}