//Public functions

var database = require('../database/database.js');
var squel = require('squel');

module.exports = {
    test: function() {
        return getSqlQueries();
    },

    read: function(idQuotation, callback) {

        var sql = getSqlQueries();
        
        database.execute(sql, { id: idQuotation }, function(results) {
            //If the quotation exists in the database
            if(results[0].length > 0) {

                var total = computeTotal(results[3]);

                //Date format
                results[0][0].date_of_creation =
                    formatDate(results[0][0].date_of_creation, results[0][0].language);
                results[0][0].date_of_validity =
                    formatDate(results[0][0].date_of_validity, results[0][0].language);

                var data = {
                    quotation     : results[0][0],
                    vendor        : results[1][0],
                    customer      : results[2][0],
                    details       : results[3],
                    vendorPhone   : results[4][0],
                    customerPhone : results[5][0],
                };

                callback(true, data);
            } else {
                callback(false, "No quotation found for this id");
            }
        });
    },
    
    generatePdf: function (idQuotation, callback) {

        var misc = squel.select()
            .from('misc', 'm')
            .join('quotation', 'q', 'q.language = m.language')
            .where('q.id = :id');

        var sql = getSqlQueries()+ misc.toString() + ';';

        database.execute(sql, { id: idQuotation }, function(results) {
            //If the quotation exists in the database
            if(results[0].length > 0) {

                var total = computeTotal(results[3]);

                //Date format
                results[0][0].date_of_creation =
                    formatDate(results[0][0].date_of_creation, results[0][0].language);
                results[0][0].date_of_validity =
                    formatDate(results[0][0].date_of_validity, results[0][0].language);

                var html = generateHTML({
                    'quotation'     : results[0][0],
                    'vendor'        : results[1][0],
                    'customer'      : results[2][0],
                    'details'       : results[3],
                    'vendorPhone'   : results[4][0],
                    'customerPhone' : results[5][0],
                    'total'         : total,
                    'misc'          : wrapMiscObject(results[6])
                });

                //HTML to PDF
                var pdf = require('html-pdf');
                var options = {
                    filename: '/tmp/quotation_' + idQuotation + '.pdf',
                    format : 'letter'
                };
                pdf.create(html, options).toFile(function(err, res) {
                    if (err) {
                        callback(false, err);
                    } else {
                        var sql = 'UPDATE quotation SET last_generated = ' + 
                            ':date WHERE id = :id;';
                        database.execute(sql, {
                            id   : idQuotation,
                            date : new Date()
                        }, function(results) {
                            callback(true, res);
                        });
                    }
                });
            } else {
                callback(false, "No quotation found for this id");
            }
        });
    },

    readAll: function(callback) {
        var sql = squel.select()
                       .from('quotation','q')
                       .from('contact','v')
                       .from('contact','c')
                       .field('q.id').field('q.summary').field('q.date_of_creation')
                       .field('v.first_name','vendor_first_name')
                       .field('v.last_name','vendor_last_name')
                       .field('c.first_name','customer_first_name')
                       .field('c.last_name','customer_last_name')
                       .where('q.vendor = v.id')
                       .where('q.customer = c.id');

        database.execute(sql.toString(), {}, function(results) {
            if (!results.length) {
                callback(false, err);
            } else {
                for(var i = 0 ; i < results.length ; i++) {
                    results[i].date_of_creation = 
                        results[i].date_of_creation
                                  .toJSON()
                                  .match(/\d{4}-\d{2}-\d{2}/)[0];
                }
                callback(true, {quotation: results});
            }
        });
    },

    search: function(data, callback) {
        var sql = squel.select()
                       .from('quotation','q')
                       .from('contact','v')
                       .from('contact','c')
                       .field('q.id').field('q.summary').field('q.date_of_creation')
                       .field('v.first_name','vendor_first_name')
                       .field('v.last_name','vendor_last_name')
                       .field('c.first_name','customer_first_name')
                       .field('c.last_name','customer_last_name')
                       .where('q.vendor = v.id')
                       .where('q.customer = c.id');
        if(data.summary) {
            sql.where('q.summary like :summary');
        }
        if(data.date) {
            sql.where('q.date_of_creation = :date');
        }
        if(data.after && data.before) {
            sql.where('q.date_of_creation BETWEEN :after AND :before');
        }
        if(data.vendor) {
            sql.where('q.vendor = :vendor');
        }

        database.execute(sql.toString(), data, function(results) {
            callback(results);
        });
    },

    update: function(quotation, callback) {
        var sql = squel.update()
                       .set('summary', ':summary')
                       .set('vendor', ':vendor')
                       .set('customer', ':customer')
                       .set('payment_method', ':payment_method')
                       .set('currency', ':currency')
                       .set('language', ':language')
                       .where('id = :id');

        database.execute(sql.toString(), {
            id             : quotation.id,
            summary        : quotation.summary, 
            vendor         : quotation.vendor, 
            customer       : quotation.customer, 
            payment_method : quotation.payment_method,
            currency       : quotation.currency, 
            language       : quotation.language
        }, function(results) {
            if(results.affectedRows === 1) {
                quotationUpdated(line.quotation);
                callback(true, results);
            } else {
                callback(false, results);
            }
        });
    },

    remove: function(idQuotation, callback) {
        var sql = squel.delete()
                       .from('quotation')
                       .where('id = :id');

        database.execute(sql.toString(), {
            id: idQuotation
        }, function(results) {
            callback(true, results);
        });
    },

    storeQuotation: function(quotation, callback) {
        store(quotation, callback);
    },

    storeQuotationWithNewClient: function(quotation, client, callback) {
        /*quotation.customer = TODO: 
         * Call to Contact bundle function that store the new client
         * and return his id 
         */
        store(quotation, callback);
    },

    upToDate: function(idQuotation, callback) {
        var sql = squel.select()
                       .from('quotation')
                       .field('unix_timestamp(last_updated)', 'last_updated')
                       .field('unix_timestamp(last_generated)', 'last_generated')
                       .where('id = :id');
            
        database.execute(sql.toString(), {
            id : idQuotation
        }, function(results) {
            if(parseInt(results[0].last_updated) <= parseInt(results[0].last_generated)) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    storeLine: function(line, callback) {
        var sql = squel.insert()
                       .into('detail')
                       .set('description', ':description')
                       .set('discount', ':discount')
                       .set('quantity', ':quantity')
                       .set('price', ':price')
                       .set('line', ':line')
                       .set('quotation', ':quotation');

        database.execute(sql.toString(), {
            description : line.description,
            discount    : line.discount,
            quantity    : line.quantity,
            price       : line.price,
            line        : line.line,
            quotation   : line.quotation
        }, function(results) {
            if(results.affectedRows === 1) {
                quotationUpdated(line.quotation);
                callback(true);
            } else {
                callback(false, results);
            }
        });
    },

    removeLine: function(idLine, callback) {
        var sql = squel.delete()
                       .from('quotation')
                       .where('id = :id');

        database.execute(sql.toString(), {
            id : idLine
        }, function(results) {
            if(results.affectedRows === 1) {
                quotationUpdated(line.quotation);
                callback(true, results);
            } else {
                callback(false, results);
            }
        });
    },

    updateLine: function(line, callback) {
        var sql = squel.update()
                       .table('detail')
                       .set('description', ':description')
                       .set('discount', ':discount')
                       .set('quantity', ':quantity')
                       .set('price', ':price')
                       .set('line', ':line')
                       .set('quotation', ':quotation')
                       .where('id = :id');

        database.execute(sql.toString(), {
            id          : line.id,
            description : line.description,
            discount    : line.discount,
            quantity    : line.quantity,
            price       : line.price,
            line        : line.line,
            quotation   : line.quotation
        }, function(results) {
            if(results.affectedRows === 1) {
                quotationUpdated(line.quotation);
                callback(true, data);
            } else {
                callback(false, data);
            }
        });
    },

    readLine: function(idLine, callback) {
        var sql = squel.select()
                       .from('detail')
                       .where('id = :id');

        database.execute(sql.toString(), {
            id : idLine
        }, function(results) {
            if(results.length === 1) {
                callback(true, results[0]);
            } else {
                callback(false, results);
            }
        });
    }
};

//Get all the usefull data from a quotation
function getSqlQueries() {
    
    var quotation = squel.select()
        .from('quotation', 'q')
        .join('payment_method', 'pm', 'q.payment_method = pm.id')
        .join('payment_method_translation', 'pmt', 'pm.id = pmt.payment_method')
        .join('currency', 'c', 'c.id = q.currency')
        .join('currency_translation', 'ct', 'ct.currency = c.id')
        .field('q.id')
        .field('q.summary')
        .field('pmt.label', 'payment_method')
        .field('c.symbol', 'currency_symbol')
        .field('ct.name', 'currency')
        .field('q.date_of_creation')
        .field('q.date_of_validity')
        .field('q.language')
        .where('q.id = :id')
        .where('pmt.language = q.language')
        .where('ct.language = q.language');

    var vendor = squel.select()
        .from('contact', 'c')
        .join('quotation', 'q', 'q.vendor = c.id')
        .join('title', 't', 't.id = c.title')
        .join('title_translation', 'tt', 'tt.title = t.id')
        .field('tt.label', 'title')
        .field('c.first_name')
        .field('c.last_name')
        .field('c.email')
        .field('c.address')
        .where('q.id = :id')
        .where('tt.language = q.language');

    var customer = squel.select()
        .from('contact', 'c')
        .join('quotation', 'q', 'q.customer = c.id')
        .join('title', 't', 't.id = c.title')
        .join('title_translation', 'tt', 'tt.title = t.id')
        .field('tt.label', 'title')
        .field('c.first_name')
        .field('c.last_name')
        .field('c.email')
        .field('c.address')
        .where('q.id = :id')
        .where('tt.language = q.language');

    var details = squel.select()
        .from('detail', 'd')
        .join('quotation', 'q', 'd.quotation = q.id')
        .field('d.line')
        .field('d.description')
        .field('d.discount')
        .field('d.quantity')
        .field('d.price')
        .field('(d.price * d.quantity * (1 - d.discount/100))', 'total_ht')
        .order('d.line');

    var vendorPhoneNumbers = squel.select()
        .from('phone', 'p')
        .join('contact', 'c', 'p.contact = c.id')
        .join('quotation', 'q', 'q.vendor = c.id')
        .field('country_code')
        .field('number')
        .where('q.id = :id');

    var customerPhoneNumbers = squel.select()
        .from('phone', 'p')
        .join('contact', 'c', 'p.contact = c.id')
        .join('quotation', 'q', 'q.customer = c.id')
        .field('country_code')
        .field('number')
        .where('q.id = :id');


    return quotation.toString() + ';' +
           vendor.toString() + ';' +
           customer.toString() + ';' +
           details.toString() + ';' +
           vendorPhoneNumbers.toString() + ';' +
           customerPhoneNumbers.toString() + ';';
}

function store(quotation, callback) {
    quotation.today = new Date();
    quotation.validity = new Date();
    quotation.validity.setDate(quotation.validity.getDate() + 30);

    var sql = squel.insert()
                   .into('quotation')
                   .set('summary', ':summary')
                   .set('vendor', ':vendor')
                   .set('customer', ':customer')
                   .set('payment_method', ':payment_method')
                   .set('currency', ':currency')
                   .set('date_of_creation', ':today')
                   .set('date_of_validity', ':validity')
                   .set('language', ':language');

    database.execute(sql.toString(), {
        summary: quotation.summary, 
        vendor: quotation.vendor, 
        customer: quotation.customer, 
        payment_method: quotation.payment_method,
        currency: quotation.currency, 
        today: quotation.today, 
        validity: quotation.validity,
        language: quotation.language
    }, function(results) {
            if (results.insertId) {
                callback(true);
            } else {
                callback(false, results);
            }
    });
}

function quotationUpdated(idQuotation) {
    var validity = new Date();
    validity.setDate(validity.getDate() + 30);
    var sql = squel.update()
                   .table('quotation')
                   .set('last_updated', ':newDate')
                   .set('date_of_validity', ':newValidity')
                   .where('where id = :id');

    database.execute(sql.toString(), {
        id          : idQuotation,
        newDate     : new Date(),
        newValidity : validity
    }, function(results) {
    });
}

function computeTotal(tasks) {
    total = 0;
    tasks.forEach(function(object, index, array) {
        total += object.total_ht;
    });
    return total;
}

function formatDate(date, lang) {
    var monthString = {
        'fr-CH' : ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                   "août", "septembre", "octobre", "novembre", "décembre"],
        'en-UK' : ["January", "February", "March", "April", "May", "June", "July",
                   "August", "September", "October", "November", "December"]
    };
    var day = date.getDate();
    var month = monthString[lang][date.getMonth()];
    var year = date.getFullYear();
    
    var dateString = '';
    if(lang === 'fr-CH') {
        dateString = day + ' ' + month + ' ' + year;
    } else {
        var cardinal = '';
        if(day === 1 || day === 21 || day === 31) {
            cardinal = 'st';
        } else if(day === 2 || day === 22) {
            cardinal = 'nd';
        } else if(day === 3 || day === 23) {
            cardinal = 'rd';
        } else {
            cardinal = 'th';
        }
        dateString = month + ', ' + day + cardinal + ' ' + year;
    }

    return dateString;
}

function generateHTML(data) {
    var jade = require('jade');
    var template = jade.compileFile('bundles/quotation/quotation.jade');
    var html = template(data);
    return html;
}

function wrapMiscObject(miscObjects) {
    var result  = {};
    miscObjects.forEach(function(object, index, array) {
        result[object.keyword] = object.text;
    });
    return result;
}
