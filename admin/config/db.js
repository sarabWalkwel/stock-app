var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
connect();
function connect(){
	mongoose.connect('mongodb://localhost/stockApp');
}
function disconnect(){
	mongoose.disconnect;
}	