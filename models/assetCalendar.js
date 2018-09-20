var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

/**
 * [AssetCalendarSchema - For List Calendar DB Operation ]
 * @type {Schema}
 */
var AssetCalendarSchema = new Schema(
    {
    lessor_id: { type: Schema.ObjectId, ref: 'Lessee', required: true },
    asset_id: { type: Schema.ObjectId, ref: 'Asset', required: true },
    native_id: {type: String, required: true},
    asset_id: {type: String, required: true, max: 100},
    from: {type: String, required: true, max: 1000},
    to: {type: String, required: true, max: 200},
    status: {type: String, required: true, max: 200},
    createdAt: {type: String, required: true, max: 100},
    });

// Virtual for list "title" name.


AssetCalendarSchema
.virtual('assetId')
.get(function () {
  return this.asset_id;
});

AssetCalendarSchema
.virtual('From')
.get(function () {
  return this.from;
});

AssetCalendarSchema
.virtual('To')
.get(function () {
  return this.to;
});

AssetCalendarSchema
.virtual('Status')
.get(function () {
  return this.status;
});

module.exports = mongoose.model('AssetCalendar', AssetCalendarSchema);
