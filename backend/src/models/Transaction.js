const db = require('../config/db');

exports.createOffer = async ({ bid_id, investor_id, interest_rate, repayment_months }) => {
  const q = 'INSERT INTO investor_offers(bid_id, investor_id, interest_rate, repayment_months, created_at) VALUES($1,$2,$3,$4,NOW()) RETURNING *';
  const { rows } = await db.query(q, [bid_id, investor_id, interest_rate, repayment_months]);
  return rows[0];
};
