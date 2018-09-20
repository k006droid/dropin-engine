var Listings = require('../models/asset');
var ListCalendar = require('../models/assetCalendar');
var ListImage = require('../models/assetImage');
var Payout = require('../models/payout');
var User = require('../models/lessee')
var async = require('async')
var moment = require('moment')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/**
 * [payout_add_post - To create payout details for the user]
 * @type {Array}
 */
exports.payout_add_post = [

	(req, res, next) => {
	var native_id = req.get('native_id');
	var lessee_id = req.body.lessee_id;
	var lessee_type =  req.body.lessee_type;
	var asset_id = req.body.asset_id;
	var account_no = req.body.account_no;
	var account_name = req.body.account_name;
	var bank_name = req.body.bank_name;
	var branch_name = req.body.branch_name;
	var routing_no = req.body.routing_no;
	var stripe_customer_id = req.body.stripe_customer_id;
	var paypal_customer_id = req.body.paypal_customer_id;


	req.checkBody('account_no', 'account_no is required').notEmpty();
	req.checkBody('account_name').notEmpty().withMessage('account_name is required')
	req.checkBody('bank_name', 'bank_name is required').notEmpty();
	req.checkBody('branch_name', 'branch_name is required').notEmpty();
	req.checkBody('routing_no', 'routing_no is required').notEmpty();
	req.checkBody('lessee_id', 'lessee_id is required').notEmpty();
	req.checkBody('lessee_type', 'lessee_type is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 	var payout = new Payout(
		          {
								native_id: native_id,
		          	lessee_type: lessee_type,
		            lessee_id: lessee_id,
		          	asset_id: asset_id,
		          	account_no: account_no,
		          	account_name: account_name,
		            bank_name: bank_name,
		            branch_name: branch_name,
		            routing_no: routing_no,
		           	stripe_customer_id : stripe_customer_id,
		           	paypal_customer_id : paypal_customer_id,
		           	createdAt: moment().valueOf(),

		           });

		 	 	//To check whether user or found or not to create the listings for particular user
		 	 	 User.findOne({_id: lessee_id})
                .exec(function (err, user) {
                  if (err) { return next(err); }
                  if (user==null) { // No results.
                     //const errors  = new Error('User not found');
                      res.status(404).json({
		 				errors : "User not found"
		 				});
                    }
                  else
                  {
                  	payout.save(function (err) {
		                if (err) {

		                res.status(409).json({	errors : err});

		                 }
		                // Successful

		                  res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						    	"lessee_id" : payout.id

						    }
			 	    });
		            });
                  }
              });
		 }
	}
];

/**
 * [payout_update_post - To update the payout details of the asset]
 * @type {Array}
 */
exports.payout_update_post = [


    (req, res, next) => {
	var native_id = req.get('native_id');
	var payout_id = req.body.payout_id
	var lessee_id = req.body.lessee_id;
	var lessee_type =  req.body.lessee_type;
	var asset_id = req.body.asset_id;
	var account_no = req.body.account_no;
	var account_name = req.body.account_name;
	var bank_name = req.body.bank_name;
	var branch_name = req.body.branch_name;
	var routing_no = req.body.routing_no;
	var stripe_customer_id = req.body.stripe_customer_id;
	var paypal_customer_id = req.body.paypal_customer_id;


	req.checkBody('account_no', 'account_no is required').notEmpty();
	req.checkBody('account_name').notEmpty().withMessage('account_name is required')
	req.checkBody('bank_name', 'bank_name is required').notEmpty();
	req.checkBody('branch_name', 'branch_name is required').notEmpty();
	req.checkBody('routing_no', 'routing_no is required').notEmpty();
	req.checkBody('payout_id', 'payout_id is required').notEmpty();
	

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {


      var payout = new Payout(
		          {
					native_id: native_id,
		          	lessee_type: lessee_type,
		            lessee_id: lessee_id,
		          	asset_id: asset_id,
		          	account_no: account_no,
		          	account_name: account_name,
		            bank_name: bank_name,
		            branch_name: branch_name,
		            routing_no: routing_no,
		           	stripe_customer_id : stripe_customer_id,
		           	paypal_customer_id : paypal_customer_id,
		           	createdAt: moment().valueOf(),

		           });




       	 Payout.findOne({_id: payout_id})
                .exec(function (err, payouts) {
                  if (err) { return next(err); }
                  if (payouts==null) { // No results.
                     
                      res.status(404).json({
		 				errors : "Pyout details not found"
		 				});
                    }
                  else
                  {


                  	// Data from form is valid. Update the record.
            Payout.findByIdAndUpdate(payout_id, payout, function (err, pay) {
                if (err) { return next(err); }
                // Successful.
                 res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						     "payout_id": pay.payoutId,
						    }
			 	    });

            	});

                  }

              });




		 }
    }
];
