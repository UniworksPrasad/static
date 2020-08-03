const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');

router.post('/user', userController.createUser);

router.post('/category', userController.createCategory);
router.post('/addcategory', userController.addCategory);
router.get('/category', userController.listCategory);
router.get('/user', userController.listUser);
router.get('/user/:name', userController.getUser);
router.post('/subcategory', userController.createSubCategory);
router.get('/subcategory', userController.listSubCategory);


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

module.exports = router;