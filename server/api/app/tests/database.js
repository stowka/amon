var database = require("../bundles/database/database.js");

database.execute("UPDATE quotation SET summary = :summary WHERE id = :id", {
	id: 9,
	summary: "blblbl"
}, function(result) {
	console.log(result);
});


database.execute("INSERT INTO quotation VALUES" 
	+ "(:id, :summary, :vendor, :customer, :payment_method, "
	+ ":currency, :date_of_creation, :date_of_validity)", {
	id: null,
	summary: "insertion",
	vendor: 1, 
	customer: 2,
	payment_method: 1,
	currency: 1,
	date_of_creation: "2015-05-17",
	date_of_validity: "2015-06-17"
}, function(result) {
	console.log("LAST INSERT ID = " + result.insertId);
	database.execute("SELECT * FROM quotation", {}, function(result) {
		console.log(result);
	})
})