var mongoose = require('mongoose');
var moment = require('moment');
var express = require('express');
var router = express.Router();
var MyCart = require('../models/myCart');
var Lessee = require('../models/lessee');
var Asset = require('../models/asset');
var async = require('async');


/**
 * [This method is to Handle MyCart create on POST.]
 * @param  {[String]}  lessee_id
 * @param  {[String]}  native_id
 * @param {[String]} res [asset_id]
 * @param {[String]} res [myCart_status]
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
 */
exports.myCart_create = function(req, res, next){
        var lessee_id = req.params.id;
        var native_id = req.get('native_id');
        var asset_id = req.body.asset_id;
        var myCart_status = req.body.myCart_status;
        var createdAt = moment().valueOf();
        var last_updated = moment().valueOf();

        // Validation
      	req.checkBody('asset_id', 'asset_id is required').notEmpty();
      	req.checkBody('status', 'status is required').notEmpty();

        // Extract the validation errors from a request.
        var errors = req.validationErrors();
        if(errors){
      		res.status(409).json({
            status:'409',
            message:errors
          });
      	}
        else {
          async.parallel({
              lessee: function (callback) {
                  Lessee.findById(lessee_id)
                      .exec(callback)
              },
              list: function (callback) {
                  Listing.findById(asset_id)
                      .exec(callback)
              },
          }, function (err, results) {
              if (err) {
                return res.status(500).json({
                status :500,
                message : 'Auth failed'
              });
              }

          // Data from form is valid.
          // Create an MyCart object with escaped and trimmed data.
          var mycart = new MyCart({
                lessee_id:lessee_id,
                native_id:native_id,
                asset_id: asset_id,
                myCart_status: myCart_status,
                createdAt: createdAt,
                last_updated: last_updated
              });
          mycart.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new MyCart record.
              res.status(200).json({
                status:'200',
                message: "MyCart created"
              });
          });
        });
      }
    };

    /**
     * [This method is to Display list of all MyCart Items.]
     * @param  {[String]}   lessee_id
     * @param  {[String]}   native_id
     *
     * @return {[String]} res [status]
     * @return {[String]} res [message]
     * @return {[String]} res [lessee_id]
     * @return {[String]} res [asset_id]
     * @return {[String]} res [myCart_status]
     * @return {[String]} res [createdAt]
     * @return {[String]} res [last_updated]
     */
    exports.myCart_list = function (req, res) {
      async.parallel({
              mycart: function(callback) {
                MyCart.find({ 'lessee_id': req.params.id,'native_id':req.get('native_id') })
                .sort([['createdAt', 'ascending']])
                .exec(callback);
              }
              }, function(err, results) {
                    if (err) { return next(err); }
                    //Combine results
                    res.status(200).json({
                      status:'200',
                      message:'Success',
                      data: results.mycart
                    });
                }
              );
    };

      /**
      * [This method is To delete message using array string.]
      * @param  {[String]}   ids
      *
      * @return {[String]} res [status]
      * @return {[String]} res [message]
      */

    exports.myCart_delete = function(req, res) {
      console.log(req.params.ids);
      var re = /\s*,\s*/;
      var params = req.params.ids.split(re);

     // Delete a message with the specified messageId in the request
      console.log(params);
      var len=params.length;

      MyCart.remove( {_id:{ $in: params}} , function(err, note) {
          if(err) {
              // console.log(err);
              if(err.kind === 'ObjectId') {
                  res.status(404).send({message: "MyCart not found with id " + params[i]});
              }
              res.status(500).send({message: "Could not delete MyCart with id " + params[i]});
          }
          if(!note) {
              res.status(404).send({message: "MyCart not found with id " + params[i]});
          }
          res.send({message: "MyCart deleted successfully!"});
       });
     };
