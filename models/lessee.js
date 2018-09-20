
var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.
var passportLocalMongoose = require("passport-local-mongoose");
var crypto = require('crypto');

var Schema = mongoose.Schema;

/**
 * [LesseeSchema - For Lessee DB Operation ]
 * @type {Schema}
 */
var LesseeSchema = new Schema(
    {
    native_id:{type: String, required: true},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    family_name: {type: String, max: 100},
    email: { type: String, required: true, },
    password : { type: String },
    dob: { type: String },
    gender: { type: String,
            enum: ['Male', 'Female', 'Others']
          },
    about_me: { type: String },
    address: { type: String },
    phone_no: { type: String },
    profile_image: { type: String },
    fb_id : { type: String },
    google_id: { type: String },
    lessee_type: { type: String },
    createdAt: { type: String },
    last_updated: { type: String },
    resetPasswordToken: {	type:String	},
		resetPasswordExpires: {	type : Date	}
  });

/*
  Password Encryption Method
 */

  var digest = 'SHA1';
  LesseeSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, digest).toString('hex');
  };

  /*
    Virtual for author "full" name.
   */

    LesseeSchema
    .virtual('name')
    .get(function () {
      return this.first_name;
    });

  /*
    Virtual for this author instance URL.
   */

  LesseeSchema
  .virtual('id')
  .get(function () {
    return this._id
  });

  LesseeSchema
  .virtual('Email')
  .get(function () {
    return this.email;
  });

  /*
    Export model
   */
  module.exports = mongoose.model('Lessee', LesseeSchema);

  LesseeSchema.plugin(passportLocalMongoose);
