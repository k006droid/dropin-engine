var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [MetatitlesSchema to perform CRUD]
 * @type {Schema}
 */
var MetatitlesSchema = new Schema({
	native_id: {type: String, required: true},
    title: {type: String, required: true, unique: true},
    descrption: { type: String, required: true },
    url: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Meta_titles', MetatitlesSchema);