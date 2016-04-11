var user = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var nodemailer = require('nodemailer');
var crypto =require('crypto');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'suraj.sudhera@gmail.com',
        pass: '**123*destination'
    }
};
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);



module.exports.createUser = createUser;
module.exports.allUsers = allUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.userLogin = userLogin;
module.exports.resetPassword = resetPassword;
module.exports.setNewPassword = setNewPassword;


function allUsers(cb){
	user.find({}).exec(function(err,data){
		if(err) console.log(err);
		cb(null,data);
	});
}
function updateUser(id, name, email,role ,cb){
	user.findOne({_id:id}).exec(function(err,userf){
		
		userf.name = name;
		userf.email = email;
		userf.role = role;
		userf.save(function(err){
			if(err) console.log(err)
				cb(null,userf);
		});
	});
}
function deleteUser(id,cb){
	user.remove({_id:id}).exec(function(err,data){
		cb(null,"user deleted")
	});
}

function createHash (password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function createUser(name,email,role,password,callback){

	// Generates hash using bCrypt
	var addUser = new user();
	addUser.name = name;
	addUser.email = email;
	addUser.username = email;
	addUser.password = createHash (password);
	addUser.role = role;
	addUser.save(function(err){
		if(err) console.log(err)
			callback(null,true)
	});
}
function userLogin(email,password,cb){
	user.findOne({email:email}).exec(function(err,data){
		// In case of any error, return using the done method
        if (err)
          return cb(err);
        // Username does not exist, log error & redirect back
        if (!data){
          return cb(null, false);                 
        }
        if (!isValidPassword(data, password)){
          return cb(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return cb(null, data);
	})
}
function isValidPassword(data,password){
	return bCrypt.compareSync(password, data.password);
}
function resetPassword(email,cb){
	user.findOne({email:email}).exec(function(err,data){
		if(data!==null){
			var random = Math.random();
			data.resetTokenApi = crypto.randomBytes(64).toString('hex');

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: '"StockMarket"', // sender address
			    to: 'suraj.sudhera@gmail.com, suraj.sudhera@gmail.com', // list of receivers
			    subject: 'Password reset', // Subject line
			    html: '<a href="http://localhost:8080/setNewPassword/'+data.resetTokenApi+'">Click Here</a>' // html body
			};

			// send mail with defined transport object
			
			console.log(data.resetTokenApi);
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});
			
			data.save(function(err){
				cb(null,data);
			});
			
		}

	});
}
function setNewPassword(password,cb){
	user.findOne({resetTokenApi:password.token}).exec(function(err,data){
		console.log(data);
		data.password = createHash (password.new);
		data.resetTokenApi = crypto.randomBytes(64).toString('hex');
		data.save(function(err){
			cb(null,data);
		});
	});
}