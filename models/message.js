
var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.


var Schema = mongoose.Schema;

/**
 * [MessageSchema - For Message DB Operation ]
 * @type {Schema}
 */

var MessageSchema = new Schema(
    {
    native_id:{type: String, required: true},
    from_lId : {type: String, required: true},
    to_lId : {type: String, required: true},
    from_lesseeName : {type:String, require: true},
    to_lesseeName : {type: String, required: true},
    msg_content : {type: String, required: true, max: 100},
    msg_status : { type: String, required: true },
    msg_type : { type: String, required: true },
    createdAt : { type: String, required: true },
    reservation_id : { type: Schema.ObjectId ,required:true, ref:'Reservation'},
    last_updated: { type: String, required: true }
  });

  // Export model.
  module.exports = mongoose.model('Message', MessageSchema);
