const Category = require('../models/category');
const SubCategory = require('../models/subcategory');
const Prerequisite = require('../models/prerequisite');
const Tutorial = require('../models/tutorial');
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
const Project_MiniCategory = require('../models/project_miniCategory');
const Project_MiniCategory_Area = require('../models/project_miniCategory_area');

exports.createUser = function(body, callback){
  User.create({
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

exports.updateUser = function(params, body, callback){
  User.findAll({where : {userName: body.userName}}).then(user => {
    user[0].userName = body.userName,
    user[0].contact = body.contact,
    user[0].role = body.role,
    user[0].emergencyContact = body.emergencyContact;
    user[0].email = body.email;
    user[0].state = body.state;
    user[0].area = body.area;
    user[0].street = body.street;
    user[0].building = body.building;
    user[0].flat = body.flat;
    user[0].lat = body.lat;
    user[0].long = body.long;
    user[0].agreement = body.agreement;
    user[0].status = body.status;
    user[0].accountNum = body.accountNum;
    user[0].IFSC = body.IFSC;
    user[0].accountHolder = body.accountHolder;
    user[0].PAN = body.PAN;
    user[0].aadharLink = body.aadharLink;
    user[0].GSTIN = body.GSTIN;
    user[0].save().then(result => {
      callback(result);
    }).catch(err => {
      callback(err);
    });
  }).catch(err => {
    callback(err);
  });
}

exports.updateCategory = function(params, body, callback){
  Category.findByPk(params.id).then(category =>{
    category.categoryName = body.categoryName;
    category.save().then(result=> {callback(null, result)}).catch(err => {callback(err)});
  }).catch(err=> {callback(err)});
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

exports.deleteUser = function(params, callback){
  User.destroy({
    where: {
       id: params.id //this will be your id that you want to delete
    }
 }).then(result => {
   success = {
     message: "User with userid: "+params.id+" deleted successfully"
   }
   console.log(result);
   callback(null, success);
 }).catch(err => {
   callback(err);
 });
}

exports.createCategory = function(body, callback){
    Category.create({
        categoryName: body.categoryName,
    }).then(result => {
      console.log(result);
      callback(null, result);
    }).catch(err => {
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
        SubCategoryId: body.SubCategoryId,
        thumbnail: body.thumbnail
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
      constructor(projects, supervisors) {
          this.projects = projects;
          this.supervisors = supervisors;
      }
    };
    Vendor_Supervisor.findAll({
      where: {
        vendorId: params.userId
      }
    }).then().catch();
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

  exports.getArea = (params, callback) => {
    return Area.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getMaterial = (params, callback) => {
    return Material.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getTutorial = (params, callback) => {
    return Tutorial.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getTool = (params, callback) => {
    return Tool.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getResource = (params, callback) => {
    return Resource.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getProject = (params, callback) => {
    return Project.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getMiniCategory = (params, callback) => {
    return MiniCategory.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getPrerequisite = (params, callback) => {
    return Prerequisite.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getProjectPlan = (params, callback) => {
    return ProjectPlan.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getProjectAreaPlan = (params, callback) => {
    return ProjectAreaPlan.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };

  exports.getMilestone = (params, callback) => {
    return Milestone.findAll()
      .then((tags) => {
        return callback(tags);
      })
      .catch((err) => {
        console.log(">> Error while retrieving Tags: ", err);
        callback(err);
      });
  };