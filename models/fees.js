var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [FeesSchema to perform CRUD]
 * @type {Schema}
 */
var FeesSchema = new Schema({
	native_id: {type: String, required: true},
    name : {type: String, required: true},
    is_fixed: { type: String, required: true },
    percenatge: {type: String, required: true},
    fixed_value: {type: String, required: true},
    currency: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Fees', FeesSchema);