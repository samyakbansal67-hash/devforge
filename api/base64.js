export default function handler(req, res) {
  const text = req.query.text || 'Hello DevForge';
  const mode = req.query.mode;

  if (mode === 'decode') {
    try {
      res.json({ encoded: text, decoded: Buffer.from(text, 'base64').toString('utf8') });
    } catch(e) { res.status(400).json({ error: 'Invalid base64 string' }); }
  } else {
    res.json({ original: text, encoded: Buffer.from(text).toString('base64') });
  }
}