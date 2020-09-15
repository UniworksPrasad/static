const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const {check} = require('express-validator');
const validate = require('./middleware/validate');
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

router.post('/auth/register', [
    check('Username').notEmpty().withMessage('Username is required'),
    check('Password').notEmpty().withMessage('Password is required'),
], validate, authController.register);
router.post('/auth/login', [
    check('Username').notEmpty().withMessage('Username is required'),
    check('Password').notEmpty().withMessage('Password is required'),
], validate, authController.login);
router.delete('/auth/user/:contact', authController.delete);
router.post('/auth/validate', authController.validate_token);
router.post('/auth/confirmSignup', [ 
    check('Username').notEmpty().withMessage('Username is required'),
    check('ConfirmationCode').notEmpty().isNumeric().withMessage('ConfirmationCode is required'),
    check('Password').notEmpty().withMessage('Password is required'),
], validate, authController.confirmSignUp);
router.get('/auth/listUsers', authController.listUsers);
//resent OTP
router.post('/auth/resendOTP', [ 
    check('Username').notEmpty().withMessage('Username is required'),
], validate, authController.resendOTP);
//forget password
router.post('/auth/forgetPassword', [ 
    check('Username').notEmpty().withMessage('New Password is required'),
], validate, authController.forgetPassword);
//forget password
router.post('/auth/confirmForgetPassword', [ 
    check('Username').notEmpty().withMessage('Username is required'),
    check('ConfirmationCode').notEmpty().isNumeric().withMessage('ConfirmationCode is required'),
    check('Password').notEmpty().withMessage('Password is required'),
], validate, authController.confirmForgetPassword);
//change password
router.post('/auth/changePassword', [ 
    check('ProposedPassword').notEmpty().withMessage('New Password is required'),
    check('PreviousPassword').notEmpty().withMessage('Previous Password is required'),
], validate, authMiddleware.Validate, authController.changePassword);
//upload Image
router.post('/auth/uploadImage', upload.single('aadharImage'), authController.uploadImage);

//router.get('/hello', authMiddleware.Validate, helloController.simple_hello); //to check if the access token is working or not
router.put('/user/updateUserAttributes', authMiddleware.Validate, userControlleraws.updateUserAttributes);

router.put('/user/updateAttributes', authMiddleware.Validate, authController.updateAttributes);

///////////////////////////////////////////////////////////////////////////////////////////////////
const userController = require('./controllers/userController');
//create User
router.post('/user', [ 
    check('userName').notEmpty().withMessage('Username is required'),
    check('role').notEmpty().withMessage('Role is required'),
    check('zip').notEmpty().withMessage('Zip code is required'),
    check('zip').isNumeric().withMessage('Zip code is not Valid'),
    check('agreement').notEmpty().withMessage('Agreement is required'),
    check('contact').notEmpty().withMessage('Contact Number is required'),
    check('contact').isNumeric().withMessage('Contact Number is not Valid'),
], validate, userController.createUser);

router.put('/user/:id', userController.updateUser);
router.get('/user', userController.listUser);
router.get('/user/supervisors/:id', userController.listSupervisors);
router.get('/user/profile/:contact', userController.getUser);
router.delete('/user/:contact', userController.deleteUser);
router.put('/addsupervisor', userController.addSupervisor);
router.delete('/removesupervisor', userController.removeSupervisor);
router.post('/requestsupervisor', userController.requestSupervisor);

router.post('/category', [ 
    check('categoryName').notEmpty().withMessage('categoryName is required'),
], validate, userController.createCategory);

router.put('/category/:id', userController.updateCategory);
router.post('/vendor/addcategory', userController.addCategoryToVendor);
router.delete('/removecategory', userController.removeCategory);
router.get('/category', userController.listCategory);
router.get('/vendor/:contact', userController.getVendorHome);
router.get('/supervisor/:contact', userController.getSupervisorHome);
//router.get('/vendor/:contact', authMiddleware.Validate, userController.getVendor);
router.post('/subcategory', userController.createSubCategory);
router.get('/subcategory', userController.listSubCategory);
router.get('/supervisor/:projectId', userController.getSupProjectDetails);

