const db = require('../config/db');

exports.createBid = async ({ user_id, amount, purpose }) => {
  const q = 'INSERT INTO borrower_bids(user_id, amount, purpose, created_at) VALUES($1,$2,$3,NOW()) RETURNING *';
  const { rows } = await db.query(q, [user_id, amount, purpose]);
  return rows[0];
};

exports.listOpen = async () => {
  const { rows } = await db.query('SELECT * FROM borrower_bids WHERE status=$1 ORDER BY created_at DESC', ['open']);
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await db.query('SELECT * FROM borrower_bids WHERE bid_id=$1', [id]);
  return rows[0];
};
