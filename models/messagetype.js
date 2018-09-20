var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [MessagetypeSchema to perform CRUD]
 * @type {Schema}
 */
var MessagetypeSchema = new Schema({
	native_id: {type: String, required: true},
	sno: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    url: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Message_type', MessagetypeSchema);