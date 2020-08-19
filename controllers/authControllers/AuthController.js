var authService = require('../../services/authServices/AuthServices');

exports.register = function (req, res) {
    console.log("In the controller");
    let register = authService.Register(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.confirmSignUp = function (req, res) {
    let confirmSignUp = authService.ConfirmSignUp(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.status(200).json({
            accessToken: result
        });
    })
}

exports.listUsers = function (req, res) {
    let listUsers = authService.ListUsers(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.login = function (req, res) {
    let login = authService.Login(req.body, function (err, result) {
        if (err)
            res.send(err)
        res.send(result);
    })
}

exports.delete = function (req, res) {
    let login = authService.Delete(req.headers, req.params, function (err, result) {
        if (err)
            res.send(err)
        res.send(result);
    })
}

exports.validate_token = function (req, res) {
    let validate = authService.Validate(req.body.token, function (err, result) {
        if (err)
            res.send(err.message);
        res.send(result);
    })
}

exports.resendOTP = function (req, res) {
    let OTP = authService.ResendOTP(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.forgetPassword = function (req, res) {
    let password = authService.ForgetPassword(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.confirmForgetPassword = function (req, res) {
    let password = authService.ConfirmForgetPassword(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.changePassword = function (req, res) {
    let password = authService.ChangePassword(req.body, req.headers['authorization'], function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })

}

exports.updateAttributes = function (req, res) {
    let password = authService.UpdateAttributes(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.uploadImage = function (req, res) {
    res.send({
        link: req.file.location
    });
}