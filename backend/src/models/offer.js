const db = require('../config/db');

const Offer = {
  create: async ({ bid_id, investor_id, amount, interest_rate, duration_months }) => {
    const query = `INSERT INTO offers (bid_id, investor_id, amount, interest_rate, duration_months) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [bid_id, investor_id, amount, interest_rate, duration_months]);
    return result;
  },

  getForBid: async (bid_id) => {
    const [rows] = await db.execute(`SELECT * FROM offers WHERE bid_id = ? ORDER BY created_at DESC`, [bid_id]);
    return rows;
  },

  updateStatus: async (offer_id, status) => {
    const [result] = await db.execute(`UPDATE offers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE offer_id = ?`, [status, offer_id]);
    return result;
  }
};

module.exports = Offer;
