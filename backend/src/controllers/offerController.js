const Offer = require('../../models/offer');

exports.createOffer = async (req, res) => {
  try {
    console.log('createOffer body:', req.body);
    const result = await Offer.create(req.body);
    res.status(201).json({ insertId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOffersForBid = async (req, res) => {
  try {
    const { bid_id } = req.params;
    const rows = await Offer.getForBid(bid_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