//Project 
router.get('/vendor/project/:projectId', userController.getAllProjectDetails);
//Project Area
router.get('/vendor/projectArea/:projectId', userController.getAllVendorProjectDetails);
router.get('/vendor/projectArea/:projectId/:areaId', userController.getVendorProjectDetails);


router.post('/area', [ 
    check('areaName').notEmpty().withMessage('areaName is required'),
], validate, userController.createArea);

router.post('/material',[ 
    check('materialName').notEmpty().withMessage('materialName is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('imageUrl').notEmpty().withMessage('imageUrl is required'),
    check('uom').notEmpty().withMessage('uom is required'),
], validate, userController.createMaterial);

router.post('/tutorial',[ 
    check('topicName').notEmpty().withMessage('topicName is required'),
    check('videoLink').notEmpty().withMessage('videoLink is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('SubCategoryId').notEmpty().withMessage('SubCategoryId is required'),
], validate, userController.createTutorial);

router.post('/tool',[ 
    check('toolName').notEmpty().withMessage('toolName is required'),
], validate, userController.createTool);

router.post('/resource',[ 
    check('name').notEmpty().withMessage('name is required'),
], validate, userController.createResource);

router.post('/project',[ 
    check('bookingId').notEmpty().withMessage('bookingId is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('startDate').notEmpty().withMessage('startDate is required'),
    check('endDate').notEmpty().withMessage('bookingId is required'),
    check('address').notEmpty().withMessage('address is required'),
    check('zip').notEmpty().withMessage('zip is required'),
    check('lat').notEmpty().withMessage('lat is required'),
    check('long').notEmpty().withMessage('long is required'),
    check('totalArea').notEmpty().withMessage('totalArea is required'),
    check('budget').notEmpty().withMessage('budget is required'),
    check('skilled').notEmpty().withMessage('skilled is required'),
    check('semiSkilled').notEmpty().withMessage('semiSkilled is required'),
    check('unSkilled').notEmpty().withMessage('unSkilled is required'),
    check('status').notEmpty().withMessage('status is required'),
    check('CategtoryId').notEmpty().withMessage('CategtoryId is required'),
    check('SubCagtegoryId').notEmpty().withMessage('SubCagtegoryId is required'),
], validate, userController.createProject);

router.get('/project/:id', userController.getProject);
router.put('/project/:id', userController.updateProject);

router.post('/minicategory',[ 
    check('miniCategoryName').notEmpty().withMessage('miniCategoryName is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('predecessor').notEmpty().withMessage('predecessor is required'),
    check('successor').notEmpty().withMessage('successor is required'),
    check('SubCategoryId').notEmpty().withMessage('SubCategoryId is required'),
], validate, userController.createMiniCategory);

router.post('/prerequisite',[ 
    check('description').notEmpty().withMessage('description is required'),
    check('SubCategoryId').notEmpty().withMessage('SubCategoryId is required'),
], validate, userController.createPrerequisite);

router.post('/projectplan',[ 
    check('planUrl').notEmpty().withMessage('planUrl is required'),
    check('ProjectId').notEmpty().withMessage('ProjectId is required'),
], validate, userController.createProjectPlan);

router.post('/projectareaplan',[ 
    check('planUrl').notEmpty().withMessage('categoryName is required'),
    check('ProjectMiniCategoryAreaId').notEmpty().withMessage('ProjectMiniCategoryAreaId is required'),
], validate, userController.createProjectAreaPlan);

router.post('/milestone',[ 
    check('milestoneName').notEmpty().withMessage('milestoneName is required'),
    check('MiniCategoryId').notEmpty().withMessage('MiniCategoryId is required'),
], validate, userController.createMilestone);

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
router.get('/supervisor/notifications/:userId', userController.getSupervisorNotifications);

router.get('/vendor/hello')
router.get('/supervisor/hello')
router.get('/customer/hello')
router.get('/admin/hello')

/////////////////////////////////////////////////////////////////////////////////////////////
//Authorized Route
router.get('/area/:id', userController.getAreaById);

module.exports = router;