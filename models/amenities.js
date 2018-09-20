var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [AmenitiesSchema to perform CRUD  ]
 * @type {Schema}
 */
var AmenitiesSchema = new Schema({
	native_id: {type: String, required: true},
    serial_no: {type: String, required: true},
    amenity_name: { type: String, required: true, unique: true },
    amenity_desc: {type: String, required: true},
    amenity_icon: {type: String, required: true},
    amenity_status: { type: String,required: true},
});


// Export model.
module.exports = mongoose.model('Amenities', AmenitiesSchema);		