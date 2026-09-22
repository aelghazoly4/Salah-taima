const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'wedding';

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
  }
  await cachedClient.connect();
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
}

function checkAdmin(req) {
  const pass = req.headers['x-admin-password'];
  return !!process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD;
}

module.exports = { getDb, setCors, checkAdmin };
