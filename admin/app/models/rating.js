
// grab the mongoose module
var db = require('../../config/db'); 

var ratingSchema = new db.Schema({
	expertId: ObjectId,
	rating: Double
});
var rating = db.mongoose.model('rating',ratingSchema);

module.exports = rating;