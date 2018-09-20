
var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.


var Schema = mongoose.Schema;

/**
 * [ReservationSchema - For Reservation DB Operation ]
 * @type {Schema}
 */
var ReservationSchema = new Schema(
    {
        native_id:{type: String, required: true},
        lessee_id: {type: Schema.ObjectId, required: true, ref: 'Lessee'},
        asset_id: {type: Schema.ObjectId, required: true , ref: 'Asset'},
        checkin: {type: String, required: true},
        checkout: {type: String, required: true},
        currency: {type: String, required: true},
        sub_total: {type: String, required: true},
        admin_commission: {type: String},
        net_total: {type: String, required: true},
        payout_status: {type: String, required: true},
        payment_type: {type: String, required: true},
        reservation_status: {type: String, required: true},
        createdAt: {type: String, required: true},
        last_updated: {type: String, required: true}
    });

  // Export model.
  module.exports = mongoose.model('Reservation', ReservationSchema);
