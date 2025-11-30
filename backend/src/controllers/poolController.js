const db = require('../config/db');

exports.createBid = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { amount, purpose } = req.body;
    if(!amount || !purpose) return res.status(400).json({ message: 'missing fields' });

    const q = 'INSERT INTO borrower_bids(user_id, amount, purpose, created_at) VALUES($1,$2,$3,NOW()) RETURNING *';
    const { rows } = await db.query(q, [user_id, amount, purpose]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.listOpenBids = async (req, res, next) => {
  try {
    const q = 'SELECT * FROM borrower_bids WHERE status = $1 ORDER BY created_at DESC';
    const { rows } = await db.query(q, ['open']);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getBid = async (req, res, next) => {
  try {
    const bidId = req.params.id;
    const q = 'SELECT * FROM borrower_bids WHERE bid_id=$1';
    const { rows } = await db.query(q, [bidId]);
    if(rows.length===0) return res.status(404).json({ message: 'not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
