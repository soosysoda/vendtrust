const db = require('../config/db');

exports.createOffer = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { bid_id, interest_rate, repayment_months } = req.body;
    if(!bid_id || !interest_rate || !repayment_months) return res.status(400).json({ message: 'missing fields' });

    const q = 'INSERT INTO investor_offers(bid_id, investor_id, interest_rate, repayment_months, created_at) VALUES($1,$2,$3,$4,NOW()) RETURNING *';
    const { rows } = await db.query(q, [bid_id, user_id, interest_rate, repayment_months]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.selectOffer = async (req, res, next) => {
  try {
    const { bidId, offerId } = req.params;
    // mark offer selected and update bid status
    await db.query('UPDATE investor_offers SET is_selected = TRUE WHERE offer_id=$1', [offerId]);
    await db.query('UPDATE borrower_bids SET selected_offer_id=$1, status=$2 WHERE bid_id=$3', [offerId, 'selected', bidId]);
    res.json({ message: 'offer selected' });
  } catch (err) { next(err); }
};
