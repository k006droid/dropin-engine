var mongoose = require('mongoose');
var moment = require('moment');
var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var async = require('async');

/**
 * [This method is to Display list of all Message.]
 * @param  {[String]}   lessee id
 * @param  {[String]}   native_id
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
 * @return {[String]} res [from_lId]
 * @return {[String]} res [to_lId]
 * @return {[String]} res [to_lesseeName]
 * @return {[String]} res [msg_type]
 * @return {[String]} res [createdAt]
 * @return {[String]} res [last_updated]
 */
exports.message_list = function (req, res) {

  async.parallel({
          msg_received: function(callback) {
            Message.find({ 'to_lId': req.params.id, 'native_id':req.get('native_id') })
            .sort([['createdAt', 'descending']])
            .exec(callback);
          },
          msg_sent: function(callback) {
            Message.find({ 'from_lId': req.params.id,'native_id':req.get('native_id') })
            .populate("reservation")
            .sort([['createdAt', 'descending']])
            .exec(callback);
          },
          }, function(err, results) {
                if (err) { return next(err); }
                //Combine results
                res.status(200).json({
                  status:'200',
                  message:'Success',
                  data: results.msg_received.concat(results.msg_sent)
                });
            });
};

/**
 * This method Handle message create on POST.
 * @param  {[String]}   native_id
 * @param  {[String]}   from_lId
 * @param  {[String]}   to_lId
 * @param  {[String]}   to_lesseeName
 * @param  {[String]}   msg_content
 * @param  {[String]}   msg_status
 * @param  {[String]}   msg_type
 *
 *  @return {[String]} res [status]
 * @return {[String]} res [message]
 */
exports.message_create = function(req, res){
        var native_id = req.get('native_id');
        var from_lId = req.params.id;
        var to_lId = req.body.to_lId;
        var from_lesseeName = req.body.from_lesseeName;
        var to_lesseeName = req.body.to_lesseeName;
        var msg_content = req.body.msg_content;
        var msg_status = req.body.msg_status;
        var msg_type = req.body.msg_type;
        var createdAt = moment().valueOf();
        var last_updated = moment().valueOf();

        // Validation
        req.checkBody('to_lId', 'to_lId is required').notEmpty();
        req.checkBody('from_lesseeName', 'from_lesseeName is required').notEmpty();
        req.checkBody('to_lesseeName', 'to_lesseeName is required').notEmpty();
      	req.checkBody('msg_content', 'msg_content is required').notEmpty();
      	req.checkBody('msg_status', 'msg_status is required').notEmpty();
      	req.checkBody('msg_type', 'msg_type is required').notEmpty();

        // Extract the validation errors from a request.
        var errors = req.validationErrors();
        if(errors){
      		res.status(409).json({
            status:'409',
            message:errors
          });
      	} else {
          // Data from form is valid.
          // Create an message object with escaped and trimmed data.
          var message = new Message(
              {
                native_id:native_id,
                from_lId:from_lId,
                to_lId: to_lId,
                from_lesseeName:from_lesseeName,
                to_lesseeName:to_lesseeName,
                msg_content: msg_content,
                msg_status: msg_status,
                msg_type : msg_type,
                createdAt: createdAt,
                last_updated: last_updated
              });
          message.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new message record.
              res.status(200).json({
                status:'200',
                message: "Message created"
              });
          });
        }
    };


     /**
      * This method To delete message using array string
      * @param  {[String Array]}   ids
      *
      * @return {[String]} res [status]
      * @return {[String]} res [message]
      */
     exports.message_delete = function(req, res) {
      console.log(req.params.ids);
      var re = /\s*,\s*/;
      var params = req.params.ids.split(re);

      // Delete a message with the specified messageId in the request
      console.log(params);
      // var len=params.length;
      Message.remove({ _id:{ $in: params}})
        .exec()
        .then(result => {
          res.status(200).json({
            status:200,
            message: "Message deleted"
          });
        })
        .catch(err => {
          res.status(500).json({
            status:500,
            message: 'Message doesnot Exist'
          });
        });

      // Message.remove( {_id:{ $in: params}} , function(err, note) {
      //     if(err) {
      //         // console.log(err);
      //         if(err.kind === 'ObjectId') {
      //             res.status(404).send({message: "Message not found with id " + params[i]});
      //         }
      //         res.status(500).send({message: "Could not delete Message with id " + params[i]});
      //     }
      //     if(!note) {
      //         res.status(404).send({message: "Messages not found with id " + params[i]});
      //     }
      //     res.send({message: "Messages deleted successfully!"})
      //  });
     };


     /**
      * This method To delete message using array string
      * @param  {[String Array]}   ids
      *
      * @return {[String]} res [status]
      * @return {[String]} res [message]
      */
     exports.message_search = function(req, res) {

       var search = req.body.search;
       console.log(search)

       // Validation
       req.checkBody('search', 'search word is required').notEmpty();

       // Extract the validation errors from a request.
       var errors = req.validationErrors();
       if(errors){
         res.status(409).json({
           status:'409',
           message:errors
         });
       } else {
         async.parallel({
                 msg_received: function(callback) {
                   console.log('^'+search+'$')
                   Message.find({ msg_content: new RegExp('^'+search+'$', "i"), 'to_lId': req.params.id, 'native_id':req.get('native_id') })
                   .sort([['createdAt', 'descending']])
                   .exec(callback);
                 },
                 msg_sent: function(callback) {
                   Message.find({msg_content: new RegExp('^'+search+'$', "i"), 'from_lId': req.params.id,'native_id':req.get('native_id') })
                   .sort([['createdAt', 'descending']])
                   .exec(callback);
                 },
                 }, function(err, results) {
                       if (err) { return next(err); }
                       //Combine results
                       res.status(200).json({
                         status:'200',
                         message:'Success',
                         data: results.msg_received.concat(results.msg_sent)
                       });
                   });
       }
     };
