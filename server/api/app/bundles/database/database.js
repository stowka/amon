/**
 * database.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest handles connections to the database
 */

 /*
 * DatabaseHandler.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest database handler
 *
 * @see https://github.com/coopernurse/node-pool
 * @see https://github.com/felixge/node-mysql/
 * @see https://nodejs.org/api/events.html
 */

/*
 * Modules
 */
var poolModule = require('generic-pool');
var mysqlModule = require('mysql');

var credentials = {
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "Amon"
}

var pool = connect(credentials);

module.exports = {

	execute: function(query, data, callback) {
		pool.acquire(function(err, client) {
			if (err)
				console.err(err);
			else {
				client.query(query, data, function(err, result) {
					if (err)
						throw err;

					pool.release(client);

					if (callback)
						callback(result);
				});
			}
		});
	}

}

function connect(credentials) {
	return poolModule.Pool({
		name	: 'mysql',
		create	: function(callback) {
			var c = mysqlModule.createConnection({
				host		: credentials.host,
				user		: credentials.user,
				password	: credentials.password,
				database	: credentials.database
			});
			c.config.queryFormat = function (query, values) {
				if (!values) 
					return query;
				
				return query.replace(/\:(\w+)/g, function (txt, key) {
					if (values.hasOwnProperty(key)) {
						return this.escape(values[key]);
					}
					return txt;
				}.bind(this));
			};
			c.connect();
			callback(null, c);
		},
		destroy	: function(c) {
			c.end();
		},
		max					: 10,
		min					: 2,
		idleTimeoutMillis	: 30000,
		log					: false
	});
}