export default function handler(req, res) {
  const json = req.query.json || '{"name":"DevForge","version":"1.0","tools":10}';
  try {
    const parsed = JSON.parse(json);
    res.json({ valid: true, formatted: JSON.stringify(parsed, null, 2) });
  } catch(e) { res.status(400).json({ valid: false, error: e.message }); }
}