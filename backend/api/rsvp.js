const { getDb, setCors, checkAdmin } = require('../lib/db');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('rsvps');

    if (req.method === 'POST') {
      const { name, message } = req.body || {};
      if (!name || !message || String(name).trim() === '' || String(message).trim() === '') {
        return res.status(400).json({ error: 'name and message are required' });
      }
      const doc = {
        name: String(name).trim().slice(0, 80),
        message: String(message).trim().slice(0, 500),
        createdAt: new Date(),
      };
      const result = await col.insertOne(doc);
      return res.status(201).json({ ok: true, id: result.insertedId });
    }

    if (req.method === 'GET') {
      if (!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
      const items = await col.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ items });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
