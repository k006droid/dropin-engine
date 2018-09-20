var express = require('express');
var router = express.Router();
var Lessee = require('../models/lessee');

// Require our controllers.
var lessee_Controller = require('../controllers/lesseeController');
var msg_controller = require('../controllers/messageController');
var mycart_controller = require('../controllers/mycartController');
var reservation_controller = require('../controllers/reservationController');
var asset_Controller = require('../controllers/assetController1');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Still in construction');
});

/* lessee routes. */

router.post('/signup', lessee_Controller.lessee_signUp);

router.post("/login", lessee_Controller.lessee_signIn);

router.get("/:id/view", lessee_Controller.lessee_detail);

router.post('/:id/update', lessee_Controller.lessee_post);

router.post("/:id/delete", lessee_Controller.lessee_delete);

//Facebook Login or Sign Up
router.post("/fb_login", lessee_Controller.lessee_fb_login);

//Google Login or Sign Up
router.post("/google_login", lessee_Controller.lessee_google_login);


/* Forget Password routes */

router.post('/:email/forgetpassword',lessee_Controller.lessee_forgetpassword);

 /* Reset Password routes */

router.post('/reset/:token', lessee_Controller.lessee_resetpassword);

/* Message routes */

router.post('/:id/messages/create',msg_controller.message_create);

router.post('/:id/messages',msg_controller.message_list);

router.post('/messages/delete/:ids',msg_controller.message_delete);

router.post('/:id/messages/search',msg_controller.message_search);

/* MyCart routes */

router.post('/:id/mycart/create', mycart_controller.myCart_create);

router.post('/:id/mycart',mycart_controller.myCart_list);

router.post('/mycart/delete/:ids',mycart_controller.myCart_delete);

/* Reservation Booking routes */

router.post('/:id/reservation/book',reservation_controller.reservation_create);

router.post('/:list_id/reservation/availability',reservation_controller.assetCalendar_checkAvailability);

router.post('/:id/reservation/history',reservation_controller.reservation_history);

/* Asset details */

router.get('/:asset_id/asset/view',asset_Controller.asset_detail);

router.post('/asset/filter_by_lcount',asset_Controller.filter_by_lcount);

router.post('/asset/filter_by_date',asset_Controller.filter_by_date);

module.exports = router;
