const Bid = require('../../models/bid');

exports.createBid = async (req, res) => {
  try {
    console.log('createBid body:', req.body);
    const result = await Bid.create(req.body);
    res.status(201).json({ insertId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOpenBids = async (req, res) => {
  try {
    const rows = await Bid.getOpen();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
