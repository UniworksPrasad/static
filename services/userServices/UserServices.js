global.fetch = require('node-fetch');
global.navigator = () => null;
require('dotenv').config();

const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.USERPOOLID,
  ClientId: process.env.CLIENTID
};

const pool_region = process.env.POOLREGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.UpdateUserAttributes = function (headers, body, callback) {
    //console.log(headers['authorization']);
    var params = {
        UserAttributes: body.UserAttributes,
        UserPoolId: poolData.UserPoolId, /* required */
        Username: body.Username, /* required */
      };
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region : pool_region});
      cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
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

//uploadImage
//forgotPassword
//changePassword
//resendOTP