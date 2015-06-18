/**
 * access.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest contains the methods concerning the access bundle
 */
var rand = require("./generate-hash.js");
var S = require("string");
var database = require("../database/database");
var users_and_roles = require("../users-and-roles/users-and-roles");
var squel = require('squel');
var bundles = {
    quotation : require('../quotation/quotation')
};

module.exports = {

    testMiddleware: function(req, res, next) {
        url = parseUrl(req.url);

        if(url.bundle === 'access') {
            next();
        } else {

            token = parseToken(req.cookies.token);

            checkSession(token, function(identified) {
                if(identified) {
                    checkPermissions(token.id, url.bundle, url.method, 
                            function(isGranted) {
                                if(isGranted) {
                                    next();
                                } else {
                                    res.status(400);
                                    res.json({error: 'You are not allowed to do that'})
                                }
                            });
                } else {
                    res.status(400);
                    res.json({error: 'You are not connected.'});
                }
            });
        }
    },

    // TODO check if such a session already exists with ip and user_agent 
    // in order to only update the matching row.
    login: function(username, password_hash, ip, user_agent, callback) {
        database.execute("SELECT id, contact, start_date, end_date FROM user "
            + "WHERE username = :username AND "
            + "password_hash = :password_hash", {
                username: username,
                password_hash: password_hash
            }, function(result) {
                if (result.length !== 1)
                    callback(false);
                else {
                    var hash = rand.generateHash();
                    database.execute("INSERT INTO session "
                        + "(user, token_hash, ip, user_agent) "
                        + "VALUES (:id, :token_hash, :ip, :user_agent)", {
                        id: result[0].id,
                        token_hash: hash,
                        ip: ip,
                        user_agent: user_agent
                    }, function() {
                        callback(true, {
                            user: {
                                id: result[0].id,
                                contact: result[0].contact,
                                start_date: result[0].start_date,
                                end_date: result[0].end_date,
                            },
                            hash: hash
                        })
                    });
                }
            })
    },

    logout: function(token, callback) {
        var token = parseToken(token);
        database.execute("DELETE FROM session "
            + "WHERE user = :user AND token_hash = :token_hash", {
                user: token.id,
                token: token.hash
            }, function(result) {
                // TODO if (1 !== result.deletedRows) callback(false)
                callback(true);
            });
    },

    acceptRequest: function(token, bundle, method, callback) {
        token = parseToken(token);
        if (token.error)
            callback(token.error);
        else {
            callback(false);
        }
    }
}

function checkPermissions(userId, bundle, method, callback) {
    var sql = squel.select()
        .from('user_access', 'ua')
        .join('bundle', 'b', 'b.id = ua.bundle')
        .join('user', 'u', 'u.id = ua.user')
        .field('ua.mode')
        .where('b.keyword = :bundle')
        .where('u.id = :userId');

    database.execute(sql.toString(), {
        bundle : bundle,
        userId : userId
    }, function(results) {
        if(tmp(results[0].mode, bundles[bundle].permissions[method])) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function checkSession(token, callback) {
    var id = token.id;
    var hash = token.hash;
    var sql = squel.select()
        .from('session')
        .field('id')
        .where('user = :user')
        .where('token_hash = :token_hash');
    
    database.execute(sql.toString(), {
            user: id,
            token_hash: hash
        }, function(result) {
            result.length === 1 ? 
                callback(true) :
                callback(false);
        });
}

function parseToken(token) {
    if (undefined != token && 
            (regex = token.match(/^([1-9][0-9]*):([0-9a-z]{40}$)/)))
        return {
            id: regex[1],
            hash: regex[2]
        };
    else
        return {
            error: 1,
            message: "Invalid token"
        };
}

function parseUrl(url) {
    var splitUrl = url.split('/');
    return {
        bundle : splitUrl[1],
        method : splitUrl[2]
    };
}

function tmp(permissions, requiredPermissions) {
    return permissions.indexOf(requiredPermissions) > -1 ? true : false;
}
