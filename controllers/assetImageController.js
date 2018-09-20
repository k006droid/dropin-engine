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
 * [asset_add_image - To add the images for the asset]
 * @type {Array}
 */
exports.asset_add_image = [

	(req, res, next) => {
		console.log(req.files);
		// console.log(req.files[0].secure_url);
		if(req.files)
		{
			var listImage = new ListImage(
		          {
               		native_id: req.get('native_id'),
		          	asset_id: req.body.asset_id,
		            lessor_id: req.body.lessor_id,
		          	caption: req.body.caption,
		          	cover_status: req.body.cover_status,
		            img_src: req.files[0].secure_url,
		           	createdAt: moment().valueOf(),

		           });
			listImage.save(function (err) {

		        if (err) {
		            res.status(409).json({	errors : err});
		        }
		        // Successful.
                    res.status(200).json({
	                	  "status": 200,
    					   "message": "Success",
						    "data": {
						     "file_path": req.files[0].secure_url
						    }
			 	    });



		            });

		}
		else{
			res.status(404).json({
                		"status": 404,
    					"message": "Filepath not found",
	 				});

		}

		//req.files.fav_icon[0].secure_url
	}
];
