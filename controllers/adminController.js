/** @type {[type]} [description] */
var async = require('async')
var cloudinary = require('cloudinary');
var Amenities = require('../models/amenities')
var asset_type = require('../models/assettype')
var Static_pages = require('../models/staticpages')
var Country = require('../models/country')
var Language = require('../models/language')
var Currency = require('../models/currency')
var Fees = require('../models/fees')
var Meta_titles = require('../models/metatitles')
var Api_credentials = require('../models/apicredentials')
var Join_us = require('../models/joinus')
var Theme_settings = require('../models/themesettings')
var Settings = require('../models/settings')
var Payment_gateway = require('../models/paymentgateway')
var Assetrules = require('../models/assetrules')
var Message_type = require('../models/messagetype')
var Reservation_type = require('../models/reservationtype')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Handle Amenities create on POST.
/**    
 * [Handle Amenities create on POST]
 * @type {Array}
 * @param {[string]} [amenity_name] [Unique Name of amenities]
 * @param {[string]} [amenity_desc] [description of the amenities]
 * @param {[string]} [amenity_status] [Status of the amenities]
 */
exports.amenities_create_post = [

    // Validate fields.
    body('amenity_name', 'Amenity name must not be empty.').isLength({ min: 1 }).trim(),
    body('amenity_desc', 'Amenity desc must not be empty.').isLength({ min: 1 }).trim(),
    body('amenity_status', 'Amenity status must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    
    (req, res, next) => {
   // return console.log(req.files[0]);
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (errors.isEmpty(req.body) && req.files[0].uploadcare_file_id !="" && req.get('native_id') !="") {

            async.parallel({
		        amenities_count: function(callback) {
		            Amenities.count(callback);
		        },
		        amenities_check: function(callback) {

		          Amenities.find({ 'amenity_name': req.body.amenity_name, 'native_id' : req.get('native_id')})
		          .exec(callback);
		        },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.amenities_check == "" || results.amenities_check == null){ 
    			        var amenities = new Amenities(
    			          { 
                      native_id: req.get('native_id'),
                      serial_no: results.amenities_count+1,
    			          	amenity_name: req.body.amenity_name,
    			            amenity_desc: req.body.amenity_desc,
    			            amenity_icon: req.files[0].uploadcare_file_id,
    			            amenity_status: req.body.amenity_status,
    			           });

					amenities.save(function (err) {
		                if (err) { return next(err); }
		                   // Successful - to send the response.
		                   // res.json(amenities);
                        res.json({ 
                          status:200,
                          message:'Added Successful',
                          data : [amenities]
                        });
		                });

                }else{
                	res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
        	res.json({'status':404,'message':'Is Empty'});
        }
    }
];
// Handle Amenities create on POST.
/** 
 * [amenities_edit_post description]
 * @type {Array}
 * @param {[string]} [amenity_name] [Unique Name of amenities]
 * @param {[string]} [amenity_desc] [description of the amenities]
 * @param {[string]} [amenity_status] [Status of the amenities]
 */
exports.amenities_edit_post = [

    // Validate fields.
    body('amenity_name', 'Amenity name must not be empty.').isLength({ min: 1 }).trim(),
    body('amenity_desc', 'Amenity desc must not be empty.').isLength({ min: 1 }).trim(),
    body('amenity_status', 'Amenity status must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (errors.isEmpty() && req.files[0].uploadcare_file_id !="") {
            

            // Get all amenities count and check amenitiy alredy exits or not for form.
            async.parallel({
		        amenities_check: function(callback) {

		          Amenities.find({ '_id': req.params.amenity_id })
		          .exec(callback);
		        },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.amenities_check != "" || results.amenities_check != null){
        					var amenities =  {
      			          	amenity_name: req.body.amenity_name,
      			            amenity_desc: req.body.amenity_desc,
      			            amenity_icon: req.files[0].uploadcare_file_id,
      			            amenity_status: req.body.amenity_status,
        					}
					Amenities.findByIdAndUpdate(req.params.amenity_id,
						amenities, {}, function (err,result) {
		                if (err) { return next(err); }
		                   // Successful - to send the response.
		                   res.json(
				               { status:200,
				               	message:'update Successful',
				                data : [amenities]
					           });
		                });

                }else{
                	res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
        	res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all amenities list
/** 
 * Get sorted amenities list 
 */
exports.amenities_list = function (req, res, next) {

    Amenities.find({'native_id' : req.get('native_id')})
        .sort([['amenity_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
		    res.status(200).json({
		        status: 200,
		        message: "Success",
		        data : list		        
		    });
        })

};

// Handle Room_type create on POST.
/** 
 * [asset_create_post Make the new asset]
 * @type {Array}
 * @param {string} [asset_type] [Name of the asset]
 * @param {string} [asset_type_status] [Status of the asset]
 */
exports.asset_create_post = [

    // Validate fields.
    body('asset_type', 'Asset type must not be empty.').isLength({ min: 1 }).trim(),
    body('asset_type_status', 'Asset type status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all asset_type count and check asset_type alredy exits or not for form.
            async.parallel({
		        asset_type_count: function(callback) {
		            Asset_type.count(callback);
		        },
		        asset_type_check: function(callback) {

		          Asset_type.find({ 'room_type': req.body.asset_type })
		          .exec(callback);
		        },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.asset_type_check == "" || results.asset_type_check == null && req.get('native_id') != ""){
			        //Create a asset_type object with escaped and trimmed data.
			        var asset_type = new Asset_type({
                        native_id: req.get('native_id'),
                        serial_no: results.asset_type_count+1,
			          	asset_type: req.body.asset_type,
			            asset_type_status: req.body.asset_type_status,
			           });
					  asset_type.save(function (err) {
		                if (err) { return next(err); }
		                   // Successful - to send response.
                        res.json({
                          status:200,
                          message:'Added Successful',
                          data : [asset_type]
                        });
		                });

                }else{
                	res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
        	res.json({'status':409,'message': errors.array()});
        }
    }
];
// Handle Room_type edit on POST.
/**  
 * [asset_type_edit_post to edit the asset]
 * @type {Array}
 * @param {string} [asset_type] [Name of the asset]
 * @param {string} [asset_type_status] [Status of the asset]
 */
exports.asset_type_edit_post = [

    // Validate fields.
    body('asset_type', 'asset type must not be empty.').isLength({ min: 1 }).trim(),
    body('asset_type_status', 'asset type status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all amenities count and check amenitiy alredy exits or not for form.
            async.parallel({
		        asset_type_check: function(callback) {
		          Asset_type.find({ '_id': req.params.edit_asset_type_id })
		          .exec(callback);
		        },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.asset_type_check != "" || results.asset_type_check != null){
  					var asset_type =  {
			          	asset_type: req.body.asset_type,
			            asset_type_status: req.body.asset_type_status,
  					}
			        //Create a Room_type object with escaped and trimmed data
					  Asset_type.findByIdAndUpdate(req.params.edit_asset_type_id,
						  asset_type, {}, function (err,result) {
		                if (err) { return next(err); }
		                   // Successful - to send response.
		                   res.json(
				               { status:200,
				               	message:'update Successful',
				                data : [asset_type]
					           });
		                });

              }else{
                res.json({'status':409,'message':'asset not exists'})
              }
            });
            return;
        }
        else {
        	res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all asset list
/**
 *  Get sorted asset list
 */
exports.asset_list = function (req, res, next) {
    Asset_type.find({'native_id' : req.get('native_id')})
        .sort([['asset_type', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
		    res.status(200).json({
		        status: 200,
		        message: "Success",
		        data : list		        
		    });
        })

};


// Handle Static Page create on POST.
/** 
 * [Handle Static Page create on POST]
 * @type {Array}
 * @param {string} [page_name] [Name of the page]
 * @param {string} [language] [ISO format language name]
 * @param {string} [content] [detail html content]
 * @param {string} [page_status] [refer page active / not]
 */
exports.static_page_create_post = [

    // Validate fields.
    body('page_name', 'Page name must not be empty.').isLength({ min: 1 }).trim(),
    body('language', 'Language must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
    body('page_status', 'Page status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all Static Page count and check Static Page alredy exits or not for form.
            async.parallel({
                static_page_count: function(callback) {
                    Static_pages.count(callback);
                },
                static_page_check: function(callback) {

                  Static_pages.find({ 'page_name': req.body.page_name })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.static_page_check == "" || results.static_page_check == null && req.get('native_id') !=""){
                    //Create a static_page object with escaped and trimmed data.
                    var static_pages = new Static_pages({
                        native_id: req.get('native_id'),
                        page_name: req.body.page_name,
                        language: req.body.language,
                        content: req.body.content,
                        page_status: req.body.page_status,
                       });
                    static_pages.save(function (err) {
                        if (err) { return next(err); }
                           // Successful - to send response.
                            res.json(
                              { status:200,
                                message:'update Successful',
                                data : [static_pages]
                            });
                        });

                }else{
                    res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];
// Handle static pages edit on POST.
/**  
 * [Handle static pages edit on POST.]
 * @param {string} [page_name] [Name of the page]
 * @param {string} [language] [ISO format language name]
 * @param {string} [content] [detail html content]
 * @param {string} [page_status] [refer page active / not]
 */
exports.static_pages_edit_post = [

    // Validate fields.
    body('page_name', 'Page name must not be empty.').isLength({ min: 1 }).trim(),
    body('language', 'Language must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
    body('page_status', 'Page status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all amenities count and check amenitiy alredy exits or not for form.
            async.parallel({
                static_page_check: function(callback) {
                  Static_pages.find({ '_id': req.params.edit_static_pages_id })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.static_page_check != "" || results.static_page_check != null ){
                    var static_pages =  {
                        page_name: req.body.page_name,
                        language: req.body.language,
                        content: req.body.content,
                        page_status: req.body.page_status,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Static_pages.findByIdAndUpdate(req.params.edit_static_pages_id,
                        static_pages, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send response.
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [static_pages]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all static_pages list
/** 
 * Get all Static page list
 */
exports.static_pages_list = function (req, res, next) {

    Static_pages.find({'native_id' : req.get('native_id')})
        .sort([['page_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle country create on POST.
/** 
 * [Handle country create on POST]
 * @param {string} [short_name] [Country short name]
 * @param {string} [short_name] [Country name]
 * @param {string} [country_code] [Country code]
 * @param {string} [country_status] [Weather country active / deactive]
 */
exports.country_create_post = [

    // Validate fields.
    body('short_name', 'Short name must not be empty.').isLength({ min: 1 }).trim(),
    body('full_name', 'Full name must not be empty.').isLength({ min: 1 }).trim(),
    body('country_code', 'Country code must not be empty.').isLength({ min: 1 }).trim(),
    body('country_status', 'Country status must not be empty.').trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
       // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all country count and check country alredy exits or not for form.
            async.parallel({
                country_count: function(callback) {
                    Country.count(callback);
                },
                country_check: function(callback) {

                  Country.find({ 'full_name': req.body.full_name })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.country_check == "" || results.country_check == null && req.get('native_id') != ""){
                    //Create a country object with escaped and trimmed data.
                    var country = new Country({
                        native_id: req.get('native_id'),
                        short_name: req.body.short_name,
                        full_name: req.body.full_name,
                        country_code: req.body.country_code,
                        country_status: req.body.country_status,
                       });
                    country.save(function (err) {
                        if (err) { return next(err); }
                           res.json(country);
                    });

                }else{
                    res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];
// Handle static_pages edit on POST.
/**  
 * [Handle static_pages edit on POST.]
 * @param {string} [short_name] [Country short name]
 * @param {string} [short_name] [Country name]
 * @param {string} [country_code] [Country code]
 * @param {string} [country_status] [Weather country active / deactive]
 */
exports.country_edit_post = [

    // Validate fields.
    body('short_name', 'Short name must not be empty.').isLength({ min: 1 }).trim(),
    body('full_name', 'Full name must not be empty.').isLength({ min: 1 }).trim(),
    body('country_code', 'Country code must not be empty.').isLength({ min: 1 }).trim(),
    body('country_status', 'Country status must not be empty.').trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all country count and check country alredy exits or not for form.
            async.parallel({
                country_check: function(callback) {
                  Country.find({ '_id': req.params.country_id })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.country_check != "" || results.country_check != null ){
                    var country =  {
                        short_name: req.body.short_name,
                        full_name: req.body.full_name,
                        country_code: req.body.country_code,
                        country_status: req.body.country_status,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Country.findByIdAndUpdate(req.params.country_id,
                        country, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send response.
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [country]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all static_pages list
/** 
 * Get sorted static pages list
 */
exports.country_list = function (req, res, next) {

    Country.find({'native_id' : req.get('native_id')})
        .sort([['full_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Language create on POST.
/** 
 * [Handle Language create on POST]
 * @param {string} [lang_name] [Language name]
 * @param {string} [lang_code] [Language code]
 * @param {string} [lang_status] [Weather active/ deactive]
 */
exports.language_create_post = [
    // Validate fields.
    body('lang_name', 'Lang name must not be empty.').isLength({ min: 1 }).trim(),
    body('lang_code', 'Lang code must not be empty.').isLength({ min: 1 }).trim(),
    body('lang_status', 'Lang status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check country alredy exits or not for form.
            async.parallel({
                language_check: function(callback) {
                  Language.find({ 'lang_name': req.body.lang_name })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.language_check == "" || results.language_check == null && req.get('native_id') !=""){

                    //Create a language object with escaped and trimmed data.
                    var language = new Language({
                        native_id: req.get('native_id'),
                        lang_name: req.body.lang_name,
                        lang_code: req.body.lang_code,
                        lang_status: req.body.lang_status,
                       });
                    language.save(function (err) {
                        if (err) { return next(err); }
                           res.json(language);
                        });

                }else{
                    res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];
// Handle Language edit on POST.
/**  
 * [Handle Language edit on POST.]
 * @param {string} [lang_name] [Language name]
 * @param {string} [lang_code] [Language code]
 * @param {string} [lang_status] [Weather active/ deactive]
 */
exports.language_edit_post = [

    // Validate fields.
    body('lang_name', 'Lang name must not be empty.').isLength({ min: 1 }).trim(),
    body('lang_code', 'Lang code must not be empty.').isLength({ min: 1 }).trim(),
    body('lang_status', 'Lang status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all country count and check country alredy exits or not for form.
            async.parallel({
                language_check: function(callback) {
                  Language.find({ '_id': req.params.language_id })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.language_check != "" || results.language_check != null ){
                    var language =  {
                        lang_name: req.body.lang_name,
                        lang_code: req.body.lang_code,
                        lang_status: req.body.lang_status,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Language.findByIdAndUpdate(req.params.language_id,
                        language, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to sent response.
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [language]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all Langusge list
/** 
 * Get all language list
 */
exports.language_list = function (req, res, next) {

    Language.find({'native_id' : req.get('native_id')})
        .sort([['lang_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Currency create on POST.
/** 
 * [Handle Currency create on POST]
 * @param {string} [currency_name] [Currency standart name]
 * @param {string} [currency_code] [Currency code]
 * @param {string} [currency_symbol] [Symol based currency]
 * @param {string} [currency_rate] [Current currency rate]
 * @param {string} [currency_status] [Weather is active / deactive]
 */
exports.currency_create_post = [

    // Validate fields.
    body('currency_name', 'Currency name must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_code', 'Currency code must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_symbol', 'Currency symbol must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_rate', 'Currency rate must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_status', 'Currency status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check Currency alredy exits or not for form.
            async.parallel({
                currency_check: function(callback) {
                  Currency.find({ 'currency_name': req.body.currency_name })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.currency_check == "" || results.currency_check == null && req.get('native_id') !=""){
                    //Create a language object with escaped and trimmed data.
                    var currency = new Currency({
                        native_id: req.get('native_id'),
                        currency_name: req.body.currency_name,
                        currency_code: req.body.currency_code,
                        currency_symbol: req.body.currency_symbol,
                        currency_rate: req.body.currency_rate,
                        currency_status: req.body.currency_status,
                       });
                    currency.save(function (err) {
                        if (err) { return next(err); }
                           res.json(currency);
                    });

                }else{
                    res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];
// Handle Currency edit on POST.
/**  
 * [Handle Currency edit on POST.]
 * @param {string} [currency_name] [Currency standart name]
 * @param {string} [currency_code] [Currency code]
 * @param {string} [currency_symbol] [Symol based currency]
 * @param {string} [currency_rate] [Current currency rate]
 * @param {string} [currency_status] [Weather is active / deactive]
 */
exports.currency_edit_post = [

    // Validate fields.
    body('currency_name', 'Currency name must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_code', 'Currency code must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_symbol', 'Currency symbol must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_rate', 'Currency rate must not be empty.').isLength({ min: 1 }).trim(),
    body('currency_status', 'Currency status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all country count and check country alredy exits or not for form.
            async.parallel({
                currency_check: function(callback) {
                  Currency.find({ '_id': req.params.currency_id })
                  .exec(callback);
                },
             }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.currency_check != "" || results.currency_check != null){
                    var currency =  {
                        currency_name: req.body.currency_name,
                        currency_code: req.body.currency_code,
                        currency_symbol: req.body.currency_symbol,
                        currency_rate: req.body.currency_rate,
                        currency_status: req.body.currency_status,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Currency.findByIdAndUpdate(req.params.currency_id,
                        currency, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send response .
                            res.json(
                               { status:200,
                                message:'update Successful',
                                data : [currency]
                            });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all static_pages list
/** 
 * List all Currency sorted by currency name.
 */
exports.currency_list = function (req, res, next) {

    Currency.find({'native_id' : req.get('native_id')})
        .sort([['currency_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};


// Handle Fees edit on POST.
/**  
 * [Handle Fees edit on POST.]
 * @param {string} [name] [name of the fees management]
 * @param {string} [is_fixed] [It determin the fixed value / percenatge ]
 * @param {string} [percenatge] [percenatge value]
 * @param {string} [fixed_value] [Fixed fee amount]
 * @param {string} [currency] [Type of currency]
 */
exports.fees_edit_post = [

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('is_fixed', 'Is fixed must not be empty.').isLength({ min: 1 }).trim(),
    body('percenatge', 'Percenatge must not be empty.').isLength({ min: 1 }).trim(),
    body('fixed_value', 'Fixed value must not be empty.').isLength({ min: 1 }).trim(),
    body('currency', 'Currency must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all country count and check country alredy exits or not for form.
            async.parallel({
                fees_check: function(callback) {
                  Fees.find({ '_id': req.params.fees_id })
                  .exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.fees_check != "" || results.fees_check != null  ){
                    var fees =  {
                        name: req.body.name,
                        is_fixed: req.body.is_fixed,
                        percenatge: req.body.percenatge,
                        fixed_value: req.body.fixed_value,
                        currency: req.body.currency,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Fees.findByIdAndUpdate(req.params.fees_id,
                        fees, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send response.
                            res.json(
                               { status:200,
                                message:'update Successful',
                                data : [fees]
                            });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all Fees list
/** 
 * List all fees list is sorted by fee name. 
 */
exports.fees_list = function (req, res, next) {

    Fees.find({'native_id' : req.get('native_id')})
        .sort([['name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Meta-titles edit on POST.
/**  
 * [Handle Meta-titles edit on POST.]
 * @param {string} [title] [Meta title]
 * @param {string} [descrption] [description of the metatitle]
 * @param {string} [url] [Meta full url link]
 */
exports.metatitles_edit_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('descrption', 'Descrption must not be empty.').isLength({ min: 1 }).trim(),
    body('url', 'Url must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check metatitles_edit_post alredy exits or not for form.
            async.parallel({
                metatitles_check: function(callback) {
                  Meta_titles.find({ '_id': req.params.metatitles_id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.metatitles_check != "" || results.metatitles_check != null ){
                    var metatitles =  {
                        title: req.body.title,
                        descrption: req.body.descrption,
                        url: req.body.url,
                    }
                    //Create a Room_type object with escaped and trimmed data
                    Meta_titles.findByIdAndUpdate(req.params.metatitles_id,
                        metatitles, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send response.
                            res.json(
                               { status:200,
                                message:'update Successful',
                                data : [metatitles]
                            });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all metatitles list
/** 
 * List all meta-titles is sorted by title
 */
exports.metatitles_list = function (req, res, next) {

    Meta_titles.find({'native_id' : req.get('native_id')})
        .sort([['title', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Api-credentials edit on POST.
/**  
 * [Handle Api-credentials edit on POST.]
 * @param {string} [fb_client_id] [Facebook client id]
 * @param {string} [fb_secret_id] [Facebook secret id]
 * @param {string} [google_client_id] [google client id]
 * @param {string} [google_secret_id] [google secret id]
 * @param {string} [google_api_id] [google api key]
 */
exports.apicredentials_edit_post = [

    // Validate fields.
    body('fb_client_id', 'Fb client id must not be empty.').isLength({ min: 1 }).trim(),
    body('fb_secret_id', 'Fb secret id must not be empty.').isLength({ min: 1 }).trim(),
    body('google_client_id', 'Google client id must not be empty.').isLength({ min: 1 }).trim(),
    body('google_secret_id', 'Google secret id must not be empty.').isLength({ min: 1 }).trim(),
    body('google_api_id', 'Google api id must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check Api_credentials  exits or not for form.
            async.parallel({
                apicredentials_check: function(callback) {
                  Api_credentials.find({ '_id': req.params.id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.apicredentials_check != "" || results.apicredentials_check != null){
                    var apicredentials =  {
                        fb_client_id: req.body.fb_client_id,
                        fb_secret_id: req.body.fb_secret_id,
                        google_client_id: req.body.google_client_id,
                        google_secret_id: req.body.google_secret_id,
                        google_api_id: req.body.google_api_id,
                    }
                    //Create a Api_credentials object with escaped and trimmed data
                    Api_credentials.findByIdAndUpdate(req.params.id,
                        apicredentials, {}, function (err,result) {
                        if (err) { return next(err); }
                           // Successful - to send responsive.
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [apicredentials]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all api-credentials list
/** 
 * List all api-credentials
 */
exports.apicredentials_list = function (req, res, next) {

    Api_credentials.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle joinus edit on POST.
/**  
 * [Handle joinus edit on POST.]
 * @param {string} [fb_link] [Facebook joinus link]
 * @param {string} [twitter_link] [Twitter joinus link]
 * @param {string} [gplus_link] [Google joinus link]
 * @param {string} [youtube_link] [Youtube joinus link]
 */
exports.joinus_edit_post = [

    // Validate fields.
    body('fb_link', 'Fb link must not be empty.').isLength({ min: 1 }).trim(),
    body('twitter_link', 'Twitter link must not be empty.').isLength({ min: 1 }).trim(),
    body('gplus_link', 'Google link must not be empty.').isLength({ min: 1 }).trim(),
    body('youtube_link', 'Youtube link must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check joinus exits or not for form.
            async.parallel({
                joinus_check: function(callback) {
                  Join_us.find({ '_id': req.params.id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.joinus_check != "" || results.joinus_check != null){
                    var joinus =  {
                        fb_link: req.body.fb_link,
                        twitter_link: req.body.twitter_link,
                        gplus_link: req.body.gplus_link,
                        youtube_link: req.body.youtube_link,
                    }
                    //update joinus object with escaped and trimmed data
                    Join_us.findByIdAndUpdate(req.params.id,
                        joinus, {}, function (err,result) {
                        if (err) { return next(err); }
                            res.json(
                               { status:200,
                                message:'update Successful',
                                data : [joinus]
                            });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all joinus_list list
exports.joinus_list = function (req, res, next) {

    Join_us.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle theme_settings_edit_post edit on POST.
exports.theme_settings_edit_post = [
    // Validate fields.
    body('font_color', 'Font color must not be empty.').isLength({ min: 1 }).trim(),
    body('font_family', 'Font family must not be empty.').isLength({ min: 1 }).trim(),
    body('background_color', 'Background color must not be empty.').isLength({ min: 1 }).trim(),
    body('header_color', 'Header color must not be empty.').isLength({ min: 1 }).trim(),
    body('footer_color', 'Footer color must not be empty.').isLength({ min: 1 }).trim(),
    body('link_color', 'Link color must not be empty.').isLength({ min: 1 }).trim(),
    body('primary_button_color', 'Primary button color must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check theme_settings exits or not for form.
            async.parallel({
                theme_settings_check: function(callback) {
                  Theme_settings.find({ '_id': req.params.id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.theme_settings_check != "" || results.theme_settings_check != null){
                   
                    var themesettings =  {
                        font_color: req.body.font_color,
                        font_family: req.body.font_family,
                        background_color: req.body.background_color,
                        header_color: req.body.header_color,
                        footer_color: req.body.footer_color,
                        link_color: req.body.link_color,
                        primary_button_color: req.body.primary_button_color,
                    }
                    //update joinus object with escaped and trimmed data
                    Theme_settings.findByIdAndUpdate(req.params.id,
                        themesettings, {}, function (err,result) {
                        if (err) { return next(err); }
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [themesettings]
                            });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all joinus_list list
exports.theme_settings_list = function (req, res, next) {
    Theme_settings.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle settings edit on POST.
/**  
 * [Handle settings edit on POST.]
 * @type {Array} variables are posted to array format
 */
exports.settings_edit_post = [
    // Validate fields.
    body('site_name', 'Site name must not be empty.').isLength({ min: 1 }).trim(),
    body('default_currency', 'Default currency must not be empty.').isLength({ min: 1 }).trim(),
    body('default_lang', 'Default lang must not be empty.').isLength({ min: 1 }).trim(),
    body('maintanance_mode', 'Maintanance mode must not be empty.').isLength({ min: 1 }).trim(),
    body('site_date_format', 'Site date format must not be empty.').isLength({ min: 1 }).trim(),
    body('default_time_zone', 'Default time zone must not be empty.').isLength({ min: 1 }).trim(),
    body('meta_keyword', 'Meta keyword must not be empty.').isLength({ min: 1 }).trim(),
    body('meta_desc', 'Meta desc must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty() && req.files.fav_icon[0].uploadcare_file_id != "" && req.files.logo[0].uploadcare_file_id) {
            // Check joinus exits or not for form.
            async.parallel({
                settings_check: function(callback) {
                  Settings.find({ '_id': req.params.id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.settings_check != "" || results.settings_check != null){
                    var settings =  {
                        site_name: req.body.site_name,
                        logo: req.files.logo[0].uploadcare_file_id,
                        fav_icon: req.files.fav_icon[0].uploadcare_file_id,
                        default_currency: req.body.default_currency,
                        default_lang: req.body.default_lang,
                        maintanance_mode: req.body.maintanance_mode,
                        site_date_format: req.body.site_date_format,
                        default_time_zone: req.body.default_time_zone,
                        meta_keyword: req.body.meta_keyword,
                        meta_desc: req.body.meta_desc,
                    }
                    //update joinus object with escaped and trimmed data
                    Settings.findByIdAndUpdate(req.params.id,
                        settings, {}, function (err,result) {
                        if (err) { return next(err); }
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [settings]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all joinus_list list
exports.settings_list = function (req, res, next) {
    Settings.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Payment gateway edit on POST.
/**  
 * [Handle Payment gateway edit on POST.]
 * @type {Array} Payment gateway variables posetd at array
 */
exports.paymentgateway_edit_post = [

    // Validate fields.
    body('payment_method', 'Payment method must not be empty.').isLength({ min: 1 }).trim(),
    body('pay_mode', 'Pay mode not be empty.').isLength({ min: 1 }).trim(),
    body('test_api_key', 'Test api key must not be empty.').isLength({ min: 1 }).trim(),
    body('test_secret_key', 'Test secret key must not be empty.').isLength({ min: 1 }).trim(),
    body('live_api_key', 'Live api key must not be empty.').isLength({ min: 1 }).trim(),
    body('live_secret_key', 'Live secret key must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Check Payment gateway exits or not for form.
            async.parallel({
                Payment_gateway_check: function(callback) {
                  Payment_gateway.find({ '_id': req.params.id })
                  .exec(callback);
                },
                
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.Payment_gateway_check != "" || results.Payment_gateway_check != null){
                    var paymentgateway =  {
                          payment_method: req.body.payment_method,
                          pay_mode: req.body.pay_mode,
                          test_api_key: req.body.test_api_key,
                          test_secret_key: req.body.test_secret_key,
                          live_api_key: req.body.live_api_key,
                          live_secret_key: req.body.live_secret_key,
                    }
                    //update joinus object with escaped and trimmed data
                    Payment_gateway.findByIdAndUpdate(req.params.id,
                        paymentgateway, {}, function (err,result) {
                        if (err) { return next(err); }
                           res.json(
                               { status:200,
                                message:'update Successful',
                                data : [paymentgateway]
                               });
                        });

                }else{
                    res.json({'status':409,'message':'Amenity not exists'})
                }
            });
            return;
        }
        else {
            res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all joinus_list list
exports.paymentgateway_list = function (req, res, next) {

    Payment_gateway.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            res.status(200).json({
                status: 200,
                message: "Success",
                data : list             
            });
        })

};

// Handle Assetrules create on POST.
/**    
 * [Handle Assetrules create on POST]
 * @type {Array}
 */
exports.assetrules_create_post = [

    body('rule_name', 'Rule name must not be empty.').isLength({ min: 1 }).trim(),
    body('rule_status', 'Rule status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            async.parallel({
            assetrules_count: function(callback) {
                Assetrules.count(callback);
            },
            assetrules_check: function(callback) {

                Assetrules.find({ 'rule_name': req.body.rule_name })
                .exec(callback);
            },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.assetrules_check == "" || results.assetrules_check == null){
              var assetrules = new Assetrules({
                  native_id: req.get('native_id'),
                  serial_no: results.assetrules_count+1,
                  rule_name: req.body.rule_name,
                  rule_status: req.body.rule_status,
                 });
         
          assetrules.save(function (err) {
                    if (err) { return next(err); }
                        res.json({
                          status:200,
                          message:'Added Successful',
                          data : [assetrules]
                        });
                    });

                }else{
                  res.json({'status':404,'message':'alreaty exists'})
                }
            });
            return;
        }
        else {
          res.json({'status':404,'message':'alreaty exists'});
        }
    }
];
// Handle assetrules Edit on POST.
/** 
 * [assetrules description]
 * @type {Array}
 */
exports.assetrules_edit_post = [
    // Validate fields.
    body('rule_name', 'Rule name must not be empty.').isLength({ min: 1 }).trim(),
    body('rule_status', 'Rule status must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all assetrules count and check amenitiy alredy exits or not for form.
            async.parallel({
            assetrules_check: function(callback) {
              Assetrules.find({ '_id': req.params.id })
              .exec(callback);
            },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.assetrules_check != "" || results.assetrules_check != null ){

            var assetrules =  {
                  rule_name: req.body.rule_name,
                  rule_status: req.body.rule_status,
            }
          //Create a houserules object with escaped and trimmed data
          Assetrules.findByIdAndUpdate(req.params.id,
            assetrules, {}, function (err,result) {
                    if (err) { return next(err); }
                       // Successful - to send response.
                       res.json(
                       { status:200,
                        message:'update Successful',
                        data : [assetrules]
                     });
                    });

                }else{
                  res.json({'status':409,'message':'Not exists'})
                }
            });
            return;
        }
        else {
          res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all assetrules list
exports.assetrules_list = function (req, res, next) {

    Assetrules.find({'native_id' : req.get('native_id')})
        .sort([['rule_name', 'ascending']])
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
            // res.json(list);
        res.status(200).json({
            status: 200,
            message: "Success",
            data : list           
        });
        })

};
// Handle messagetype_edit_post create on POST.
/** 
 * [assetrules messagetype_edit_post]
 * @type {Array}
 */
exports.messagetype_edit_post = [

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('url', 'URL must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (errors.isEmpty()) {

            // Get all messagetype_edit_post count and check amenitiy alredy exits or not for form.
            async.parallel({
            messagetype_check: function(callback) {

              Message_type.find({ '_id': req.params.id })
              .exec(callback);
            },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
             
                if(results.messagetype_check != "" || results.messagetype_check != null ){

          
           
            var messagetype =  {                  
                  name: req.body.name,
                  url: req.body.url,
            }
          //Create a houserules object with escaped and trimmed data
          Message_type.findByIdAndUpdate(req.params.id,
            messagetype, {}, function (err,result) {
                    if (err) { return next(err); }
                       // Successful - redirect to book detail page.
                       res.json(
                       { status:200,
                        message:'update Successful',
                        data : [messagetype]
                     });
                    });

                }else{
                  res.json({'status':409,'message':'Not exists'})
                }
            });
            return;
        }
        else {
          res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all messagetype list
exports.messagetype_list = function (req, res, next) {

    Message_type.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
        res.status(200).json({
            status: 200,
            message: "Success",
            data : list           
        });
        })

};

// Handle messagetype_edit_post create on POST.
/** 
 * [assetrules messagetype_edit_post]
 * @type {Array}
 */
exports.reservation_type_edit_post = [

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Get all reservationtype alredy exits or not for form.
            async.parallel({
            reservationtype_check: function(callback) {
              Reservation_type.find({ '_id': req.params.id })
              .exec(callback);
            },
            }, function(err, results) {
                if (err) { return next(err); }
                //check availability
                if(results.reservationtype_check != "" || results.reservationtype_check != null ){
                var reservation_type =  {                  
                      name: req.body.name,
                      // url: req.body.url,
                }
          //Create a reservationtype object with escaped and trimmed data
          Reservation_type.findByIdAndUpdate(req.params.id,
            reservation_type, {}, function (err,result) {
                    if (err) { return next(err); }
                       // Successful - to send response.
                       res.json(
                       { status:200,
                        message:'update Successful',
                        data : [reservation_type]
                     });
                    });

                }else{
                  res.json({'status':409,'message':'Not exists'})
                }
            });
            return;
        }
        else {
          res.json({'status':409,'message': errors.array()});
        }
    }
];

//get all reservation_type list
exports.reservation_type_list = function (req, res, next) {
    Reservation_type.find({'native_id' : req.get('native_id')})
        .exec(function (err, list) {
            if (err) { return next(err); }
            // Successful, so send.
        res.status(200).json({
            status: 200,
            message: "Success",
            data : list           
        });
        })

};