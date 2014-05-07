Template.loading.helpers({
	initialLoading: function () {
		return !Session.get("all_data_loaded");
	},
	percentage: function  () {
		return Math.floor((Session.get("hours_loaded")/num_hours)*100);
	}
});