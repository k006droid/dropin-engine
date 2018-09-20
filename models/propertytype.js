var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [PropertytypeSchema to perform CRUD]
 * @type {Schema}
 */
var PropertytypeSchema = new Schema({
	native_id: {type: String, required: true},
	native_id: {type: String, required: true},
    serial_no: {type: String, required: true},
    property_name: { type: String, required: true },
    status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Property_type', PropertytypeSchema);