var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
const uploadcareStorage = require('multer-storage-uploadcare')

var adminController = require('../controllers/adminController'); 
// cloudinary upload
const multer = require('multer')
let upload = multer({
  storage: uploadcareStorage({
    public_key: process.env.public_key,
    private_key: process.env.private_key,
    store: 'auto' // 'auto' || 0 || 1
  })
});
// sample link https://ucarecdn.com/70793f9d-78f4-4f1a-b316-73caefaa4b2c/-/resize/200x200/
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//amenities
router.post('/add_amenity',upload.array('amenity_icon',12),adminController.amenities_create_post);
router.post('/edit_amenity/:amenity_id',adminController.amenities_edit_post);
router.get('/amenities',adminController.amenities_list);
//room_type
router.post('/add_asset_type',adminController.asset_create_post);
router.post('/edit_asset_type/:edit_asset_type_id',adminController.asset_type_edit_post);
router.get('/asset_type',adminController.asset_list);
//static pages
router.post('/add_page',adminController.static_page_create_post);
router.post('/edit_page/:edit_static_pages_id',adminController.static_pages_edit_post);
router.get('/pages',adminController.static_pages_list);
//Country management
router.post('/add_country',adminController.country_create_post);
router.post('/edit_country/:country_id',adminController.country_edit_post);
router.get('/country',adminController.country_list);
//manage language
router.post('/add_language',adminController.language_create_post);
router.post('/edit_language/:language_id',adminController.language_edit_post);
router.get('/language',adminController.language_list);
//manage currency
router.post('/add_currency',adminController.currency_create_post);
router.post('/edit_currency/:currency_id',adminController.currency_edit_post);
router.get('/currency',adminController.currency_list);
//fees management
router.post('/fees/:fees_id',adminController.fees_edit_post);
router.get('/fees',adminController.fees_list);
//Meta management
router.post('/edit_meta/:metatitles_id',adminController.metatitles_edit_post);
router.get('/metas',adminController.metatitles_list);
//Meta management
router.post('/api_credentials/:id',adminController.apicredentials_edit_post);
router.get('/api_credentials',adminController.apicredentials_list);
//Manage join us link
router.post('/join_us/:id',adminController.joinus_edit_post);
router.get('/join_us',adminController.joinus_list);
//Manage theme settings
router.post('/theme_settings/:id',adminController.theme_settings_edit_post);
router.get('/theme_settings',adminController.theme_settings_list);
//manage settings
router.post('/settings/:id',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'fav_icon', maxCount: 1 }]),adminController.settings_edit_post);
router.get('/settings',adminController.settings_list);
//paymentgateway
router.post('/payment_gateway/:id',adminController.paymentgateway_edit_post);
router.get('/payment_gateway',adminController.paymentgateway_list);
//house_rules
router.post('/add_assetrules',adminController.assetrules_create_post);
router.post('/edit_assetrules/:id',adminController.assetrules_edit_post);
router.get('/assetrules',adminController.assetrules_list);
//Message_type
router.post('/message_type/:id',adminController.reservation_type_edit_post);
router.get('/message_type',adminController.messagetype_list);
//Reservation_type
router.post('/reservation_type/:id',adminController.reservation_type_edit_post);
router.get('/reservation_type',adminController.reservation_type_list);

module.exports = router;
