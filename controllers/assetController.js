var Listings = require('../models/asset');
var ListCalendar = require('../models/assetCalendar');
var ListImage = require('../models/assetImage');
var User = require('../models/lessee')
var async = require('async')
var moment = require('moment')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.host_test_get = function(req, res, next) {
    res.send(JSON.stringify({'status':'respond with a resource'}));
};



/**
 * [asset_create_post - To create new asset]
 * @type {Array}
 */
exports.asset_create_post = [

	(req, res, next) => {
	var address = req.body.address;
	var roomtype_id =  req.body.roomtype_id;
	var property_id = req.body.property_id;
	var lessor_id = req.body.lessor_id;
    var native_id = req.get('native_id');

	req.checkBody('address', 'address is required').notEmpty();
	req.checkBody('lessor_id').notEmpty().withMessage('lessor_id is required')
	// For future use
	/*
	.custom((value) => {
            return new Promise((resolve, reject) => {
              User.findOne({_id:req.body.lessor_id}, function(err, user){

                if(err) {
                	console.log(err);
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                	console.log("okcheck");
                  reject(  console.log("ch1") new Error('E-mail already in use'))
                }
                resolve(true)
              });
            });
          });
	 */
	req.checkBody('roomtype_id', 'roomtype_id is required').notEmpty();
	req.checkBody('property_id', 'property_id is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 	var listings = new Listings(
		          {
                    native_id : native_id,
		          	address: req.body.address,
		            lessor_id: req.body.lessor_id,
		          	roomtype_id: req.body.roomtype_id,
		          	property_id: req.body.property_id,
		            bathroom_: req.body.bathrooms,
		            bedtype_id: req.body.bedtype_id,
		            bedroom_count: req.body.bedroom_count,
		            lessee_count: req.body.lessee_count,
		            // houserules_id: req.body.houserules_id,
		           	amenties_id : req.body.amenties_id,
		           	asset_status : "1",
		           	createdAt: moment().valueOf(),

		           });

		 	 	//To check whether user or found or not to create the asset for particular user
		 	 	 User.findOne({_id: lessor_id})
                .exec(function (err, user) {
                  if (err) { return next(err); }
                  if (user==null) { // No results.
                     
                      res.status(404).json({
		 				errors : "Leasor not found"
		 				});
                    }
                  else
                  {
                  	listings.save(function (err,asset) {
		                if (err) {

		                 res.status(409).json({	errors : err});

		                  }
		                // Successful

		                  res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
		            });
                  }
              });
		 }
	}
];

/**
 * [asset_update_post - To update the basic details of the asset]
 * @type {Array}
 */
exports.asset_update_post = [


    (req, res, next) => {
	var address = req.body.address;
	var roomtype_id =  req.body.roomtype_id;
	var property_id = req.body.property_id;
	var asset_id = req.body.asset_id;

	req.checkBody('address', 'address is required').notEmpty();
	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('roomtype_id', 'roomtype_id is required').notEmpty();
	req.checkBody('property_id', 'property_id is required').notEmpty();

     const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {


       	var listings = new Listings(
		          {
		          	 _id: asset_id,
		          	address: req.body.address,
		            roomtype_id: req.body.roomtype_id,
		          	property_id: req.body.property_id,
		            bathroom_count: req.body.bathroom_count,
		            bedtype_id: req.body.bedtype_id,
		            bedroom_count: req.body.bedroom_count,
		            // houserules_id: req.body.houserules_id,
		           	amenties_id : req.body.amenties_id,
		           	last_updated: moment().valueOf(),

		           });




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


                  	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, function (err, list) {
                if (err) { return next(err); }
                // Successful.
                 res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						     "asset_id": asset.assetId,
						    }
			 	    });

            	});

                  }

              });




		 }
    }
];

/**
 * [asset_update_amenities - To update or create amenities for particular listing]
 * @type {Array}
 */
exports.asset_update_amenities = [

(req, res, next) => {

	var amenities_id = req.body.amenities_id;
	var asset_id = req.body.asset_id;

	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('amenities_id', 'amenities_id is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                amenties_id: amenities_id,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "add Successful",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });

	      		 }
            });
		 }
	}
];



/**
 * [asset_update_title - To update or create title for particular listing]
 * @type {Array}
 */

