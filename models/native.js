var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** 
 * [BedtypeSchema to perform CRUD]
 * @type {Schema}
 */
var NativeSchema = new Schema({
	native_id: {type: String, required: true, unique : true},
    domain_name: {type: String, required: true, unique : true},
    status: {type: String, required: true},
});

// Export model.
module.exports = mongoose.model('Native', NativeSchema);