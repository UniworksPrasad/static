const Category = require('../models/category');
const SubCategory = require('../models/subcategory');
const Prerequisite = require('../models/prerequisite');
const Tutorial = require('../models/tutorial');
const Admin = require('../models/user');
const User = require('../models/user');
const Area = require('../models/projectArea');
const Material = require('../models/material');
const Tool = require('../models/tool');
const Resource = require('../models/resource');
const Project = require('../models/project');
const MiniCategory = require('../models/miniCategory');
const ProjectPlan = require('../models/projectPlan');
const Milestone = require('../models/milestone');
const ProjectAreaPlan = require('../models/projectAreaPlan');
const Vendor_Supervisor = require('../models/vendor_supervisor');

exports.createUser = function(body, callback){
  Admin.create({
      userName: body.userName,
      role: body.role,
      zip: body.zip,
      agreement: body.agreement,
      contact: body.contact
  }).then(result =>{
          callback(null, result);
      }).catch(err => {
      callback(err);
  })
}

exports.getUser = function(params, callback){
    User.findAll({
        where: {
            userName: params.name
        },
        include: [
          {
            model: Category,
            as: "categories",
            attributes: ["id", "categoryName"],
            through: {
              attributes: [],
            },
            // through: {
            //   attributes: ["tag_id", "tutorial_id"],
            // },
            include :[
                {
                    model: SubCategory,
                    as: "subcategories",
                    attributes: ["id", "subcategoryName"],
                    include: [{
                        model: Prerequisite,
                        as: "prerequisites"
                    },{
                        model: Tutorial,
                        as: "tutorials"
                    }]
                }
            ]
          },
        ],
      }).then(result => {
            callback(null, result);
        }
    ).catch(err => {
        callback(err);
    })
}

exports.createCategory = function(body, callback){
    Category.create({
        categoryName: body.categoryName,

    }).then(result => {
            callback(null, result);
        }
    ).catch(err => {
        callback(err);
    })
}

exports.addCategory = (body, callback) => {
    return User.findByPk(body.userId)
      .then((user) => {
        if (!user) {
          console.log("User not found!");
          error = {
              message: "User not found!"
          }
          return callback(error);
        }
          Category.findByPk(body.categoryId).then((category) => {
              if (!category) {
                console.log("Category not found!");
                error = {
                    message: "Category not found!"
                }
                return callback(error);
              }
              user.addCategory(category).then(result => {
                callback(null, result);
              }).catch(err => {
                  return callback(err);
              });
          });
      })
      .catch((err) => {
        console.log(">> Error while adding Tutorial to Tag: ", err);
        return callback(err);
      });
  };

  exports.listCategory = (body, callback) => {
    return Category.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "userName", "role"],
          through: {
            attributes: [],
          }
        },{
            model: SubCategory,
            as: "subcategories",
            attributes: ["id", "subcategoryName"]
        }
      ],
    })
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.listUser = (body, callback) => {
    return User.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "categoryName"],
          through: {
            attributes: [],
          },
          // through: {
          //   attributes: ["tag_id", "tutorial_id"],
          // },
          include :[{
            model: SubCategory,
            as: "subcategories",
            attributes: ["id", "subcategoryName"]
          }]
        },
      ],
    })
      .then((tutorials) => {
        return callback(null, tutorials);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tutorials: ", err);
        return callback(err);
      });
  };

  exports.listSubCategory = (body, callback) => {
    return SubCategory.findAll({
      include: [
        {
          model: Prerequisite,
          as: "prerequisites",
        },{
            model: Tutorial,
            as: "tutorials"
        }
      ],
    })
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  //All independent data tables

  exports.createArea = function(body, callback){
    Area.create({
        areaName: body.areaName
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createMaterial = function(body, callback){
    Material.create({
        materialName: body.materialName,
        description: body.description,
        imageUrl: body.imageUrl,
        uom: body.uom
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createSubCategory = function(body, callback){
    SubCategory.create({
        subcategoryName: body.subcategoryName,
        description: body.description,
        CategoryId: body.CategoryId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createTutorial = function(body, callback){
    Tutorial.create({
        topicName: body.topicName,
        videoLink: body.videoLink,
        description: body.description,
        SubCategoryId: body.SubCategoryId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createTool = function(body, callback){
    Tool.create({
        toolName: body.toolName
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createResource = function(body, callback){
    Resource.create({
        name: body.name
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createProject = function(body, callback){
    Project.create({
      bookingId: body.bookingId,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      address: body.address,
      zip: body.zip,
      lat: body.lat,
      long: body.long,
      totalArea: body.totalArea,
      areaCompleted: body.areaCompleted,
      budget: body.budget,
      skilled: body.skilled,
      semiSkilled: body.semiSkilled,
      unSkilled: body.unSkilled,
      status: body.status,
      CategoryId: body.CategoryId,
      SubCategoryId: body.SubCategoryId,
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createMiniCategory = function(body, callback){
    MiniCategory.create({
        miniCategoryName: body.miniCategoryName,
        description: body.description,
        predecessor: body.predecessor,
        successor: body.successor,
        SubCategoryId: body.SubCategoryId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createPrerequisite = function(body, callback){
    Prerequisite.create({
        description: body.description,
        SubCategoryId: body.SubCategoryId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createProjectPlan = function(body, callback){
    ProjectPlan.create({
        planUrl: body.planUrl,
        ProjectId: body.ProjectId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createProjectAreaPlan = function(body, callback){
    ProjectAreaPlan.create({
        planUrl: body.planUrl,
        ProjectMiniCategoryAreaId: body.ProjectMiniCategoryAreaId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.createMilestone = function(body, callback){
    Milestone.create({
        milestoneName: body.milestoneName,
        MiniCategoryId: body.MiniCategoryId
    }).then(result =>{
            callback(null, result);
        }).catch(err => {
        callback(err);
    })
  }

  exports.getSiteRequest = function(params, callback){
    let site = class site {
      constructor(project, plans) {
          this.project = project;
          this.plans = plans;
      }
    };
    Project.findByPk(params.projectId,{
        include: [
          {
            model: Category
          },{
              model: SubCategory,
              include: [{
                model: Tool,
                as: "tools"
              }],
          }
        ],
      })
      .then((project) => {
        ProjectPlan.findAll({
          where : {
          ProjectId: params.projectId
        }
      },{
          attributes: ['id', 'planUrl']
        }).then(plans => {
          callback(new site(project, plans));
        }).catch(err => {
          callback(err);
        });
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  }

  exports.getNotifications = function(params, callback){
    var users = [];
    class notification {
      constructor(projects, users) {
          this.projects = projects;
          this.users = users;
      }
    };
    User.findByPk(params.userId,{
        attributes: ['zip']
      })
      .then((output) => {
        console.log(output.zip);
        Project.findAll({
          where : {
          zip: output.zip
        }
      }).then(projects => {
        Vendor_Supervisor.findAll({where : {
          vendorId: params.userId,
          status: "P"
        }}).then(supervisors =>{
          var len = supervisors.length;
          var i;
          for(i = 0; i < len; i++){
            const supervisorNumber = supervisors[i].supervisorId;
            users.push(supervisorNumber);
          }
          User.findAll({where : {
            id: users
          }}).then(result => {
            callback(null, new notification(projects, result));
          }).catch(err => {
            callback(err);
          });
        }).catch(err => {
          callback(err);
        });
      }).catch(err => {
          callback(err);
        });
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  }
  //All indedendent data tables