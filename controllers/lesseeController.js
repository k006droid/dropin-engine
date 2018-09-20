var express = require('express');
var router = express.Router();
var Lessee = require('../models/lessee');
var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var unixTime = require('unix-time');
var jwt = require('jsonwebtoken');
var async = require('async');
var nodemailer =  require("nodemailer"); //smpt mail library
var crypto = require("crypto");
var isEqual = require('lodash.isequal');
var equal = require('deep-equal');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/**
 * [This method is to Register new lessee.]
 * @param  {[String]} req [first_name]
 * @param  {[String]} req [last_name]
 * @param  {[String]} req [family_name]
 * @param  {[String]} req native_id
 * @param  {[String]} req [email]
 * @param  {[String]} req [password]
 * @param  {[String]} req [dob]
 * @param  {[String]} req [lessee_type]
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
 */

exports.lessee_signUp = function(req, res) {
  var native_id = req.get('native_id');
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var password = req.body.password;
  var dob = req.body.dob;
  var lessee_type = req.body.lessee_type;
  var createdAt = moment().valueOf();
  var last_updated = moment().valueOf();;

  // Validation
	req.checkBody('first_name', 'first_name is required').notEmpty();
  req.checkBody('last_name', 'last_name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('lessee_type', 'lessee_type is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {
    Lessee.find({ email: req.body.email, native_id:native_id })
    .exec()
    .then(lessee => {
      if (lessee.length >= 1) {
        return res.status(409).json({
          status:'409',
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status:'500',
              message: err
            });
          } else {
            const lessee = new Lessee({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              native_id:native_id,
              password: hash,
              first_name: first_name,
              last_name: last_name,
              dob: dob,
              lessee_type: lessee_type,
              profile_image: '',
              fb_id : '',
              google_id: '',
              createdAt: createdAt,
              last_updated: last_updated
            });
            lessee
              .save()
              .then(result => {
                console.log(result);
                res.status(200).json({
                  status:'200',
                  message: "Lessee created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  status:'500',
                  message: err
                });
              });
          }
        });
      }
    });
  }
};

/**
 * [This method is to authenticate Login]
 * @param  {[String]} req [email]
 * @param  {[String]} req [password]
 * @param  {[String]} req native_id
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
 * @return {[String]} res [lesseeId]
 * @return {[String]} res [email]
 * @return {[String]} res [first_name]
 * @return {[String]} res [last_name]
 * @return {[String]} res [family_name]
 * @return {[String]} res [dob]
 * @return {[String]} res [gender]
 * @return {[String]} res [about_me]
 * @return {[String]} res [address]
 * @return {[String]} res [phone_no]
 * @return {[String]} res [profile_image]
 * @return {[String]} res [fb_id]
 * @return {[String]} res [google_id]
 * @return {[String]} res [lessee_type]
 * @return {[String]} res [host_id]
 * @return {[String]} res [createdAt]
 * @return {[String]} res [last_updated]
 */
