var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [ApicredentialsSchema to perform CRUD]
 * @type {Schema}
 */
var ApicredentialsSchema = new Schema({
	native_id: {type: String, required: true},
    fb_client_id: {type: String, required: true},
    fb_secret_id: { type: String, required: true },
    google_client_id: {type: String, required: true},
    google_secret_id: {type: String, required: true},
    google_api_id: { type: String,required: true},
});


// Export model.
module.exports = mongoose.model('Api_credentials', ApicredentialsSchema);