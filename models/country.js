var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [CountrySchema to perform CRUD]
 * @type {Schema}
 */
var CountrySchema = new Schema({
	native_id: {type: String, required: true},
    short_name: {type: String, required: true, unique: true},
    full_name: { type: String, required: true,unique: true },
    country_code: {type: String, required: true,unique: true},
    country_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Country', CountrySchema);