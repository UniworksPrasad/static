const userService = require('../services/userService');

exports.createUser = function(req, res){
    const createUser = userService.createUser(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.updateUser = function(req, res){
    const createUser = userService.updateUser(req.params, req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.createCategory = function(req, res){
    const createUser = userService.createCategory(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.updateCategory = function(req, res){
    const createUser = userService.updateCategory(req.params, req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.getUser = function(req, res){
    const getUser = userService.getUser(req.params, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.addCategory = function(req, res){
    const createUser = userService.addCategory(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.listCategory = function(req, res){
    const createUser = userService.listCategory(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.listUser = function(req, res){
    const createUser = userService.listUser(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.createSubCategory = function(req, res){
    const createUser = userService.createSubCategory(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

exports.listSubCategory = function(req, res){
    const createUser = userService.listSubCategory(req.params, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
}

//All independent data tables

exports.createArea = function(req, res){
    const createUser = userService.createArea(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createMaterial = function(req, res){
    const createUser = userService.createMaterial(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createTutorial = function(req, res){
    const createUser = userService.createTutorial(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createTool = function(req, res){
    const createUser = userService.createTool(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createResource = function(req, res){
    const createUser = userService.createResource(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createProject = function(req, res){
    const createUser = userService.createProject(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createMiniCategory = function(req, res){
    const createUser = userService.createMiniCategory(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createPrerequisite = function(req, res){
    const createUser = userService.createPrerequisite(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createProjectPlan = function(req, res){
    const createUser = userService.createProjectPlan(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createProjectAreaPlan = function(req, res){
    const createUser = userService.createProjectAreaPlan(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.createMilestone = function(req, res){
    const createUser = userService.createMilestone(req.body, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.getSiteRequest = function(req, res){
    const createUser = userService.getSiteRequest(req.params, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }

  exports.getNotifications = function(req, res){
    const createUser = userService.getNotifications(req.params, function(err, result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
  }
  //All indedendent data tables