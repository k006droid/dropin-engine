var mongoose = require('mongoose');
var moment = require('moment');
var express = require('express');
var router = express.Router();
var Asset = require('../models/asset');
var AssetCalendar = require('../models/assetCalendar');
const arrayUnion = require('array-union');
var async = require('async');


/**
 * this method is To Display detail page for a specific assets.
  * @param  {[String]} req  [AssetId]
  *
  * @return {[String]} res [status]
  * @return {[String]} res [message]
  * @return {[String]} res [lessor_id]
  * @return {[String]} res [roomtype_id]
  * @return {[String]} res [property_id]
  * @return {[String]} res [address]
  * @return {[String]} res [houserules]
  * @return {[String]} res [amenties_id]
  * @return {[String]} res [profile_image]
  * @return {[String]} res [bedcounts]
  * @return {[String]} res [bedrooms]
  * @return {[String]} res [bathrooms]
  * @return {[String]} res [title]
  * @return {[String]} res [desc]
  * @return {[String]} res [lessee_count]
  * @return {[String]} res [lat_long]
  * @return {[String]} res [min_night]
  * @return {[String]} res [max_night]
  * @return {[String]} res [price_mode]
  * @return {[String]} res [demand_max_price]
  * @return {[String]} res [demand_min_price]
  * @return {[String]} res [currency_code]
  * @return {[String]} res [base_price]
  * @return {[String]} res [weekly_discount]
  * @return {[String]} res [monthly_discount]
  * @return {[String]} res [publish_status]
  * @return {[String]} res [createdAt]
  * @return {[String]} res [last_updated]
 */
exports.asset_detail = function (req, res, next) {
  async.parallel({
        asset: function (callback) {
            Asset.findById(req.params.asset_id)
                .exec(callback)
        },
        assetCalendar: function (callback) {
            Asset.find({ 'asset_id': req.params.asset_id})
                .exec(callback)
        },
        assetImage: function (callback) {
            Asset.find({ 'asset_id': req.params.asset_id})
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
          return res.status(200).json({
          status :404,
          message : 'Auth failed'
        });
      }
      // Error in API usage.
        if (results.asset == null) { // No results.
            return res.status(404).json({
              status:404,
              message: 'Asset not found'
            });
        }
        // Successful, so render.
        return res.status(200).json({
          status:200,
          message: 'Success',
          data: results.asset.concat(results.assetCalendar).concat(results.assetImage)
        });
    });
};


/**
 * this method is To Display list of assets based on lessee_count.
  * @param  {[String]} req  [native_id]
  * @param  {[String]} req  [lessee_count]
  *
  * @return {[String]} res [status]
  * @return {[String]} res [message]
  * @return {[String]} res [lessor_id]
  * @return {[String]} res [roomtype_id]
  * @return {[String]} res [property_id]
  * @return {[String]} res [address]
  * @return {[String]} res [houserules]
  * @return {[String]} res [amenties_id]
  * @return {[String]} res [profile_image]
  * @return {[String]} res [bedcounts]
  * @return {[String]} res [bedrooms]
  * @return {[String]} res [bathrooms]
  * @return {[String]} res [title]
  * @return {[String]} res [desc]
  * @return {[String]} res [lessee_count]
  * @return {[String]} res [lat_long]
  * @return {[String]} res [min_night]
  * @return {[String]} res [max_night]
  * @return {[String]} res [price_mode]
  * @return {[String]} res [demand_max_price]
  * @return {[String]} res [demand_min_price]
  * @return {[String]} res [currency_code]
  * @return {[String]} res [base_price]
  * @return {[String]} res [weekly_discount]
  * @return {[String]} res [monthly_discount]
  * @return {[String]} res [publish_status]
  * @return {[String]} res [createdAt]
  * @return {[String]} res [last_updated]
 */
