var companyCtrl = require('./controllers/companyCtrl');
var expertCtrl = require('./controllers/expertCtrl');
var sharesCtrl = require('./controllers/sharesCtrl');
var predictionCtrl = require('./controllers/predictionCtrl');
var userCtrl = require('./controllers/userCtrl');
var mainCtrl = require('./controllers/mainCtrl');
var cors = require('cors');
var session = require('express-session');
var sess;
var multer = require('multer');

  var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  });
  var upload = multer({ //multer settings
      storage: storage
  }).single('file');



module.exports = function(app , passport ,router){

  
  


  /*=================================
    rest apis
  ===================================*/

 app.use(cors());
  app.get('/webservices/prediction/list',function(req,res){
    mainCtrl.predictionList(function(data){ 
      res.json(data);
    });
  });
  app.get('/webservices/expert/list',function(req,res){
    mainCtrl.expertList(function(data){ 
      res.json(data);
    });
  });
  app.get('/webservices/company/predictionList/:id',function(req,res){
    var id = req.params.id;
    mainCtrl.companyPredictions(id,function(err,data){
      res.json(data);
    });
  });
  app.get('/webservices/expert/profile/:id',function(req,res){
    var id = req.params.id;
    mainCtrl.expertProfile(id,function(err,data){
      res.json(data);
    });
  });
  app.post('/webservices/signup',function(req,res){
      var name = req.body.userDetails.name;
      var email = req.body.userDetails.email;
      var role = "user";
      var password = req.body.userDetails.password;
      userCtrl.createUser(name,email,role,password,function(err,data){
        if(data){
          res.status(200).json({
            status: 'Sign Up successful'
          });
        }
      });
  });


  //login functionality
    app.post('/webservices/login', function(req, res) {
      var email = req.body.userDetails.name;
      var password = req.body.userDetails.pass;
      userCtrl.userLogin(email,password,function(err,user){
        if(err){
          throw err
        }
        if(!user){
          res.status(401).json({
            status: "401 not authenticated"
          })
        }
        else{
          sess = req.session
          sess.email = email;
          sess.role = user.role;
          res.status(200).json({
            status:'Login successful!'
          })
        }
      })
    });

    ///checking if user is logged in or not
    app.post('/api/user/status',function(req,res){
      sess = req.session;
      if (!sess.email) {
        return res.status(200).json({
          status: false
        });
      }
      res.status(200).json({
        status: true,
        role : sess.role
      });
    });

    app.post('/logout', function(req, res) {
      sess = req.session;
      sess.email ="";
      res.status(200).json({
        status: 'Bye!'
      });
    });

    /*================================
        reset password
  ==================================*/  
  app.post('/reset/password',function(req,res){
    var email = req.body.email;
    userCtrl.resetPassword(email,function(err,data){
      console.log(data);
    });
  });

  app.post('/setNewPassword',function(req,res){
    var password=req.body.newPassword;
    userCtrl.setNewPassword(password,function(err,data){
      console.log(data);
    });
  });


  /*=============================
      file upload
  ===============================*/
    app.post('/company/upload/logo', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 console.log(err);
                 return;
            }
             res.json({error_code:0,err_desc:null});
        })
       
    });




	/*==================================
		all routes for company
	====================================*/

	//find all companies
	app.post('/api/companies',function(req, res) {
	    companyCtrl.companyList(function(err, companies){
	      res.json(companies);
	    });
  	}); 

  	//add company
	app.post('/api/company/add',function(req,res){
		var name = req.body.name;
    var description = req.body.description;
		var logo = req.body.logo;
		companyCtrl.addCompany(name, description,logo, function(err,response){
			console.log(response);
		});
	});

	//find one company
	app.post('/api/company/find/:id', function(req,res){
	    var companyId = req.params.id;
	    console.log(companyId);
	    companyCtrl.findCompany(companyId,function(err,data){
	      res.json(data);
	    });
  	});

  	//update company
  	app.post('/api/company/update/:id', function(req,res){
	    var companyId = req.params.id;
	    var name = req.body.name;
	    var description = req.body.description;
	    companyCtrl.updateCompany(companyId, name, description, sharePrice, function(err){
	      console.log("company updated");
	    });
  	});

  	//delete company 
  	app.post('/api/company/delete/:id', function(req,res){
	    var companyId = req.params.id;
	    companyCtrl.removeCompany(companyId,function(err, data){
	      console.log("company deleted");
	    });
  	});

  	//add share price
  	app.post('/api/company/addShare/:id',function(req,res){
  		var id = req.params.id;
  		var shareprice =  req.body.shareprice;
  		var date = new Date().toISOString().
  			replace(/T/, ' ').      // replace T with a space
  			replace(/\..+/, '');
  		sharesCtrl.addShares(id,shareprice , date,function(err,data){
  			res.json(data);
  		});
  	});

    //get share price list
  	app.post('/api/company/sharepricelist/:id',function(req,res){
  		var companyId = req.params.id;
  		sharesCtrl.findShareprice(companyId,function(err,data){
  			res.json(data);
  		});
  	});

    //update share price
    app.post('/api/share/edit/:id',function(req,res){
      var id = req.params.id;
      var share = req.body.share;
      sharesCtrl.editShare(id,share, function(err,data){
        res.json(data);
      });
    });

    //delete share price
    app.post('/api/share/delete/:id',function(req,res){
      var id = req.params.id;
      sharesCtrl.removeShare(id,function(err,data){
        res.json(data);
      });
    });

    app.post('/api/shares/distinct/:id',function(req,res){
      var id = req.params.id;
      sharesCtrl.distinctShare(id,function(err,data){
        res.json(data);
      });
    });

	/*==================================
		all routes for expert
	====================================*/
	app.post('/api/experts',function(req, res) {
	    expertCtrl.expertList(function(err, experts){
	      res.json(experts);
	    });
  	});
  	app.post('/api/expert/add',function(req, res) {
	    var name = req.body.name;
		var description = req.body.description;
		expertCtrl.addExpert(name, description, function(err, data){
		  	console.log(name + description);
		});
  	});
  	app.post('/api/expert/find/:id',function(req, res) {
	    var expertId = req.params.id;

	  	expertCtrl.findExpert(expertId,function(err,data){
	  		res.json(data);
	  		console.log(data);
	  	});
  	});
  	app.post('/api/expert/update/:id', function(req,res){
	    var expertId = req.params.id;
	  	var name = req.body.name;
	  	var description = req.body.description;
	  	expertCtrl.updateExpert(expertId, name, description, function(err){
		    console.log(name);
	  	});
  	});
  	app.post('/api/expert/delete/:id',function(req, res) {
  		var expertId = req.params.id;
	  	expertCtrl.removeExpert(expertId,function(err, data){
	  		console.log("Expert deleted");
	    });

  	});

    /*=========================================
      route for predictions
    ===========================================*/

    //get predictions ==============
    app.post('/api/prediction/list',function(req,res){
      predictionCtrl.predictionList(function(data){ 
        res.json(data);
      });
    });

    //add prediction ==================
    app.post('/api/prediction/add',function(req,res){
      var company = req.body.predict.company;
      var expert = req.body.predict.expert;
      var datetime = req.body.predict.datetime;
      var target = req.body.predict.target;
      var prediction = req.body.predict.prediction;
      var suggestion = req.body.predict.suggestion;
      console.log(prediction);
      predictionCtrl.addPrediction(company,expert,datetime,target,prediction,suggestion,function(err,data){
        res.json(data);
      });
    });

    //find prediction
    app.post('/api/prediction/find/:id',function(req,res){
      var id = req.params.id;
      predictionCtrl.findPrediction(id,function(err,data){
        res.json(data);
      });
    });
    
    
    //eidt prediction
    app.post('/api/prediction/edit',function(req,res){
      var id = req.body.predict._id;
      var company = req.body.predict.companyId;
      var expert = req.body.predict.expertId;
      var datetime = req.body.predict.datetime;
      var target = req.body.predict.target;
      var prediction = req.body.predict.prediction;
      var suggestion = req.body.predict.suggestion;
      predictionCtrl.editPrediction(id,company,expert,datetime,target,prediction,suggestion,function(err,data){
          res.json(data)
      })

    });

    //delete prediction
    app.post('/api/prediction/delete/:id',function(req,res){
      var id = req.params.id;
      predictionCtrl.removePrediction(id,function(err,data){
        res.json("prediction deleted");
      });
    });

     /*=========================================
      route for users
    ===========================================*/
    //get users
    app.post('/api/users',function(req,res){
      userCtrl.allUsers(function(err,data){
        res.json(data);
      });
    });

    app.post('/api/user/edit',function(req,res){
      var id = req.body.user._id;
      var name = req.body.user.name;
      var email = req.body.user.email;
      var role = req.body.user.role;
      userCtrl.updateUser(id,name,email,role,function(err,data){
        res.json(data);
      });
    });

    app.post('/api/user/delete/:id',function(req,res){
      var id = req.params.id;
      userCtrl.deleteUser(id,function(err,data){
        res.json("user Deleted")
      })
    });

    //adding user
    app.post('/api/user/add', function(req, res) {
      var name = req.body.name;
      var email = req.body.email;
      var role = req.body.role;
      var password = req.body.password;
      userCtrl.createUser(name,email,role,password,function(err,data){
        if(data){
          res.status(200).json({
            status: 'Sign Up successful'
          });
        }
      });
    });

    //login functionality
    app.post('/api/login', function(req, res) {
      var email = req.body.username;
      var password = req.body.password;
      userCtrl.userLogin(email,password,function(err,user){
        //console.log(user);
        if(err){
          throw err
        }
        if(!user){
          res.status(401).json({
            status: "401 not authenticated"
          })
        }
        else{
          sess = req.session
          sess.email = email;
          sess.role = user.role;
          res.status(200).json({
            status:'Login successful!'
          })
        }
      })
    });

    ///checking if user is logged in or not
    app.post('/api/user/status',function(req,res){
      sess = req.session;
      if (!sess.email) {
        return res.status(200).json({
          status: false
        });
      }
      res.status(200).json({
        status: true,
        role : sess.role
      });
    });

    app.post('/logout', function(req, res) {
      sess = req.session;
      sess.email ="";
      res.status(200).json({
        status: 'Bye!'
      });
    });

    /*================================
        reset password
  ==================================*/  
  app.post('/reset/password',function(req,res){
    var email = req.body.email;
    userCtrl.resetPassword(email,function(err,data){
      console.log(data);
    });
  });

  app.post('/setNewPassword',function(req,res){
    var password=req.body.newPassword;
    userCtrl.setNewPassword(password,function(err,data){
      console.log(data);
    });
  });

	// frontend routes =========================================================
        // route to handle all angular requests
/*  app.get('/',function(req,res){
    res.sendFile('./index.html', { root: __dirname });
  })*/
	app.get('*', function(req, res) {
      res.sendFile('/admin.html', { root: __dirname }); // load our public/index.html file
  });

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}