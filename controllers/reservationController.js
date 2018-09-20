var mongoose = require('mongoose');
var moment = require('moment');
var express = require('express');
var router = express.Router();
var Reservation = require('../models/reservation');
var AssetCalendar = require('../models/assetCalendar');
var Asset = require('../models/asset');
var Lessee = require('../models/lessee');
var async = require('async');


/**
 * This method is to Handle Reservation create on POST.
 * @param  {[String]}   lessee_id
 * @param  {[String]}   native_id
 * @param  {[String]}   asset_id
 * @param  {[String]}   checkin
 * @param  {[String]}   checkout
 * @param  {[String]}   currency
 * @param  {[String]}   sub_total
 * @param  {[String]}   admin_commission
 * @param  {[String]}   net_total
 * @param  {[String]}   payout_status
 * @param  {[String]}   payment_type
 * @param  {[String]}   reservation_status
 *
 *  @return {[String]} res [status]
 * @return {[String]} res [message]
 */
exports.reservation_create = function(req, res, next){
        var lessee_id = req.params.id;
        var native_id = req.get('native_id');
        var asset_id = req.body.asset_id;
        var checkin = req.body.checkin;
        var checkout = req.body.checkout;
        var currency = req.body.currency;
        var sub_total = req.body.sub_total;
        var admin_commission = req.body.admin_commission;
        var net_total = req.body.net_total;
        var payout_status = req.body.payout_status;
        var payment_type = req.body.payment_type;
        var reservation_status = req.body.reservation_status;
        var createdAt = moment().valueOf();
        var last_updated = moment().valueOf();

        // Validation
        req.checkBody('asset_id', 'asset_id is required').notEmpty();
        req.checkBody('checkin', 'checkin is required').notEmpty();
        req.checkBody('checkout', 'checkout is required').notEmpty();
        req.checkBody('currency', 'currency is required').notEmpty();
        req.checkBody('sub_total', 'sub_total is required').notEmpty();
        req.checkBody('admin_commission', 'admin_commission is required').notEmpty();
        req.checkBody('net_total', 'net_total is required').notEmpty();
        req.checkBody('payout_status', 'payout_status is required').notEmpty();
      	req.checkBody('payment_type', 'payment_type is required').notEmpty();
      	req.checkBody('reservation_status', 'reservation_status is required').notEmpty();

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
              asset: function (callback) {
                  Asset.findById(asset_id)
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
          // Create an Reservation object with escaped and trimmed data.
          var reservation = new Reservation({
             lessee_id : lessee_id,
             native_id : native_id,
             asset_id : asset_id,
             checkin : checkin,
             checkout : checkout,
             currency : currency,
             sub_total : sub_total,
             admin_commission : admin_commission,
             net_total : net_total,
             payout_status : payout_status,
             payment_type : payment_type,
             reservation_status : reservation_status,
             createdAt : createdAt,
             last_updated : last_updated
              });
          reservation.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new Reservation record.
              // Blocking dates in Asset Calendar:
                var assetCalendar = new AssetCalendar(
                {
                lessor_id: lessee_id,
                native_id: native_id,
                asset_id:asset_id,
                from: checkin,
                to :checkout,
                asset_status : 'Booked',
                createdAt: createdAt
                });
                assetCalendar.save(function (err) {
                    if (err) { return next(err); }
                });

              res.status(200).json({
                status:'200',
                message: "Reservation created"
              });
          });
        });
      }
    };

      /**
      * This method is to Display reservation history of all  details.
      * @param  {[String]}   lessee_id
      * @param  {[String]}  native_id
      *
      * @return {[String]} res [status]
      * @return {[String]} res [message]
      * @return {[String]} res [reservation_id]
      * @return {[String]} res [checkin]
      * @return {[String]} res [checkout]
      * @return {[String]} res [currency]
      * @return {[String]} res [sub_total]
      * @return {[String]} res [net_total]
      * @return {[String]} res [payment_type]
      * @return {[String]} res [reservation_status]
      * @return {[String]} res [asset_id]
      * @return {[String]} res [title]
      * @return {[String]} res [descrption]
      * @return {[String]} res [leaser_id]
      * @return {[String]} res [leaser_name]
      * @return {[String]} res [assetImage_id]
      * @return {[String]} res [img_src]
      * @return {[String]} res [cover_status]
      * @return {[String]} res [caption]
      * @return {[String]} res [img_resize]
      */
    exports.reservation_history = function (req, res, next) {

      async.parallel({
              reservation: function(callback) {
                Reservation.find({ 'lessee_id': req.params.id, 'native_id':req.get('native_id') })
                .populate("asset_id")
                .populate("lessee_id")
                .sort([['createdAt', 'ascending']])
                .exec(callback);
              }
              }, function(err, results) {
                    if (err) { return next(err); }
                    //Combine results
                    res.status(200).json({
                      status:'200',
                      message:'Success',
                      data: results.reservation
                    });
                }
              );
    };


    /**
     * This method is to List Availability dates from Asset Calendar.
     * @param  {[String]}   asset_id
     * @param  {[String]}  native_id
     *
     * @return {[String]} res [status]
     * @return {[String]} res [message]
     * @return {[String]} res [lessee_id]
     * @return {[String]} res [asset_id]
     * @return {[String]} res [from]
     * @return {[String]} res [to]
     * @return {[String]} res [status]
     * @return {[String]} res [createdAt]
     */
    exports.assetCalendar_checkAvailability = function (req, res,next) {
      async.parallel({
              assetCalendar: function(callback) {
                AssetCalendar.find({ 'asset_id': req.params.id,'native_id':req.get('native_id') })
                .sort([['createdAt', 'descending']])
                .exec(callback);
               }
              }, function(err, results) {
                    if (err) { return next(err); }
                    //Combine results
                    res.status(200).json({
                      status:'200',
                      message:'Success',
                      data: results.assetCalendar
                    });
                }
              );
    };
