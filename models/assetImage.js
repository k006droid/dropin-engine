var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

/**
 * [AssetImageSchema - For asset images DB operations]
 * @type {Schema}
 */
var AssetImageSchema = new Schema(
    {
    lessor_id: { type: Schema.ObjectId, ref: 'Lessee', required: true },
    native_id: {type: String, required: true},
    asset_id: { type: Schema.ObjectId, ref: 'Asset', required: true },
    // img_name: {type: String, required: true, max: 1000},
    img_src: {type: String, required: true, max: 200},
    cover_status: {type: String, default: '0'},
    capti56on: {type: String, required: false, max: 100},
    img_resize: {type: String, required: false, max: 1000},
    createdAt: {type: String, required: true, max: 100},
    });
// Virtual for this author instance URL.
AssetImageSchema
.virtual('url')
.get(function () {
  return this.img_src
});

module.exports = mongoose.model('AssetImage', AssetImageSchema);
