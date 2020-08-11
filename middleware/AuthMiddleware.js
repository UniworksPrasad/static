const request = require('request');
const jwkToPem = require('jwk-to-pem');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv').config();
const User = require('../models/user');
const rolefile = require('./role');


const pool_region = process.env.POOLREGION;

exports.Validate = function (req, res, next) {
    var token = req.headers['authorization'];
    var params = {
        AccessToken: token /* required */
      };
    request({
        url: process.env.COGNITOURL,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = {
                    kty: key_type,
                    n: modulus,
                    e: exponent
                };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            var decodedJwt = jwt.decode(token, {
                complete: true
            });
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                res.status(401);
                return res.send("Invalid token");
            }
            var kid = decodedJwt.header.kid;
            var pem = pems[kid];
            if (!pem) {
                console.log('Invalid token');
                res.status(401);
                return res.send("Invalid token");
            }
            jwt.verify(token, pem, async function (err, payload) {
                if (err) {
                    console.log("Invalid Token.");
                    res.status(401);
                    return res.send("Invalid tokern");
                } else {
                    console.log("Valid Token.");
                    var cognitoidentityserviceprovider = await new AWS.CognitoIdentityServiceProvider({
                        region: pool_region
                    });
                    await cognitoidentityserviceprovider.getUser(params, async function (err, data) {
                        if (err) {
                            res.status(401);
                            return res.send("Error in Fetching Data");
                        }
                        else {
                            const phone_number = await data.UserAttributes[2].Value;
                            await User.findAll({
                                where: {
                                    contact: phone_number
                                }
                            }).then(user => {
                                console.log(user[0].role);
                                const myRole = user[0].role;
                                if (rolefile[myRole].find(function (allowedRoute) {
                                        return req.path.startsWith(allowedRoute);
                                    })) {
                                    return next();
                                } else {
                                    return res.status(401).json({
                                        error: 'Access Denied: You dont have correct privilege to perform this operation'
                                    });
                                }
                            })
                        }
                    });
                }
                jwt.verify(token, pem, async function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                        res.status(401);
                        return res.send("Invalid tokern");                    
                    } else {
                         console.log("Valid Token.");
                         var cognitoidentityserviceprovider = await new AWS.CognitoIdentityServiceProvider({region : pool_region});
                         await cognitoidentityserviceprovider.getUser(params, async function(err, data) {
                            if (err) {
                                res.status(401);
                                return res.send("Error in Fetching Data");  
                            } // an error occurred
                            else {
                                const phone_number = await data.UserAttributes[2].Value;
                                await User.findAll({where: {contact: phone_number}}).then(user => {
                                    console.log(user[0].role);
                                    const role = user[0].role;
                                    if(role != "CNVD"){
                                        res.status(401);
                                           return res.send("not authorized");
                                    } else {
                                        return next();
                                    }
                                })
                            }         // successful response
                          });
                        
                         
                    }
               });
       } else {
             console.log("Error! Unable to download JWKs");
             res.status(500);
             return res.send("Error! Unable to download JWKs");
            });
        } else {
            console.log("Error! Unable to download JWKs");
            res.status(500);
            return res.send("Error! Unable to download JWKs");
        }
    });
}