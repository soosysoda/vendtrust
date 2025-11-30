const db = require('../config/db');

const Bid = {
  create: async ({ user_id, title, amount, purpose }) => {
    const query = `INSERT INTO bids (user_id, title, amount, purpose) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(query, [user_id, title, amount, purpose]);
    return result;
  },

  findById: async (bid_id) => {
    const [rows] = await db.execute(`SELECT * FROM bids WHERE bid_id = ?`, [bid_id]);
    return rows[0];
  },

  getOpen: async () => {
    const [rows] = await db.execute(`SELECT * FROM bids WHERE status = 'open' ORDER BY created_at DESC`);
    return rows;
  },

  updateStatus: async (bid_id, status) => {
    const [result] = await db.execute(`UPDATE bids SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE bid_id = ?`, [status, bid_id]);
    return result;
  }
};

module.exports = Bid;
