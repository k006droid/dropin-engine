var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [MessagetypeSchema to perform CRUD]
 * @type {Schema}
 */
var ReservationtypeSchema = new Schema({
	native_id: {type: String, required: true},
	sno: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
});


// Export model.
module.exports = mongoose.model('Reservation_type', ReservationtypeSchema);