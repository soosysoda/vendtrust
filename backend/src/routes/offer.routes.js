const express = require('express');
const router = express.Router();
const { createOffer, getOffersForBid } = require('../contrbackend\src\controllers\offerController.jsollers/offerController');

router.post('/create', createOffer);
router.get('/bid/:bid_id', getOffersForBid);

module.exports = router;
