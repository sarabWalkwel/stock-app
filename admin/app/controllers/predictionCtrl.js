var prediction = require('../models/prediction');
var company = require('../models/company');
var shares = require('../models/shares');
var expert = require('../models/expert');


module.exports.addPrediction = addPrediction;
module.exports.predictionList = predictionList;
module.exports.removePrediction = removePrediction;
module.exports.findPrediction = findPrediction;
module.exports.editPrediction = editPrediction;


//get all predictoins
function predictionList(callback){
	var predictions =[];
	company.find({}).exec(function(err,companyf){
		if(err) console.log(err)
		shares.aggregate([{
			$group :{
				_id:"$companyId",
				shareprice:{$last:"$shareprice"}
			}
			
		}]).exec(function(err,sharesf){
			if(err) throw err
			expert.find({}).exec(function(err,expertf){
				if(err) console.log(err)
				prediction.find({}).exec(function(err,predictionf){					
					for (var i in companyf) {
						for(var s in sharesf){
							for(var k in predictionf){
								for(var j in expertf){
									if(companyf[i]["_id"]==sharesf[s]['_id']&&companyf[i]["_id"]==predictionf[k]['companyId']&&expertf[j]["_id"]==predictionf[k]['expertId']){
										var predict = {};
										predict._id = predictionf[k]["_id"];
										predict.date = predictionf[k]["date"];
										predict.companyId = predictionf[k]["companyId"];
										predict.company = companyf[i]["name"];
										predict.companydesc = companyf[i]["description"];
										predict.expertId = predictionf[k]["expertId"];
										predict.expert = expertf[j]["name"];
										predict.current = sharesf[s]["shareprice"];
										predict.target = predictionf[k]["target"];
										predict.prediction = predictionf[k]["prediction"];
										predict.suggestion = predictionf[k]["suggestion"];
										predictions.push(predict);
									}	
								}
							}
						}
					}
					callback(predictions);
				});
			});
		});		
	});
};

//add prediction
function addPrediction(company,expert,date,target,predicted,suggested,callback){
	var newPrediction = new prediction();
	newPrediction.companyId = company;
	newPrediction.expertId = expert;
	newPrediction.date = date;
	newPrediction.target = target;
	newPrediction.prediction = predicted;
	newPrediction.suggestion = suggested;
	newPrediction.save(function(err,data){
		if(err) console.log(err);
		callback(null,newPrediction);
	});
};

//find specfic prediction
function findPrediction(id,callback){
	prediction.findOne({_id:id}).exec(function(err,data){
		if(err) console.log(err)
			callback(null,data);
	});
};

//edit function
function editPrediction(id,company,expert,datetime,target,predict,suggestion,callback){
	
	prediction.findOne({_id:id}).exec(function(err,data){
		if(err) console.log(err);
		data._id= id;
		data.companyId= company;
		data.expertId = expert;
		data.date = datetime;
		data.target = target;
		data.prediction = predict;
		data.suggestion = suggestion;
		console.log(data.datetime);
		data.save(function(err,res){
			if(err) console.log(err)
				callback(null,res);
		}); 
	});
};

//remove prediction
function removePrediction(id,callback){
	prediction.remove({_id:id}).exec(function(err,data){
		if(err) console.log(err);
		callback(null,data);
	});
};