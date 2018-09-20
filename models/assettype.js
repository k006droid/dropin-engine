var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [RoomtypeSchema to perform CRUD]
 * @type {Schema}
 */
var AssettypeSchema = new Schema({
	native_id: {type: String, required: true},
    serial_no: {type: String, required: true},
    room_type: { type: String, required: true, unique: true},
    room_type_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Asset_type', AssettypeSchema);