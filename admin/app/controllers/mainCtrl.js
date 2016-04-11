var prediction = require('../models/prediction');
var company = require('../models/company');
var shares = require('../models/shares');
var expert = require('../models/expert');


module.exports.predictionList = predictionList;
module.exports.expertList = expertList;
module.exports.companyPredictions = companyPredictions;
module.exports.expertProfile = expertProfile;

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
function expertList(callback){
	var expertsData = [];
	expert.find({}).exec(function(err,expertf){
		prediction.aggregate([{
			$group :{
				_id:"$expertId",
				count: { $sum: 1 }
			}
			
		}])
		.exec(function(err,predictf){
			for(var i in expertf){
				for(var j in predictf){
					if(expertf[i]['_id'] == predictf[j]['_id']){
						var expertData = {};
						expertData.id = expertf[i]['_id'];
						expertData.name = expertf[i]['name'];
						expertData.description = expertf[i]['description'];
						expertData.predicted = predictf[j]['count'];
						expertData.accuracy = "0";
						expertData.rating = "0";
						expertsData.push(expertData);
					}
				}
			}
			callback(expertsData);
		});
	});
};
function companyPredictions(id,callback){
	var predictions =[];
	company.find({_id:id}).exec(function(err,companyf){
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
				prediction.find({}).sort('-date').exec(function(err,predictionf){					
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
										predict.expertaccuracy = "0";
										predict.expertrating = "0";
										predictions.push(predict);
									}
										
								}
							}
						}
					}
					callback(null,predictions);
				});
			});
		});		
	});
};
function expertProfile(id,callback){
	var expertsData = [];
	expert.find({_id:id}).exec(function(err,expertf){
		prediction.find([{
			$group :{
				_id:"$expertId",
				count: { $sum: 1 }
			}
			
		}])
		.exec(function(err,predictf){
			
			callback(null,expertf,predictf);
		});
	});
};