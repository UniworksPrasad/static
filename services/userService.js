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
const ProjectAreaMiniMiles = require('../models/project_area_mini_mile');


const {
  Op
} = require("sequelize");
const Project_User = require('../models/project_user');
const ConstructVend_Category = require('../models/constructVend_category');
const Project_Area = require('../models/project_area');
const Project_Area_Mini_Mile = require('../models/project_area_mini_mile');
const Project_Area_Minicategory = require('../models/project_area_minicategory');
const {
  ElastiCache
} = require('aws-sdk');

exports.createUser = function (body, callback) {
  User.create({
    userName: body.userName,
    role: body.role,
    zip: body.zip,
    agreement: body.agreement,
    contact: body.contact
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.updateUser = function (params, body, callback) {
  User.findAll({
    where: {
      contact: body.contact
    }
  }).then(user => {
    user[0].userName = body.userName,
      user[0].name = body.name,
      user[0].role = body.role,
      user[0].contact = body.contact,
      user[0].emergencyContact = body.emergencyContact;
    user[0].email = body.email;
    user[0].state = body.state;
    user[0].city = body.city;
    user[0].area = body.area;
    user[0].street = body.street;
    user[0].building = body.building;
    user[0].flat = body.flat;
    user[0].zip = body.zip;
    user[0].lat = body.lat;
    user[0].long = body.long;
    user[0].agreement = body.agreement;
    user[0].status = body.status;
    user[0].accountNum = body.accountNum;
    user[0].IFSC = body.IFSC;
    user[0].accountHolder = body.accountHolder;
    user[0].PAN = body.PAN;
    user[0].aadharNum = body.aadharNum;
    user[0].aadharLink = body.aadharLink;
    user[0].GSTIN = body.GSTIN;
    user[0].save().then(result => {
      if (body.role == "CSVD") {
        Vendor_Supervisor.findAll({
          where: {
            supervisorId: user[0].id
          }
        }).then(entry => {
          if (entry.length == 0) {
            Vendor_Supervisor.create({
              vendorId: user[0].id,
              supervisorId: user[0].id,
              status: "C"
            }).then(callback(null, result)).catch(err => {
              callback(err);
            });
          } else
            callback(null, result);
        }).catch(err => {
          callback(err);
        })
      } else
        callback(null, result);
    }).catch(err => {
      callback(err);
    });
  }).catch(err => {
    callback(err);
  });
}

exports.updateCategory = function (params, body, callback) {
  Category.findByPk(params.id).then(category => {
    category.categoryName = body.categoryName;
    category.save().then(result => {
      callback(null, result)
    }).catch(err => {
      callback(err)
    });
  }).catch(err => {
    callback(err)
  });
}

exports.getVendor = function (params, callback) {
  class Vendordetails {
    constructor(vendor, categorydetails) {
      this.vendor = vendor;
      this.categorydetails = categorydetails;
    }
  };

  User.findAll({
      where: {
        contact: params.contact
      }
    })
    .then((user) => {
      console.log(user);
      ConstructVend_Category.findAll({
        where: {
          userId: user[0].id
        }
      }).then(results => {
        var array = [];
        results.forEach(element => {
          array.push(element.categoryId);
        });
        console.group(array);
        Category.findAll({
          where: {
            id: array
          },
          include: [{
            model: SubCategory,
            as: "subcategories",
            include: [{
                model: Tutorial,
                as: "tutorials"
              },
              {
                model: Prerequisite,
                as: "prerequisites"
              }
            ]
          }]
        }).then(output => {
          User.findByPk(results[0].userId).then(user => {
            callback(null, new Vendordetails(user, output))
          }).catch();
        }).catch(err => {
          callback(err)
        });
      }).catch(err => {
        callback(err)
      });
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tutorials: ", err);
      return callback(err);
    });
}

exports.getUser = function (params, callback) {
  User.findAll({
      where: {
        contact: params.contact
      },
      include: [{
        all: true
      }]
    }).then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tutorials: ", err);
      return callback(err);
    });
}

exports.deleteUser = function (params, callback) {
  User.destroy({
    where: {
      contact: params.contact //this will be your id that you want to delete
    }
  }).then(result => {
    success = {
      message: "User with userid: " + params.contact + " deleted successfully"
    }
    callback(null, success);
  }).catch(err => {
    callback(err);
  });
}

exports.addSupervisor = (body, callback) => {
  Vendor_Supervisor.findAll({
    where: {
      vendorId: body.vendorId,
      supervisorId: body.supervisorId
    }
  }).then(results => {
    results[0].status = "C";
    results[0].save().then(output => {
      callback(null, output);
    }).catch(err => {
      callback(err);
    });
  }).catch(err => {
    callback(err);
  });
};

exports.removeSupervisor = function (body, callback) {
  Vendor_Supervisor.destroy({
    where: {
      vendorId: body.vendorId,
      supervisorId: body.supervisorId
    }
  }).then(result => {
    var success = {
      message: "Mapping removed successfully"
    };
    callback(null, success);
  }).catch(err => {
    callback(err);
  })
}

exports.requestSupervisor = function (body, callback) {
  return User.findAll({
      where: {
        contact: body.vendorContact
      }
    })
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        error = {
          message: "User not found!"
        }
        return callback(error);
      }
      User.findByPk(body.supervisorId).then((supervisor) => {
        if (!supervisor) {
          console.log("Supervisor not found!");
          error = {
            message: "Supervisor not found!"
          }
          return callback(error);
        }
        Vendor_Supervisor.create({
          vendorId: user[0].id,
          supervisorId: supervisor.id,
          status: "P"
        }).then(result => {
          callback(null, result);
        }).catch(err => {
          return callback(err);
        });
      });
    })
    .catch((err) => {
      return callback(err);
    });
}

