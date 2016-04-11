var expert = require('../models/expert');
 

module.exports.expertList = expertList;
module.exports.addExpert = addExpert;
module.exports.removeExpert = removeExpert;
module.exports.findExpert = findExpert;
module.exports.updateExpert = updateExpert;


// get all 
function expertList(callback){
	expert.find({}, function(err, experts) {
	  if (err){
	  	callback(err);
	  }
	  else{
	  	callback(null, experts);
	  }
	});
};
// add 
function addExpert(name, description, callback){
	var newexpert = new expert();
	  newexpert.name = name;
	  newexpert.description = description;
	newexpert.save(function(err) {
	  if (err){
	  	callback(err);
	  }
	  else{
	  	callback(null, newexpert);
	  	console.log(name + description);
	  }
	});
};
//delete 
function removeExpert(id,callback){
	expert.remove({ _id: id },function(err) {
		if (err) throw err;
		callback(null);
		console.log("company deleted successfully");
	});
};

//find
function findExpert(id, callback){
	expert.findOne({_id: id},function(err, expert){
		if (err){
	  	callback(err);
	  }
	  else{
	  	callback(null, expert);
	  }
	});
};
//update
function updateExpert(id, name, description, callback){

	expert.find({_id: id},function(err, expert){
		if (err){
	  	callback(err);
	  }
	  else{
	  	  expert[0].name = name;
		  expert[0].description = description;
		  expert[0].save(function(err) {
		  if (err){
		  	callback(err);
		  }
		  else{
		  	callback(null, expert);
		  }
		});
	  }
	});
};