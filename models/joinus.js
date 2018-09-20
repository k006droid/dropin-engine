var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [ThemesettingSchema to perform CRUD]
 * @type {Schema}
 */
var JoinusSchema = new Schema({
	native_id: {type: String, required: true},
    fb_link: {type: String, required: true},
    twitter_link: { type: String, required: true },
    gplus_link: {type: String, required: true},
    youtube_link: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Join_us', JoinusSchema);