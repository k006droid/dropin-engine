		
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [BedtypeSchema to perform CRUD]
 * @type {Schema}
 */
var BedtypeSchema = new Schema({
	native_id: {type: String, required: true},
    serial_no: {type: String, required: true},
    bed_type: { type: String, required: true },
    status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Payment_gateway', BedtypeSchema);