var express = require('express');
var router = express.Router();

// Require our controllers.
var lessor_controller = require('../controllers/assetController');
var calendar_controller = require('../controllers/calendarController');
var assetImage_controller = require('../controllers/assetImageController');
var payout_controller = require('../controllers/payoutController');

/**
 * [cloudinary - Cloudinary configuration used to store the asset images in cloudinary]
 * @type {[type]}
 */
var cloudinary = require('cloudinary');
let multer = require('multer');
var cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
 cloud_name: process.env.cloud_name,
 api_key: process.env.api_key,
 api_secret: process.env.api_secret,
});
var storage = cloudinaryStorage({
 cloudinary: cloudinary,
 folder: '/assetImage',
 allowedFormats: ['jpg', 'png'],
 filename: function (req, file, cb) {
   cb(undefined, file);
 }
});
let upload = multer({ storage: storage });

/* GET host asset. */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify({'status':'respond with a resource'}));
});

/* POST create new asset. */
router.post('/create', lessor_controller.asset_create_post);

/* POST  update basic the particular asset from DB */
 router.post('/update/', lessor_controller.asset_update_post);

/* POST create or update amenities for particular List . */
router.post('/amenities/', lessor_controller.asset_update_amenities);


/* POST create or update title for particular List . */
router.post('/title/', lessor_controller.asset_update_title);

/* POST create or update title for particular List . */
router.post('/description/',lessor_controller.asset_update_description);

/* POST create or update title for particular List . */
router.post('/house-rules/', lessor_controller.asset_update_houserules);

/* POST create or update availability-questions for particular List . */
router.post('/availability-questions/', lessor_controller.asset_update_availability);

/* POST create calendar for particular List . */
router.post('/calendar/', calendar_controller.asset_create_calendar);

router.get('/calendar/list_id/:id', calendar_controller.asset_get_calendar);

/* POST create or update special offer for particular List . */
router.post('/promotion/', lessor_controller.asset_update_specialOffer);

/* POST create or update special discount for particular List . */
router.post('/additional-pricing/', lessor_controller.asset_update_specialDiscount);

/* POST create or update publish status for particular List . */
router.post('/publish/', lessor_controller.asset_publicStatus);

/* POST create or update notify days status for notify the guest. */
router.post('/availability-settings/', lessor_controller.asset_availabiltySettings);

/* POST create or update notify days status for notify the guest. */
router.post('/price-mode/', lessor_controller.asset_update_priceMode);

/* POST create or update notify days status for notify the guest. */
router.post('/price/', lessor_controller.asset_update_price);

/* POST  delete the particular asset from DB */

router.get('/delete-asset/id/:id', lessor_controller.asset_delete);
router.post('/photos/upload', upload.array('photos', 12), assetImage_controller.asset_add_image);

router.post('/payout_info', payout_controller.payout_add_post);
router.post('/update_payout_info', payout_controller.payout_update_post);

router.get('/asset_details/asset_id/:id', lessor_controller.asset_detail);


router.get('/lessor_asset_details/user_id/:id', lessor_controller.lessor_asset_detail);



module.exports = router;
