const { getDb, setCors, checkAdmin } = require('../lib/db');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('visits');

    if (req.method === 'POST') {
      const { sessionId, event } = req.body || {};
      if (!sessionId || !event) {
        return res.status(400).json({ error: 'sessionId and event are required' });
      }

      if (event === 'enter') {
        const result = await col.insertOne({
          sessionId,
          enteredAt: new Date(),
          leftAt: null,
        });
        return res.status(201).json({ ok: true, id: result.insertedId });
      }

      if (event === 'leave') {
        await col.updateOne(
          { sessionId, leftAt: null },
          { $set: { leftAt: new Date() } },
          { sort: { enteredAt: -1 } }
        );
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'event must be "enter" or "leave"' });
    }

    if (req.method === 'GET') {
      if (!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
      const items = await col.find({}).sort({ enteredAt: -1 }).toArray();
      return res.status(200).json({ items });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