exports.filter_by_lcount = function (req, res, next) {
  var lessee_count = req.body.lessee_count;
  req.checkBody('lessee_count', 'lessee_count is required').notEmpty();

  //Validation Errors
  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {
    async.parallel({
          asset: function (callback) {
              Asset.find({lessee_count: {$gte: lessee_count}, native_id:req.get('native_id')})
                  .exec(callback)
          },
      }, function (err, results) {
          if (err) {
            return res.status(200).json({
            status :404,
            message : 'Auth failed'
          });
        }
        // Error in API usage.
          if (results.asset == null) { // No results.
              return res.status(404).json({
                status:404,
                message: 'Asset not found'
              });
          }
          // //Successful, so render.
          // res.status(200).json({
          //   status:200,
          //   message: 'Success',
          //   data: results.asset
          // });

          var arr_id = []
          var i =0;
          while(i < (results.asset.length))
          {
            arr_id.push(results.asset[i]._id)
            i+=1
          }
          console.log(arr_id)

          async.parallel({
                assets: function (callback) {
                    Asset.find({'_id':arr_id})
                        .exec(callback)
                },
                assetCalendar: function (callback) {
                    Asset.find({ 'asset_id': arr_id})
                        .exec(callback)
                },
                assetImage: function (callback) {
                    Asset.find({ 'asset_id': arr_id})
                        .exec(callback)
                },
            }, function (err, results) {
                if (err) {
                  return res.status(200).json({
                  status :404,
                  message : 'Auth failed'
                });
              }
              // Error in API usage.
                if (results.assets == null) { // No results.
                    return res.status(404).json({
                      status:404,
                      message: 'Asset not found'
                    });
                }
                // Successful, so render.
                return res.status(200).json({
                  status:200,
                  message: 'Success',
                  data: (results.assets.concat(results.assetCalendar)).concat(results.assetImage)
                });
            });





      });
  }
};

/**
 * this method is To Display list of assets based on check in and check out.
  * @param  {[String]} req  [native_id]
  * @param  {[String]} req  [lessee_count]
  *
  * @return {[String]} res [status]
  * @return {[String]} res [message]
  * @return {[String]} res [lessor_id]
  * @return {[String]} res [roomtype_id]
  * @return {[String]} res [property_id]
  * @return {[String]} res [address]
  * @return {[String]} res [houserules]
  * @return {[String]} res [amenties_id]
  * @return {[String]} res [profile_image]
  * @return {[String]} res [bedcounts]
  * @return {[String]} res [bedrooms]
  * @return {[String]} res [bathrooms]
  * @return {[String]} res [title]
  * @return {[String]} res [desc]
  * @return {[String]} res [lessee_count]
  * @return {[String]} res [lat_long]
  * @return {[String]} res [min_night]
  * @return {[String]} res [max_night]
  * @return {[String]} res [price_mode]
  * @return {[String]} res [demand_max_price]
  * @return {[String]} res [demand_min_price]
  * @return {[String]} res [currency_code]
  * @return {[String]} res [base_price]
  * @return {[String]} res [weekly_discount]
  * @return {[String]} res [monthly_discount]
  * @return {[String]} res [publish_status]
  * @return {[String]} res [createdAt]
  * @return {[String]} res [last_updated]
 */
exports.filter_by_date = function (req, res, next) {
  var from = req.body.from;
  var to = req.body.to;
  req.checkBody('from', 'from date is required').notEmpty();
  req.checkBody('to', 'to date is required').notEmpty();

  //Validation Errors
  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {
    async.parallel({
          assets: function (callback) {
              AssetCalendar.find({from: {$gte: from},to: {$lte: to}, native_id:req.get('native_id')})
                  .exec(callback)
          },
      }, function (err, results) {
          if (err) {
            return res.status(200).json({
            status :404,
            message : 'Auth failed'
          });
        }
        // Error in API usage.
          if (results.assets == null) { // No results.
              return res.status(404).json({
                status:404,
                message: 'Asset not found'
              });
          }
          // Successful, so render.
          console.log(results.assets)
          // return res.status(200).json({
          //   status:200,
          //   message: 'Success',
          //   data: results.assets
          // });

          var arr_id = []
          var i =0;
          while(i < (results.assets.length))
          {
            arr_id.push(results.assets[i].asset_id)
            i+=1
          }
          var arr_nid = arrayUnion(arr_id);
          console.log(arr_nid)

          async.parallel({
                  asset_list: function(callback) {
                    Asset.find({ _id: arr_nid })
                    .sort([['createdAt', 'descending']])
                    .exec(callback);
                  },
                  }, function(err, results) {
                        if (err) { return next(err); }
                        //Combine results
                        res.status(200).json({
                          status:'200',
                          message:'Success',
                          data: results.asset_list
                        });
                    });
      });
  }
};
