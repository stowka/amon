AlertHandler = {
	success: function(title, message) {
		var alert = '<div class="alert alert-success">'
			+ '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
			+ '<strong>' + title + '</strong> ' + message
			+ '</div>';

		$("#alert").html(alert);
		console.log("Success:" + title);
	},
	warning: function(title, message) {
		var alert = '<div class="alert alert-warning">'
			+ '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
			+ '<strong>' + title + '</strong> ' + message
			+ '</div>';

		$("#alert").html(alert);
		console.warn(title);
	},
	error: function(title, message) {
		var alert = '<div class="alert alert-danger">'
			+ '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
			+ '<strong>' + title + '</strong> ' + message
			+ '</div>';

		$("#alert").html(alert);
		console.error(title);
	},
	info: function(title, message) {
		var alert = '<div class="alert alert-info">'
			+ '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
			+ '<strong>' + title + '</strong> ' + message
			+ '</div>';

		$("#alert").html(alert);
		console.info(title);
	},

	loading: function(bundle) {
		var alert = '<div class="text-center"><img width="32px" src="img/gifs/loader.gif" class="loader-gif"></div>';
		$("#" + bundle + "-contents").html(alert);
		console.info("Loading...");
	}
}