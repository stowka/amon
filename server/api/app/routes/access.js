var express = require('express');
var router = express.Router();
var access = require('../bundles/access/access');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // TODO format json response
    access.login(username, password, req.ip.split(":")[3], 
        req.headers["user-agent"], function(success, token) {
        if (success) {
            res.status(200);
            res.json({
                token: token.user.id + ":" + token.hash,
                contact: token.user.contact,
                start_date: token.user.start_date,
                end_date: token.user.end_date
            });
        } else {
            res.status(200);
            res.json({
                error: 1,
                message: "Wrong username or password."
            })
        }
    });
});

router.post('/logout', function(req, res) {
    var token = req.body.token;

    // TODO format json response
    access.logout(token, function(success) {
        if (success) {
            res.sendStatus(200);
        } else {
            res.status(200);
            res.json({
                error: 1,
                message: "No such a session."
            })
        }
    });
});

module.exports = router;
