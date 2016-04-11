var shares = require('../models/shares');
var company = require('../models/company');

module.exports.addShares = addShares;
module.exports.findShareprice = findShareprice;
module.exports.editShare = editShare;
module.exports.removeShare = removeShare;
module.exports.distinctShare = distinctShare;

function addShares(id , share , date , callback) {
	var companyShare = new shares();
	companyShare.companyId = id;
	companyShare.shareprice = share;
	companyShare.date = date;
	companyShare.save(function(err){
		if(err){
			callback(err);
		}
		else{
			callback(null,companyShare);			
		}
	});
};
function findShareprice(id,callback){
	company.findOne({_id:id},function(err,company){
		if(err){

		}
		else{
			var companiesDetail = [];
			shares.find({companyId:id}).sort('-date').exec(function(err,data){
				if(err){
					console.log(err);	
				} 
				else{
						
					for(var key in data){
						companyDetail ={};
						companyDetail.companyid = id;
						companyDetail.name = company.name;
						companyDetail.date = data[key].date;
						companyDetail.shareprice = data[key].shareprice;
						companyDetail.shareid = data[key]._id;
						companiesDetail.push(companyDetail);
					}
					//console.log(data);
					//console.log(companiesDetail);
					callback(null,companiesDetail);
				}		
			});
		}
	});
};
function editShare(id,share,callback){
	shares.findOne({_id:id}).exec(function(err,data){
		if(err) console.log(err);
		data.shareprice= share;
		data.save(function(err,res){
			if(err) console.log(err)
				callback(null,res);
		}); 
	});
};

function removeShare(id,callback){
	shares.remove({_id:id}).exec(function(err,data){
		if(err) console.log(err);
		callback(null,data);
	});
};

function distinctShare(id,callback){
	shares.aggregate([
		{
			$match:{
				companyId : id
			}
		},
		{
			$group :{
				_id:"$companyId",
				shareprice:{$last:"$shareprice"}
			}
		}
	])
	.exec(function(err,sharesf){
		callback(null,sharesf)
	});
};