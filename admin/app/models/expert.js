var db = require('../../config/db');

var expertSchema = new db.Schema({
	name : {type: String, unique: true},
	description : String
});

var expert = db.mongoose.model('expert', expertSchema);
// Exports
module.exports = expert;