exports.asset_update_title = [

(req, res, next) => {

	var title = req.body.title;
	var asset_id = req.body.asset_id;

	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('title', 'title is required').notEmpty();

		const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                title: title,
                asset_status: "2",
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful
	                res.status(200).json({
	                	"status": 200,
    					"message": "Success",
						"data": {
						   "list_id": asset.assetId,
						}
			 	    });
           		 }
            });
		 }
	}
];

//
/**
 * [asset_update_description - To update or create Descriptions for particular listing]
 * @type {Array}
 */
exports.asset_update_description = [

(req, res, next) => {

	var description = req.body.description;
	var asset_id = req.body.asset_id;

	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('description', 'description is required').notEmpty();

		const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                desc: description,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "add Successful",
						    "data": {
						        "asset_id": asset.listId,
						    }
			 	    });
           		 }
            });
		 }
	}
];


/**
 * [asset_update_houserules - To update or create house rules for particular listing]
 * @type {Array}
 */
exports.asset_update_houserules = [

(req, res, next) => {

	var houserules = req.body.houserules;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('houserules', 'houserules is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                houserules: houserules,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}
];


/**
 * [asset_update_availability - To update or create availability_type for particular listing]
 * @type {Array}
 */
exports.asset_update_availability = [

(req, res, next) => {

	var availability_type = req.body.availability_type;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('availability_type', 'availability_type is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                availability_type: availability_type,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
	 				errors : "Asset not found"
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}
];

/**
 * [asset_publicStatus - To update or create publish for particular listing]
 * @type {Array}
 */
exports.asset_publicStatus = [

(req, res, next) => {
	var public_status = req.body.public_status;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('public_status', 'public_status is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                public_status: public_status,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }

}

];

/**
 * [asset_update_specialOffer - To update or create discount offer for particular asset promotion]
 * @type {Array}
 */
exports.asset_update_specialOffer = [

(req, res, next) => {

	var special_offer = req.body.special_offer;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('special_offer', 'special_offer is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                special_offer: special_offer,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}
];

/**
 * [asset_update_specialDiscount - - To update or create special discount for particular listing]
 * @type {Array}
 */
exports.asset_update_specialDiscount = [

(req, res, next) => {

	var weekly_discount = req.body.weekly_discount;
	var monthly_discount = req.body.monthly_discount;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
	req.checkBody('monthly_special_discount', 'monthly_special_discount is required').notEmpty();
	req.checkBody('weekly_special_discount', 'weekly_special_discount is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                weekly_discount: weekly_discount,
                monthly_discount: monthly_discount,
                asset_status: "3",
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
                		"status": 404,
    					"message": "Asset not found",
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}
];


/**
 * [asset_availabiltySettings -  To update or create availability settings for particular listing]
 * @type {Array}
 */
exports.asset_availabiltySettings = [

(req, res, next) => {

    var notify_day = req.body.notify_day;
    var asset_id = req.body.asset_id;
    var min_night = req.body.min_night;
    var max_night = req.body.max_night;

    req.checkBody('asset_id').notEmpty().withMessage('asset_id is required')
    req.checkBody('notify_day', 'notify_day is required').notEmpty();
    req.checkBody('min_night', 'min_night is required').notEmpty();
    req.checkBody('max_night', 'max_night is required').notEmpty();

         const errors = req.validationErrors();

        if ( errors) {
            res.status(409).json({
                 errors : errors
             });
         }
         else
         {
              var listings = new Listings(
            {
                notify_day: notify_day,
                min_night : min_night,
                max_night : max_night,
                _id: asset_id
            });

             // Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                    res.status(404).json({
                        "status": 404,
                        "message": "Asset not found",
                     });
                }
                 else
                 {
                    // Successful
                    res.status(200).json({
                          "status": 200,
                           "message": "add Successful",
                            "data": {
                                "asset_id": asset.assetId,
                            }
                     });

                   }
            });
         }
    }
];


/**
 * [asset_update_priceMode - To update the pricemode for the particular asset]
 * @type {Array}
 */
exports.asset_update_priceMode =[

(req, res, next) => {

	var price_mode = req.body.price_mode;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required');
	req.checkBody('price_mode', 'price_mode is required').notEmpty();

		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                price_mode: price_mode,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
	 				errors : "Asset not found"
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}

];

/**
 * [asset_update_price - To update the price details foe the particular  asset]
 * @type {Array}
 */
exports.asset_update_price =[

(req, res, next) => {

	var base_price = req.body.base_price;
	var demand_min_price = req.body.demand_min_price;
	var demand_max_price =  req.body.demand_max_price;
	var currency_code =  req.body.currency_code;
	var asset_id = req.body.asset_id;


	req.checkBody('asset_id').notEmpty().withMessage('asset_id is required');
	req.checkBody('base_price', 'base_price is required').notEmpty();
	req.checkBody('demand_min_price').notEmpty().withMessage('demand_min_price is required');
	req.checkBody('demand_max_price', 'demand_max_price is required').notEmpty();
	req.checkBody('currency_code', 'currency_code is required').notEmpty();


		 const errors = req.validationErrors();

        if ( errors) {
        	res.status(409).json({
		 		errors : errors
		 	});
		 }
		 else
		 {
		 	 var listings = new Listings(
            {
                base_price: base_price,
                demand_min_price: demand_min_price,
                demand_max_price: demand_max_price,
                currency_code: currency_code,
                _id: asset_id
            });

		 	// Data from form is valid. Update the record.
            Listings.findByIdAndUpdate(asset_id, listings, {}, function (err, asset) {
                if (err) { return next(err); }
                if(asset==null)
                {
                	res.status(404).json({
	 				errors : "Asset not found"
	 				});
                }
 				else
 				{
	                // Successful.
	                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "asset_id": asset.assetId,
						    }
			 	    });
           		 }
            });
		 }
	}

];

