// grab the mongoose module
var db = require('../../config/db');
var passportLocalMongoose = require('passport-local-mongoose');
// module.exports allows us to pass this to other files when it is called
var userSchema = new db.Schema({
	name :  String,
	email :  {type:String, unique:true, sparse: true},
	password : String,
	role : {type:String,default:"user"},
	resetTokenApi: {type:String, default:"none"}
});

var user = db.mongoose.model('user', userSchema);
// Exports
module.exports = user;