var express = require('express');
var fs = require('fs');
var router = express.Router();
var quotation = require('../bundles/quotation/quotation');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/pdf/:id', function(req, res, next) {
    var id = req.params.id;
    
    quotation.generatePdf(id, function(success, data) {
        if(success) {
            var filename = 'quotation_' + req.params.id + '.pdf';
            fs.readFile(filename, function(err, file) {
                if (err) {
                    res.status(200);
                    res.json({error : 1, message : "No such file! (" + file + ")"});
                } else {
                    res.writeHeader(200, {'contentType': 'application/pdf'});
                    res.end(file);
                }
            });
        } else {
            res.status(200);
            res.json({error : 1, message : "Couldn't generate PDF!"});
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

router.get('/read/:id', function(req, res, next) {
    var id = req.params.id;
    quotation.read(id, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(404);
            res.json(data);
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
    quotation.storeQuotation(req.body, function(success, data) {
        if(success) {
            res.sendStatus(200);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.post('/line/create', function(req, res) {
    quotation.storeLine(req.body, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.get('/line/read/:id', function(req, res) {
    quotation.readLine(req.params.id, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.post('/line/update', function(req, res) {
    quotation.updateLine(req.body, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.get('/line/remove/:id', function(req, res) {
    quotation.removeLine(req.params.id, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});


module.exports = router;
