global.fetch = require('node-fetch');
global.navigator = () => null;

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const poolData = {
   UserPoolId: process.env.USERPOOLID,
   ClientId: process.env.CLIENTID
};

const pool_region = process.env.POOLREGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.Register = function (body, callback) {
   var username = body.Username;
   var phone_number = body.Phone_number;
   var password = body.Password;
   var attributeList = [];
   
   attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: phone_number }));
   userPool.signUp(username, password, attributeList, null, function (err, result) {
     if (err)
         callback(err);
    else{
        User.create({
            contact: body.Username,
            status : "NOT CONFIRMED"
        }).then(result =>{
                callback(null, result);
            }).catch(err => {
            callback(err);
        })
     }
   })
}

exports.ConfirmSignUp = function (body, callback) {
    var params = {
        ClientId: poolData.ClientId, /* required */
        ConfirmationCode: body.ConfirmationCode, /* required */
        Username: body.Username, /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
        if (err){
            callback(err);
        } // an error occurred
        else{
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: body.Username,
                Password: body.Password
            });
            var userData = {
                Username: body.Username,
                Pool: userPool
            }
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                   var accesstoken = result.getAccessToken().getJwtToken();
                   User.findAll({where : {userName: body.Username}}).then(users =>{
                    console.log(users);
                    users[0].status = "CONFIRMED";
                    users[0].save().then(result => {
                        callback(null, accesstoken);
                    }).catch(err => {callback(err)});
                }).catch(err => {
                    callback(err);
                });
                },
                onFailure: (function (err) {
                   callback(err);
               })
           })
        } // successful response
      });
 };

exports.Login = function (body, callback) {
    var userName = body.Username;
    var password = body.Password;
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
         Username: userName,
         Password: password
     });
     var userData = {
         Username: userName,
         Pool: userPool
     }
     var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
     cognitoUser.authenticateUser(authenticationDetails, {
         onSuccess: function (result) {
            var accesstoken = result.getAccessToken().getJwtToken();
            callback(null, accesstoken);
         },
         onFailure: (function (err) {
            callback(err);
        })
    })
 };

 exports.Delete = function (headers, body, callback) {
     var params = {
        AccessToken: headers.authorization /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.deleteUser(params, function(err, data) {
        if (err){
            callback(err);
        } // an error occurred
        else{
            User.destroy({
                where: {
                   userName: body.Username //this will be your id that you want to delete
                }
             }).then(result => {
               success = {
                 message: "User with phone number: "+body.Username+" deleted successfully"
               }
               console.log(result);
               callback(null, success);
             }).catch(err => {
               callback(err);
             });
        }           // successful response

      });

 };

 exports.ListUsers = function (body, callback) {
    var params = {
        UserPoolId: poolData.UserPoolId, /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.listUsers(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            callback(err);
        } // an error occurred
        else{
            console.log(data);
            callback(null, data);
        } // successful response
      });
 };

 exports.Validate = function(token, callback){
    request({
        url : process.env.COGNITOURL,
        json : true
     }, function(error, response, body){
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for(var i = 0; i < keys.length; i++) {
                 var key_id = keys[i].kid;
                 var modulus = keys[i].n;
                 var exponent = keys[i].e;
                 var key_type = keys[i].kty;
                 var jwk = { kty: key_type, n: modulus, e: exponent};
                 var pem = jwkToPem(jwk);
                 pems[key_id] = pem;
            }
            var decodedJwt = jwt.decode(token, {complete: true});
                 if (!decodedJwt) {
                     console.log("Not a valid JWT token");
                     callback(new Error('Not a valid JWT token'));
                 }
                 var kid = decodedJwt.header.kid;
                 var pem = pems[kid];
                 if (!pem) {
                     console.log('Invalid token');
                     callback(new Error('Invalid token'));
                 }
                 jwt.verify(token, pem, function(err, payload) {
                     if(err) {
                         console.log("Invalid Token.");
                         callback(new Error('Invalid token'));
                     } else {
                          console.log("Valid Token.");
                          callback(null, "Valid token");
                     }
                });
        } else {
              console.log("Error! Unable to download JWKs");
              callback(error);
        }
    });
 }

 exports.ResendOTP = function (body, callback) {
    var params = {
        ClientId: poolData.ClientId, /* required */
        Username: body.Username, /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.resendConfirmationCode(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            callback(err);
        } // an error occurred
        else{
            console.log(data);
            callback(null, data);
        } // successful response
      });
 };

 exports.ForgetPassword = function (body, callback) {
    var params = {
        ClientId: poolData.ClientId, /* required */
        Username: body.Username, /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.forgotPassword(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            callback(err);
        } // an error occurred
        else{
            console.log(data);
            callback(null, data);
        } // successful response
      });
 };

 exports.ChangePassword = function (body, token, callback) {
    var params = {
        AccessToken: token,
        PreviousPassword: body.PreviousPassword,
        ProposedPassword: body.ProposedPassword
        };
      
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.changePassword(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            callback(err);
        } // an error occurred
        else{
            console.log(data);
            callback(null, data);
        } // successful response
      });
 };

 exports.UpdateAttributes = function(body, callback){
    var params = {
        UserAttributes: body.UserAttributes,
          UserPoolId: process.env.USERPOOLID, /* required */
          Username: body.Username, /* required */
        };
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
          if (err) callback(err); // an error occurred
          else     callback(null, data);           // successful response
        });
 }


 /*
 
 
 
 
 */ 