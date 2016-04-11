// grab the mongoose module
var db = require('../../config/db');

var predictionSchema = new db.Schema({
	companyId : String,
	expertId : String,
	date: Date,
	target: Number,
	prediction: Number,
	suggestion: String
});

var prediction = db.mongoose.model('prediction' , predictionSchema);
module.exports = prediction;
