		
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [BedtypeSchema to perform CRUD]
 * @type {Schema}
 */
var AssetrulesSchema = new Schema({
	native_id: {type: String, required: true},
    serial_no: {type: String, required: true},
    rule_name: { type: String, required: true, unique: true },
    rule_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Houserules', AssetrulesSchema);