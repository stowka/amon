//Public functions

var database = require("../database/database.js");

module.exports = {
    
    generatePdf: function (idQuotation, callback) {

        var sqlQuotation = {
            query: "SELECT Q.id, Q.summary, PMT.label as payment_method, "
                + "C.symbol as currency_symbol, CT.name as currency, "
                + "Q.date_of_creation, Q.date_of_validity, Q.language "
                + "FROM quotation Q, payment_method PM, "
                + "payment_method_translation PMT, currency C, "
                + "currency_translation CT WHERE Q.id = :id "
                + "AND Q.payment_method = PM.id " 
                + "AND PMT.payment_method = PM.id " 
                + "AND PMT.language = Q.language " 
                + "AND Q.currency = C.id " 
                + "AND CT.currency = C.id " 
                + "AND CT.language = Q.language;",
            data: {
                id: idQuotation
            }
        };

        var sqlCustomer = {
            query: "SELECT TT.label as title, C.first_name, C.last_name, C.email, C.address, " +
                "P.country_code, P.number " +
            "FROM quotation Q, contact C, title T, title_translation TT, phone P, " +
                "contact_phone CP " +
            "WHERE Q.id = :id " +
            "AND Q.customer = C.id " +
            "AND C.title = T.id " +
            "AND TT.title = T.id " +
            "AND TT.language = Q.language " + 
            "AND CP.contact = C.id " + 
            "AND CP.phone = P.id LIMIT 1; ",
            data: {
                id: idQuotation
            }
        };

        var sqlVendor = {
            query: 'SELECT TT.label as title, C.first_name, C.last_name, C.email, C.address, ' +
                'P.country_code, P.number ' +
            'FROM quotation Q, contact C, title T, title_translation TT, phone P,  ' +
                'contact_phone CP ' +
            'WHERE Q.id = :id ' +
            'AND   Q.vendor = C.id ' +
            'AND   C.title = T.id ' +
            'AND   TT.title = T.id ' + 
            'AND   TT.language = Q.language ' +
            'AND   CP.contact = C.id ' +
            'AND   CP.phone = P.id LIMIT 1; ',
            data: {
                id: idQuotation
            }
        };

        var sqlDetail = {
            query: 'SELECT D.line, D.description, D.discount, D.quantity, D.price, ' +
                '(D.price * D.quantity * (1 - D.discount/100)) as total_ht ' +
            'FROM quotation Q, detail D  ' +
            'WHERE D.quotation = Q.id ' + 
            'ORDER BY D.line;'
        };

        var sqlMisc = {
            query: 'SELECT M.keyword, M.text ' + 
            'FROM misc M, quotation Q ' + 
            'WHERE Q.id = :id ' +
            'AND   M.language = Q.language;',
            data: {
                id: idQuotation
            }
        };

        var sqlQuery = sqlQuotation.query + sqlVendor.query + sqlCustomer.query 
            + sqlDetail.query + sqlMisc.query;

        database.execute(sqlQuery, {
            id: idQuotation
        },
        function(results) {
            console.log(results); // /!\ UNDEFINED 

            //If the quotation exists in the database
            if(results[0].length > 0) {

                var total = computeTotal(results[3]);

                //Date format
                results[0][0].date_of_creation =
                    formatDate(results[0][0].date_of_creation, results[0][0].language);
                results[0][0].date_of_validity =
                    formatDate(results[0][0].date_of_validity, results[0][0].language);

                var html = generateHTML({
                    'quotation' : results[0][0],
                    'vendor'    : results[1][0],
                    'customer'  : results[2][0],
                    'details'   : results[3],
                    'total'     : total,
                    'misc'      : wrapMiscObject(results[4])
                });

                //HTML to PDF
                var pdf = require('html-pdf');
                var options = {
                    filename: 'quotation_' + idQuotation + '.pdf',
                    format : 'letter'
                };
                pdf.create(html, options).toFile(function(err, res) {
                    if (err) throw err;
                    var data = {
                        'quotation' : results[0][0],
                        'vendor'    : results[1][0],
                        'customer'  : results[2][0],
                        'details'   : results[3],
                    };
                    callback(true, data);
                });
            } else {
                callback(false, "No quotation found for this id");
            }
        });
    },

    readAll: function(callback) {
        var sql = 'SELECT Q.id, Q.summary, Q.date_of_creation, ' +
                  '       V.first_name as vendor_first_name, ' +
                  '       V.last_name as vendor_last_name, ' +
                  '       C.first_name as customer_first_name, ' +
                  '       C.last_name as customer_last_game ' +
                  'FROM quotation Q, contact V, contact C ' +
                  'WHERE Q.vendor = V.id ' +
                  'AND   Q.customer = C.id;';

        database.execute(sql, {}, function(results) {
            if (!results.length) {
                callback(false, err);
            } else {
                callback(true, {quotation: results});
            }
        });
    },

    remove: function(idQuotation, callback) {
        var sql = "DELETE FROM quotation WHERE id = :id;";

        database.execute(sql, {
            id: idQuotation
        }, function(results) {
            callback(true, results);
        });
    },

    storeQuotation: function(quotation, callback) {
        store(quotation, callback);
    },

    storeQuotationWithNewClient: function(quotation, client, callback) {
        /*quotation.customer = TODO: Call to Contact bundle function that store the new client
         *                        and return his id 
         */
        store(quotation, callback);
    },
};

function store(quotation, callback) {
    quotation.today = new Date();
    quotation.validity = new Date();
    quotation.validity.setDate(quotation.validity.getDate() + 30);

    database.execute("INSERT INTO quotation VALUES (null, :summary, :vendor, "
        + ":customer, :payment_method, :currency, :today, :validity", {
            summary: quotation.summary, 
            vendor: quotation.vendor, 
            customer: quotation.customer, 
            payment_method: quotation.payment_method,
            currency: quotation.currency, 
            today: quotation.today, 
            validity: quotation.validity
        }, function(results) {
            if (result.insertId)
                callback(result.insertId);
            else
                callback(false);
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
