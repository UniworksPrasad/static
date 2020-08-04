var userService = require('../../services/userServices/UserServices');

exports.updateUserAttributes = function(req, res){
    let updateAttributes = userService.UpdateUserAttributes(req.headers, req.body, function(err, result){
    if(err)
        res.send(err);
    res.send(result);
  })
}

//uploadImage
//forgotPassword
//changePassword
//resendOTP