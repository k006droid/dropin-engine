var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [PaymentgatewaySchema to perform CRUD]
 * @type {Schema}
 */
var PaymentgatewaySchema = new Schema({
	native_id: {type: String, required: true},
    payment_method: {type: String, required: true},
    pay_mode: { type: String, required: true },
    test_api_key: {type: String, required: true},
    test_secret_key: {type: String, required: true},
    live_api_key: { type: String,required: true},
    live_secret_key: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Payment_gateway', PaymentgatewaySchema);