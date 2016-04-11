
// grab the mongoose module
var db = require('../../config/db');
// module.exports allows us to pass this to other files when it is called
var companySchema = new db.Schema({
	name : {type: String, unique: true},
	description : String,
	logo: String
});

var company = db.mongoose.model('company', companySchema);
// Exports
module.exports = company;