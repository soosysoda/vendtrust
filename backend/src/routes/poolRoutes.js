const express = require('express');
const router = express.Router();
const poolController = require('../controllers/poolController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, poolController.createBid);
router.get('/open', poolController.listOpenBids);
router.get('/:id', poolController.getBid);

module.exports = router;
