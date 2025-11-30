const db = require('../config/db');

exports.findById = async (user_id) => {
  const { rows } = await db.query('SELECT * FROM table1 WHERE user_id=$1', [user_id]);
  return rows[0];
};

exports.findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM table1 WHERE email=$1', [email]);
  return rows[0];
};

exports.create = async ({ user_id, full_name, email, phone }) => {
  const q = 'INSERT INTO table1(user_id, full_name, email, phone, created_at) VALUES($1,$2,$3,$4,NOW()) RETURNING *';
  const { rows } = await db.query(q, [user_id, full_name, email, phone]);
  return rows[0];
};
