require('dotenv').config();
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var routes = require('./routes');
const connection = require('./utils/connection');
const Category = require('./models/category');
const SubCategory = require('./models/subcategory');
const Prerequisite = require('./models/prerequisite');
const Tutorial = require('./models/tutorial');
const ProjectIssue = require('./models/projectIssue');
const ProjectIssueComment = require('./models/projectIssueComment');
const ProjectPlan = require('./models/projectPlan');
const Project = require('./models/project');
const Project_MiniCategory = require('./models/project_miniCategory');
const Project_MiniCategory_Area = require('./models/project_miniCategory_area');
const Material = require('./models/material');
const MiniCategory = require('./models/miniCategory');
const Milestone = require('./models/milestone');
const Tool = require('./models/tool');
const Resource = require('./models/resource');
const Area = require('./models/projectArea');
const Project_MiniCategory_Area_Milestone = require('./models/project_mini_area_mile');
const ProjectAreaIssue = require('./models/projectAreaIssue');
const ProjectAreaPlan = require('./models/projectAreaPlan');
const ProjectAreaIssueComment = require('./models/projectAreaIssueComment');
const SubCategory_Tool = require('./models/subcategory_tool');
const SubCategory_Resource = require('./models/subcategory_resource');
const MiniCategory_Material = require('./models/minicategory_material');
const ConstructVend_Category = require('./models/constructVend_category');
const Project_User = require('./models/project_user');
const User = require('./models/user');
const Vendor_Supervisor = require('./models/vendor_supervisor');

connection
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

User.belongsToMany(Category, { through: ConstructVend_Category, as: 'categories', foreignKey: "userId" }, {onDelete: 'cascade'});
Category.belongsToMany(User, { through: ConstructVend_Category, as: 'constructionVendors', foreignKey: "categoryId" }, {onDelete: 'cascade'});

User.belongsToMany(User, {through: Vendor_Supervisor, as: 'supervisors', foreignKey: "vendorId"}, {onDelete: 'cascade'});
User.belongsToMany(User, {through: Vendor_Supervisor, as: 'vendors', foreignKey: "supervisorId"}, {onDelete: 'cascade'});

Category.hasMany(SubCategory, { as: "subcategories" }, {onDelete: 'cascade'});
SubCategory.belongsTo(Category);

SubCategory.hasMany(Prerequisite, { as: "prerequisites" }, {onDelete: 'cascade'});
Prerequisite.belongsTo(SubCategory);

SubCategory.hasMany(Tutorial, { as: "tutorials" }, {onDelete: 'cascade'});
Tutorial.belongsTo(SubCategory);

Project.hasMany(ProjectIssue, {as: "projectIssues"}, {onDelete: 'cascade'});
ProjectIssue.belongsTo(Project);

ProjectIssue.hasMany(ProjectIssueComment, {as: "comments"}, {onDelete: 'cascade'});
ProjectIssueComment.belongsTo(ProjectIssue);

User.hasMany(ProjectIssueComment, {as: "projectcomments"}, {onDelete: 'cascade'});
ProjectIssueComment.belongsTo(User);

SubCategory.hasMany(MiniCategory, {as: "miniCategories"}, {onDelete: 'cascade'});
MiniCategory.belongsTo(SubCategory);

SubCategory.belongsToMany(Tool, { through: SubCategory_Tool, as: 'tools', foreignKey: "subcategoryId" }, {onDelete: 'cascade'});
Tool.belongsToMany(SubCategory, { through: SubCategory_Tool, as: 'subcategories', foreignKey: "toolId" }, {onDelete: 'cascade'});

SubCategory.belongsToMany(Resource, { through: SubCategory_Resource, as: 'subcategoryresources', foreignKey: "subcategoryId" }, {onDelete: 'cascade'});
Resource.belongsToMany(SubCategory, { through: SubCategory_Resource, as: 'resourcesubcategories', foreignKey: "resourceId" }, {onDelete: 'cascade'});

MiniCategory.hasMany(Milestone, {as: "milestones"}, {onDelete: 'cascade'});
Milestone.belongsTo(MiniCategory);

MiniCategory.belongsToMany(Material, { through: MiniCategory_Material, as: 'minicategorymaterials', foreignKey: "minicategoryId" }, {onDelete: 'cascade'});
Material.belongsToMany(MiniCategory, { through: MiniCategory_Material, as: 'materialminicategories', foreignKey: "materialId" }, {onDelete: 'cascade'});

Project.hasMany(ProjectPlan, {as: "projectplans"}, {onDelete: 'cascade'});
ProjectPlan.belongsTo(Project);

Project.belongsToMany(MiniCategory, { through: Project_MiniCategory, as: 'projectminicategories', foreignKey: "projectId" }, {onDelete: 'cascade'});
MiniCategory.belongsToMany(Project, { through: Project_MiniCategory, as: 'minicategoryprojects', foreignKey: "minicategoryId" }, {onDelete: 'cascade'});

//Project.belongsTo(Category, { as: 'category' });
Category.hasOne(Project);
Project.belongsTo(Category);

SubCategory.hasOne(Project);
Project.belongsTo(SubCategory);
//Project.belongsTo(SubCategory, { as: 'subcategory' });

Project.belongsToMany(User, { through: Project_User, as: 'users', foreignKey: "projectId" }, {onDelete: 'cascade'});
User.belongsToMany(Project, { through: Project_User, as: 'projects', foreignKey: "userId" }, {onDelete: 'cascade'});

Project_MiniCategory.belongsToMany(Area, { through: Project_MiniCategory_Area, as: 'projectminicategoryareas', foreignKey: "projectMiniCategoryId" });
Area.belongsToMany(Project_MiniCategory, { through: Project_MiniCategory_Area, as: 'areaprojectminicategories', foreignKey: "areaId" });

Project_MiniCategory_Area.belongsToMany(Milestone, { through: Project_MiniCategory_Area_Milestone, as: 'projectminicategoryareamilestones', foreignKey: "projectMiniAreaId" });
Milestone.belongsToMany(Project_MiniCategory_Area, { through: Project_MiniCategory_Area_Milestone, as: 'milestoneprojectminicategories', foreignKey: "milestoneId" });

Project_MiniCategory_Area.hasMany(ProjectAreaPlan, {as: "projectminicategoryareaplans"});
ProjectAreaPlan.belongsTo(Project_MiniCategory_Area);

Project_MiniCategory_Area.hasMany(ProjectAreaIssue, {as: "projectminicategoryareaissues"});
ProjectAreaIssue.belongsTo(Project_MiniCategory_Area);

ProjectAreaIssue.hasMany(ProjectAreaIssueComment, {as: "projectareacomments"});
ProjectAreaIssueComment.belongsTo(ProjectAreaIssue);

User.hasMany(ProjectAreaIssueComment, {as: "projectareacomments"}, {onDelete: 'cascade'});
ProjectAreaIssueComment.belongsTo(User);

connection.sync({force: false}).then(result=>{
    console.log("Database synched successfully!!!");
}).catch(err=>{
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);
	
module.exports = app;
