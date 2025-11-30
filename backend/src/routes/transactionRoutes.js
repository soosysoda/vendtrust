const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.post('/offers', auth, transactionController.createOffer);
router.post('/offers/:bidId/select/:offerId', auth, transactionController.selectOffer);

module.exports = router;
