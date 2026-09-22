const { setCors, checkAdmin } = require('../lib/db');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  if (checkAdmin(req)) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'wrong password' });
};
