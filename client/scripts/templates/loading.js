Template.loading.helpers({
	initialLoading: function () {
		return !Session.get("all_data_loaded");
	},
	percentage: function  () {
		return (Session.get("hours_loaded")/num_hours)*100;
	}
});