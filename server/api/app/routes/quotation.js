var express = require('express');
var fs = require('fs');
var router = express.Router();
var quotation = require('../bundles/quotation/quotation');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.get('/read/:id/:language', function(req, res, next) {
    var id = req.params.id;
    var language = req.params.language;

    quotation.generatePdf(id, language, function(filename) {
        fs.readFile(filename, function(err, file) {
            if (err) throw err;
            res.writeHeader(200, {'contentType' : 'application/pdf'});
            res.end(file);
        });
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
    var params = [req.body.id, req.body.summary, req.body.vendor,
                  req.body.customer, req.body.payment_method,
                  req.body.currency];

    quotation.store(params, function(success, err) {
        if(success) {
            res.sendStatus(200);
        } else {
            res.status(400);
            res.json(err);
        }
    });
});

module.exports = router;
