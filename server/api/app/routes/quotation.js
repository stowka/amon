var express = require('express');
var fs = require('fs');
var router = express.Router();
var quotation = require('../bundles/quotation/quotation');

router.get('/test', function(req, res, next) {
    res.status(200);
    res.end(quotation.test());
});

router.get('/pdf/:id', function(req, res, next) {
    var id = req.params.id;
    var filename = '/tmp/quotation_' + id + '.pdf';
    var sendPDF = function() {
        fs.readFile(filename, function(err, file) {
            if (err) {
                res.status(200);
                res.json(err);
            } else {
                res.writeHeader(200, {'contentType': 'application/pdf'});
                res.end(file);
            }
        });
    };
    
    fs.exists(filename, function(exists) { 
        quotation.upToDate(id, function(upToDate) {
            if(exists && upToDate) {
                sendPDF();
            } else {
                quotation.generatePdf(id, function(success, data) {
                    if(success) {
                        sendPDF();
                    } else {
                        res.sendStatus(404);
                    }
                });
            }
        });
    });
});

router.get('/read/all', function(req, res, next) {
    console.log(req.cookies);
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

router.post('/update', function(req, res, next) {
    quotation.update(req.body, function(success, data) {
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


router.post('/create', function(req, res, next) {
    quotation.storeQuotation(req.body, function(success, data) {
        if(success) {
            res.status(200);
            res.json(data);
        } else {
            res.status(400);
            res.json(data);
        }
    });
});

router.post('/search', function(req, res, next) {
    quotation.search(req.body, function(results) {
        res.status(200);
        res.json(results);
    });
});

router.post('/line/create', function(req, res, next) {
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

router.get('/line/read/:id', function(req, res, next) {
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

router.post('/line/update', function(req, res, next) {
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

router.get('/line/remove/:id', function(req, res, next) {
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
