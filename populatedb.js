#! /usr/bin/env node


// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Fees = require('./models/fees')
var Meta_titles = require('./models/metatitles')
var Api_credentials = require('./models/apicredentials')
var Join_us = require('./models/joinus')
var Theme_settings = require('./models/themesettings')
var Settings = require('./models/settings')
var Payment_gateway = require('./models/paymentgateway')
var Native = require('./models/native')
var Message_type = require('./models/messagetype')
var Reservation_type = require('./models/reservationtype')
var Messages = require('./models/message');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

function feesCreate(native_id,name, is_fixed, percenatge, fixed_value, currency, cb) {
  feesdetail = { 
    native_id: native_id,
    name: name,
    is_fixed:is_fixed,
    percenatge: percenatge,
    fixed_value: fixed_value,
    currency: currency,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var fees = new Fees(feesdetail);    
  fees.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New fees: ' + fees);
    cb(null, fees)
  }  );
}

function nativeCreate(native_id, domain_name, status, cb) {
  native = { 
    native_id: native_id,
    domain_name: domain_name,
    status: status,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var native = new Native(native);    
  native.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New native: ' + native);
    cb(null, native)
  }  );
}

function metatitlesCreate(native_id, title, descrption, url, cb) {
  metatitles = { 
    native_id: native_id,
    title: title,
    descrption:descrption,
    url: url,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var metatitles = new Meta_titles(metatitles);    
  metatitles.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New meta: ' + metatitles);
    cb(null, metatitles)
  }  );
}

function apicredentialsCreate(native_id,fb_client_id, fb_secret_id, google_client_id, google_secret_id, google_api_id, cb) {
  apicredentials = {
    native_id : native_id, 
    fb_client_id: fb_client_id,
    fb_secret_id:fb_secret_id,
    google_client_id: google_client_id,
    google_secret_id:google_secret_id,
    google_api_id:google_api_id,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var apicredentials = new Api_credentials(apicredentials);    
  apicredentials.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New apicredentials: ' + apicredentials);
    cb(null, apicredentials)
  }  );
}

function joinusCreate(native_id,fb_link, twitter_link, gplus_link, youtube_link, cb) {
  joinus = { 
    native_id:native_id,
    fb_link: fb_link,
    twitter_link:twitter_link,
    gplus_link: gplus_link,
    youtube_link: youtube_link,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var joinus = new Join_us(joinus);    
  joinus.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New join_us: ' + joinus);
    cb(null, joinus)
  }  );
}


function themesettingsCreate(native_id,font_color, font_family, background_color, header_color, footer_color, link_color, primary_button_color, cb) {
  themesettings = { 
    native_id: native_id,
    font_color: font_color,
    font_family: font_family,
    background_color: background_color,
    header_color: header_color,
    footer_color: footer_color,
    link_color: link_color,
    primary_button_color: primary_button_color,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var themesettings = new Theme_settings(themesettings);    
  themesettings.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New themesettings: ' + themesettings);
    cb(null, themesettings)
  }  );
}



function settingsCreate(native_id,site_name, logo, fav_icon, default_currency, default_lang, maintanance_mode, site_date_format, default_time_zone, meta_keyword, meta_desc, cb) {
  settings = { 
    native_id: native_id,
    site_name: site_name,
    logo: logo,
    fav_icon: fav_icon,
    default_currency: default_currency,
    default_lang: default_lang,
    maintanance_mode: maintanance_mode,
    site_date_format: site_date_format,
    default_time_zone: default_time_zone,
    meta_keyword: meta_keyword,
    meta_desc: meta_desc,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var settings = new Settings(settings);    
  settings.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New themesettings: ' + settings);
    cb(null, settings)
  }  );
}

function paymentgatewayCreate(native_id,payment_method, pay_mode, test_api_key, test_secret_key,live_api_key,live_secret_key, cb) {
  paymentgateway = { 
    native_id: native_id,
    payment_method: payment_method,
    pay_mode:pay_mode,
    test_api_key: test_api_key,
    test_secret_key: test_secret_key,
    live_api_key: live_api_key,
    live_secret_key: live_secret_key,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var paymentgateway = new Payment_gateway(paymentgateway);    
  paymentgateway.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New join_us: ' + paymentgateway);
    cb(null, paymentgateway)
  }  );
}


