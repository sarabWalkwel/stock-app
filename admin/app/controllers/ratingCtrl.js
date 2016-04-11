var rating = require('../models/rating');

module.exports.addRating = addRating;

function addRating (id,urating,cb){
	var expertRating  = new rating();
	expertRating.expertId = Id;
	expertRating.urating = rating;
	expertRating.save(function(err){
		console.log(err);
		cb(null,expertRating);
	});
}