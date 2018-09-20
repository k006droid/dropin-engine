var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**  
 * [SettingSchema to perform CRUD]
 * @type {Schema}
 */
var SettingSchema = new Schema({
    native_id: {type: String, required: true},
    site_name: {type: String, required: true},
    logo: { type: String, required: true },
    fav_icon: {type: String, required: true},
    default_currency: {type: String, required: true},
    default_lang: { type: String,required: true},
    maintanance_mode: {type: String, required: true},
    site_date_format: {type: String, required: true},
    default_time_zone: {type: String, required: true},
    meta_keyword: {type: String, required: true},
    meta_desc: {type: String, required: true}
});


// Export model.
module.exports = mongoose.model('Settings', SettingSchema);