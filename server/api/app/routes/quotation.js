var express = require('express');
var fs = require('fs');
var router = express.Router();
var quotation = require('../bundles/quotation/quotation');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.get('/pdf/:filename', function(req, res, next) {
    var filename = req.params.filename;

    fs.readFile(filename, function(err, file) {
        if (err) {
            res.status(404);
            res.json({errorCode : 1, error : "The file doesn't exist"});
        } else {
            res.writeHeader(200, {'contentType': 'application/pdf'});
            res.end(file);
        }
    });
});

router.get('/read/all', function(req, res, next) {
    quotation.readAll(function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.get('/read/:id/:language', function(req, res, next) {
    var id = req.params.id;
    var language = req.params.language;

    quotation.generatePdf(id, language, function(success, data) {
        if(success) {
            fs.readFile(data, function(err, file) {
                if (err) throw err;
                res.writeHeader(200, {'contentType' : 'application/pdf'});
                res.end(file);
            });
        } else {
            res.status = 404;
            res.end(data);
        }
    });
});


router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;

    quotation.remove(id, function(success, data) {
        if(success && data > 0) {
            res.sendStatus(200);
        } else if(success && data === 0) {
            res.sendStatus(404);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});


router.post('/create', function(req, res) {
    var quotationData = {
        summary        : req.body.summary,
        vendor         : req.body.vendor,
        customer       : req.body.customer,
        payment_method : req.body.payment_method,
        currency       : req.body.currency
    };

    quotation.storeQuotation(quotationData, function(success, err) {
        if(success) {
            res.sendStatus(200);
        } else {
            res.status(400);
            res.json(err);
        }
    });
});

module.exports = router;
