var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

/**
 * [MyCartSchema - For MyCart DB Operation ]
 * @type {Schema}
 */
var MyCartSchema = new Schema(
    {
    native_id:{type: String, required: true},
    lessee_id: {type: String, required: true},
    asset_id: {type: String, required: true},
    myCart_status: {type: String, required: true},
    createdAt: { type: String, required: true },
    last_updated: { type: String, required: true }
  });

  // Export model.
  module.exports = mongoose.model('MyCart', MyCartSchema);
