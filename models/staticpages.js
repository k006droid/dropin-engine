var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [StaticpagesSchema to perform CRUD]
 * @type {Schema}
 */
var StaticpagesSchema = new Schema({
	native_id: {type: String, required: true},
    page_name: {type: String, required: true, unique: true},
    language: { type: String, required: true },
    content: {type: String, required: true},
    page_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Static_pages', StaticpagesSchema);