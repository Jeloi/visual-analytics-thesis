Template.loading.helpers({
	initialLoading: function () {
		return !Session.get("all_data_loaded");
	}
});