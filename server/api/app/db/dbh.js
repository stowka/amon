var mysql      = require('mysql');
var connection = mysql.createConnection({
	host		: 'localhost',
 	user		: 'root',
	password	: '',
	database	: 'NPM'
});

connection.connect();

connection.query('SELECT * FROM access_key;', function(err, rows, fields) {
	if (err) 
		throw err;
	console.log(rows);
});

connection.end();