var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

/**
 * [AssetSchema - For asset DB operations]
 * @type {Schema}
 */
var AssetSchema = new Schema(
    {
    lessor_id: { type: Schema.ObjectId, ref: 'Lessee', required: true },
    native_id: {type: String, required: true},
    roomtype_id: {type: String, required: true, max: 100},
    property_id: {type: String, required: true, max: 100},
    address: {type: String, required: true, max: 200},
    houserules: {type: String, required: false, max: 1000},
    lessee_count:{type: String, required: false, max: 100},
    amenties_id: {type: String, required: false, max: 1000},
    bedtype_id: {type: String, required: false, max: 100},
    bedcounts: {type: String, required: false, max: 100},
    bedroom_count: {type: String, required: false, max: 100},
    bathroom_count: {type: String, required: false, max: 100},
    title: {type: String, required: false, max: 100},
    desc: {type: String, required: false, max: 200},
    lessee_count: {type: String, required: false, max: 200},
    lat_long: {type: String, required: false, max: 200},
    // availabilty_type: {type: String, required: false, max: 200},
    min_night: {type: String, required: false, max: 200},
    max_night: {type: String, required: false, max: 200},
    price_mode: {type: String, required: false, max: 200},
    demand_max_price: {type: String, required: false, max: 200},
    demand_min_price: {type: String, required: false, max: 200},
    currency_code: {type: String, required: false, max: 200},
    base_price: {type: String, required: false, max: 200},
    weekly_discount: {type: String, required: false, max: 200},
    monthly_discount: {type: String, required: false, max: 200},
    asset_status: {type: String, default: '0' , max: 100},
    publish_status: {type: String, default: '0' , max: 100},
    createdAt: { type: String,  },
    last_updated: { type: String }



    }
  );


// Virtual for list "title" name.
AssetSchema
.virtual('name')
.get(function () {
  return this.title +', '+this.title;
});

AssetSchema
.virtual('assetId')
.get(function () {
  return this._id;
});
// Virtual for this author instance URL.
// ListSchema
// .virtual('url')
// .get(function () {
//   return '/become-a-host/room/'+this._id
// });
module.exports = mongoose.model('Asset', AssetSchema);
