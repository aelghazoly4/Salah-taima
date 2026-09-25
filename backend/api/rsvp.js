const { getDb, setCors, checkAdmin } = require('../lib/db');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('rsvps');

    if (req.method === 'POST') {
      const { name, peopleCount, attending } = req.body || {};
      const count = parseInt(peopleCount, 10);
      const validAttending = attending === 'yes' || attending === 'no';
      if (!name || String(name).trim() === '' || !Number.isInteger(count) || count < 1 || !validAttending) {
        return res.status(400).json({ error: 'name, peopleCount and attending (yes/no) are required' });
      }
      const doc = {
        name: String(name).trim().slice(0, 80),
        peopleCount: Math.min(count, 50),
        attending: attending,
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