function messagetypeCreate(native_id, sno, name, url, cb) {
  messagetype = { 
    native_id: native_id,
    sno:sno,
    name: name,
    url: url,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var messagetype = new Message_type(messagetype);    
  messagetype.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New meta: ' + messagetype);
    
  }  );
}

function reservation_type_Create(native_id, sno, name, cb) {
  reservation_type = { 
    native_id: native_id,
    sno:sno,
    name: name,
  }
  // if (genre != false) bookdetail.genre = genre
    
  var reservation_type = new Reservation_type(reservation_type);    
  reservation_type.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Reservation_type: ' + reservation_type);
    
  }  );
}


function reservation_type_CreateCall(cb) {
    async.parallel([
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',1, 'Payment Pending', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',2, 'Pending', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',3, 'Expired', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',4, 'Accepted', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',5, 'Declined', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',6, 'Before Checkin Canceled by Host', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',7, 'Before Checkin Canceled by Guest', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',8, 'Checkin', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',9, 'Awaiting Host Review', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',10, 'Awaiting Travel Review', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',11, 'Completed', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',12, 'After Checkin Canceled by Host', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',13, 'After Checkin Canceled by Guest', callback);
        },
        function(callback) {
          reservation_type_Create('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',14, 'Pending Reservation Canceled', callback);
        },
        ],
        // optional callback
        cb);
}

function apicredentialsCreateCall(cb) {
    async.parallel([
        function(callback) {
          apicredentialsCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','askdjghasjkd8712346827ksjagj', 'aksjdhkasd32984', 'ajksdghk3274', 'aghsde2378t42783','jadhs32t45eu23yrtdsa', callback);
        },
        ],
        // optional callback
        cb);
}

function metatitlesCreateCall(cb) {
    async.parallel([
        function(callback) {
          metatitlesCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','Amenities','add','/admin/add_amenity', callback);
        },
        function(callback) {
          metatitlesCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','Amenities2', 'edit', '/admin/edit_amenity/', callback);
        },
        ],
        // optional callback
        cb);
}

function feesCreateCall(cb) {
    async.parallel([
        function(callback) {
          feesCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','Gust fee', '0', '5', '0','INR', callback);
        },
        function(callback) {
          feesCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','Host fee', '1', '0','50','INR', callback);
        },
        ],
        // optional callback
        cb);
}

function joinusCreateCall(cb) {
    async.parallel([
        function(callback) {
          joinusCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','/fb','/tw','/google','/youtube', callback);
        },
        ],
        // optional callback
        cb);
}


function themesettingsCreateCall(cb) {
    async.parallel([
        function(callback) {
          themesettingsCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',"#777", "Times_New_roman", "#000", "#3232", "#777", "#2525", "#5421", callback);
        },
        ],
        // optional callback
        cb);
}

function settingsCreateCall(cb) {
    async.parallel([
        function(callback) {
          settingsCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',"admin", "logo.png", "fav.ico", "INR", "en", "0", "dd-mm-yy", "asia", "meta_keyword", "meta_desc", callback);
        },
        ],
        // optional callback
        cb);
}

function paymentgatewayCreateCall(cb) {
    async.parallel([
        function(callback) {
          paymentgatewayCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',"stripe", "test", "test_api_key", "test_secret_key","live_api_key","live_secret_key", callback);
        },
        ],
        // optional callback
        cb);
}

function nativeCreateCall(cb) {
    async.parallel([
        function(callback) {
          nativeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg','www.admin.com', 'active', callback);
        },
        ],
        // optional callback
        cb);
}


function messagetypeCreateCall(cb) {
    async.parallel([
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',1,'Reservation Request','trips/request', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',2,'Conversation','trips/conversation', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',3,'Message','trips/conversation', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',4,'Review Request Host','trips/review_by_host', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',5,'Review Request Traveller','trips/review_by_traveller', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',6,'Inquiry','trips/conversation', callback);
        },
        function(callback) {
          messagetypeCreate('YWRtaW4sd3d3LmFkbWluLmNvbSw2NDU5MTA2Nzg',7,'List Creation','trips/conversation', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    //  feesCreateCall,
    // metatitlesCreateCall,
    // apicredentialsCreateCall,
    // joinusCreateCall,
    // themesettingsCreateCall,
    // settingsCreateCall,
    // paymentgatewayCreateCall,
    // nativeCreateCall,
    // messagetypeCreateCall,
    reservation_type_CreateCall,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});