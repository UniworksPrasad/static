const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
var authMiddleware = require('./middleware/AuthMiddleware');
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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb('only images', false);
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKETNAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, "users-aadhar/" + path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.delete('/auth/user/:contact', authController.delete);
router.post('/auth/validate', authController.validate_token);
router.post('/auth/confirmSignup', authController.confirmSignUp);
router.get('/auth/listUsers', authController.listUsers);
//resent OTP
router.post('/auth/resendOTP', authController.resendOTP);
//forget password
router.post('/auth/forgetPassword', authController.forgetPassword);
//forget password
router.post('/auth/confirmForgetPassword', authController.confirmForgetPassword);
//change password
router.post('/auth/changePassword', authMiddleware.Validate, authController.changePassword);
//upload Image
router.post('/auth/uploadImage', upload.single('aadharImage'), authController.uploadImage);

//router.get('/hello', authMiddleware.Validate, helloController.simple_hello); //to check if the access token is working or not
router.put('/user/updateUserAttributes', authMiddleware.Validate, userControlleraws.updateUserAttributes);

router.put('/user/updateAttributes', authMiddleware.Validate, authController.updateAttributes);

///////////////////////////////////////////////////////////////////////////////////////////////////
const userController = require('./controllers/userController');

router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.get('/user', userController.listUser);
router.get('/user/supervisors/:id', userController.listSupervisors);
router.get('/user/profile/:contact', userController.getUser);
router.delete('/user/:contact', userController.deleteUser);
router.put('/addsupervisor', userController.addSupervisor);
router.delete('/removesupervisor', userController.removeSupervisor);
router.post('/requestsupervisor', userController.requestSupervisor);
router.post('/category', userController.createCategory);
router.put('/category/:id', userController.updateCategory);
router.post('/vendor/addcategory', userController.addCategoryToVendor);
router.delete('/removecategory', userController.removeCategory);
router.get('/category', userController.listCategory);
router.get('/vendor/:contact', userController.getVendor);
//router.get('/vendor/:contact', authMiddleware.Validate, userController.getVendor);
router.post('/subcategory', userController.createSubCategory);
router.get('/subcategory', userController.listSubCategory);
router.get('/supervisor/:projectId', userController.getSupProjectDetails);


router.post('/area', userController.createArea);
router.post('/material', userController.createMaterial);
router.post('/tutorial', userController.createTutorial);
router.post('/tool', userController.createTool);
router.post('/resource', userController.createResource);
router.post('/project', userController.createProject);
router.get('/project/:id', userController.getProject);
router.post('/minicategory', userController.createMiniCategory);
router.post('/prerequisite', userController.createPrerequisite);
router.post('/projectplan', userController.createProjectPlan);
router.post('/projectareaplan', userController.createProjectAreaPlan);
router.post('/milestone', userController.createMilestone);

router.get('/area', userController.getArea);
router.get('/material', userController.getMaterial);
router.get('/tutorial', userController.getTutorial);
router.get('/tool', userController.getTool);
router.get('/resource', userController.getResource);
router.get('/project', userController.getProject);
router.get('/minicategory', userController.getMiniCategory);
router.get('/prerequisite', userController.getPrerequisite);
router.get('/projectplan', userController.getProjectPlan);
router.get('/projectareaplan', userController.getProjectAreaPlan);
router.get('/milestone', userController.getMilestone);

//Get route with specific ID

// router.get('/area/:id', userController.getAreaById);
router.get('/material/:id', userController.getMaterialById);
router.get('/tutorial/:id', userController.getTutorialById);
router.get('/tool/:id', userController.getToolById);
router.get('/resource/:id', userController.getResourceById);
router.get('/project/:id', userController.getProjectById);
router.get('/minicategory/:id', userController.getMiniCategoryById);
router.get('/prerequisite/:id', userController.getPrerequisiteById);
router.get('/projectplan/:id', userController.getProjectPlanById);
router.get('/projectareaplan/:id', userController.getProjectAreaPlanById);
router.get('/milestone/:id', userController.getMilestoneById);
//router.get('/siteRequest/:projectId', userController.siteRequest);
//router.get('/getSupervisors/:vendorId', userController.getSupervisors);
///siteRequest/:projectId
router.get('/siteRequest/:projectId', userController.getSiteRequest);
router.get('/notifications/:userId', userController.getNotifications);

router.get('/vendor/hello')
router.get('/supervisor/hello')
router.get('/customer/hello')
router.get('/admin/hello')

/////////////////////////////////////////////////////////////////////////////////////////////
//Authorized Route
router.get('/area/:id', userController.getAreaById);

module.exports = router;