exports.createCategory = function (body, callback) {
  Category.create({
    categoryName: body.categoryName,
  }).then(result => {
    console.log(result);
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.addCategoryToVendor = function (body, callback) {
  return User.findByPk(body.userId)
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        error = {
          message: "User not found!"
        }
        return callback(error);
      }
      Category.findAll({
        where: {
          id: body.categories
        }
      }).then((output) => {
        if (output.length < body.categories.length) {
          console.log("One or more categories not found!");
          error = {
            message: "One or more categories not found!"
          }
          return callback(error);
        }
        output.forEach(element => {
          user.addCategory(element).then().catch(err => {
            callback(err);
          });
        })
        var success = {
          message: "All categories have been added successfully"
        }
        callback(null, success);
      }).catch(err => {
        return callback(err);
      });
    })
    .catch((err) => {
      console.log(">> Error while adding categories to user ", err);
      return callback(err);
    });
};

exports.removeCategory = (body, callback) => {
  ConstructVend_Category.destroy({
    where: {
      userId: body.userId,
      categoryId: {
        [Op.or]: body.categories
      }
    }
  }).then(result => {
    var success = {
      message: result + " categories unmapped successfully"
    }
    callback(null, success);
  }).catch(err => {
    callback(err);
  });
}

exports.listCategory = (body, callback) => {
  return Category.findAll({
      include: [{
        model: SubCategory,
        as: "subcategories",
        attributes: ["id", "subcategoryName"],
        include: [{
            model: Tutorial,
            as: "tutorials"
          },
          {
            model: Prerequisite,
            as: "prerequisites"
          }
        ]
      }],
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
      include: [{
        model: Category,
        as: "categories",
        attributes: ["id", "categoryName"],
        through: {
          attributes: [],
        },
        // through: {
        //   attributes: ["tag_id", "tutorial_id"],
        // },
        include: [{
          model: SubCategory,
          as: "subcategories",
          attributes: ["id", "subcategoryName"]
        }]
      }, ],
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
    include: [{
      model: Prerequisite,
      as: "prerequisites",
    }, {
      model: Tutorial,
      as: "tutorials"
    }],
  })
}

exports.createTutorial = function (body, callback) {
  Tutorial.create({
    topicName: body.topicName,
    videoLink: body.videoLink,
    description: body.description,
    SubCategoryId: body.SubCategoryId,
    thumbnail: body.thumbnail
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  });
};

//All independent data tables