/**
 * [asset_detail - To display the details of the particular asset]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.asset_detail = function(req, res, next) {

    async.parallel({
        listings: function(callback) {

            Listings.findById(req.params.id)
            .exec(callback);
        },
        listCalendar: function(callback) {

          ListCalendar.find({ 'asset_id': req.params.id, 'native_id': req.get('native_id') })
          .exec(callback);
        },
        listImage: function(callback) {

          ListImage.find({ 'asset_id': req.params.id, 'native_id': req.get('native_id') })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.listings==null) { // No results.
            res.status(404).json({
	 				errors : "Asset not found"
	 		});
        }
        // Successful.

          res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "basic_details": results.listings,
						        "availability": results.listCalendar,
						        "img_details": results.listImage,


						    }
			 	    });
    });

};

/**
 * [lessor_asset_detail - To get the asset details for particular lessor]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.lessor_asset_detail = function(req, res, next) {

	Listings.find({'lessor_id': req.params.id, 'native_id': req.get('native_id')})
    .populate('listcalendar')
    .exec(function (err, asset_books) {
      if (err) { return next(err); }
      // Successful, so render
        res.status(200).json({
                          "status": 200,
                           "message": "Success",
                            "data": {
                                "asset_detail": asset_books,
                            }
                    });


});


    /* Another way

    async.parallel({
        listings: function(callback) {

            Listings.find({ 'lessor_id': req.params.id })
            .exec(callback);
        },
        listCalendar: function(callback) {

          ListCalendar.find({ 'lessor_id': req.params.id})
          .exec(callback);
        },
        // listImage: function(callback) {

        //   ListImage.find({ 'list_id': results.listings._id })
        //   .exec(callback);
        // },
    }, function(err, results) {

        if (err) { return next(err); }
        if (results.listings==null) { // No results.
            res.status(404).json({
	 				errors : "List not found"
	 		});
        }
        // Successful, so render.
          res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						        "basic_details": results.listings,
						        "availability": results.listCalendar,
						       // "img_details": results.listImage,


						    }
			 	    });
    });
    */

};

/**
 * [asset_delete - To delete the asset]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.asset_delete = function(req, res, next) {

	 async.parallel({
        asset: function(callback) {
            Listings.findById(req.params.id).exec(callback);
        },
        assetCalendar: function(callback) {
            ListCalendar.find({ 'asset_id': req.params.id }).exec(callback);
        },
        assetImage: function(callback) {
            ListImage.find({ 'asset_id': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.asset.length > 0) {
             res.status(404).json({
	 				errors : "Asset not found"
	 		});
           
        }
        else {
            Listings.findByIdAndRemove(req.params.id, function deleteAsset(err) {
                if (err) { return next(err); }
                // Success.
                res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
				
			 	    });
                
            });

        }
    });

    
};
