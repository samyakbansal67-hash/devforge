export default function handler(req, res) {
  res.json({ status: 'ok', service: 'DevForge API', timestamp: new Date().toISOString(), version: '1.0' });
}