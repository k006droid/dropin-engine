var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** 
 * [CurrencySchema to perform CRUD]
 * @type {Schema}
 */
var CurrencySchema = new Schema({
	native_id: {type: String, required: true},
    currency_name: {type: String, required: true, unique: true},
    currency_code: { type: String, required: true, unique: true },
    currency_symbol: {type: String, required: true, unique: true},
    currency_rate: {type: String, required: true},
    currency_status: {type: String, required: true},
});


// Export model.
module.exports = mongoose.model('Currency', CurrencySchema);