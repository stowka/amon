/*
 * DatabaseHandler.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest database handler
 */

/*
 * Modules
 */
var poolModule = require('generic-pool');
var mysqlModule = require('mysql');
var eventsModule = require('events');

var eventEmitter = new eventsModule.EventEmitter();

var pool = poolModule.Pool({
	name	: 'mysql',
	create	: function(callback) {
		var c = mysqlModule.createConnection({
			host		: 'localhost',
			user		: 'root',
			password	: '893QQY',
			database	: 'NPM'
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

function execute(query, data, callback) {
	pool.acquire(function(err, client) {
		if (err)
			console.err(err);
		else {
			client.query(query, data, function(err, result) {
				if (err)
					throw err;

				// TODO it doesn't differentiate select from delete
				// and well, mate, that's an issue we gotta take care of!

				if (result.insertId)
					eventEmitter.emit('insertDidComplete', result.insertId);
				else if (result.changedRows)
					eventEmitter.emit('updateDidComplete', result.changedRows);
				else
					eventEmitter.emit('selectDidComplete', result);

				pool.release(client);

				if (callback)
					callback(null);
			});
		}
	});
}

/*
 * Listeners
 */

eventEmitter.on('insertDidComplete', function(insertId) {
	console.log(insertId);
});

eventEmitter.on('selectDidComplete', function(rows) {
	console.log(rows);
});


/*
 * Tests
 */

execute("INSERT INTO tests (txt) VALUES (:value);", {
	value: "value"
}, function() {
	execute("SELECT * FROM tests;");
});