exports.createArea = function (body, callback) {
  Area.create({
    areaName: body.areaName
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createMaterial = function (body, callback) {
  Material.create({
    materialName: body.materialName,
    description: body.description,
    imageUrl: body.imageUrl,
    uom: body.uom
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createSubCategory = function (body, callback) {
  SubCategory.create({
    subcategoryName: body.subcategoryName,
    description: body.description,
    CategoryId: body.CategoryId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createTutorial = function (body, callback) {
  Tutorial.create({
    topicName: body.topicName,
    videoLink: body.videoLink,
    description: body.description,
    SubCategoryId: body.SubCategoryId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createTool = function (body, callback) {
  Tool.create({
    toolName: body.toolName,
    imageUrl: body.imageUrl,
    description: body.description
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createResource = function (body, callback) {
  Resource.create({
    name: body.name
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createProject = function (body, callback) {
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
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createMiniCategory = function (body, callback) {
  MiniCategory.create({
    miniCategoryName: body.miniCategoryName,
    description: body.description,
    predecessor: body.predecessor,
    successor: body.successor,
    SubCategoryId: body.SubCategoryId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createPrerequisite = function (body, callback) {
  Prerequisite.create({
    description: body.description,
    SubCategoryId: body.SubCategoryId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createProjectPlan = function (body, callback) {
  ProjectPlan.create({
    planUrl: body.planUrl,
    ProjectId: body.ProjectId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createProjectAreaPlan = function (body, callback) {
  ProjectAreaPlan.create({
    planUrl: body.planUrl,
    ProjectMiniCategoryAreaId: body.ProjectMiniCategoryAreaId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.createMilestone = function (body, callback) {
  Milestone.create({
    milestoneName: body.milestoneName,
    MiniCategoryId: body.MiniCategoryId
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getSiteRequest = function (params, callback) {
  let site = class site {
    constructor(project, plans) {
      this.project = project;
      this.plans = plans;
    }
  };
  Project.findByPk(params.projectId, {
      include: [{
        model: Category
      }, {
        model: SubCategory,
        include: [{
          model: Tool,
          as: "tools"
        }],
      }],
    })
    .then((project) => {
      ProjectPlan.findAll({
        where: {
          ProjectId: params.projectId
        }
      }, {
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

//getSupervisorNotifications

exports.getSupervisorNotifications = function (params, callback) {
  Project_User.findAll({
    where: {
      id: params.userId
    }
  }).then(projects => {
    var projectIdArray = [];
    projects.forEach(element => {
      projectIdArray.push(element.projectId);
    });
    console.log(projectIdArray);
    Project.findAll({
      where: {
        id: projectIdArray,
        [Op.not]: {
          status: "F"
        }
      }
    }).then(projects => {
      callback(null, projects);
    }).catch(err => {
      callback(err)
    });
  }).catch(err => callback(err));
}


exports.getNotifications = function (params, callback) {
  var users = [];
  class notification {
    constructor(siterequests, supervisors, restallprojects) {
      this.siterequests = siterequests;
      this.supervisors = supervisors;
      this.restallprojects = restallprojects;
    }
  };
  Vendor_Supervisor.findAll({
    where: {
      vendorId: params.userId
    }
  }).then().catch();
  User.findByPk(params.userId, {
      attributes: ['zip']
    })
    .then((output) => {
      console.log(output.zip);
      Project.findAll({
        where: {
          zip: output.zip,
          status: "I"
        }
      }).then(siterequests => {
        Vendor_Supervisor.findAll({
          where: {
            vendorId: params.userId,
            status: "P"
          }
        }).then(supervisors => {
          var len = supervisors.length;
          var i;
          for (i = 0; i < len; i++) {
            const supervisorNumber = supervisors[i].supervisorId;
            users.push(supervisorNumber);
          }
          User.findAll({
            where: {
              id: users
            }
          }).then(supervisors => {
            Project_User.findAll({
              where: {
                id: params.userId
              }
            }).then(projects => {
              var projectIdArray = [];
              projects.forEach(element => {
                projectIdArray.push(element.projectId);
              });
              console.log(projectIdArray);
              Project.findAll({
                where: {
                  id: projectIdArray,
                  [Op.not]: {
                    status: "F"
                  }
                }
              }).then(projects => {
                callback(null, new notification(siterequests, supervisors, projects));
              }).catch(err => {
                callback(err)
              });
            }).catch(err => callback(err));
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
}
//All indedendent data tables

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

exports.getAreaById = (params, callback) => {
  return Area.findAll({
      where: {
        id: params.id
      },
      include: [{
        all: true,
        attributes: ["description", "startDate", "endDate", "address", "zip", "lat", "long", "totalArea", "areaCompleted", "budget", "skilled", "semiSkilled", "unSkilled", "status"],
      }],
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};
// ,
// include: [
//   {
//     model: Prerequisite,
//     as: "prerequisites",
//   }
// ],
exports.getMaterialById = (params, callback) => {
  return Material.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getTutorialById = (params, callback) => {
  return Tutorial.findAll({
      where: {
        id: params.id
      },
      include: [{
        all: true,
        attributes: ["subcategoryName", "description"],
      }],

    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getToolById = (params, callback) => {
  return Tool.findAll({
      where: {
        id: params.id
      },
      include: [{
        all: true,
        attributes: ["subcategoryName", "description"],
      }],
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getResourceById = (params, callback) => {
  return Resource.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getProjectById = (params, callback) => {
  return Project.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getMiniCategoryById = (params, callback) => {
  return MiniCategory.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getPrerequisiteById = (params, callback) => {
  return Prerequisite.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getProjectPlanById = (params, callback) => {
  return ProjectPlan.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getProjectAreaPlanById = (params, callback) => {
  return ProjectAreaPlan.findAll({
      where: {
        id: params.id
      }
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getMilestoneById = (params, callback) => {
  return Milestone.findAll({
      where: {
        id: params.id
      },
      include: [{
        all: true,
        // attributes: ["subcategoryName", "description"],
      }],
    })
    .then((tags) => {
      return callback(tags);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
      callback(err);
    });
};

exports.getSupProjectDetails = function (params, callback) {
  Project_MiniCategory.findAll({
    where: {
      projectId: 1
    },
    include: [{
      model: Area,
      where: {
        id: 1
      },
      as: 'projectminicategoryareas'
    }]
  }).then(res => {
    Project_MiniCategory_Area.findAll({
      where: {
        areaId: 1
      },
      include: [{
        all: true
      }]
    }).then(res1 => {
      output = {
        topdetials: res,
        bottomdetails: res1
      };
      callback(null, output);
    }).catch(err => {
      callback(err)
    });
  }).catch(err => {
    callback(err)
  });
}

exports.getAllProjectDetails = async function (params, callback) {
  const project = await Project.findAll({
    where: {
      id: params.projectId
    }
  });
  const CategoryId = project[0].CategoryId;
  const SubCategoryId = project[0].SubCategoryId;
  const category = await Category.findAll({
    where: {
      id: CategoryId
    }
  });
  const subCategory = await SubCategory.findAll({
    where: {
      id:SubCategoryId
    }
  });
  
      // console.log(miniCategory[0].miniCategoryName, milestone[0], projectAreaMiniMiles[0], prerequisite[0]);
      const result = {
        project: project[0],
        category: category[0],
        subCategory: subCategory[0],
      }
      callback(null, result);
    }

exports.getAllVendorProjectDetails = async function (params, callback) {
  const projectArea = await Project_Area.findAll({
    where: {
      projectId: params.projectId
    }
  });
      const result = {
        projectArea: projectArea,
      }
      callback(null, result);
    }


exports.getVendorProjectDetails = async function (params, callback) {
  const projectArea = await Project_Area.findAll({
    where: {
      projectId: params.projectId,
      areaId: params.areaId
    }
  });
  const projectAreaId = projectArea[0].id;
  const projectAreaMinicategory = await Project_Area_Minicategory.findAll({
    where: {
      projectareaId: projectAreaId,
      status : 'Process' 
    }
  });

  const miniCategoryId = projectAreaMinicategory[0].minicategoryId;

      const miniCategory = await MiniCategory.findAll({
        where: {
          id: miniCategoryId
        }
      });
      const milestone = await Milestone.findAll({
        where: {
          MiniCategoryId: miniCategoryId
        }
      })
      const projectAreaMiniMiles = await ProjectAreaMiniMiles.findAll({
        where: {
          projectareaminiId : projectAreaMinicategory[0].id,
          milestoneId: milestone[0].id
        }
      })
      const prerequisite = await Prerequisite.findAll({
        where: {
          SubCategoryId: miniCategory[0].SubCategoryId
        }
      })
      console.log(miniCategory[0].miniCategoryName, milestone[0], projectAreaMiniMiles[0], prerequisite[0]);
      const result = {
        projectArea: projectArea[0],
        projectAreaMinicategory: projectAreaMinicategory,
        miniCategory: miniCategory,
        milestone: milestone,
        projectAreaMiniMiles: projectAreaMiniMiles,
        prerequisite: prerequisite
      }
      callback(null, result);
    }
    // Project_MiniCategory_Area.findAll({
    //   where: {
    //     areaId: 1
    //   },
    //   include: [{
    //     all: true
    //   }]
    // }).then(res1 => {
    //   output = {
    //     topdetials: res,
    //     bottomdetails: res1
    //   };
    //   callback(null, output);
    // }).catch(err => {
    //   callback(err)
    // });

// const { Op } = require("sequelize");
// exports.getSupProjectDetails = function(params, callback){
//   Project_MiniCategory.findAll({
//     where: {
//       projectId: params.projectId
//     }
//   }).then(projectMinicategories => {
//     var minicategoryArray = []
//     projectMinicategories.forEach(element => {
//       minicategoryArray.push(element.minicategoryId);
//     });
//     console.log(minicategoryArray);
//     Project_MiniCategory_Area.findAll({
//       where : {
//         projectMiniCategoryId : {
//           [Op.or]: minicategoryArray
//         }
//       }
//     }).then(result => {
//       let areaSet = new Set();
//       result.forEach(element => {
//         areaSet.add(element.areaId);
//       });
//       console.log(areaSet);
//       let array = Array.from(areaSet);
//       console.log(array);
//       callback(result);
//     }).catch(err => {callback(err)});
//   }).catch(err => {
//     callback(err);
//   });
// }
//All indedendent data tables

// exports.getProject = function(params, callback){
//   let map = new Map();
//   Project_Area.findAll({
//     where : {
//       projectId : params.id
//     }
//   }).then(result => {
//     var mySet = new Set();
//     result.forEach(element => {
//       mySet.add(element.areaId)
//     });
//     let areaArray = Array.from(mySet);
//     console.log(areaArray);
//     areaArray.forEach(element => {
//       Project_Area.findAll({
//         where : {
//           areaId : element,
//           projectId: params.id
//         }
//       }).then(result => {
//         result.forEach(other => {
//           map.set(element, other.id);
//           console.log(map);
//         });
//       }).catch();
//     });
//     console.log("Map before callback");
//     console.log(map);
//     callback(null, null);
//   }).catch(err => {
//     callback(err);
//   });
// }


exports.getProject = function (params, callback) {
  class output {
    constructor(siteEngineer, differentAreas, minicategories) {
      this.siteEngineer = siteEngineer;
      this.differentAreas = differentAreas;
      this.minicategories = minicategories;
    }
  };
  var newOutput = new output();
  Project_User.findAll({
    where: {
      projectId: params.id
    }
  }).then(results => {
    var users = [];
    results.forEach(element => {
      users.push(element.userId);
    });
    User.findAll({
      where: {
        id: users,
        role: "SENG"
      }
    }).then(outputs => {
      newOutput.siteEngineer = outputs[0];
    }).catch();
  }).catch();
  Project_Area.findAll({
    where: {
      projectId: params.id
    },
    include: [{
      all: true
    }]
  }).then(result => {
    newOutput.differentAreas = result;
    Project_Area_Minicategory.findAll({
      where: {
        projectareaId: [1, 2]
      },
      include: [{
        all: true
      }]
    }).then(miniresult => {
      newOutput.minicategories = miniresult;
      callback(null, newOutput);
    }).catch(err => {
      callback(err)
    });
  }).catch(
    err => {
      callback(err)
    });
}

exports.listSupervisors = function (params, callback) {
  Vendor_Supervisor.findAll({
    where: {
      vendorId: params.id
    }
  }).then(result => {
    var array = [];
    result.forEach(element => {
      array.push(element.supervisorId);
    });
    User.findAll({
      where: {
        id: array
      },
      include: [{
        model: User,
        as: "supervisors"
      }]
    }).then(result => {
      callback(null, result);
    }).catch(err => {
      callback(err);
    });
  }).catch(err => {
    callback(err);
  });
}