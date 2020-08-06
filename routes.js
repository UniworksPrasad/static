const express = require('express');
const router = express.Router();
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
require('dotenv').config();

const s3 = new aws.S3({
    accessKeyId: process.env.AWSACCESSKEYID,
    secretAccessKey: process.env.AWSSECRETACCESSKEY,
    Bucket: process.env.BUCKETNAME
});

var authController = require('./controllers/authControllers/AuthController')
var authMiddleware = require('./middleware/AuthMiddleware');
//var helloController = require('./controllers/userControllers/HelloController');
var userControlleraws = require('./controllers/userControllers/UserController');

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb('only images' , false);
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKETNAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, "users-aadhar/" + path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
        }
    }),
    limits: {
    fileSize: 1024*1024*5 
    }, 
    fileFilter: fileFilter
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.delete('/auth/user', authController.delete);
router.post('/auth/validate', authController.validate_token);
router.post('/auth/confirmSignup', authController.confirmSignUp);
router.get('/auth/listUsers', authController.listUsers);
//resent OTP
router.post('/auth/resendOTP', authController.resendOTP);
//forget password
router.post('/auth/forgetPassword', authController.forgetPassword);
//change password
router.post('/auth/changePassword', authMiddleware.Validate , authController.changePassword);
//upload Image
router.post('/auth/uploadImage', upload.single('aadharImage'), authController.uploadImage);

//router.get('/hello', authMiddleware.Validate, helloController.simple_hello); //to check if the access token is working or not
router.put('/user/updateUserAttributes', authMiddleware.Validate, userControlleraws.updateUserAttributes);

router.put('/user/updateAttributes', authMiddleware.Validate, authController.updateAttributes);

///////////////////////////////////////////////////////////////////////////////////////////////////
const userController = require('./controllers/userController');

router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.put('/addsupervisor', userController.addSupervisor);
router.delete('/removesupervisor', userController.removeSupervisor);
router.post('/requestsupervisor', userController.requestSupervisor);
router.post('/category', userController.createCategory);
router.put('/category/:id', userController.updateCategory);
router.post('/addcategory', userController.addCategory);
router.get('/category', userController.listCategory);
router.get('/user', userController.listUser);
router.get('/user/:name', userController.getUser);
router.post('/subcategory', userController.createSubCategory);
router.get('/subcategory', userController.listSubCategory);
router.get('/supervisor/:projectId', userController.getSupProjectDetails);


router.post('/area', userController.createArea);
router.post('/material', userController.createMaterial);
router.post('/tutorial', userController.createTutorial);
router.post('/tool', userController.createTool);
router.post('/resource', userController.createResource);
router.post('/project', userController.createProject);
router.post('/minicategory', userController.createMiniCategory);
router.post('/prerequisite', userController.createPrerequisite);
router.post('/projectplan', userController.createProjectPlan);
router.post('/projectareaplan', userController.createProjectAreaPlan);
router.post('/milestone', userController.createMilestone);

//router.get('/siteRequest/:projectId', userController.siteRequest);
//router.get('/getSupervisors/:vendorId', userController.getSupervisors);
///siteRequest/:projectId
router.get('/siteRequest/:projectId', userController.getSiteRequest);
router.get('/notifications/:userId', userController.getNotifications);

/////////////////////////////////////////////////////////////////////////////////////////////



module.exports = router;