var stripe = require("stripe")(process.env.sk_key);
var Payment_gateway = require('../models/paymentgateway')

//stripe charge by using token
exports.stripe_charges = function (req, res, next) {

Payment_gateway.find({'native_id' : req.get('native_id')})
.exec(function (err, results) {
    if (err) { return next(err); }
    // Successful, so send.
    
	if(req.body.customer == ""){
	if(req.body.amount !="" && req.body.currency !="" && req.body.token !="" && req.body.description !=""){
		stripe.charges.create({
		  amount: req.body.amount,
		  currency: req.body.currency,
		  source: req.body.token, // obtained with Stripe.js
		  description: req.body.description
		}, function(err, charge) {
			if (err) { return next(err); }
		  // asynchronously called
		  	res.json({'status':200,'message':'sucess',data:[charge]})
		});
	}else{
    	res.json({'status':409,'message':'Missing require amount/currency/token'})
    }
	}else{
		if(req.body.amount !="" && req.body.currency !="" && req.body.customer !=""){
			stripe.charges.create({
			  amount: req.body.amount,
			  currency: req.body.currency,
			  source: req.body.token, 
			  description: req.body.description
			}, function(err, charge) {
				if (err) { return next(err); }
			  // asynchronously called
			  	res.json({'status':200,'message':'sucess',data:[charge]})
			});
		}else{
	    	res.json({'status':409,'message':'Missing require amount/currency/token'})
	    }
	}
});
}

exports.create_customers = function (req, res, next) {
	if(req.body.token !="" && req.body.description !=""){
		stripe.customers.create({
		  description: req.body.description,
		  source: req.body.token // obtained with Stripe.js
		}, function(err, customer) {
		  // asynchronously called
		  if (err) { return next(err); }
			  // asynchronously called
			res.json({'status':200,'message':'sucess',data:[customer]})
		});
	}else{
	    	res.json({'status':409,'message':'Missing require token/description'})
	}
}

exports.refunds = function (req, res, next) {
	if(req.body.trans_id !="" && req.body.reverse_transfer !=""){
		// reverse_transferBoolean indicating whether the transfer should be reversed when refunding this charge.
		//  The transfer will be reversed for the same amount being refunded (either the entire or partial amount).
		// A transfer can only be reversed by the application that created the charge.
		stripe.refunds.create({charge:req.body.trans_id,reverse_transfer: req.body.reverse_transfer},
		  function(err, charge) {
		    // asynchronously called
		    if (err) { return next(err); }
			  // asynchronously called
			  	res.json({'status':200,'message':'sucess',data:[charge]})
		  }
		);
	}else{
	    	res.json({'status':409,'message':'Missing trans_id'})
	}
}

exports.create_payouts = function (req, res, next) {
	//description
	//-The ID of a bank account or a card to send the payout to. 
	//-If no destination is supplied, the default external account for the specified currency will be used.
	if(req.body.amount !="" && req.body.currency !="" && req.body.description !=""){	
		stripe.payouts.create({
		  amount: req.body.amount,
		  currency: req.body.currency,
		  destination: req.body.description,
		}, function(err, payout) {
		  // asynchronously called
		  if (err) { return next(err); }
			  // asynchronously called
			  	res.json({'status':200,'message':'sucess',data:[payout]})
		});
	}else{
	    	res.json({'status':409,'message':'Missing trans_id'})
	}
}