exports.lessee_signIn = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var native_id = req.get('native_id');

  req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {

  Lessee.find({ email: email, native_id:native_id })
    .exec()
    .then(lessee => {
      if (lessee.length < 1) {
        return res.status(403).json({
          status:403,
          message: "Authentication failed"
        });
      }
      bcrypt.compare(req.body.password, lessee[0].password, (err, result) => {
        if (err) {
          return res.status(403).json({
            status:403,
            message: "Auth failed: Password mismatch"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              lesseeId: lessee[0]._id,
              email: lessee[0].email,
              first_name: lessee[0].first_name,
              last_name: lessee[0].last_name,
              family_name: lessee[0].family_name,
              dob: lessee[0].dob,
              gender: lessee[0].gender,
              about_me: lessee[0].about_me,
              address: lessee[0].address,
              phone_no: lessee[0].phone_no,
              profile_image: lessee[0].profile_image,
              fb_id: lessee[0].fb_id,
              google_id: lessee[0].google_id,
              lessee_type: lessee[0].lessee_type,
              host_id: lessee[0].host_id,
              createdAt: lessee[0].createdAt,
              last_updated: lessee[0].last_updated
            },
            'secret',
            {
                expiresIn: "1d"
            }
          );
          return res.status(200).json({
            status:200,
            message: "Authentication successful",
            token: token
          });
        }
        res.status(403).json({
          status:403,
          message: "Authentication failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status:403,
        message: err
      });
    });
  }
}

/**
  * this method is To Display detail page for a specific Lessee.
  * @param  {[String]} req  [LesseeId]
  *
  * @return {[String]} res [status]
  * @return {[String]} res [message]
  * @return {[String]} res [lesseeId]
  * @return {[String]} res [email]
  * @return {[String]} res [first_name]
  * @return {[String]} res [last_name]
  * @return {[String]} res [family_name]
  * @return {[String]} res [dob]
  * @return {[String]} res [gender]
  * @return {[String]} res [about_me]
  * @return {[String]} res [address]
  * @return {[String]} res [phone_no]
  * @return {[String]} res [profile_image]
  * @return {[String]} res [fb_id]
  * @return {[String]} res [google_id]
  * @return {[String]} res [lessee_type]
  * @return {[String]} res [createdAt]
  * @return {[String]} res [last_updated]
 */
exports.lessee_detail = function (req, res, next) {
  console.log(req.params.id)
    async.parallel({
        lessee: function (callback) {
            console.log(req.params.id)
            Lessee.findById(req.params.id)
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
          return res.status(200).json({
          status :404,
          message : 'Auth failed'
        });
      }
      console.log(results.lessee);
      // Error in API usage.
        if (results.lessee == null) { // No results.
            return res.status(404).json({
              status:404,
              message: 'Lessee not found'
            });
        }
        console.log(results.lessee);
        // Successful, so render.
        return res.status(200).json({
          status:200,
          message: 'Success',
          data: results.lessee

        });
    });
};

 /**
  * this method is To delete lessee using his Id.
   * @param  {[String]}  req  [LesseeId]
   *
   * @return {[String]} res [status]
   * @return {[String]} res [message]
  */
 exports.lessee_delete = function (req, res, next) {
   Lessee.remove({ _id: req.params.id })
     .exec()
     .then(result => {
       res.status(200).json({
         status:200,
         message: "Lessee deleted"
       });
     })
     .catch(err => {
       res.status(500).json({
         status:500,
         message: 'Lessee doesnot Exist'
       });
     });
};


/**
 * This method is to update the corresponding lessee detail based on id request.
 * @param  {[String]} req [first_name]
 * @param  {[String]} req [last_name]
 * @param  {[String]} req [family_name]
 * @param  {[String]} req [email]
 * @param  {[String]} req [dob]
 * @param  {[String]} req [gender]
 * @param  {[String]} req [about_me]
 * @param  {[String]} req [phone_no]
 * @param  {[String]} req [address]
 * @param  {[String]} req [lessee_type]
 * @param  {[String]} req [profile_image]
 * @param  {[String]} req [last_updated]
 *
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
 */
 exports.lessee_post = function (req, res, next) {

     // Validate fields.
     var lessee_id = req.params.id;
     var native_id = req.get('native_id');
     var first_name = req.body.first_name;
     var last_name = req.body.last_name;
     var family_name = req.body.family_name;
     var email = req.body.email;
     var dob = req.body.dob;
     var gender = req.body.gender;
     var about_me = req.body.about_me;
     var phone_no = req.body.phone_no;
     var address = req.body.address;
     var lessee_type = req.body.lessee_type;
     var profile_image = req.body.profile_image;
     var last_updated = moment().valueOf();
     var IsCheck = false;

     // Validation
   	req.checkBody('first_name', 'first_name is required').notEmpty();
    req.checkBody('last_name', 'last_name is required').notEmpty();
   	req.checkBody('lessee_type', 'lessee_type is required').notEmpty();

         // Extract the validation errors from a request.
         var errors = req.validationErrors();
         if(errors){
       		res.status(409).json({
             status:'409',
             message:errors
           });
       	} else {
          async.parallel({
                  lessee_check: function(callback) {
                    Lessee.findById({ '_id': lessee_id })
                    .exec(callback);
                  },
                  lessee_email: function(callback) {
                    Lessee.find({ email: email, native_id:native_id })
                    .exec(callback);
                  },
                  }, function(err, results) {
                        if (err) { return next(err); }

                        if (results.lessee_email.length >0) {
                        if(equal(results.lessee_check._id,results.lessee_email[0]._id)) {
                            IsCheck = true;
                            console.log("Here");
                          }
                          else {
                            console.log("tHere");
                            IsCheck = false;
                            return res.status(404).json({
                                      status :404,
                                      message : 'Mail Id Already Exist'
                                            });
                          }
                        }
                        else {
                          IsCheck = true;
                        }

                        if (IsCheck) {
                          // Create lessee object with escaped and trimmed data (and the old id!)
                              var lessee = new Lessee(
                                  {
                                       _id: req.params.id,
                                      email: email,
                                      first_name: first_name,
                                      last_name: last_name,
                                      family_name: family_name,
                                      dob: dob,
                                      gender:gender,
                                      about_me:about_me,
                                      phone_no:phone_no,
                                      address:address,
                                      lessee_type: lessee_type,
                                      profile_image: profile_image,
                                      last_updated: last_updated
                                    }
                              );
                              // Data from form is valid. Update the record.
                              Lessee.findByIdAndUpdate(req.params.id, lessee, {}, function (err, thelessee) {
                                  if (err) {
                                    return res.status(404).json({
                                    status :404,
                                    message : 'Auth failed'
                                  });
                                }
                                  else { // Successful.
                                    return res.status(200).json({
                                    status :200,
                                    message : 'User Updated Successfully'
                                  });
                                  }
                              });
                            }
                          });
                        }
};



/**
 * this method is To Login or Sign Up as facebook lessee using his facebook Id.
 * @param  {[String]} req [first_name]
 * @param  {[String]} req [last_name]
 * @param  {[String]} req [family_name]
 * @param  {[String]} req [email]
 * @param  {[String]} req [dob]
 * @param  {[String]} req [gender]
 * @param  {[String]} req [about_me]
 * @param  {[String]} req [phone_no]
 * @param  {[String]} req [address]
 * @param  {[String]} req [profile_image]
 * @param  {[String]} req [fb_id]
 * @param  {[String]} req [google_id]
 * @param  {[String]} req [lessee_type]
 * @param  {[String]} req [last_updated]
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
  */
exports.lessee_fb_login = function (req, res, next) {
  var native_id = req.get('native_id');
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var family_name = req.body.family_name;
  var email = req.body.email;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var about_me = req.body.about_me;
  var phone_no = req.body.phone_no;
  var address = req.body.address;
  var profile_image = req.body.profile_image;
  var fb_id = req.body.fb_id;
  var lessee_type = req.body.lessee_type;
  var createdAt = moment().valueOf();
  var last_updated = moment().valueOf();
  var IsCheck = false;

  // Validation
	req.checkBody('first_name', 'first_name is required').notEmpty();
  req.checkBody('last_name', 'last_name is required').notEmpty();
	req.checkBody('lessee_type', 'lessee_type is required').notEmpty();
	req.checkBody('fb_id', 'fb_id is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {
    Lessee.find({ fb_id: fb_id, native_id:native_id })
    .exec()
    .then(lessee => {
      if (lessee.length >= 1) {
        return res.status(200).json({
          status:'200',
          message: "Logged In Successfully",
          data:lessee[0]
        });
      } else {
        if (email=="") {
            IsCheck = false;
        }
        Lessee.find({ email: email, native_id:native_id })
        .exec()
        .then(lessee => {
          if (lessee.length >= 1) {
            return res.status(409).json({
              status:'409',
              message: "Mail exists"
            });
          } else {
            const lessee = new Lessee({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              native_id:native_id,
              first_name: first_name,
              last_name: last_name,
              family_name: family_name,
              dob: dob,
              gender:gender,
              about_me:about_me,
              phone_no:phone_no,
              address:address,
              lessee_type: lessee_type,
              profile_image: profile_image,
              fb_id : fb_id,
              google_id: '',
              createdAt: createdAt,
              last_updated: last_updated
            });
            lessee
              .save()
              .then(result => {
                console.log(result);
                res.status(200).json({
                  status:'200',
                  message: "Lessee created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  status:'500',
                  message: err
                });
              });
          }
        });
  }
});
}
};


/**
 * this method is To Login or Sign Up as google lessee using his facebook Id.
 * @param  {[String]} req [first_name]
 * @param  {[String]} req [last_name]
 * @param  {[String]} req [family_name]
 * @param  {[String]} req [email]
 * @param  {[String]} req [dob]
 * @param  {[String]} req [gender]
 * @param  {[String]} req [about_me]
 * @param  {[String]} req [phone_no]
 * @param  {[String]} req [address]
 * @param  {[String]} req [profile_image]
 * @param  {[String]} req [fb_id]
 * @param  {[String]} req [google_id]
 * @param  {[String]} req [lessee_type]
 * @param  {[String]} req [last_updated]
 *
 * @return {[String]} res [status]
 * @return {[String]} res [message]
  */
exports.lessee_google_login = function (req, res, next) {
  var native_id = req.get('native_id');
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var family_name = req.body.family_name;
  var email = req.body.email;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var about_me = req.body.about_me;
  var phone_no = req.body.phone_no;
  var address = req.body.address;
  var profile_image = req.body.profile_image;
  var google_id = req.body.google_id;
  var lessee_type = req.body.lessee_type;
  var createdAt = moment().valueOf();
  var last_updated = moment().valueOf();;

  // Validation
	req.checkBody('first_name', 'first_name is required').notEmpty();
  req.checkBody('last_name', 'last_name is required').notEmpty();
	req.checkBody('lessee_type', 'lessee_type is required').notEmpty();
	req.checkBody('google_id', 'google_id is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
		res.status(409).json({
      status:'409',
      message:errors
    });
	} else {
    Lessee.find({ google_id: google_id, native_id:native_id })
    .exec()
    .then(lessee => {
      if (lessee.length >= 1) {
        return res.status(200).json({
          status:'200',
          message: "Logged In Successfully",
          data:lessee[0]
        });
      } else {
        Lessee.find({ email: email, native_id:native_id })
        .exec()
        .then(lessee => {
          if (lessee.length >= 1) {
            return res.status(409).json({
              status:'409',
              message: "Mail exists"
            });
          } else {
            const lessee = new Lessee({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              native_id:native_id,
              first_name: first_name,
              last_name: last_name,
              family_name: family_name,
              dob: dob,
              gender:gender,
              about_me:about_me,
              phone_no:phone_no,
              address:address,
              lessee_type: lessee_type,
              profile_image: profile_image,
              fb_id : '',
              google_id: google_id,
              createdAt: createdAt,
              last_updated: last_updated
            });
            lessee
              .save()
              .then(result => {
                console.log(result);
                res.status(200).json({
                  status:'200',
                  message: "Lessee created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  status:'500',
                  message: err
                });
              });
          }
        });
  }
});
}
};

 /**
  * This method is used to reset forget password mail
  * @param  {[String]} [email]
  *
  * @return {[String]} res [status]
  * @return {[String]} res [message]
  */

  exports.lessee_forgetpassword =  function(req, res, next){
    	async.waterfall([
        function(done){
          crypto.randomBytes(20, function(err, buf){
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done){
          Lessee.findOne({ email: req.params.email,native_id: req.get('native_id') },
          function(err, lessee){
            if(!lessee){
              return res.status(404).json({
              status :404,
              message : 'Auth failed'
            });
            }
            lessee.resetPasswordToken = token;
            lessee.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            lessee.save(function(err){
              done(err, token, lessee);
            });
          });
        },
        function(token, lessee, done){
          var smtpTransport = nodemailer.createTransport({
            service:'gmail',
            secure: false, // use SSL
            port: 25, // port for secure SMTP
            auth:{
              lessee: 'karthiyayini@cogzidel.com',
              pass: 'yayini006'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
          var mailOptions = {
            to: lessee.email,
            from: 'karthiyayini@cogzidel.com',
            subject: 'dropInn Website Password Reset',
            html: '<h1>Welcome </h1><p>You are receiving this mail based on your request for Reset Password </p> <p> Please click on the following link, or paste this in your browser </p> <p>'
              + req.protocol + '://' + req.get('host') + '/lessees/reset/'+token+ '</p>  <h3>This mail is valid for only 1 hour</h3>'
          };
          smtpTransport.sendMail(mailOptions, function(err){
            res.status(200).json({
            status :200,
            message : 'Mail Sent'
            });
            done(err, 'done');
          });
        },
      ],
      function(err){
        if(err) return next(err);
      });
    };

    /**
     * This method sents mails for accessing reset password
     * @param  {[String]}  resetPasswordToken
     * @param  {[String]}  password
     *
     * @return {[String]} res [status]
     * @return {[String]} res [message]
     */
     exports.lessee_resetpassword =function(req, res){
      async.waterfall([
        function(done){
          Lessee.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
          function(err, lessee){
            if(!lessee){
              res.status(404).json({
              status :404,
              message : 'Auth failed'
            });
            }
            lessee.setPassword(req.body.password);
            lessee.resetPasswordToken = undefined;
            lessee.resetPasswordExpires = undefined;
            lessee.save(function(err){
                done(err, lessee);
            });
        });
      },
      function(lessee, done){
        var smtpTransport = nodemailer.createTransport({
          service:'gmail',
          secure: false, // use SSL
          port: 25, // port for secure SMTP
          auth:{
            lessee: 'karthiyayini@cogzidel.com',
            pass: 'yayini006'
          },
          tls: {
              rejectUnauthorized: false
          }
        });
        var mailOptions = {
          to: lessee.email,
          from: 'karthiyayini@cogzidel.com',
          subject : 'Your Password has been changed',
          text: 'Hello, \n\n'+
          'This is a confirmation that the password for you account  ' +lessee.email+ '  has been changed successfully'
        };
        smtpTransport.sendMail(mailOptions, function(err){
          res.status(200).json({
          status :200,
          message : 'Mail Sent'
          });
          done(err);
        });
      }
    ], function(err){
      res.status(200).json({
      status :200,
      message : 'Mail Sent'
      });
    });
};
