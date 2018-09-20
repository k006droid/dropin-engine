var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [LanguageSchema to perform CRUD]
 * @type {Schema}
 */
var LanguageSchema = new Schema({
	native_id: {type: String, required: true},
    lang_name: {type: String, required: true, unique: true},
    lang_code: { type: String, required: true, unique: true },
    lang_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Language', LanguageSchema);