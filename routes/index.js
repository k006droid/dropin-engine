var express = require('express');
var router = express.Router();
var Native = require('../models/native')
var stripeController = require('../controllers/stripeController'); 
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send(JSON.stringify({'welcome':'d'}));
 	res.status(404).json({
 		status: 404,
        message: 'Not Found',
    });
});

//authentication to check native client for all routes
/** authentication to check native client for all routes
*/
router.use(function (req, res, next) {
  
  Native.find({ 'native_id' : req.get('native_id'), 'status':'active'})
    .exec(function (err, list) {
    if (err) { return next(err); }
    // Successful, so send.
    if (list != "")
      return next()
    else
      return res.status(500).json({ status : 500, message: "authentication fail", data : [] });
  })
  
})

//stripe payment
router.post('/stripe_charges',stripeController.stripe_charges);
router.post('/create_customers',stripeController.create_customers);
router.post('/refunds',stripeController.refunds);
router.post('/create_payouts',stripeController.create_payouts);

module.exports = router;
