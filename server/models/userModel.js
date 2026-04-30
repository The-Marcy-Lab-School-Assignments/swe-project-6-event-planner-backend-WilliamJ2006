const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const SALT_ROUNDS = 8;

module.exports.list = async () => {
  const { rows } = await pool.query(
    `SELECT user_id, username FROM users ORDER BY user_id`,
  );
  return rows;
};

module.exports.find = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT user_id, username FROM users WHERE user_id = $1`,
    [user_id],
  );
  return rows[0] || null;
};

module.exports.findByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT user_id, username FROM users WHERE username = $1`,
    [username],
  );
  return rows[0] || null;
};

module.exports.create = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id, username`;
  const { rows } = await pool.query(query, [username.trim(), passwordHash]);
  return rows[0];
};

module.exports.validatePassword = async (username, password) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const user = rows[0];
  if (!user) return null;

  const compare = await bcrypt.compare(password, user.password_hash);
  if (!compare) return null;

  return { user_id: user.user_id, username: user.username };
};

module.exports.update = async (user_id, password) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING user_id, username`;
  const { rows } = await pool.query(query, [passwordHash, user_id]);
  return rows[0] || null;
};

module.exports.delete = async (user_id) => {
  const query = `DELETE FROM users WHERE user_id = $1 RETURNING user_id, username`;
  const { rows } = await pool.query(query, [user_id]);
  return rows[0] || null;
};
