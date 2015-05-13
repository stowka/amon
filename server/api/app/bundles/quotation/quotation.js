//Public functions
module.exports = {
    
    generatePdf: function (idQuotation, language, callback) {
        var connection = connectToDatabase();

        var id = connection.escape(idQuotation);
        var lang = connection.escape(language);

        var sqlQuotation = 
            'SELECT Q.id, Q.summary, PMT.label as payment_method, C.symbol as currency_symbol, ' + 
                'CT.name as currency, Q.date_of_creation, Q.date_of_validity ' + 
            'FROM quotation Q, payment_method PM, payment_method_translation PMT, currency C, ' +
                'currency_translation CT ' +
            'WHERE Q.id = ' + id + ' ' +
            'AND   Q.payment_method = PM.id ' +
            'AND   PMT.payment_method = PM.id ' +
            'AND   PMT.language = ' + lang + ' ' +
            'AND   Q.currency = C.id ' + 
            'AND   CT.currency = C.id ' +
            'AND   CT.language = ' + lang +'; ';

        var sqlCustomer = 
            'SELECT TT.label as title, C.first_name, C.last_name, C.email, C.address, ' +
                'P.country_code, P.number ' +
            'FROM quotation Q, contact C, title T, title_translation TT, phone P, ' +
                'contact_phone CP ' +
            'WHERE Q.id = ' + id + ' ' +
            'AND   Q.customer = C.id ' +
            'AND   C.title = T.id ' +
            'AND   TT.title = T.id ' +
            'AND   TT.language = ' + lang + ' ' +
            'AND   CP.contact = C.id ' + 
            'AND   CP.phone = P.id LIMIT 1; ';

        var sqlVendor = 
            'SELECT TT.label as title, C.first_name, C.last_name, C.email, C.address, ' +
                'P.country_code, P.number ' +
            'FROM quotation Q, contact C, title T, title_translation TT, phone P,  ' +
                'contact_phone CP ' +
            'WHERE Q.id = ' + id + ' ' +
            'AND   Q.vendor = C.id ' +
            'AND   C.title = T.id ' +
            'AND   TT.title = T.id ' + 
            'AND   TT.language = ' + lang + ' ' +
            'AND   CP.contact = C.id ' +
            'AND   CP.phone = P.id LIMIT 1; ';

        var sqlDetail = 
            'SELECT D.line, D.description, D.discount, D.quantity, D.price, ' +
                '(D.price * D.quantity * (1 - D.discount/100)) as total_ht ' +
            'FROM quotation Q, detail D, quotation_detail QD ' +
            'WHERE Q.id = ' + id + ' ' +
            'AND   QD.quotation = Q.id ' +
            'AND   QD.detail = D.id; '; 

        var sqlMisc = 
            'SELECT * ' + 
            'FROM misc ' + 
            'WHERE language = ' + lang + '; ';

        var sqlQuery = sqlQuotation + sqlVendor + sqlCustomer + sqlDetail + sqlMisc;

        connection.query(sqlQuery, function(err, results, fields) {
            if(err) {
                throw err;
            } 

            var total = computeTotal(results[3]);

            //Date format
            results[0][0].date_of_creation =
                formatDate(results[0][0].date_of_creation, language);
            results[0][0].date_of_validity =
                formatDate(results[0][0].date_of_validity, language);

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
                filename: 'fr_devis.pdf',
                format : 'letter'
            };
            pdf.create(html, options).toFile(function(err, res) {
                if (err) throw err;
                callback(res.filename);
            });
        });
        
        connection.end();
    },

    remove: function(idQuotation, callback) {
        var connection = connectToDatabase();
        
        var sql = 'START TRANSACTION; ' +
                  'DELETE D ' + 
                  'FROM detail D, quotation_detail QD ' +
                  'WHERE QD.quotation = ? ' + 
                  'AND   QD.detail = D.id; ' + 
                  'DELETE ' + 
                  'FROM quotation ' +
                  'WHERE id = ?; ' +
                  'COMMIT;';


        connection.query(sql, [idQuotation, idQuotation], function(err, results) {
            if (err) {
                callback(false, err);
            } else {
                data = results[1].affectedRows + results[2].affectedRows;
                callback(true, data);
            }
        });
        
        connection.end();
    },

    store: function(params, callback) {
        var today = new Date();
        var validity = new Date();
        validity.setDate(validity.getDate() + 30);

        params.push(today);
        params.push(validity);

        var connection = connectToDatabase();

        connection.query("INSERT INTO quotation VALUES (?,?,?,?,?,?,?,?);", params, 
        function(err, results, fields) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, null);
            }
        });

        connection.end();
    }
};

function connectToDatabase() {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        database : 'AMON',
        multipleStatements : true
    });
    connection.connect();
    return connection;
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
    var template = jade.compileFile('bundles/quotation/devis.jade');
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


