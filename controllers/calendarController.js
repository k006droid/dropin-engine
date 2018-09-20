var Listings = require('../models/asset');
var ListCalendar = require('../models/assetCalendar');
var User = require('../models/lessee')
var async = require('async')
var moment = require('moment')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/**
 * [asset_create_calendar - To create calendar to update the block dates]
 * @type {Array}
 */
exports.asset_create_calendar = [

	(req, res, next) => {
	var native_id = req.get('native_id');
	var asset_id = req.body.asset_id;
	var from =  req.body.from;
	var to = req.body.to;
	var status = req.body.status;
	var lessor_id = req.body.lessor_id;


	req.checkBody('asset_id', 'asset_id is required').notEmpty();
	req.checkBody('lessor_id').notEmpty().withMessage('lessor_id is required')
	req.checkBody('from', 'roomtype_id is required').notEmpty();
	req.checkBody('to', 'property_id is required').notEmpty();
	req.checkBody('status', 'status is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 	var listCalendar = new ListCalendar(
		          {
					native_id: native_id,
		          	asset_id: asset_id,
		            lessor_id: lessor_id,
		          	from: from,
		          	to: to,
		           	status : status,
		           	createdAt: moment().valueOf(),

		           });

		 	 	//To check whether user or found or not to create the listings for particular user
		 	 	Listings.findOne({_id: asset_id})
                .exec(function (err, asset) {
                  if (err) { return next(err); }
                  if (asset==null) { // No results.
                    
                      res.status(404).json({
		 				errors : "Asset not found"
		 				});
                    }
                  else
                  {
                  	listCalendar.save(function (err) {
		                if (err) {
		                	console.log(err);
		                 res.status(409).json({	errors : err});

		                  }
		                // Successful
		                res.status(200).json({
		                'status': 200,
    					   'message': 'add Successful',
						    'data': {
						        'asset_id':listCalendar.assetId,
						        'from':listCalendar.From,
						        'to':listCalendar.To,
						        'calendarStatus':listCalendar.Status
						    }
						    });

		            });
                  }
              });
		 }
	}
];


/**
 * [asset_get_calendar - Display the calendar deatils for a particular asset]
 * @param  {[type]}   req  [pass the list id in get mothod]
 * @param  {[type]}   res  [return the calendar details for the particular asset]
 * @param  {Function} next []
 * @return {[type]}        [json]
 */

exports.asset_get_calendar = function(req, res, next) {

     ListCalendar.find({asset_id: req.params.id, native_id: req.get('native_id')})
     .populate('asset_id')
    .exec(function (err, listCalendars ) {
      if (err) { return next(err); }
      if (listCalendars==null) { // No results.
          var err = new Error('Data not found');
          err.status = 404;
          return next(err);
        }
      // Successful
       res.status(200).json({
		                'status': 200,
    					   'message': 'Successful',
						    'data': {
						        'details':listCalendars,

						    }
						    });
    })
};
