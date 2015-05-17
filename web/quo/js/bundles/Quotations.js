/**
 *
 *
 */

Quotations = {
	all: [],
	init: function(callback) {
		this.readAll(function(data) {
			this.all = data.quotation;

			$("#quotations-contents").html("");

			for(var index in this.all) {
				$("#quotations-contents").append(formatQuotationInList(this.all[index]));
			}

			if (callback)
				callback(null);
		});
	},

	display: function(id) {
		this.read(id, function(data) {
			$("#quotations-contents").html("");
			$("#quotations-contents").append(formatQuotation(data));
		})
	},

	pdf: function(id) {
		this.read(id, function() {
			$("#quotations-contents").css("height", "360px");
			new PDFObject({
				url: "http://127.0.0.1:8989/quotation/pdf/" + id
			}).embed("quotations-contents");
			AlertHandler.success("quotations/pdf/" + id, "");
		})
	},

	readAll: function(callback) {
		AlertHandler.loading("quotations");
		$.get("http://127.0.0.1:8989/quotation/read/all", function(data) {
			AlertHandler.success("quotations/read/all", "");
			if (callback)
				callback(data);
		}, "json");
	},

	read: function(id, callback) {
		AlertHandler.loading("quotations");
		$.get("http://127.0.0.1:8989/quotation/read/" + id, function(data) {
			AlertHandler.success("quotations/read/" + id, "");
			if (callback)
				callback(data);
		}, "json");
	},

	create: function(quotation, callback) {
		AlertHandler.loading("quotations");
		AlertHandler.success("quotations/create", "");
	},

	update: function(quotation, callback) {
		AlertHandler.loading("quotations");
		AlertHandler.success("quotations/update/" + quotation.id, "");
	},

	delete: function(id, callback) {
		AlertHandler.loading("quotations");
		AlertHandler.error("quotations/delete/" + id, "");
	}
}

function formatQuotationInList(quotation) {
	return '<div class="quotation">'
		+ '<h3>' + quotation.summary + '</h3>'
		+ '<p>' + quotation.date_of_creation + '</p>'
		+ '<h6>'
		+ '[<a href="#" class="quotation-see" onclick="javascript:Quotations.display(' + quotation.id + ')">See</a> • '
		+ '<a href="#" class="quotation-edit" onclick="javascript:Quotations.edit(' + quotation.id + ')">Edit</a> • '
		+ '<a href="#" class="quotation-generate-pdf" onclick="javascript:Quotations.pdf(' + quotation.id + ')">PDF</a> • '
		+ '<a href="#" class="text-danger quotation-delete" onclick="javascript:Quotations.delete(' + quotation.id + ')">Delete</a>]'
		+ '</h6>'
		+ '</div>';
}

function formatQuotation(data) {
	var html = '<div class="quotation">'
		+ '<h3>' + data.quotation.summary + '</h3>'
		+ '<p>' + data.quotation.date_of_creation + ' &rarr; '
		+ data.quotation.date_of_validity + '</p>';

	html += '<ul class="text-left">';
	html += '<li>Language: <em>' + data.quotation.language + '</em></li>';
	html += '<li>Currency: <em>' + data.quotation.currency + ' (' + data.quotation.currency_symbol + ')</em></li>';
	html += '<li>Payment method: <em>' + data.quotation.payment_method + '</em></li>';
	html += '<li>Vendor: <em>' + data.vendor.first_name + ' ' + data.vendor.last_name + '</em></li>';
	html += '<li>Client: <em>' + data.customer.first_name + ' ' + data.customer.last_name + '</em></li>';
	html += '</ul>';
	
	html += '<table class="table table-hover">';
	// html += '<thead>';
	// html += '<tr>';
	// html += '<th class="text-left">#</th>';
	// html += '<th class="text-left">Designation</th>';
	// html += '<th class="text-left">Discount</th>';
	// html += '<th class="text-left">Quantity</th>';
	// html += '<th class="text-left">Price</th>';
	// html += '<th class="text-left">Total</th>';
	// html += '</tr>';
	// html += '</thead>';
	html += '<tbody>';
	for (index in data.details) {
		html += '<tr>';
		for (jndex in data.details[index]) {
			html += '<td class="text-left">';
			html += data.details[index][jndex];
			html += '<td>';
		}
		html += '<tr>';
	}
	html += '</tbody>';
	html += '</table>';

	html += '<h6>';
	html += '[<a href="#" class="quotation-edit" onclick="javascript:Quotations.edit(' + data.quotation.id + ')">Edit</a> • ';
	html += '<a href="#" class="quotation-generate-pdf" onclick="javascript:Quotations.pdf(' + data.quotation.id + ')">PDF</a> • ';
	html += '<a href="#" class="text-danger quotation-delete" onclick="javascript:Quotations.delete(' + data.quotation.id + ')">Delete</a>]';
	html += '</h6>';
	
	html += '</div>';
	return html;
}