var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [ThemesettingSchema to perform CRUD]
 * @type {Schema}
 */
var ThemesettingSchema = new Schema({
	native_id: {type: String, required: true},
    font_color: { type: String, required: true },
    font_family: {type: String, required: true},
    background_color: {type: String, required: true},
    header_color: { type: String,required: true},
    footer_color: {type: String, required: true},
    link_color: {type: String, required: true},
    primary_button_color: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Theme_settings', ThemesettingSchema);