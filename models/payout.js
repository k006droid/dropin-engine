var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

/**
 * [PayoutSchema - For List images DB operations]
 * @type {Schema}
 */
var PayoutSchema = new Schema(
    {
    lessor_id: { type: Schema.ObjectId, ref: 'Lessee', required: true },
    native_id: {type: String, required: true, max: 100},
    lessee_type: {type: String, required: true, max: 100},
    asset_id: { type: Schema.ObjectId, ref: 'Asset', required: true },
    account_name: {type: String, required: true, max: 100},
    account_no: {type: String, required: true, max: 200},
    bank_name: {type: String, required: true, max: 200},
    branch_name: {type: String, required: true, max: 100},
    routing_no: {type: String, required: true, max: 1000},
    paypal_customer_id: {type: String, required: false, max: 1000},
    stripe_customer_id: {type: String, required: false, max: 1000},
    createdAt: {type: String, required: true, max: 100},
    last_updated: { type: String }

    });



// Virtual for this author instance URL.
PayoutSchema
.virtual('id')
.get(function () {
  return this.leasee_id
});

PayoutSchema
.virtual('payoutId')
.get(function () {
  return this._id
});

module.exports = mongoose.model('Payout', PayoutSchema);
