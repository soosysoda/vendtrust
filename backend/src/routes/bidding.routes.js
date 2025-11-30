const express = require('express');
const router = express.Router();
const { createBid, getOpenBids } = require('../controllers/backend\src\controllers\bidController.js');

router.post('/create', createBid);
router.get('/open', getOpenBids);

module.exports = router;
